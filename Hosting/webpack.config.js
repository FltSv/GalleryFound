module.exports = {
  mode: 'development',
  entry: './src/index.js',                  // 変換元のエントリーポイントファイルを指定します。
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: 'ts-loader',
      },
    ],
  },
  // import 文で .ts ファイルを解決する
  resolve: {
    extensions: [
      '.ts', '.tsx', '.js', '.jsx'
    ],
  },
  target: ["web", "es5"],
  output: {
    path: `${__dirname}/public`,  // 変換したファイルの出力先フォルダパスと、
    filename: 'bundle.js'         // 出力するファイル名を指定します。
  },
  devtool: 'eval-source-map',
}