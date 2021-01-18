import dotenv from 'dotenv';
import { setup, loadPage } from '~/__tests__/utils';
import user from '@testing-library/user-event';

dotenv.config({ path: 'server/.env' });

setup();

describe('Guests', () => {
  it('should show guests', async() => {
    const { findByText, getByText } = await loadPage(
      'guests',
      scope => scope.get(/guests\?/).reply(200, {
        'data': [
          {
            'id': 1,
            'name': '山本 蓮',
            'nameKana': '中村 太一',
            'zipCode': '993-6803',
            'address': 'Liechtenstein 伊藤市 大和 View',
            'phone': '0091-90-5072',
            'createdAt': '2021-01-04T09:36:28.444Z',
            'updatedAt': '2021-01-04T09:36:28.444Z',
          }, {
            'id': 3,
            'name': '清水 杏',
            'nameKana': '中村 蓮',
            'zipCode': '368-0205',
            'address': 'Russian Federation 杏市 太一 Spur',
            'phone': '05-0350-5927',
            'createdAt': '2021-01-04T09:36:28.451Z',
            'updatedAt': '2021-01-04T09:36:28.451Z',
          }, {
            'id': 7,
            'name': '田中 心愛',
            'nameKana': '伊藤 莉子',
            'zipCode': '789-5615',
            'address': 'Montserrat 佐々木村 木村 Row',
            'phone': '07-8684-9443',
            'createdAt': '2021-01-04T09:36:28.463Z',
            'updatedAt': '2021-01-04T09:36:28.463Z',
          }, {
            'id': 9,
            'name': '伊藤 颯太',
            'nameKana': '小林 蒼空',
            'zipCode': '251-2747',
            'address': 'Greece 佐藤市 大翔 Course',
            'phone': '004-297-8015',
            'createdAt': '2021-01-04T09:36:28.469Z',
            'updatedAt': '2021-01-04T09:36:28.469Z',
          }, {
            'id': 4,
            'name': '清水 蒼空',
            'nameKana': '小林 颯太',
            'zipCode': '922-5891',
            'address': 'British Indian Ocean Territory (Chagos Archipelago) 井上区 木村 Village',
            'phone': '01165-3-9928',
            'createdAt': '2021-01-04T09:36:28.454Z',
            'updatedAt': '2021-01-04T09:36:28.454Z',
          },
        ],
        'page': 0,
        'totalCount': 10,
      }),
    );

    await findByText('山本 蓮');
    expect(getByText('清水 蒼空')).toBeVisible();
    expect(getByText('368-0205')).toBeVisible();
    expect(getByText('Montserrat 佐々木村 木村 Row')).toBeVisible();
    expect(getByText('004-297-8015')).toBeVisible();
  });

  it('should handle validation error', async() => {
    const save = jest.fn();
    const { findByText, queryAllByText, container } = await loadPage(
      'guests',
      scope => scope
        .get(/guests\?/).reply(200, {
          'data': [],
          'page': 0,
          'totalCount': 0,
        })
        .post('/guests', body => {
          save(body);
          return body;
        }).reply(400, [
          {
            'property': 'name',
            'children': [],
            'constraints': {
              'length': 'name must be longer than or equal to 1 characters',
              'isNotEmpty': 'name should not be empty',
            },
          },
          {
            'property': 'nameKana',
            'children': [],
            'constraints': {
              'matches': 'This value is not katakana',
              'length': 'nameKana must be longer than or equal to 1 characters',
              'isNotEmpty': 'nameKana should not be empty',
            },
          },
          {
            'property': 'zipCode',
            'children': [],
            'constraints': { 'matches': 'This value is not zip code', 'isNotEmpty': 'zipCode should not be empty' },
          },
          {
            'property': 'address',
            'children': [],
            'constraints': {
              'length': 'address must be longer than or equal to 1 characters',
              'isNotEmpty': 'address should not be empty',
            },
          },
          {
            'property': 'phone',
            'children': [],
            'constraints': { 'matches': 'This value is not phone number', 'isNotEmpty': 'phone should not be empty' },
          },
        ]),
    );

    const button = container.querySelectorAll('[title="Add"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);

    user.click(container.querySelectorAll('[title="Save"]')[0]);
    await findByText('name must be longer than or equal to 1 characters');
    await findByText('This value is not katakana');
    await findByText('This value is not zip code');
    await findByText('address must be longer than or equal to 1 characters');
    await findByText('This value is not phone number');

    container.querySelectorAll('[mode="add"] input').forEach(input => {
      user.type(input, '0');
    });

    expect(queryAllByText('name must be longer than or equal to 1 characters')).toHaveLength(0);
    expect(queryAllByText('This value is not katakana')).toHaveLength(0);
    expect(queryAllByText('This value is not zip code')).toHaveLength(0);
    expect(queryAllByText('address must be longer than or equal to 1 characters')).toHaveLength(0);
    expect(queryAllByText('This value is not phone number')).toHaveLength(0);
  });

  it('should add guest', async() => {
    const save = jest.fn();
    const { findByText, container } = await loadPage(
      'guests',
      scope => scope
        .get(/guests\?/).reply(200, {
          'data': [],
          'page': 0,
          'totalCount': 0,
        })
        .post('/guests', body => {
          save(body);
          return body;
        }).reply(201),
    );

    const button = container.querySelectorAll('[title="Add"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);

    // input
    const input = container.querySelectorAll('[mode="add"] input');
    expect(input).toHaveLength(5);
    user.type(input[0], 'test-name');
    user.type(input[1], 'テスト');
    user.type(input[2], '100-0001');
    user.type(input[3], 'テスト県テスト市テスト町');
    user.type(input[4], '090-0000-0000');

    // save
    user.click(container.querySelectorAll('[title="Save"]')[0]);

    // notice
    await findByText('追加しました。');

    expect(save).toBeCalledWith({
      name: 'test-name',
      nameKana: 'テスト',
      zipCode: '100-0001',
      address: 'テスト県テスト市テスト町',
      phone: '090-0000-0000',
    });
  });

  it('should delete guest', async() => {
    const del = jest.fn();
    const { findByText, container } = await loadPage(
      'guests',
      scope => scope
        .get(/guests\?/).reply(200, {
          'data': [
            {
              'id': 11,
              'name': 'test-name',
              'nameKana': 'テスト',
              'zipCode': '100-0001',
              'address': 'テスト県テスト市テスト町',
              'phone': '090-0000-0000',
              'createdAt': '2021-01-13T06:37:37.996Z',
              'updatedAt': '2021-01-13T06:37:37.997Z',
            },
          ],
          'page': 0,
          'totalCount': 1,
        })
        .delete('/guests/11').reply(200, body => {
          del();
          return body;
        }),
    );

    await findByText('test-name');

    const button = container.querySelectorAll('[title="Delete"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);
    await findByText('Are you sure you want to delete this row?');

    // cancel delete
    user.click(container.querySelectorAll('[title="Cancel"]')[0]);
    await findByText('test-name');

    // delete
    user.click(container.querySelectorAll('[title="Delete"]')[0]);
    await findByText('Are you sure you want to delete this row?');
    user.click(container.querySelectorAll('[title="Save"]')[0]);

    // notice
    await findByText('削除しました。');

    expect(del).toBeCalledTimes(1);
  });

  it('should update guest', async() => {
    const update = jest.fn();
    const { findByText, container } = await loadPage(
      'guests',
      scope => scope
        .get(/guests\?/).reply(200, {
          'data': [{
            'id': 11,
            'name': 'test-name',
            'nameKana': 'テスト',
            'zipCode': '100-0001',
            'address': 'テスト県テスト市テスト町',
            'phone': '090-0000-0000',
            'createdAt': '2021-01-13T06:37:37.996Z',
            'updatedAt': '2021-01-13T06:37:37.997Z',
          }],
          'page': 0,
          'totalCount': 1,
        })
        .patch('/guests/11', body => {
          update(body);
          return body;
        }).reply(200),
    );

    await findByText('test-name');

    const button = container.querySelectorAll('[title="Edit"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);

    // cancel edit
    user.click(container.querySelectorAll('[title="Cancel"]')[0]);
    await findByText('test-name');

    // edit
    user.click(container.querySelectorAll('[title="Edit"]')[0]);
    const input = container.querySelectorAll('[mode="update"] input');
    expect(input).toHaveLength(5);
    user.clear(input[0]);
    user.type(input[0], 'update-name');
    user.click(container.querySelectorAll('[title="Save"]')[0]);

    // notice
    await findByText('更新しました。');

    expect(update).toBeCalledWith({
      id: 11,
      name: 'update-name',
      nameKana: 'テスト',
      zipCode: '100-0001',
      address: 'テスト県テスト市テスト町',
      phone: '090-0000-0000',
    });
  });
});