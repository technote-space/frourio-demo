module.exports = {
  presets: ['next/babel'],
  overrides: [{
    include: [
      /@fullcalendar/,
      /@frourio-demo/,
      /slick-carousel/,
    ],
    plugins: [
      ['babel-plugin-transform-require-ignore', {
        extensions: ['.css'],
      }],
    ],
  }],
};
