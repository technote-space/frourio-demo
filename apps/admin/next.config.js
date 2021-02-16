const withTranspileModules = require('next-transpile-modules')([
  '@fullcalendar',
  '@frourio-demo',
]);
const withBundleAnalyzer   = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withTranspileModules({
  assetPrefix: process.env.CI ? '/frourio-demo/admin' : '',
  env: {
    FRONT_URL: process.env.FRONT_URL,
    LOCK_URL: process.env.LOCK_URL,
  },
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
  webpack: (config) => {
    // remove unused packages
    // https://github.com/mbrn/material-table/issues/2164#issuecomment-692525181
    config.module.rules.push({
      test: /jspdf|moment/, // material-table => jspdf, chart.js => moment
      use: 'null-loader',
    });

    return config;
  },
}));