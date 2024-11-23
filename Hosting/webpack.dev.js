import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(
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
