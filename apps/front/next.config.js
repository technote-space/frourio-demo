const withTranspileModules = require('next-transpile-modules')([
  '@fullcalendar',
  '@frourio-demo',
  'slick-carousel',
]);
const withBundleAnalyzer   = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withTranspileModules({
  assetPrefix: '.',
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
}));