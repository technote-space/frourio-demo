module.exports = {
  presets: ['next/babel'],
  overrides: [{
    include: [
      /@fullcalendar/,
      /@frourio-demo/,
    ],
    plugins: [
      ['babel-plugin-transform-require-ignore', {
        extensions: ['.css'],
      }],
    ],
  }],
};
