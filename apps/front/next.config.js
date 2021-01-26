const withTranspileModules = require('next-transpile-modules')([
  '@fullcalendar',
  '@frourio-demo',
]);
const withBundleAnalyzer   = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withTranspileModules({
  target: 'serverless',
  assetPrefix: '.',
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
}));