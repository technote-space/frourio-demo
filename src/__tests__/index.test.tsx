import React from 'react';
import dotenv from 'dotenv';
import Index from '~/pages/index';
import { render, useNock, act, setupCookie, setCookie } from '~/__tests__/utils';
import user from '@testing-library/user-event';

dotenv.config({ path: 'server/.env' });

setupCookie();

describe('Index page', () => {
  it('should show login form', async() => {
    const { asFragment, getAllByText, getByText, getByLabelText } = render(<Index/>, {});

    expect(getAllByText('予約システム')).toHaveLength(2); // header, footer
    expect(getByText('Email address')).toBeInTheDocument();
    expect(getByLabelText(/Email address/)).toBeInTheDocument();
    expect(getByText('Password')).toBeInTheDocument();
    expect(getByLabelText(/Password/)).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should fail to login', async() => {
    const login = jest.fn();
    useNock().post('/login').reply(400, (uri, body) => {
      login(body);
      return body;
    });
    const { asFragment, getByText, getByLabelText, findByText } = render(<Index/>, {});

    user.type(getByLabelText(/Email address/), 'test@example.com');
    user.type(getByLabelText(/Password/), 'password');
    await act(async() => {
      user.click(getByText('Login'));
    });

    await findByText('Request failed with status code 400');

    expect(login).toBeCalledWith({ email: 'test@example.com', pass: 'password' });
    expect(asFragment()).toMatchSnapshot();
  });

  it('should fail to login (invalid header)', async() => {
    const login = jest.fn();
    useNock().post('/login').reply(204, (uri, body) => {
      login(body);
      return body;
    });
    const { asFragment, getByText, getByLabelText, findByText } = render(<Index/>, {});

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
    useNock().post('/login').reply(204, (uri, body) => {
      login(body);
      return body;
    }, {
      authorization: 'test-token',
    })
      .get('/admin').reply(200, { name: 'test name', icon: null })
      .get('/rooms').reply(200, [])
      .get(/\/dashboard\/checkin/).reply(200, [])
      .get(/\/dashboard\/checkout/).reply(200, []);

    const { getByText, getByLabelText, findAllByText, getAllByText } = render(<Index/>, {});

    user.type(getByLabelText(/Email address/), 'test@example.com');
    user.type(getByLabelText(/Password/), 'password');
    await act(async() => {
      user.click(getByText('Login'));
    });

    expect(await findAllByText('チェックイン')).toHaveLength(2); // table title, table header

    expect(login).toBeCalledWith({ email: 'test@example.com', pass: 'password' });
    expect(getAllByText('チェックアウト')).toHaveLength(2); // table title, table header
    expect(getByText('全部屋')).toBeInTheDocument();
  });

  it('should login automatically', async() => {
    useNock()
      .get('/admin').reply(200, { name: 'test name', icon: null })
      .get('/rooms').reply(200, [])
      .get(/\/dashboard\/checkin/).reply(200, [])
      .get(/\/dashboard\/checkout/).reply(200, []);
    setCookie('authToken', 'token');

    const { getByText, findAllByText, getAllByText } = render(<Index/>, {});

    expect(await findAllByText('チェックイン')).toHaveLength(2); // table title, table header

    expect(getAllByText('チェックアウト')).toHaveLength(2); // table title, table header
    expect(getByText('全部屋')).toBeInTheDocument();
  });
});
