const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(
  common,
  /** @type import('webpack').Configuration */
  {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
      static: {
        directory: `${__dirname}/public`,
      },
      hot: true, // ホットモジュールリプレースメントを有効化
      port: 5000, // サーバーポート
      historyApiFallback: true, // すべてのリクエストを index.html にフォールバック
    },
    plugins: [new ReactRefreshWebpackPlugin()],
  },
);
