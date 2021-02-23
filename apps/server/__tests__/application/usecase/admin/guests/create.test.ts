import { CreateGuestUseCase } from '$/application/usecase/admin/guests/create';
import { TestGuestRepository } from '$/__tests__/__mocks__/infra/database/guest';
import { ResponseRepository } from '$/infra/http/response';

describe('CreateGuestUseCase', () => {
  it('should create guest', async() => {
    expect(await (new CreateGuestUseCase(new TestGuestRepository(), new ResponseRepository())).execute({
      email: 'test@example.com',
    })).toEqual({
      status: 201,
      body: {
        id: 1,
        email: 'test@example.com',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
