export type Methods = {
  post: {
    reqHeaders: { 'stripe-signature': string; };
    resBody: { received: boolean };
    reqBody: any;
  }
}
