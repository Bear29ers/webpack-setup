const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // バンドルするモード
  mode: 'development',
  devtool: false,
  // 全てのファイルの基準となるファイル
  entry: { app: './src/app.js' },
  // 複数の指定も可能
  // entry: {
  //   app: './src/app.js',
  //   sub: './src/sub.js'
  // },
  // 出力先フォルダとファイル名
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        // 対象外にしたいフォルダ・ファイル
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // --fixオプションを使用する
          fix: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        // preがついていないloaderより早く実行される
        enforce: 'pre',
        // 対象となる拡張子
        test: /\.(sass|scss)$/,
        // 使用するloader
        use: [
          // 下から実行されるため、最初に実行したいものを末尾に記述
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        // Webpack5からはfile-loaderはインストール不要になったので、loaderの設定はしない
        test: /\.(jpg?g|gif|png|svg|woff2?|tff|eot)$/,
        generator: {
          // 出力先の指定
          /** @see https://webpack.js.org/configuration/output/#template-strings */
          filename: './images/[contenthash].[ext]'
        },
        // アセットモジュールタイプの指定（個別にファイルを生成して、そのURLを出力する
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    // Stylelintの--fixを実行する
    new StylelintPlugin({
      fix: true
    }),
    new HtmlWebpackPlugin({
      // 対象ファイル
      template: './src/index.html',
      // インジェクトするタグ
      inject: 'body'
    })
  ]
};
