const withTM = require('next-transpile-modules')([
  '@fullcalendar',
]);

module.exports = withTM({
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
});