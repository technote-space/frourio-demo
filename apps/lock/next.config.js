const withTranspileModules = require('next-transpile-modules')([
  '@frourio-demo',
]);
const withBundleAnalyzer   = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withTranspileModules({
  assetPrefix: process.env.CI ? '/frourio-demo/lock' : '',
  env: {
    BASE_PATH: process.env.CI ? '/frourio-demo/lock' : '',
  },
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
}));