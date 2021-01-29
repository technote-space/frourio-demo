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