import type { BasicResponse } from '$/types';
import controller from '$/api/front/reservation/validate/controller';
import { getFastify } from '$/__tests__/utils';

describe('validate', () => {
  it('should validate reservation body', async() => {
    const validateMock = jest.fn(() => ({
      status: 200,
    }) as BasicResponse);
    const injectedController = controller.inject({
      validate: validateMock,
    })(getFastify());

    const res = await injectedController.post({
      body: {
        guestName: 'guest name',
        guestNameKana: 'テスト',
        guestZipCode: '100-0001',
        guestAddress: 'テスト県テスト市',
        guestPhone: '03-0000-0000',
        roomId: 1,
        number: 2,
        checkin: '2020-01-01',
        checkout: '2020-01-03',
      },
      headers: undefined,
    });
    expect(res).not.toHaveProperty('body');
    expect(validateMock).toBeCalledTimes(1);
  });
});
