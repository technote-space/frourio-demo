import { ValidateUseCase } from '$/packages/application/usecase/front/reservation/validate';
import { ResponseRepository } from '$/packages/infra/http/response';

describe('ValidateUseCase', () => {
  it('should return undefined', async() => {
    expect(await (new ValidateUseCase(new ResponseRepository())).execute()).toEqual({
      status: 200,
      body: undefined,
    });
  });
});
