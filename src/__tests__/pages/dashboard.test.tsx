import React from 'react';
import dotenv from 'dotenv';
import Index from '~/pages/index';
import { render, useNock, setupCookie, setCookie, findElement, mockStdout } from '~/__tests__/utils';
import user from '@testing-library/user-event';
import { startOfToday, addYears, format } from 'date-fns';

dotenv.config({ path: 'server/.env' });

setupCookie();
mockStdout();

describe('Dashboard', () => {
  it('should show checkin and checkout tables and sales', async() => {
    useNock()
      .get('/admin').reply(200, { name: 'test name', icon: null })
      .get('/dashboard/rooms').reply(200, [])
      .get(/\/dashboard\/checkin/).reply(200, {
        'data': [],
        'page': 0,
        'totalCount': 0,
      })
      .get(/\/dashboard\/checkout/).reply(200, {
        'data': [],
        'page': 0,
        'totalCount': 0,
      })
      .get(/\/dashboard\/sales/).reply(200, []);
    setCookie('authToken', 'token');

    const { findByTestId, getByTestId, getByText } = render(
      <Index/>,
      {},
    );

    // tables
    await findByTestId('select-date');

    // sales
    expect(getByTestId('select-sales-date')).toBeVisible();
    expect(getByTestId('daily-sales')).toBeVisible();
    expect(getByTestId('monthly-sales')).toBeVisible();
    expect(getByText('全部屋')).toBeVisible();
  });

  it('should checkin and checkout', async() => {
    const checkin  = jest.fn();
    const checkout = jest.fn();
    const cancel   = jest.fn();
    useNock()
      .get('/admin').reply(200, { name: 'test name', icon: null })
      .get('/dashboard/rooms').reply(200, [])
      .get(/\/dashboard\/checkin/).reply(200, {
        'data': [
          {
            'id': 831,
            'guestName': '山本 美咲',
            'guestNameKana': 'テスト',
            'guestPhone': '060-844-7544',
            'roomName': '杏19119',
            'checkin': '2021-01-10T06:00:00.000Z',
            'checkout': '2021-01-17T01:00:00.000Z',
            'status': 'reserved',
          },
          {
            'id': 127,
            'guestName': '清水 蒼空',
            'guestNameKana': 'テスト',
            'guestPhone': '01165-3-9928',
            'roomName': '杏19119',
            'checkin': '2021-01-10T06:00:00.000Z',
            'checkout': '2021-01-14T01:00:00.000Z',
            'status': 'reserved',
          },
          {
            'id': 731,
            'guestName': '清水 結菜',
            'guestNameKana': 'テスト',
            'guestPhone': '089-159-0016',
            'roomName': '颯太83958',
            'checkin': '2021-01-10T06:00:00.000Z',
            'checkout': '2021-01-17T01:00:00.000Z',
            'status': 'checkin',
          },
          {
            'id': 227,
            'guestName': '吉田 大和',
            'guestNameKana': 'テスト',
            'guestPhone': '05469-0-9629',
            'roomName': '杏19119',
            'checkin': '2021-01-10T06:00:00.000Z',
            'checkout': '2021-01-14T01:00:00.000Z',
            'status': 'cancelled',
          },
          {
            'id': 227,
            'guestName': '吉田 大和',
            'guestNameKana': 'テスト',
            'guestPhone': '05469-0-9629',
            'roomName': '杏19119',
            'checkin': '2021-01-10T06:00:00.000Z',
            'checkout': '2021-01-14T01:00:00.000Z',
            'status': 'checkout',
          },
        ],
        'page': 0,
        'totalCount': 5,
      })
      .get(/\/dashboard\/checkout/).reply(200, {
        'data': [
          {
            'id': 578,
            'guestName': '清水 蒼空',
            'guestNameKana': 'テスト',
            'roomName': '大翔75634',
            'checkin': '2021-01-09T06:00:00.000Z',
            'checkout': '2021-01-10T01:00:00.000Z',
            'number': 4,
            'status': 'checkout',
            'amount': 323552,
            'payment': 323552,
            'room': { 'number': 5, 'price': 80888 },
          },
          {
            'id': 315,
            'guestName': '山本 蓮',
            'guestNameKana': 'テスト',
            'roomName': '颯太83958',
            'checkin': '2021-01-08T06:00:00.000Z',
            'checkout': '2021-01-10T01:00:00.000Z',
            'number': 3,
            'status': 'checkin',
            'amount': 36510,
            'payment': null,
            'room': { 'number': 8, 'price': 6085 },
          },
          {
            'id': 415,
            'guestName': '伊藤 颯太',
            'guestNameKana': 'テスト',
            'roomName': '大翔75634',
            'checkin': '2021-01-08T06:00:00.000Z',
            'checkout': '2021-01-10T01:00:00.000Z',
            'number': 3,
            'status': 'checkout',
            'amount': 36510,
            'payment': 365100,
            'room': { 'number': 8, 'price': 6085 },
          },
          {
            'id': 415,
            'guestName': '伊藤 颯太',
            'guestNameKana': 'テスト',
            'roomName': '大翔75634',
            'checkin': '2021-01-08T06:00:00.000Z',
            'checkout': '2021-01-10T01:00:00.000Z',
            'number': 3,
            'status': 'reserved',
            'amount': 36510,
            'payment': null,
            'room': { 'number': 8, 'price': 6085 },
          },
          {
            'id': 415,
            'guestName': '伊藤 颯太',
            'guestNameKana': 'テスト',
            'roomName': '大翔75634',
            'checkin': '2021-01-08T06:00:00.000Z',
            'checkout': '2021-01-10T01:00:00.000Z',
            'number': 3,
            'status': 'cancelled',
            'amount': 36510,
            'payment': null,
            'room': null,
          },
        ],
        'page': 0,
        'totalCount': 5,
      },
      )
      .get(/\/dashboard\/sales/).reply(200, [])
      .patch('/dashboard/checkin', body => {
        checkin(body);
        return body;
      }).reply(200)
      .patch('/dashboard/checkout', body => {
        checkout(body);
        return body;
      }).reply(200)
      .patch('/dashboard/cancel', body => {
        cancel(body);
        return body;
      }).reply(200);
    setCookie('authToken', 'token');

    const { getByTestId, findAllByText, findByText, getAllByText } = render(
      <Index/>,
      {},
    );

    await findByText('山本 美咲');
    await findByText('山本 蓮');
    expect(await findAllByText('チェックイン')).toHaveLength(4); // table title, table header, button * 2
    expect(getAllByText('チェックアウト')).toHaveLength(3); // table title, table header, button
    expect(getAllByText('キャンセル')).toHaveLength(5); // table header, button * 4
    expect(getAllByText('チェックイン済み')).toHaveLength(1);
    expect(getAllByText('キャンセル済み')).toHaveLength(1);
    expect(getAllByText('チェックアウト済み')).toHaveLength(2);
    expect(getAllByText('未チェックイン')).toHaveLength(1);

    // change date
    user.click(findElement(await getByTestId('select-date'), 'input'));
    await findByText(format(startOfToday(), 'M月 yyyy'));
    user.click(await findByText('17'));

    // test checkin
    user.click(getAllByText('チェックイン')[2]);
    await findByText('更新しました。');

    // test checkout
    user.click(getAllByText('チェックアウト')[2]);
    user.click(await findByText('閉じる'));
    user.click(getAllByText('チェックアウト')[2]);
    user.clear(findElement(await getByTestId('checkout-payment'), '.MuiInputBase-input'));
    user.type(findElement(await getByTestId('checkout-payment'), '.MuiInputBase-input'), '1');
    user.click(await findByText('確定'));
    await findByText('更新しました。');

    // test cancel
    user.click(getAllByText('キャンセル')[4]);
    user.click(await findByText('閉じる'));
    user.click(getAllByText('キャンセル')[4]);
    user.click(await findByText('はい'));
    await findByText('キャンセルしました。');

    expect(checkin).toBeCalledWith({ id: 831 });
    expect(checkout).toBeCalledWith({ id: 315, payment: 1 });
    expect(cancel).toBeCalledWith({ id: 227 });
  });

  it('should render sales', async() => {
    const daily   = jest.fn();
    const monthly = jest.fn();
    useNock()
      .get('/admin').reply(200, { name: 'test name', icon: null })
      .get('/dashboard/rooms').reply(200, [
        { 'id': 1, 'name': '颯太83958' },
        { 'id': 2, 'name': '大翔75634' },
        { 'id': 3, 'name': '翼36423' },
        { 'id': 4, 'name': '結菜8081' },
        { 'id': 5, 'name': '杏19119' },
      ])
      .get(/\/dashboard\/checkin/).reply(200, {
        'data': [],
        'page': 0,
        'totalCount': 5,
      })
      .get(/\/dashboard\/checkout/).reply(200, {
        'data': [],
        'page': 0,
        'totalCount': 5,
      })
      .get(/\/dashboard\/sales\/daily/).reply(200, (uri) => {
        daily(uri);
        return [
          { 'day': '2019-12-31T15:00:00.000Z', 'sales': 656568 },
          { 'day': '2020-01-01T15:00:00.000Z', 'sales': 121700 },
          { 'day': '2020-01-02T15:00:00.000Z', 'sales': 517380 },
          { 'day': '2020-01-03T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-04T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-05T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-06T15:00:00.000Z', 'sales': 447828 },
          { 'day': '2020-01-07T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-08T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-09T15:00:00.000Z', 'sales': 485147 },
          { 'day': '2020-01-10T15:00:00.000Z', 'sales': 1368088 },
          { 'day': '2020-01-11T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-12T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-13T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-14T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-15T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-16T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-17T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-18T15:00:00.000Z', 'sales': 108075 },
          { 'day': '2020-01-19T15:00:00.000Z', 'sales': 21615 },
          { 'day': '2020-01-20T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-21T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-22T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-23T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-24T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-25T15:00:00.000Z', 'sales': 0 },
          { 'day': '2020-01-26T15:00:00.000Z', 'sales': 1034760 },
          { 'day': '2020-01-27T15:00:00.000Z', 'sales': 449470 },
          { 'day': '2020-01-28T15:00:00.000Z', 'sales': 242664 },
          { 'day': '2020-01-29T15:00:00.000Z', 'sales': 559785 },
          { 'day': '2020-01-30T15:00:00.000Z', 'sales': 0 },
        ];
      })
      .get(/\/dashboard\/sales\/monthly/)
      .reply(200, (uri) => {
        monthly(uri);
        return [
          { 'month': '2019-12-31T15:00:00.000Z', 'sales': 6013080 },
          { 'month': '2020-01-31T15:00:00.000Z', 'sales': 4790803 },
          { 'month': '2020-02-29T15:00:00.000Z', 'sales': 18903318 },
          { 'month': '2020-03-31T15:00:00.000Z', 'sales': 11577323 },
          { 'month': '2020-04-30T15:00:00.000Z', 'sales': 14144067 },
          { 'month': '2020-05-31T15:00:00.000Z', 'sales': 9184391 },
          { 'month': '2020-06-30T15:00:00.000Z', 'sales': 21629510 },
          { 'month': '2020-07-31T15:00:00.000Z', 'sales': 19655282 },
          { 'month': '2020-08-31T15:00:00.000Z', 'sales': 20417817 },
          { 'month': '2020-09-30T15:00:00.000Z', 'sales': 21199194 },
          { 'month': '2020-10-31T15:00:00.000Z', 'sales': 24838914 },
          { 'month': '2020-11-30T15:00:00.000Z', 'sales': 19164865 },
        ];
      });
    setCookie('authToken', 'token');

    const { getByTestId, findByText, getByText } = render(
      <Index/>,
      {},
    );

    await findByText('全部屋');
    expect(getByTestId('select-sales-date')).toBeVisible();
    expect(getByTestId('daily-sales')).toBeVisible();
    expect(getByTestId('monthly-sales')).toBeVisible();

    // change room
    user.click(getByText('全部屋'));
    user.click(await findByText('大翔75634'));

    // change date
    user.click(findElement(await getByTestId('select-sales-date'), 'input'));
    await findByText(format(startOfToday(), 'yyyy'));
    user.click(await findByText(format(addYears(startOfToday(), 2), 'yyyy')));
    user.click(await findByText('5月'));
    user.click(await findByText('大翔75634'));
    user.click(await findByText('杏19119'));

    expect(daily.mock.calls.length).toBeGreaterThanOrEqual(3); // 1 + change room + change date
    expect(monthly.mock.calls.length).toBeGreaterThanOrEqual(3); // 1 + change room + change date
    expect(new RegExp(`date=${format(startOfToday(), 'yyyy')}`).test(daily.mock.calls[0])).toBe(true);
    expect(new RegExp(`date=${format(addYears(startOfToday(), 2), 'yyyy')}`).test(daily.mock.calls[daily.mock.calls.length - 1])).toBe(true);
    expect(/roomId=2/.test(daily.mock.calls[0])).toBe(false);
    expect(/roomId=2/.test(daily.mock.calls[daily.mock.calls.length - 1])).toBe(true);
  });
});
