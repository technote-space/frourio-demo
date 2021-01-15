const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals       = require('webpack-node-externals');

module.exports = {
  entry: './index.ts',
  target: 'node',
  node: {
    __dirname: false,
  },
  output: {
    filename: 'index.js',
    path: __dirname,
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({configFile: '../../tsconfig.json'})],
  },
  externals: [nodeExternals()],
};
