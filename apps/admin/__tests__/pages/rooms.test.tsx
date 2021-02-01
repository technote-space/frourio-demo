import { setup, loadPage, findElement } from '~/__tests__/utils';
import user from '@testing-library/user-event';
import { startOfToday, startOfMonth, addDays, format } from 'date-fns';

setup();

describe('Rooms', () => {
  it('should show rooms', async() => {
    const { findByText, getByText } = await loadPage(
      'rooms',
      scope => scope.get(/rooms\?/).reply(200, {
        'data': [
          {
            'id': 5,
            'name': '杏19119',
            'number': 4,
            'price': 37319,
            'createdAt': '2021-01-04T09:36:28.487Z',
            'updatedAt': '2021-01-04T09:36:28.487Z',
          }, {
            'id': 4,
            'name': '結菜8081',
            'number': 8,
            'price': 51738,
            'createdAt': '2021-01-04T09:36:28.485Z',
            'updatedAt': '2021-01-04T09:36:28.485Z',
          }, {
            'id': 3,
            'name': '翼36423',
            'number': 1,
            'price': 21615,
            'createdAt': '2021-01-04T09:36:28.482Z',
            'updatedAt': '2021-01-04T09:36:28.482Z',
          }, {
            'id': 2,
            'name': '大翔75634',
            'number': 5,
            'price': 80888,
            'createdAt': '2021-01-04T09:36:28.479Z',
            'updatedAt': '2021-01-07T18:31:11.661Z',
          }, {
            'id': 1,
            'name': '颯太83958',
            'number': 8,
            'price': 6085,
            'createdAt': '2021-01-04T09:36:28.477Z',
            'updatedAt': '2021-01-04T09:36:28.477Z',
          },
        ],
        'page': 0,
        'totalCount': 5,
      }),
    );

    await findByText('杏19119');
    expect(getByText('颯太83958')).toBeVisible();
    expect(getByText('¥21615')).toBeVisible();
  });

  it('should show status', async() => {
    const { findByText, findByTestId, findByRole, findAllByText } = await loadPage(
      'rooms',
      scope => scope
        .get(/rooms\?/).reply(200, {
          'data': [
            {
              'id': 5,
              'name': '杏19119',
              'number': 4,
              'price': 37319,
              'createdAt': '2021-01-04T09:36:28.487Z',
              'updatedAt': '2021-01-04T09:36:28.487Z',
            },
          ],
          'page': 0,
          'totalCount': 1,
        })
        .get(/rooms\/calendar/).reply(200, [
          {
            'title': '清水 蒼空 (4人)',
            'start': format(addDays(startOfMonth(startOfToday()), 2), 'yyyy-MM-dd'),
            'end': format(addDays(startOfMonth(startOfToday()), 6), 'yyyy-MM-dd'),
            'allDay': true,
            'displayEventTime': false,
            'startEditable': false,
            'durationEditable': false,
            'resourceEditable': false,
          },
          {
            'title': '田中 心愛 (1人)',
            'start': format(addDays(startOfMonth(startOfToday()), 8), 'yyyy-MM-dd'),
            'end': format(addDays(startOfMonth(startOfToday()), 13), 'yyyy-MM-dd'),
            'allDay': true,
            'displayEventTime': false,
            'startEditable': false,
            'durationEditable': false,
            'resourceEditable': false,
          },
        ]),
    );

    await findByText('杏19119');

    user.click(await findByTestId('room-status'));
    expect((await findAllByText('清水 蒼空 (4人)')).length).toBeGreaterThanOrEqual(1);
    expect((await findAllByText('田中 心愛 (1人)')).length).toBeGreaterThanOrEqual(1);

    // close
    user.click(findElement(await findByRole('presentation'), '.MuiBackdrop-root'));
  });

  it('should handle validation error', async() => {
    const save = jest.fn();
    const { findByText, queryAllByText, container } = await loadPage(
      'rooms',
      scope => scope
        .get(/rooms\?/).reply(200, {
          'data': [],
          'page': 0,
          'totalCount': 0,
        })
        .post('/rooms', body => {
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
            'property': 'number',
            'children': [],
            'constraints': {
              'isPositive': 'number must be a positive number',
              'isInt': 'number must be an integer number',
              'isNotEmpty': 'number should not be empty',
            },
          },
          {
            'property': 'price',
            'children': [],
            'constraints': {
              'min': 'price must not be less than 0',
              'isInt': 'price must be an integer number',
              'isNotEmpty': 'price should not be empty',
            },
          },
        ]),
    );

    const button = container.querySelectorAll('[title="追加"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);

    // input
    const input = container.querySelectorAll('[mode="add"] input');
    expect(input).toHaveLength(3);
    user.type(input[0], 'test-name');
    user.type(input[1], '3');
    user.type(input[2], '10000');

    user.click(container.querySelectorAll('[title="保存"]')[0]);
    await findByText('name must be longer than or equal to 1 characters');
    await findByText('number must be a positive number');
    await findByText('price must not be less than 0');

    container.querySelectorAll('[mode="add"] input').forEach(input => {
      user.type(input, '0');
    });

    expect(queryAllByText('name must be longer than or equal to 1 characters')).toHaveLength(0);
    expect(queryAllByText('number must be a positive number')).toHaveLength(0);
    expect(queryAllByText('price must not be less than 0')).toHaveLength(0);
  });

  it('should add room', async() => {
    const save = jest.fn();
    const { findByText, container } = await loadPage(
      'rooms',
      scope => scope
        .get(/rooms\?/).reply(200, {
          'data': [],
          'page': 0,
          'totalCount': 0,
        })
        .post('/rooms', body => {
          save(body);
          return body;
        }).reply(201),
    );

    const button = container.querySelectorAll('[title="追加"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);

    // input
    const input = container.querySelectorAll('[mode="add"] input');
    expect(input).toHaveLength(3);
    user.type(input[0], 'test-name');
    user.type(input[1], '3');
    user.type(input[2], '10000');

    // save
    user.click(container.querySelectorAll('[title="保存"]')[0]);

    // notice
    await findByText('追加しました。');

    expect(save).toBeCalledWith({
      name: 'test-name',
      number: 3,
      price: 10000,
    });
  });

  it('should delete room', async() => {
    const del = jest.fn();
    const { findByText, container } = await loadPage(
      'rooms',
      scope => scope
        .get(/rooms\?/).reply(200, {
          'data': [{
            'id': 6,
            'name': 'test-name',
            'number': 3,
            'price': 10000,
            'createdAt': '2021-01-13T05:55:52.624Z',
            'updatedAt': '2021-01-13T05:55:52.624Z',
          }],
          'page': 0,
          'totalCount': 1,
        })
        .delete('/rooms/6').reply(200, body => {
          del();
          return body;
        }),
    );

    await findByText('test-name');

    const button = container.querySelectorAll('[title="削除"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);
    await findByText('この行を削除しますか？');

    // cancel delete
    user.click(container.querySelectorAll('[title="キャンセル"]')[0]);
    await findByText('test-name');

    // delete
    user.click(container.querySelectorAll('[title="削除"]')[0]);
    await findByText('この行を削除しますか？');
    user.click(container.querySelectorAll('[title="保存"]')[0]);

    // notice
    await findByText('削除しました。');

    expect(del).toBeCalledTimes(1);
  });

  it('should update room', async() => {
    const update = jest.fn();
    const { findByText, container } = await loadPage(
      'rooms',
      scope => scope
        .get(/rooms\?/).reply(200, {
          'data': [{
            'id': 6,
            'name': 'test-name',
            'number': 3,
            'price': 10000,
            'createdAt': '2021-01-13T05:55:52.624Z',
            'updatedAt': '2021-01-13T05:55:52.624Z',
          }],
          'page': 0,
          'totalCount': 1,
        })
        .patch('/rooms/6', body => {
          update(body);
          return body;
        }).reply(200),
    );

    await findByText('test-name');

    const button = container.querySelectorAll('[title="編集"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);

    // cancel edit
    user.click(container.querySelectorAll('[title="キャンセル"]')[0]);
    await findByText('test-name');

    // edit
    user.click(container.querySelectorAll('[title="編集"]')[0]);
    const input = container.querySelectorAll('[mode="update"] input');
    expect(input).toHaveLength(3);
    user.clear(input[0]);
    user.type(input[0], 'update-name');
    user.click(container.querySelectorAll('[title="保存"]')[0]);

    // notice
    await findByText('更新しました。');

    expect(update).toBeCalledWith({
      id: 6,
      name: 'update-name',
      number: 3,
      price: 10000,
    });
  });
});
