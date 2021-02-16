import { loadPage, setup, findElement, waitFor } from '~/__tests__/utils';
import user from '@testing-library/user-event';
import { startOfToday, addYears, format } from 'date-fns';

setup();

describe('Dashboard', () => {
  it('should show checkin and checkout tables and sales', async() => {
    const { findByTestId, getByTestId, getByText } = await loadPage(
      'dashboard',
      scope => scope
        .get('/dashboard/rooms').reply(200, [])
        .get(/\/dashboard\/(checkin|checkout)/).reply(200, {
          'data': [],
          'page': 0,
          'totalCount': 0,
        })
        .get(/\/dashboard\/sales/).reply(200, []),
    );

    // tables
    await findByTestId('select-date');

    // sales
    expect(getByTestId('select-sales-date')).toBeVisible();
    expect(getByTestId('daily-sales')).toBeVisible();
    expect(getByTestId('monthly-sales')).toBeVisible();
    expect(getByText('全部屋')).toBeVisible();
  });

  it('should checkin', async() => {
    const checkin = jest.fn();

    const { findAllByText, findByText, getByRole, getAllByText } = await loadPage(
      'dashboard',
      scope => scope
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
        })
        .get(/\/dashboard\/sales/).reply(200, [])
        .patch('/dashboard/checkin', body => {
          checkin(body);
          return body;
        }).reply(200, () => ({ id: 123 })),
    );

    await findByText('山本 美咲');
    await findByText('山本 蓮');
    expect(await findAllByText('チェックイン')).toHaveLength(4); // table title, table header, button * 2
    expect(getAllByText('チェックイン済み')).toHaveLength(1);

    // test checkin
    user.click(getAllByText('チェックイン')[2]);
    await findByText('更新しました。');

    // close alert
    user.click(findElement(getByRole('alert'), 'button'));
    await waitFor(() => expect(() => getByRole('alert')).toThrow());

    expect(checkin).toBeCalledWith({ id: 831 });
  });

  it('should resend room key', async() => {
    const checkin = jest.fn();

    const { findByText, getByRole, getAllByText } = await loadPage(
      'dashboard',
      scope => scope
        .get('/dashboard/rooms').reply(200, [])
        .get(/\/dashboard\/checkin/).reply(200, {
          'data': [{
            'id': 831,
            'guestName': '山本 美咲',
            'guestNameKana': 'テスト',
            'guestPhone': '060-844-7544',
            'roomName': '杏19119',
            'checkin': '2021-01-10T06:00:00.000Z',
            'checkout': '2021-01-17T01:00:00.000Z',
            'status': 'reserved',
            'isValid': true,
          }],
          'page': 0,
          'totalCount': 1,
        })
        .get(/\/dashboard\/checkout/).reply(200, {
          'data': [],
          'page': 0,
          'totalCount': 0,
        })
        .get(/\/dashboard\/sales/).reply(200, [])
        .post('/dashboard/checkin', body => {
          checkin(body);
          return body;
        }).reply(200, () => ({ id: 123 })),
    );

    await findByText('山本 美咲');
    expect(getAllByText('入室番号再送信')).toHaveLength(1);

    // test resend room key
    user.click(getAllByText('入室番号再送信')[0]);
    await findByText('送信しました。');

    // close alert
    user.click(findElement(getByRole('alert'), 'button'));
    await waitFor(() => expect(() => getByRole('alert')).toThrow());

    expect(checkin).toBeCalledWith({ id: 831 });
  });

  it('should checkout', async() => {
    const checkout = jest.fn();

    const { getByTestId, findAllByText, findByText, getByRole, getAllByText } = await loadPage(
      'dashboard',
      scope => scope
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
        })
        .get(/\/dashboard\/sales/).reply(200, [])
        .patch('/dashboard/checkout', body => {
          checkout(body);
          return body;
        }).reply(200, () => ({ id: 123 })),
    );

    await findByText('山本 美咲');
    await findByText('山本 蓮');
    expect(await findAllByText('チェックアウト')).toHaveLength(3); // table title, table header, button
    expect(getAllByText('チェックアウト済み')).toHaveLength(2);

    // test checkout
    await waitFor(() => expect(() => getByRole('presentation')).toThrow());
    user.click(getAllByText('チェックアウト')[2]);
    await waitFor(() => expect(() => getByRole('presentation')).not.toThrow());
    user.click(await findByText('閉じる'));
    await waitFor(() => expect(() => getByRole('presentation')).toThrow());
    user.click(getAllByText('チェックアウト')[2]);
    await waitFor(() => expect(() => getByRole('presentation')).not.toThrow());
    user.clear(findElement(getByTestId('checkout-payment'), '.MuiInputBase-input'));
    user.type(findElement(getByTestId('checkout-payment'), '.MuiInputBase-input'), '1');
    user.click(await findByText('確定'));
    await findByText('更新しました。');
    await waitFor(() => expect(() => getByRole('presentation')).toThrow());

    expect(checkout).toBeCalledWith({ id: 315, payment: 1 });
  });

  it('should cancel', async() => {
    const cancel = jest.fn();

    const { findAllByText, findByText, getByRole, getAllByText } = await loadPage(
      'dashboard',
      scope => scope
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
        })
        .get(/\/dashboard\/sales/).reply(200, [])
        .patch('/dashboard/cancel', body => {
          cancel(body);
          return body;
        }).reply(200, () => ({ id: 123 })),
    );

    await findByText('山本 美咲');
    await findByText('山本 蓮');
    expect(await findAllByText('キャンセル')).toHaveLength(3); // table header, button * 2
    expect(getAllByText('キャンセル済み')).toHaveLength(1);
    expect(getAllByText('チェックアウト済み')).toHaveLength(2);
    expect(getAllByText('未チェックイン')).toHaveLength(1);

    // test cancel
    user.click(getAllByText('キャンセル')[2]);
    await waitFor(() => expect(() => getByRole('presentation')).not.toThrow());
    user.click(await findByText('閉じる'));
    await waitFor(() => expect(() => getByRole('presentation')).toThrow());
    user.click(getAllByText('キャンセル')[2]);
    user.click(await findByText('はい'));
    await findByText('キャンセルしました。');
    await waitFor(() => expect(() => getByRole('presentation')).toThrow());

    expect(cancel).toBeCalledWith({ id: 127 });
  });

  it('should change date', async() => {
    const sales = jest.fn();

    const { getByTestId, findByText } = await loadPage(
      'dashboard',
      scope => scope
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
        })
        .get(/\/dashboard\/sales/).reply(200, () => {
          sales();
          return [];
        }),
    );

    await findByText('山本 美咲');
    await findByText('山本 蓮');

    // change date
    user.click(findElement(await getByTestId('select-date'), 'input'));
    await findByText(format(startOfToday(), 'M月 yyyy'));
    user.click(await findByText('17'));

    await waitFor(() => expect(sales.mock.calls.length).toBeGreaterThanOrEqual(3));
  });

  it('should fail to checkin', async() => {
    const checkin = jest.fn();

    const { findByText, getAllByText } = await loadPage(
      'dashboard',
      scope => scope
        .get('/dashboard/rooms').reply(200, [])
        .get(/\/dashboard\/checkin/).reply(200, {
          'data': [{
            'id': 831,
            'guestName': '山本 美咲',
            'guestNameKana': 'テスト',
            'guestPhone': '060-844-7544',
            'roomName': '杏19119',
            'checkin': '2021-01-10T06:00:00.000Z',
            'checkout': '2021-01-17T01:00:00.000Z',
            'status': 'reserved',
          }],
          'page': 0,
          'totalCount': 1,
        })
        .get(/\/dashboard\/checkout/).reply(200, {
          'data': [],
          'page': 0,
          'totalCount': 0,
        })
        .get(/\/dashboard\/sales/).reply(200, [])
        .patch('/dashboard/checkin', body => {
          checkin(body);
          return body;
        }).reply(401),
    );

    await findByText('山本 美咲');

    // test checkin
    user.click(getAllByText('チェックイン')[2]);
    await findByText('その操作をする権限がありません。');
  });

  it('should render sales', async() => {
    const daily = jest.fn();
    const monthly = jest.fn();
    const year = Number(format(startOfToday(), 'yyyy'));

    const { getByTestId, findByText, getByText } = await loadPage(
      'dashboard',
      scope => scope
        .get('/dashboard/rooms').reply(200, [
          { 'id': 1, 'name': '颯太83958' },
          { 'id': 2, 'name': '大翔75634' },
          { 'id': 3, 'name': '翼36423' },
          { 'id': 4, 'name': '結菜8081' },
          { 'id': 5, 'name': '杏19119' },
        ])
        .get(/\/dashboard\/(checkin|checkout)/).reply(200, {
          'data': [],
          'page': 0,
          'totalCount': 0,
        })
        .get(/\/dashboard\/sales\/daily/).reply(200, (uri) => {
          daily(uri);
          return [
            { 'day': `${year - 1}-12-31T15:00:00.000Z`, 'sales': 656568 },
            { 'day': `${year}-01-01T15:00:00.000Z`, 'sales': 121700 },
            { 'day': `${year}-01-02T15:00:00.000Z`, 'sales': 517380 },
            { 'day': `${year}-01-03T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-04T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-05T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-06T15:00:00.000Z`, 'sales': 447828 },
            { 'day': `${year}-01-07T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-08T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-09T15:00:00.000Z`, 'sales': 485147 },
            { 'day': `${year}-01-10T15:00:00.000Z`, 'sales': 1368088 },
            { 'day': `${year}-01-11T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-12T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-13T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-14T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-15T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-16T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-17T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-18T15:00:00.000Z`, 'sales': 108075 },
            { 'day': `${year}-01-19T15:00:00.000Z`, 'sales': 21615 },
            { 'day': `${year}-01-20T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-21T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-22T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-23T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-24T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-25T15:00:00.000Z`, 'sales': 0 },
            { 'day': `${year}-01-26T15:00:00.000Z`, 'sales': 1034760 },
            { 'day': `${year}-01-27T15:00:00.000Z`, 'sales': 449470 },
            { 'day': `${year}-01-28T15:00:00.000Z`, 'sales': 242664 },
            { 'day': `${year}-01-29T15:00:00.000Z`, 'sales': 559785 },
            { 'day': `${year}-01-30T15:00:00.000Z`, 'sales': 0 },
          ];
        })
        .get(/\/dashboard\/sales\/monthly/)
        .reply(200, (uri) => {
          monthly(uri);
          return [
            { 'month': `${year - 1}-12-31T15:00:00.000Z`, 'sales': 6013080 },
            { 'month': `${year}-01-31T15:00:00.000Z`, 'sales': 4790803 },
            { 'month': `${year}-02-29T15:00:00.000Z`, 'sales': 18903318 },
            { 'month': `${year}-03-31T15:00:00.000Z`, 'sales': 11577323 },
            { 'month': `${year}-04-30T15:00:00.000Z`, 'sales': 14144067 },
            { 'month': `${year}-05-31T15:00:00.000Z`, 'sales': 9184391 },
            { 'month': `${year}-06-30T15:00:00.000Z`, 'sales': 21629510 },
            { 'month': `${year}-07-31T15:00:00.000Z`, 'sales': 19655282 },
            { 'month': `${year}-08-31T15:00:00.000Z`, 'sales': 20417817 },
            { 'month': `${year}-09-30T15:00:00.000Z`, 'sales': 21199194 },
            { 'month': `${year}-10-31T15:00:00.000Z`, 'sales': 24838914 },
            { 'month': `${year}-11-30T15:00:00.000Z`, 'sales': 19164865 },
          ];
        }),
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

    await waitFor(() => expect(daily.mock.calls.length).toBeGreaterThanOrEqual(3)); // 1 + change room + change date
    await waitFor(() => expect(monthly.mock.calls.length).toBeGreaterThanOrEqual(3)); // 1 + change room + change date
    expect(daily.mock.calls[0][0]).toEqual(expect.stringMatching(new RegExp(`date=${format(startOfToday(), 'yyyy')}`)));
    expect(daily.mock.calls[0][0]).toEqual(expect.not.stringMatching(/roomId=2/));
    expect(daily.mock.calls[daily.mock.calls.length - 1][0]).toEqual(expect.stringMatching(new RegExp(`date=${format(addYears(startOfToday(), 2), 'yyyy')}`)));
    expect(daily.mock.calls[daily.mock.calls.length - 1][0]).toEqual(expect.stringMatching(/roomId=2/));
    expect(monthly.mock.calls[0][0]).toEqual(expect.stringMatching(new RegExp(`date=${format(startOfToday(), 'yyyy')}`)));
    expect(monthly.mock.calls[0][0]).toEqual(expect.not.stringMatching(/roomId=2/));
    expect(monthly.mock.calls[monthly.mock.calls.length - 1][0]).toEqual(expect.stringMatching(new RegExp(`date=${format(addYears(startOfToday(), 2), 'yyyy')}`)));
    expect(monthly.mock.calls[monthly.mock.calls.length - 1][0]).toEqual(expect.stringMatching(/roomId=2/));
  });
});
