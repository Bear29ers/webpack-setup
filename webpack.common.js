const path = require('path');
const { ProvidePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = ({ outputFile, assetFile }) => ({
  // 全てのファイルの基準となるファイル
  // entry: { app: './src/js/app.js' },
  // 複数の指定も可能
  entry: {
    app: './src/js/app.js',
    sub: './src/js/sub.js'
  },
  // 出力先フォルダとファイル名
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: `${outputFile}.js`,
    // 出力するファイル名の命名規則を指定する
    chunkFilename: `${outputFile}.js`,

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
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        // Webpack5からはfile-loaderはインストール不要になったので、loaderの設定はしない
        test: /\.(jpg?g|gif|png|svg|woff2?|ttf|eot)$/,
        generator: {
          // 出力先の指定
          /** @see https://webpack.js.org/configuration/output/#template-strings */
          filename: `./images/${assetFile}.[ext]`
        },
        // アセットモジュールタイプの指定（個別にファイルを生成して、そのURLを出力する
        type: 'asset/resource'
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${outputFile}.css`
    }),
    // Stylelintの--fixを実行する
    new StylelintPlugin({
      fix: true
    }),
    // グローバルな値として設定する
    new ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      // ローカルディレクトリの参照は絶対パスで指定する
      utils: [path.resolve(__dirname, 'src/js/utils'), 'default']
    })
  ],
  /** @see https://webpack.js.org/plugins/split-chunks-plugin/ */
  optimization: {
    splitChunks: {
      // asyncだとダイナミックインポートのみ分割する
      chunks: 'all',
      // 最低限分割するファイルサイズ
      minSize: 0,
      cacheGroups: {
        defaultVendor: {
          // ファイル名を指定する
          name: 'vendor',
          // ファイルを分割するディレクトリを指定する
          test: /node_modules/,
          // cacheGroupsは複数指定でき、priorityの大きいものから実行される
          priority: -10,
          reuseExistingChunk: true
        },
        // 独自定義したモジュールファイルを分割してバンドルする
        utils: {
          name: 'utils',
          test: /src[\\/]/,
          chunks: 'initial',
          reuseExistingChunk: true
        },
        default: false
      }
    },
  },
  resolve: {
    // 特定の文字列にパスを紐づける
    alias: {
      '@scss': path.resolve(__dirname, 'src/scss/'),
      '@images': path.resolve(__dirname, 'src/images/')
    },
    // 拡張子を省略する設定
    extensions: ['.js', '.scss'],
    // モジュールの検索対象
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
});
