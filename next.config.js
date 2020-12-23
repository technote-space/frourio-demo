module.exports = {
  target: 'serverless',
  async rewrites() {
    return [
      {
        source: '/api/:any*',
        destination: '/api/:any*',
      },
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
};