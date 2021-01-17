const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals       = require('webpack-node-externals');
const NodemonPlugin       = require('nodemon-webpack-plugin');

module.exports = {
  entry: './index.ts',
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
    filename: 'index.js',
    path: __dirname,
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
  plugins: [new NodemonPlugin()],
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  externals: [nodeExternals()],
};
