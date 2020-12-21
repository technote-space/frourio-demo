import React from 'react';
import dotenv from 'dotenv';
import Index from '~/pages/index';
import { render, waitFor, mockRouter } from '~/__tests__/utils';

dotenv.config({ path: 'server/.env' });

describe('Index page', () => {
  it('matches snapshot', async() => {
    const mock                      = mockRouter();
    const { container, asFragment } = render(<Index/>, {});

    await waitFor(() => {
      //
    }, { container: container as HTMLElement });

    expect(asFragment()).toMatchSnapshot();
    expect(mock.replace).toBeCalledTimes(1);
  });
});
