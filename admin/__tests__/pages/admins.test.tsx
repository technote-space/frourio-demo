import dotenv from 'dotenv';
import { setup, loadPage, findElement } from '~/__tests__/utils';
import user from '@testing-library/user-event';

dotenv.config({ path: '../server/.env' });

setup();

describe('Admins', () => {
  const roles = {
    'dashboard': 'Dashboard',
    'dashboard_create': 'Create in Dashboard',
    'dashboard_detail': 'Get detail in Dashboard',
    'dashboard_update': 'Update in Dashboard',
    'dashboard_delete': 'Delete in Dashboard',
    'admins': 'Admins',
    'admins_create': 'Create in Admins',
    'admins_detail': 'Get detail in Admins',
    'admins_update': 'Update in Admins',
    'admins_delete': 'Delete in Admins',
    'rooms': 'Rooms',
    'rooms_create': 'Create in Rooms',
    'rooms_detail': 'Get detail in Rooms',
    'rooms_update': 'Update in Rooms',
    'rooms_delete': 'Delete in Rooms',
    'guests': 'Guests',
    'guests_create': 'Create in Guests',
    'guests_detail': 'Get detail in Guests',
    'guests_update': 'Update in Guests',
    'guests_delete': 'Delete in Guests',
    'reservations': 'Reservations',
    'reservations_create': 'Create in Reservations',
    'reservations_detail': 'Get detail in Reservations',
    'reservations_update': 'Update in Reservations',
    'reservations_delete': 'Delete in Reservations',
  };

  it('should show admins', async() => {
    const { findByText, getByText } = await loadPage(
      'admins',
      scope => scope
        .get('/admins/roles').reply(200, roles)
        .get(/admins\?/).reply(200, {
          'data': [
            {
              'id': 4,
              'name': 'No edit',
              'email': 'read@example.com',
              'icon': 'http://localhost:8080/api/icons/dummy.svg',
              'createdAt': '2021-01-21T09:47:38.264Z',
              'updatedAt': '2021-01-21T09:47:38.264Z',
              'roles': [
                { 'role': 'dashboard', 'name': 'Dashboard' },
                { 'role': 'guests', 'name': 'Guests' },
                { 'role': 'reservations', 'name': 'Reservations' },
                { 'role': 'rooms', 'name': 'Rooms' },
              ],
            },
            {
              'id': 3,
              'name': 'Only rooms',
              'email': 'rooms@example.com',
              'icon': 'http://localhost:8080/api/icons/dummy.svg',
              'createdAt': '2021-01-21T09:47:38.183Z',
              'updatedAt': '2021-01-21T09:47:38.183Z',
              'roles': [
                { 'role': 'rooms', 'name': 'Rooms' },
                { 'role': 'rooms_create', 'name': 'Create in Rooms' },
                { 'role': 'rooms_detail', 'name': 'Get detail in Rooms' },
                { 'role': 'rooms_update', 'name': 'Update in Rooms' },
              ],
            },
            {
              'id': 2,
              'name': 'Test User',
              'email': 'test@example.com',
              'icon': 'http://localhost:8080/api/icons/dummy.svg',
              'createdAt': '2021-01-21T09:47:38.098Z',
              'updatedAt': '2021-01-21T09:47:38.098Z',
              'roles': [
                { 'role': 'dashboard', 'name': 'Dashboard' },
                { 'role': 'dashboard_create', 'name': 'Create in Dashboard' },
                { 'role': 'dashboard_delete', 'name': 'Delete in Dashboard' },
                { 'role': 'dashboard_detail', 'name': 'Get detail in Dashboard' },
                { 'role': 'dashboard_update', 'name': 'Update in Dashboard' },
                { 'role': 'guests', 'name': 'Guests' },
                { 'role': 'guests_create', 'name': 'Create in Guests' },
                { 'role': 'guests_delete', 'name': 'Delete in Guests' },
                { 'role': 'guests_detail', 'name': 'Get detail in Guests' },
                { 'role': 'guests_update', 'name': 'Update in Guests' },
                { 'role': 'reservations', 'name': 'Reservations' },
                { 'role': 'reservations_create', 'name': 'Create in Reservations' },
                { 'role': 'reservations_delete', 'name': 'Delete in Reservations' },
                { 'role': 'reservations_detail', 'name': 'Get detail in Reservations' },
                { 'role': 'reservations_update', 'name': 'Update in Reservations' },
                { 'role': 'rooms', 'name': 'Rooms' },
                { 'role': 'rooms_create', 'name': 'Create in Rooms' },
                { 'role': 'rooms_delete', 'name': 'Delete in Rooms' },
                { 'role': 'rooms_detail', 'name': 'Get detail in Rooms' },
                { 'role': 'rooms_update', 'name': 'Update in Rooms' },
              ],
            },
            {
              'id': 1,
              'name': 'Admin',
              'email': 'admin@example.com',
              'icon': 'http://localhost:8080/api/icons/dummy.svg',
              'createdAt': '2021-01-21T09:47:38.012Z',
              'updatedAt': '2021-01-22T16:11:25.471Z',
              'roles': [
                { 'role': 'admins', 'name': 'Admins' },
                { 'role': 'admins_create', 'name': 'Create in Admins' },
                { 'role': 'admins_delete', 'name': 'Delete in Admins' },
                { 'role': 'admins_detail', 'name': 'Get detail in Admins' },
                { 'role': 'admins_update', 'name': 'Update in Admins' },
                { 'role': 'dashboard', 'name': 'Dashboard' },
                { 'role': 'dashboard_create', 'name': 'Create in Dashboard' },
                { 'role': 'dashboard_delete', 'name': 'Delete in Dashboard' },
                { 'role': 'dashboard_detail', 'name': 'Get detail in Dashboard' },
                { 'role': 'dashboard_update', 'name': 'Update in Dashboard' },
                { 'role': 'guests', 'name': 'Guests' },
                { 'role': 'guests_create', 'name': 'Create in Guests' },
                { 'role': 'guests_delete', 'name': 'Delete in Guests' },
                { 'role': 'guests_detail', 'name': 'Get detail in Guests' },
                { 'role': 'guests_update', 'name': 'Update in Guests' },
                { 'role': 'reservations', 'name': 'Reservations' },
                { 'role': 'reservations_create', 'name': 'Create in Reservations' },
                { 'role': 'reservations_delete', 'name': 'Delete in Reservations' },
                { 'role': 'reservations_detail', 'name': 'Get detail in Reservations' },
                { 'role': 'reservations_update', 'name': 'Update in Reservations' },
                { 'role': 'rooms', 'name': 'Rooms' },
                { 'role': 'rooms_create', 'name': 'Create in Rooms' },
                { 'role': 'rooms_delete', 'name': 'Delete in Rooms' },
                { 'role': 'rooms_detail', 'name': 'Get detail in Rooms' },
                { 'role': 'rooms_update', 'name': 'Update in Rooms' },
              ],
            },
          ],
          'page': 0,
          'totalCount': 4,
        }),
    );

    await findByText('No edit');
    expect(getByText('rooms@example.com')).toBeVisible();
    expect(getByText('test@example.com')).toBeVisible();
    expect(getByText('admin@example.com')).toBeVisible();
  });

  it('should handle validation error', async() => {
    const save = jest.fn();
    const { findByText, findByTestId, findByRole, queryAllByText, container } = await loadPage(
      'admins',
      scope => scope
        .get('/admins/roles').reply(200, roles)
        .get(/admins\?/).reply(200, {
          'data': [],
          'page': 0,
          'totalCount': 0,
        })
        .post('/admins', body => {
          save(body);
          return body;
        }).reply(400, [
          {
            'value': '',
            'property': 'name',
            'children': [],
            'constraints': {
              'length': 'name must be longer than or equal to 1 characters',
              'isNotEmpty': 'name should not be empty',
            },
          },
          {
            'value': 'a',
            'property': 'email',
            'children': [],
            'constraints': { 'isEmail': 'email must be an email' },
          },
          {
            'value': 'a',
            'property': 'password',
            'children': [],
            'constraints': { 'minLength': 'password must be longer than or equal to 4 characters' },
          },
        ]),
    );

    const button = container.querySelectorAll('[title="Add"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);

    // input
    const input = container.querySelectorAll('[mode="add"] input[type="text"]');
    expect(input).toHaveLength(3);
    user.type(input[0], 'test-name');
    user.type(input[1], 'test@example.com');
    user.type(input[2], 'test1234');
    user.click(findElement(await findByTestId('edit-roles'), '[role="button"]'));
    user.click(findElement(await findByRole('presentation'), '[data-value="dashboard"] span'));
    user.tab();

    user.click(container.querySelectorAll('[title="Save"]')[0]);
    await findByText('name must be longer than or equal to 1 characters');
    await findByText('email must be an email');
    await findByText('password must be longer than or equal to 4 characters');

    container.querySelectorAll('[mode="add"] input[type="text"]').forEach(input => {
      user.type(input, '0');
    });

    expect(queryAllByText('role must be longer than or equal to 1 characters')).toHaveLength(0);
    expect(queryAllByText('email must be an email')).toHaveLength(0);
    expect(queryAllByText('password must be longer than or equal to 4 characters')).toHaveLength(0);
  });

  it('should add admin', async() => {
    const save = jest.fn();
    const { findByText, findByTestId, findByRole, container } = await loadPage(
      'admins',
      scope => scope
        .get('/admins/roles').reply(200, roles)
        .get(/admins\?/).reply(200, {
          'data': [],
          'page': 0,
          'totalCount': 0,
        })
        .post('/admins', body => {
          save(body);
          return body;
        }).reply(201),
    );

    const button = container.querySelectorAll('[title="Add"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);

    // input
    const input = container.querySelectorAll('[mode="add"] input[type="text"]');
    expect(input).toHaveLength(3);
    user.type(input[0], 'test-name');
    user.type(input[1], 'test@example.com');
    user.type(input[2], 'test1234');
    user.upload(await findByTestId('select-icon-file'), new File([], 'test.png', { type: 'image/png' }));
    user.click(findElement(await findByTestId('edit-roles'), '[role="button"]'));
    user.click(findElement(await findByRole('presentation'), '[data-value="dashboard"]'));
    user.tab();

    // save
    user.click(container.querySelectorAll('[title="Save"]')[0]);

    // notice
    await findByText('追加しました。');

    expect(save.mock.calls[0][0]).toEqual(expect.stringContaining('test-name'));
    expect(save.mock.calls[0][0]).toEqual(expect.stringContaining('test@example.com'));
    expect(save.mock.calls[0][0]).toEqual(expect.stringContaining('test1234'));
    expect(save.mock.calls[0][0]).toEqual(expect.stringContaining('image/png'));
    expect(save.mock.calls[0][0]).toEqual(expect.stringContaining('Dashboard'));
  });

  it('should delete admin', async() => {
    const del = jest.fn();
    const { findByText, container } = await loadPage(
      'admins',
      scope => scope
        .get('/admins/roles').reply(200, roles)
        .get(/admins\?/).reply(200, {
          'data': [{
            'id': 4,
            'name': 'No edit',
            'email': 'read@example.com',
            'icon': 'http://localhost:8080/api/icons/dummy.svg',
            'createdAt': '2021-01-21T09:47:38.264Z',
            'updatedAt': '2021-01-21T09:47:38.264Z',
            'roles': [
              { 'role': 'dashboard', 'name': 'Dashboard' },
              { 'role': 'guests', 'name': 'Guests' },
              { 'role': 'reservations', 'name': 'Reservations' },
              { 'role': 'rooms', 'name': 'Rooms' },
            ],
          }],
          'page': 0,
          'totalCount': 1,
        })
        .delete('/admins/4').reply(200, body => {
          del();
          return body;
        }),
    );

    await findByText('No edit');

    const button = container.querySelectorAll('[title="Delete"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);
    await findByText('Are you sure you want to delete this row?');

    // cancel delete
    user.click(container.querySelectorAll('[title="Cancel"]')[0]);
    await findByText('No edit');

    // delete
    user.click(container.querySelectorAll('[title="Delete"]')[0]);
    await findByText('Are you sure you want to delete this row?');
    user.click(container.querySelectorAll('[title="Save"]')[0]);

    // notice
    await findByText('削除しました。');

    expect(del).toBeCalledTimes(1);
  });

  it('should update admin', async() => {
    const update = jest.fn();
    const { findByText, container } = await loadPage(
      'admins',
      scope => scope
        .get('/admins/roles').reply(200, roles)
        .get(/admins\?/).reply(200, {
          'data': [{
            'id': 4,
            'name': 'No edit',
            'email': 'read@example.com',
            'icon': 'http://localhost:8080/api/icons/dummy.svg',
            'createdAt': '2021-01-21T09:47:38.264Z',
            'updatedAt': '2021-01-21T09:47:38.264Z',
            'roles': [
              { 'role': 'dashboard', 'name': 'Dashboard' },
              { 'role': 'guests', 'name': 'Guests' },
              { 'role': 'reservations', 'name': 'Reservations' },
              { 'role': 'rooms', 'name': 'Rooms' },
            ],
          }],
          'page': 0,
          'totalCount': 1,
        })
        .patch('/admins/4', body => {
          update(body);
          return body;
        }).reply(200),
    );

    await findByText('No edit');

    const button = container.querySelectorAll('[title="Edit"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);

    // cancel edit
    user.click(container.querySelectorAll('[title="Cancel"]')[0]);
    await findByText('No edit');

    // edit
    user.click(container.querySelectorAll('[title="Edit"]')[0]);
    const input = container.querySelectorAll('[mode="update"] input[type="text"]');
    expect(input).toHaveLength(3);
    user.clear(input[0]);
    user.type(input[0], 'update-name');
    user.click(container.querySelectorAll('[title="Save"]')[0]);

    // notice
    await findByText('更新しました。');

    expect(update.mock.calls[0][0]).toEqual(expect.stringContaining('update-name'));
    expect(update.mock.calls[0][0]).toEqual(expect.stringContaining('read@example.com'));
    expect(update.mock.calls[0][0]).toEqual(expect.stringContaining('http://localhost:8080/api/icons/dummy.svg'));
    expect(update.mock.calls[0][0]).toEqual(expect.stringContaining('Dashboard'));
  });
});
