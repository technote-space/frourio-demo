const withTranspileModules = require('next-transpile-modules')([
  '@fullcalendar',
  '@frourio-demo',
]);
const withBundleAnalyzer   = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withTranspileModules({
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
}));