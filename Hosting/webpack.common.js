const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const Dotenv = require('dotenv-webpack');

/** @type import('webpack').Configuration */
module.exports = {
  entry: './src/index.js', // 変換元のエントリーポイントファイルを指定します。
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        // 拡張子 .ts の場合
        test: /\.tsx?$/,
        exclude: /node_modules/,
        // TypeScript をコンパイルする
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['tailwindcss', 'autoprefixer'],
              },
            },
          },
        ],
      },
    ],
  },
  // import 文で .ts ファイルを解決する
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      src: `${__dirname}/src`,
      components: `${__dirname}/src/components`,
    },
  },
  target: ['web', 'es5'],
  output: {
    path: `${__dirname}/public`, // 変換したファイルの出力先フォルダパスと、
    filename: 'bundle.js', // 出力するファイル名を指定します。
  },
  plugins: [
    new FaviconsWebpackPlugin({
      /**
       * /src/assets/images/GFskelton_narrow_384.png
       * -> /favicon.ico                  (#)
       *    /favicon-16x16.png            (#)
       *    /favicon-32x32.png            (MacOS)
       *    /favicon-48x48.png            (#)
       */
      logo: `${__dirname}/src/assets/images/GFskelton_narrow_384.png`,
      mode: 'webapp',
      devMode: 'webapp',
      prefix: './',
      inject: false,
      favicons: {
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          favicons: [
            'assets/images/favicon-16x16.png',
            'assets/images/favicon-32x32.png',
            'assets/images/favicon-48x48.png',
            'favicon.ico',
          ],
          windows: false,
          yandex: false,
        },
      },
    }),
    new FaviconsWebpackPlugin({
      /**
       * /src/assets/images/GFskelton_512.png
       * -> /apple-touch-icon.png         (iOS)
       *    /android-chrome-192x192.png   (Android)
       *    /android-chrome-512x512.png   (Android)
       *    /mstile-150x150.png           (Windows)
       */
      logo: `${__dirname}/src/assets/images/GFskelton_512.png`,
      mode: 'webapp',
      devMode: 'webapp',
      prefix: 'assets/images/',
      inject: false,
      favicons: {
        icons: {
          android: ['android-chrome-192x192.png', 'android-chrome-512x512.png'],
          appleIcon: ['apple-touch-icon.png'],
          favicons: false,
          appleStartup: false,
          windows: false,
          yandex: false,
        },
      },
    }),
    new Dotenv({ systemvars: true }),
  ],
};
