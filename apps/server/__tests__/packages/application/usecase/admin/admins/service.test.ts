import { processRoleConnections, checkIcon } from '$/packages/application/usecase/admin/admins/service';

describe('processRoleConnections', () => {
  it('should contains roles property', () => {
    expect(processRoleConnections({}, true)).toEqual({ roles: { connect: [] } });
    expect(processRoleConnections({
      roles: [{ role: 'test1', name: 'test1' }, { role: 'test2', name: 'test2' }],
    }, false)).toEqual({ roles: { set: [{ role: 'test1' }, { role: 'test2' }] } });
  });
});

describe('checkIcon', () => {
  it('should delete icon', () => {
    expect(checkIcon({ icon: 'test.png' })).not.toHaveProperty('icon');
  });

  it('should not delete icon', () => {
    expect(checkIcon({
      icon: {
        filename: 'test.png',
        toBuffer: jest.fn(),
      } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    })).toHaveProperty('icon');
  });
});
