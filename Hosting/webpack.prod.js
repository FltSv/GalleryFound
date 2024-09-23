import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import TerserPlugin from 'terser-webpack-plugin';

export default merge(
  common,
  /** @type import('webpack').Configuration */
  {
    mode: 'production',
    devtool: false,
    optimization: {
      usedExports: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },
  },
);
