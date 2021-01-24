import dotenv from 'dotenv';
import Index from '~/pages/index';
import { render, setup, useNock, setToken, setInvalidToken, setDarkMode, loadPage, act } from '~/__tests__/utils';
import user from '@testing-library/user-event';

dotenv.config({ path: '../server/.env' });

setup();

describe('Index', () => {
  it('should show login form', async() => {
    const { asFragment, findByText, getAllByText, getByText, getByLabelText } = render(<Index/>);

    await findByText('Login');
    expect(getAllByText('予約システム')).toHaveLength(2); // header, footer
    expect(getByText('Email address')).toBeVisible();
    expect(getByLabelText(/Email address/)).toBeVisible();
    expect(getByText('Password')).toBeVisible();
    expect(getByLabelText(/Password/)).toBeVisible();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should fail to login', async() => {
    const login = jest.fn();
    useNock()
      .post('/login/admin', body => {
        login(body);
        return body;
      }).reply(400);
    setInvalidToken();

    const { getByText, getByLabelText, getByTestId, findByText } = render(<Index/>);

    await findByText('Login');
    user.type(getByLabelText(/Email address/), 'test@example.com');
    user.type(getByLabelText(/Password/), 'password');
    user.click(getByTestId('password-switch'));
    await act(async() => {
      user.click(getByText('Login'));
    });

    await findByText('Request failed with status code 400');

    expect(login).toBeCalledWith({ email: 'test@example.com', pass: 'password' });
    expect(asFragment()).toMatchSnapshot();
  });

  it('should fail to login (invalid header)', async() => {
    const login = jest.fn();
    useNock()
      .post('/login/admin', body => {
        login(body);
        return body;
      }).reply(204);

    const { getByText, getByLabelText, findByText } = render(<Index/>);

    await findByText('Login');
    user.type(getByLabelText(/Email address/), 'test@example.com');
    user.type(getByLabelText(/Password/), 'password');
    await act(async() => {
      user.click(getByText('Login'));
    });

    await findByText('Invalid header');

    expect(login).toBeCalledWith({ email: 'test@example.com', pass: 'password' });
    expect(asFragment()).toMatchSnapshot();
  });

  it('should success to login', async() => {
    const login = jest.fn();
    useNock()
      .post('/login/admin', body => {
        login(body);
        return body;
      }).reply(204, undefined, {
        authorization: 'test-token',
      })
      .get('/admin').reply(200, {
        name: null,
        icon: 'http://localhost:8080/api/icons/dummy.svg',
        roles: [
          { 'role': 'dashboard', 'name': 'Dashboard' },
        ],
      })
      .get('/admin/dashboard/rooms').reply(200, [])
      .get(/\/dashboard\/(checkin|checkout)/).reply(200, {
        'data': [],
        'page': 0,
        'totalCount': 0,
      })
      .get(/\/dashboard\/sales/).reply(200, []);

    const { getByText, getByLabelText, findByText, findAllByText, getAllByText, container, findByTestId } = render(
      <Index/>,
    );

    await findByText('Login');
    user.type(getByLabelText(/Email address/), 'test@example.com');
    user.type(getByLabelText(/Password/), 'password');
    await act(async() => {
      user.click(getByText('Login'));
    });

    expect(await findAllByText('チェックイン')).toHaveLength(2); // table title, table header

    expect(login).toBeCalledWith({ email: 'test@example.com', pass: 'password' });
    expect(getAllByText('チェックアウト')).toHaveLength(2); // table title, table header
    expect(getByText('全部屋')).toBeVisible();

    // test header
    const buttons = container.querySelectorAll('header .MuiSvgIcon-root');
    expect(buttons).toHaveLength(2);
    user.click(getAllByText('予約システム')[0]); // header link
    user.click(buttons[1]); // toggle dark mode

    // test sidebar
    user.click(buttons[0]);
    await findByTestId('admin-avatar');
    const menuClose = await findByTestId('drawer-layer');
    user.click(menuClose);
  });

  it('should logout automatically', async() => {
    useNock()
      .get('/admin').reply(401, {
        message: 'test error',
        tokenExpired: true,
      });
    setToken('token');

    const { findByText } = render(<Index/>);

    await findByText('Login');
  });

  it('should logout automatically if no appropriate roles', async() => {
    useNock().get('/admin').reply(200, {
      name: 'test name', icon: null, roles: [],
    });
    setToken('token');

    const { findByText } = render(<Index/>);

    await findByText('Login');
  });

  it('should not logout automatically', async() => {
    useNock()
      .get('/admin').reply(200, {
        name: 'test name',
        icon: null,
        roles: [
          { 'role': 'dashboard', 'name': 'Dashboard' },
        ],
      })
      .get('/admin/dashboard/rooms').reply(401)
      .get(/\/dashboard\/(checkin|checkout)/).reply(200, {
        'data': [],
        'page': 0,
        'totalCount': 0,
      })
      .get(/\/dashboard\/sales/).reply(200, []);
    setToken('token');

    const { findByTestId } = render(<Index/>);

    await findByTestId('select-date');
  });

  it('should show fallback page', async() => {
    useNock()
      .get('/admin').reply(200, {
        name: 'test name', icon: null, roles: [
          { 'role': 'rooms', 'name': 'Rooms' },
        ],
      })
      .get(/rooms\?/)
      .reply(200, {
        'data': [],
        'page': 0,
        'totalCount': 0,
      });
    setToken('token');

    const { findByTestId } = render(<Index/>);

    await findByTestId('page-rooms');
  });

  it('should login automatically and logout', async() => {
    useNock()
      .get('/admin').reply(200, {
        name: 'test name',
        icon: null,
        roles: [
          { 'role': 'dashboard', 'name': 'Dashboard' },
        ],
      })
      .get('/admin/dashboard/rooms').reply(200, [])
      .get(/\/dashboard\/(checkin|checkout)/).reply(200, {
        'data': [],
        'page': 0,
        'totalCount': 0,
      })
      .get(/\/dashboard\/sales/).reply(200, []);
    setToken('token');
    setDarkMode(true);

    const { getByText, findByText, findByTestId, container } = render(<Index/>);

    await findByTestId('select-date');

    const buttons = container.querySelectorAll('header .MuiSvgIcon-root');
    user.click(buttons[0]);
    await findByText('test name');
    user.click(getByText('ログアウト'));
    await findByText('Login');
    expect(getByText('Email address')).toBeVisible();
    expect(getByText('Password')).toBeVisible();
  });

  it('should show license dialog', async() => {
    useNock()
      .get('/admin').reply(200, {
        name: 'test name',
        icon: null,
        roles: [
          { 'role': 'dashboard', 'name': 'Dashboard' },
        ],
      })
      .get('/admin/dashboard/rooms').reply(200, [])
      .get(/\/dashboard\/(checkin|checkout)/).reply(200, {
        'data': [],
        'page': 0,
        'totalCount': 0,
      })
      .get(/\/dashboard\/sales/).reply(200, []);
    setToken('token');

    const { findByText, findByTestId, findAllByTestId, container } = render(<Index/>);

    await findByTestId('select-date');

    const buttons = container.querySelectorAll('header .MuiSvgIcon-root');
    user.click(buttons[0]);
    user.click(await findByText('ライセンス'));
    user.click((await findAllByTestId('license-item'))[0]);
    user.click(await findByTestId('close-license'));
    user.click(await findByTestId('close-license-list'));
  });

  it('should show license dialog without login', async() => {
    const { findByText, findByTestId, findAllByTestId, container } = render(<Index/>);

    await findByText('Login');

    const buttons = container.querySelectorAll('header .MuiSvgIcon-root');
    user.click(buttons[0]);
    user.click(await findByText('ライセンス'));
    user.click((await findAllByTestId('license-item'))[0]);
    user.click(await findByTestId('close-license'));
    user.click(await findByTestId('close-license-list'));
  });

  it('should reuse component', async() => {
    const { findByText, findByTestId, container } = await loadPage(
      'guests',
      scope => scope
        .get(/guests\?/).reply(200, {
          'data': [],
          'page': 0,
          'totalCount': 0,
        }),
    );

    const buttons = container.querySelectorAll('header .MuiSvgIcon-root');
    user.click(buttons[0]);
    user.click(await findByText('ダッシュボード'));
    await findByTestId('select-date');
  });
});
