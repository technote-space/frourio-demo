export type Methods = {
  post: {
    reqHeaders: { 'stripe-signature': string; };
    resBody: { received: boolean };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reqBody: any;
  }
}
