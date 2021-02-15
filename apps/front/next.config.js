const withTranspileModules = require('next-transpile-modules')([
  '@fullcalendar',
  '@frourio-demo',
  'slick-carousel',
]);
const withBundleAnalyzer   = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withTranspileModules({
  assetPrefix: process.env.CI ? '/frourio-demo/front' : '',
  env: {
    BASE_PATH: process.env.CI ? '/frourio-demo/front' : '',
    STRIPE_KEY: 'pk_test_51IGcm8DBz4ItKNrD4B3d5KYOPUxaslYfhgiGLXAJQSft8Y7InVvYIMfieW1oUYO3hW5K4Z7RLQDxsXto9m27gPOY00VOPO2l9h',
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