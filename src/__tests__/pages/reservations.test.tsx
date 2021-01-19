import dotenv from 'dotenv';
import { setup, mockFullCalendar, loadPage, findElement } from '~/__tests__/utils';
import user from '@testing-library/user-event';
import { startOfToday, startOfMonth, endOfMonth, addDays, format, setHours } from 'date-fns';

dotenv.config({ path: 'server/.env' });

setup();

describe('Reservations', () => {
  it('should show reservations', async() => {
    const { findByText, getByText, getAllByText } = await loadPage(
      'reservations',
      scope => scope.get(/reservations/).reply(200, {
        'data': [
          {
            'id': 1008,
            'guestId': 7,
            'guestName': '田中 心愛',
            'guestNameKana': '伊藤 莉子',
            'guestZipCode': '789-5615',
            'guestAddress': 'Montserrat 佐々木村 木村 Row',
            'guestPhone': '07-8684-9443',
            'roomId': 5,
            'roomName': '杏19119',
            'number': 4,
            'amount': 149276,
            'checkin': '2021-02-11T06:00:00.000Z',
            'checkout': '2021-02-12T01:00:00.000Z',
            'status': 'reserved',
            'payment': null,
            'createdAt': '2021-01-09T15:43:53.703Z',
            'updatedAt': '2021-01-09T15:44:16.582Z',
            'room': { 'number': 4, 'price': 37319 },
          }, {
            'id': 1007,
            'guestId': 9,
            'guestName': '伊藤 颯太',
            'guestNameKana': '小林 蒼空',
            'guestZipCode': '251-2747',
            'guestAddress': 'Greece 佐藤市 大翔 Course',
            'guestPhone': '004-297-8015',
            'roomId': 5,
            'roomName': '杏19119',
            'number': 4,
            'amount': 298552,
            'checkin': '2021-01-22T06:00:00.000Z',
            'checkout': '2021-01-24T01:00:00.000Z',
            'status': 'reserved',
            'payment': null,
            'createdAt': '2021-01-09T06:11:45.590Z',
            'updatedAt': '2021-01-09T06:11:45.591Z',
            'room': { 'number': 4, 'price': 37319 },
          }, {
            'id': 1006,
            'guestId': 10,
            'guestName': '清水 結菜',
            'guestNameKana': '山田 大和',
            'guestZipCode': '317-0074',
            'guestAddress': 'American Samoa 井上村 蒼空 Loop',
            'guestPhone': '089-159-0016',
            'roomId': 5,
            'roomName': '杏19119',
            'number': 4,
            'amount': 149276,
            'checkin': '2021-02-02T06:00:00.000Z',
            'checkout': '2021-02-03T01:00:00.000Z',
            'status': 'cancelled',
            'payment': null,
            'createdAt': '2021-01-08T17:50:26.717Z',
            'updatedAt': '2021-01-08T17:51:21.255Z',
            'room': { 'number': 4, 'price': 37319 },
          }, {
            'id': 1004,
            'guestId': 9,
            'guestName': '伊藤 颯太',
            'guestNameKana': '小林 蒼空',
            'guestZipCode': '251-2747',
            'guestAddress': 'Greece 佐藤市 大翔 Course',
            'guestPhone': '004-297-8015',
            'roomId': 5,
            'roomName': '杏19119',
            'number': 4,
            'amount': 149276,
            'checkin': '2021-01-21T06:00:00.000Z',
            'checkout': '2021-01-22T01:00:00.000Z',
            'status': 'reserved',
            'payment': 149276,
            'createdAt': '2021-01-07T18:33:48.639Z',
            'updatedAt': '2021-01-07T18:33:48.640Z',
            'room': null,
          }, {
            'id': 1003,
            'guestId': 9,
            'guestName': '伊藤 颯太',
            'guestNameKana': '小林 蒼空',
            'guestZipCode': '251-2747',
            'guestAddress': 'Greece 佐藤市 大翔 Course',
            'guestPhone': '004-297-8015',
            'roomId': 2,
            'roomName': '大翔75634',
            'number': 1,
            'amount': 80888,
            'checkin': '2021-01-13T06:00:00.000Z',
            'checkout': '2021-01-14T01:00:00.000Z',
            'status': 'reserved',
            'payment': null,
            'createdAt': '2021-01-07T17:51:37.396Z',
            'updatedAt': '2021-01-07T18:33:01.210Z',
            'room': { 'number': 5, 'price': 80888 },
          },
        ],
        'page': 0,
        'totalCount': 1004,
      }),
    );

    await findByText('田中 心愛');
    expect(getAllByText('杏19119')).toHaveLength(4);
    expect(getByText('(¥80888 * 1人 * 1泊)')).toBeVisible();
    expect(getByText('2021-02-03 10:00')).toBeVisible();
    expect(getByText('キャンセル')).toBeVisible();
    expect(getAllByText('予約済み')).toHaveLength(4);
  });

  it('should handle validation error', async() => {
    const save = jest.fn();
    mockFullCalendar(
      startOfMonth(startOfToday()),
      endOfMonth(startOfToday()),
      {
        'checkin': [
          addDays(startOfMonth(startOfToday()), 4), // click after loading (valid date)
        ],
        'checkout': [
          addDays(startOfMonth(startOfToday()), 6), // click after loading (valid date)
        ],
      },
      {
        'checkin': [
          [{ start: startOfMonth(startOfToday()), end: addDays(startOfMonth(startOfToday()), 3) }], // click after loading (valid date)
        ],
        'checkout': [
          [{ start: addDays(startOfMonth(startOfToday()), 4), end: addDays(startOfMonth(startOfToday()), 8) }], // click after loading (valid date)
        ],
      },
    );
    const {
      findByText,
      findAllByText,
      findByTestId,
      findByRole,
      getByTestId,
      queryAllByText,
      container,
    } = await loadPage(
      'reservations',
      scope => scope
        .get(/reservations\?/).reply(200, {
          'data': [],
          'page': 0,
          'totalCount': 0,
        })
        .get(/reservations\/search\/guests/).reply(200, {
          'data': [
            {
              'id': 10,
              'name': '清水 結菜',
              'nameKana': '山田 大和',
              'zipCode': '317-0074',
              'address': 'American Samoa 井上村 蒼空 Loop',
              'phone': '089-159-0016',
              'reservations': [],
            },
          ],
          'page': 0,
          'totalCount': 1,
        })
        .get(/reservations\/search\/rooms/).reply(200, {
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
        .get('/reservations/guest?guestId=10').reply(200, { 'id': 10, 'name': '清水 結菜' })
        .get('/reservations/room?roomId=5').reply(200, { 'id': 5, 'name': '杏19119', 'number': 4, 'price': 37319 })
        .get(/reservations\/calendar\/checkin/).reply(200, [
          {
            'start': format(startOfMonth(startOfToday()), 'yyyy-MM-dd'),
            'end': format(startOfMonth(addDays(startOfToday(), 3)), 'yyyy-MM-dd'),
            'allDay': true,
            'color': '#a99',
            'textColor': 'black',
            'display': 'background',
          },
        ])
        .get(/reservations\/calendar\/checkout/).reply(200, [
          {
            'start': format(startOfMonth(addDays(startOfToday(), 4)), 'yyyy-MM-dd'),
            'end': format(startOfMonth(addDays(startOfToday(), 8)), 'yyyy-MM-dd'),
            'allDay': true,
            'color': '#a99',
            'textColor': 'black',
            'display': 'inverse-background',
          },
        ])
        .post('/reservations', body => {
          save(body);
          return body;
        }).reply(400, [
          {
            'value': '2020-12-31T01:00:00.000Z',
            'property': 'guestId',
            'children': [],
            'constraints': { 'Test1': 'Invalid guestId.' },
          },
          {
            'value': '2020-12-31T01:00:00.000Z',
            'property': 'roomId',
            'children': [],
            'constraints': { 'Test2': 'Invalid roomId.' },
          },
          {
            'value': '2020-12-31T01:00:00.000Z',
            'property': 'number',
            'children': [],
            'constraints': { 'Test3': 'Invalid number.' },
          },
          {
            'value': '2020-12-31T01:00:00.000Z',
            'property': 'checkin',
            'children': [],
            'constraints': { 'Test4': 'Invalid checkin.' },
          },
          {
            'value': '2020-12-31T01:00:00.000Z',
            'property': 'checkout',
            'children': [],
            'constraints': { 'Test5': 'Invalid checkout.' },
          },
        ]),
    );

    const button = container.querySelectorAll('[title="Add"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);
    const select = await findAllByText('選択');

    // select guest
    user.click(select[0]);
    await findByText('清水 結菜');
    user.click(findElement(getByTestId('guests-search-table'), '[title="Select"]'));

    // select room
    user.click(select[1]);
    await findByText('杏19119');
    user.click(findElement(getByTestId('rooms-search-table'), '[title="Select"]'));

    // select checkin
    user.click(getByTestId('select-checkin-date-link'));
    await findByTestId('checkin-mock-calendar-not-loading');
    user.click(await findByTestId('checkin-mock-calendar')); // click after loading (valid date)
    await findByText(format(addDays(startOfMonth(startOfToday()), 4), 'yyyy-MM-dd'));

    // select checkout
    user.click(await findByTestId('select-checkout-date-link'));
    await findByTestId('checkout-mock-calendar-not-loading');
    user.click(await findByTestId('checkout-mock-calendar')); // click after loading (valid date)
    await findByText(format(addDays(startOfMonth(startOfToday()), 6), 'yyyy-MM-dd'));

    user.click(container.querySelectorAll('[title="Save"]')[0]);
    await findByText('Invalid guestId.');
    await findByText('Invalid roomId.');
    await findByText('Invalid number.');
    await findByText('Invalid checkin.');
    await findByText('Invalid checkout.');

    user.click(await findByText('清水 結菜'));
    user.click(findElement(await findByRole('presentation'), '.MuiBackdrop-root'));
    expect(queryAllByText('Invalid guestId.')).toHaveLength(0);
  });

  it('should add reservation', async() => {
    const save = jest.fn();
    mockFullCalendar(
      startOfMonth(startOfToday()),
      endOfMonth(startOfToday()),
      {
        'checkin': [
          startOfMonth(startOfToday()), // click while loading
          startOfMonth(startOfToday()), // click after loading (invalid date)
          addDays(startOfMonth(startOfToday()), 4), // click after loading (valid date)
        ],
        'checkout': [
          addDays(startOfMonth(startOfToday()), 6), // click after loading (valid date)
        ],
      },
      {
        'checkin': [
          [{ start: startOfMonth(startOfToday()), end: addDays(startOfMonth(startOfToday()), 3) }], // click after loading (invalid date)
          [{ start: startOfMonth(startOfToday()), end: addDays(startOfMonth(startOfToday()), 3) }], // click after loading (valid date)
        ],
        'checkout': [
          [{ start: addDays(startOfMonth(startOfToday()), 4), end: addDays(startOfMonth(startOfToday()), 8) }], // click after loading (valid date)
        ],
      },
    );
    const {
      findByText,
      findAllByText,
      findByTestId,
      findByRole,
      getByTestId,
      container,
    } = await loadPage(
      'reservations',
      scope => scope
        .get(/reservations\?/).reply(200, {
          'data': [],
          'page': 0,
          'totalCount': 0,
        })
        .get(/reservations\/search\/guests/).reply(200, {
          'data': [
            {
              'id': 10,
              'name': '清水 結菜',
              'nameKana': '山田 大和',
              'zipCode': '317-0074',
              'address': 'American Samoa 井上村 蒼空 Loop',
              'phone': '089-159-0016',
              'reservations': [],
            },
          ],
          'page': 0,
          'totalCount': 1,
        })
        .get(/reservations\/search\/rooms/).reply(200, {
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
        .get('/reservations/guest?guestId=10').reply(200, { 'id': 10, 'name': '清水 結菜' })
        .get('/reservations/room?roomId=5').reply(200, { 'id': 5, 'name': '杏19119', 'number': 4, 'price': 37319 })
        .get(/reservations\/calendar\/checkin/).reply(200, [
          {
            'start': format(startOfMonth(startOfToday()), 'yyyy-MM-dd'),
            'end': format(startOfMonth(addDays(startOfToday(), 3)), 'yyyy-MM-dd'),
            'allDay': true,
            'color': '#a99',
            'textColor': 'black',
            'display': 'background',
          },
        ])
        .get(/reservations\/calendar\/checkout/).reply(200, [
          {
            'start': format(startOfMonth(addDays(startOfToday(), 4)), 'yyyy-MM-dd'),
            'end': format(startOfMonth(addDays(startOfToday(), 8)), 'yyyy-MM-dd'),
            'allDay': true,
            'color': '#a99',
            'textColor': 'black',
            'display': 'inverse-background',
          },
        ])
        .post('/reservations', body => {
          save(body);
          return body;
        }).reply(201),
    );

    const button = container.querySelectorAll('[title="Add"]');
    expect(button).toHaveLength(1);
    user.click(button[0]);
    const select = await findAllByText('選択');
    expect(select).toHaveLength(2);

    // select guest
    user.click(select[0]);
    await findByTestId('guests-search-table');
    user.click(findElement(getByTestId('guests-search-table'), '[aria-label="close"]'));
    user.click(select[0]);
    await findByText('清水 結菜');
    user.click(findElement(getByTestId('guests-search-table'), '[title="Select"]'));

    // select room
    user.click(select[1]);
    await findByTestId('rooms-search-table');
    await findByText('杏19119');
    user.click(findElement(getByTestId('rooms-search-table'), '[title="Select"]'));
    await findByTestId('input-number');

    // on change input number
    user.type(findElement(getByTestId('input-number'), 'input'), '0');

    // open and close checkin
    user.click(getByTestId('select-checkin-date-link'));
    user.click(findElement(await findByRole('presentation'), '.MuiBackdrop-root')); // close test

    // select checkin
    user.click(getByTestId('select-checkin-date-link'));
    await findByTestId('select-checkin-date-calendar');
    await findByTestId('checkin-mock-calendar-loading');
    user.click(await findByTestId('checkin-mock-calendar')); // click while loading
    await findByTestId('checkin-mock-calendar-not-loading');
    user.click(await findByTestId('checkin-mock-calendar')); // click after loading (invalid date)
    user.click(await findByTestId('checkin-mock-calendar')); // click after loading (valid date)
    await findByText(format(addDays(startOfMonth(startOfToday()), 4), 'yyyy-MM-dd'));

    // select checkout date
    user.click(await findByTestId('select-checkout-date-link'));
    await findByTestId('select-checkout-date-calendar');
    await findByTestId('checkout-mock-calendar-loading');
    await findByTestId('checkout-mock-calendar-not-loading');
    user.click(await findByTestId('checkout-mock-calendar')); // click after loading (valid date)
    await findByText(format(addDays(startOfMonth(startOfToday()), 6), 'yyyy-MM-dd'));

    // select checkout time
    user.click(await findByTestId('select-checkout-time-link'));
    user.click(await findByText('OK'));

    // save
    await findByText('¥298552 = ¥37319 * 4人 * 2泊');
    user.click(container.querySelectorAll('[title="Save"]')[0]);

    // notice
    await findByText('追加しました。');

    expect(save).toBeCalledWith({
      guestId: 10,
      roomId: 5,
      number: 4,
      checkin: setHours(addDays(startOfMonth(startOfToday()), 4), 15).toISOString(),
      checkout: setHours(addDays(startOfMonth(startOfToday()), 6), 10).toISOString(),
    });
  });

  it('should delete reservation', async() => {
    const del = jest.fn();
    const { findByText, container } = await loadPage(
      'reservations',
      scope => scope
        .get(/reservations\?/).reply(200, {
          'data': [
            {
              'id': 1011,
              'guestId': 10,
              'guestName': 'test-name',
              'guestNameKana': 'テスト',
              'guestZipCode': '100-0001',
              'guestAddress': 'テスト県テスト市テスト町',
              'guestPhone': '090-0000-0000',
              'roomId': 1,
              'roomName': '颯太83958',
              'number': 3,
              'amount': 18255,
              'checkin': '2020-12-28T06:00:00.000Z',
              'checkout': '2020-12-29T01:00:00.000Z',
              'status': 'reserved',
              'payment': null,
              'createdAt': '2021-01-13T05:42:30.903Z',
              'updatedAt': '2021-01-13T05:42:30.903Z',
              'room': { 'number': 8, 'price': 6085 },
            },
          ],
          'page': 0,
          'totalCount': 1,
        })
        .get('/reservations/guest?guestId=10').reply(200, { 'id': 10, 'name': '清水 結菜' })
        .get('/reservations/room?roomId=1').reply(200, { 'id': 1, 'name': '杏19119', 'number': 4, 'price': 37319 })
        .delete('/reservations/1011').reply(200, body => {
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

  it('should update reservation', async() => {
    const update = jest.fn();
    const { findByText, container } = await loadPage(
      'reservations',
      scope => scope
        .get(/reservations\?/).reply(200, {
          'data': [{
            'id': 1011,
            'guestId': 10,
            'guestName': 'test-name',
            'guestNameKana': 'テスト',
            'guestZipCode': '100-0001',
            'guestAddress': 'テスト県テスト市テスト町',
            'guestPhone': '090-0000-0000',
            'roomId': 1,
            'roomName': '颯太83958',
            'number': 3,
            'amount': 18255,
            'checkin': '2020-12-28T06:00:00.000Z',
            'checkout': '2020-12-29T01:00:00.000Z',
            'status': 'reserved',
            'payment': null,
            'createdAt': '2021-01-13T05:42:30.903Z',
            'updatedAt': '2021-01-13T05:42:30.903Z',
            'room': { 'number': 8, 'price': 6085 },
          }],
          'page': 0,
          'totalCount': 1,
        })
        .get('/reservations/guest?guestId=10').reply(200, { 'id': 10, 'name': '清水 結菜' })
        .get('/reservations/room?roomId=1').reply(200, { 'id': 1, 'name': '杏19119', 'number': 4, 'price': 37319 })
        .patch('/reservations/1011', body => {
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
    expect(input).toHaveLength(3);
    user.type(input[2], '12345');
    user.click(container.querySelectorAll('[title="Save"]')[0]);

    // notice
    await findByText('更新しました。');

    expect(update).toBeCalledWith({
      'id': 1011,
      'guestId': 10,
      'guestName': 'test-name',
      'guestNameKana': 'テスト',
      'guestZipCode': '100-0001',
      'guestAddress': 'テスト県テスト市テスト町',
      'guestPhone': '090-0000-0000',
      'roomId': 1,
      'roomName': '颯太83958',
      'number': 3,
      'amount': 18255,
      'checkin': '2020-12-28T06:00:00.000Z',
      'checkout': '2020-12-29T01:00:00.000Z',
      'status': 'reserved',
      'payment': 12345,
      'room': { 'number': 8, 'price': 6085 },
    });
  });
});
