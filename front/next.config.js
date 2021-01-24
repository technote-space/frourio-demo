const withTranspileModules = require('next-transpile-modules')([
  '@fullcalendar',
  'server',
]);
const withBundleAnalyzer   = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withTranspileModules({
  target: 'serverless',
  assetPrefix: '.',
}));