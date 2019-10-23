const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const NormalModuleReplacementPlugin = webpack.NormalModuleReplacementPlugin;

module.exports = {
  // Polyfills have to be installed in root page
  entry: { polyfills: './src/polyfills.ts', main: './src/index.ts' },
  mode: 'production', resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' },
      {
        test: /\.scss$/, include: /index\.scss$/,
        use: [{ loader: MiniCssExtractPlugin.loader, options: { publicPath: '/assets' } },
          'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.scss$/, exclude: /index\.scss$/, use: ['to-string-loader',
        'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [ { loader: 'file-loader', options: { outputPath: 'assets/', publicPath: '/assets' } } ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: 'all'
      }),
    ],
    mergeDuplicateChunks: false,
    removeEmptyChunks: false,
    concatenateModules: true
  },
  plugins: [
    new NormalModuleReplacementPlugin(
      /src[\\\/]environments[\\\/]environment.dev.ts/,
      './environment.prod.ts'
    ),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new CleanWebpackPlugin(), new MiniCssExtractPlugin(),
  ]
};
