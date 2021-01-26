module.exports = {
  presets: ['next/babel'],
  overrides: [{
    include: [
      './node_modules/@fullcalendar',
    ],
    plugins: [
      ['babel-plugin-transform-require-ignore', {
        extensions: ['.css'],
      }],
    ],
  }],
};
