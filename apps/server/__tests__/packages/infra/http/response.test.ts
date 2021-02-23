import { ResponseRepository } from '$/packages/infra/http/response';

const repository = new ResponseRepository();

describe('success', () => {
  it('should return success response', () => {
    expect(repository.success(undefined)).toEqual({
      status: 200,
    });
    expect(repository.success('test')).toEqual({
      status: 200,
      body: 'test',
    });
    expect(repository.success({ test: 'test' })).toEqual({
      status: 200,
      body: { test: 'test' },
    });
  });
});

describe('created', () => {
  it('should return created response', () => {
    expect(repository.created(undefined)).toEqual({
      status: 201,
    });
    expect(repository.created('test')).toEqual({
      status: 201,
      body: 'test',
    });
    expect(repository.created({ test: 'test' })).toEqual({
      status: 201,
      body: { test: 'test' },
    });
  });
});

describe('accepted', () => {
  it('should return accepted response', () => {
    expect(repository.accepted(undefined)).toEqual({
      status: 202,
    });
    expect(repository.accepted('test')).toEqual({
      status: 202,
      body: 'test',
    });
    expect(repository.accepted({ test: 'test' })).toEqual({
      status: 202,
      body: { test: 'test' },
    });
  });
});

describe('noContent', () => {
  it('should return noContent response', () => {
    expect(repository.noContent()).toEqual({
      status: 204,
    });
  });
});

describe('login', () => {
  it('should return login response', () => {
    expect(repository.login('test')).toEqual({
      status: 204,
      headers: { authorization: 'test' },
    });
  });
});

describe('error', () => {
  it('should return error response', () => {
    expect(repository.error(400)).toEqual({
      status: 400,
    });
    expect(repository.error(400, 'bad request', { test: 'test' })).toEqual({
      status: 400,
      test: 'test',
      body: {
        message: 'bad request',
      },
    });
  });
});

describe('badRequest', () => {
  it('should return error response', () => {
    expect(repository.badRequest('test message', { test: 'test' })).toEqual({
      status: 400,
      test: 'test',
      body: {
        message: 'test message',
      },
    });
  });
});

describe('unauthorized', () => {
  it('should return unauthorized response', () => {
    expect(repository.unauthorized('test message', { test: 'test' })).toEqual({
      status: 401,
      test: 'test',
      body: {
        message: 'test message',
      },
    });
  });
});

describe('forbidden', () => {
  it('should return forbidden response', () => {
    expect(repository.forbidden('test message', { test: 'test' })).toEqual({
      status: 403,
      test: 'test',
      body: {
        message: 'test message',
      },
    });
  });
});

describe('notFound', () => {
  it('should return notFound response', () => {
    expect(repository.notFound('test message', { test: 'test' })).toEqual({
      status: 404,
      test: 'test',
      body: {
        message: 'test message',
      },
    });
  });
});
