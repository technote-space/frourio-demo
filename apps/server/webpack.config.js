const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals       = require('webpack-node-externals');
const NodemonPlugin       = require('nodemon-webpack-plugin');
const path                = require('path');

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'index.ts'),
    'tasks/mail': path.resolve(__dirname, 'infra/mail/task.ts'),
  },
  target: 'node',
  node: {
    /*
    * for prisma client
    *
    * const dirnamePolyfill = path.join(process.cwd(), "prisma/client")
    * const dirname = __dirname.length === 1 ? dirnamePolyfill : __dirname
    * */
    __dirname: 'mock',
  },
  output: {
    filename: '[name].js',
    path: __dirname,
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.html$/, loader: 'raw-loader' },
    ],
  },
  plugins: [new NodemonPlugin()],
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  externals: [
    nodeExternals({
      allowlist: [/@frourio-demo/],
    }),
    nodeExternals({
      modulesDir: path.resolve(__dirname, '../../node_modules'),
      allowlist: [/@frourio-demo/],
    }),
  ],
};
