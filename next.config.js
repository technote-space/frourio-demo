const withTranspileModules = require('next-transpile-modules')([
  '@fullcalendar',
]);
const withBundleAnalyzer   = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withTranspileModules({
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
  webpack: (config) => {
    config.module.rules.push({
      test: /jspdf|moment/,
      use: 'null-loader'
    });

    return config;
  },
}));