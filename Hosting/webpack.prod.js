const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(
  common,
  /** @type import('webpack').Configuration */
  {
    mode: 'production',
    devtool: false,
    optimization: {
      usedExports: true,
      minimize: true,
    },
  },
);
