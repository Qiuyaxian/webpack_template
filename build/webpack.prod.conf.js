'use strict'
const path = require('path');
const webpack = require('webpack');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackMerge = require('webpack-merge')

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')
const conf = require('../config');
const baseWebpackConfig = require('./webpack.base.conf');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
const publicPath = './';
// 引入自定义webpack 插件
// const myPlugin = require('./webpack.plugins')

const webpackConfig = webpackMerge(baseWebpackConfig, {
  mode: 'production',
  module: {
    // rules: utils.styleLoaders({
    //   sourceMap: conf.build.productionSourceMap,
    //   extract: true,
    //   usePostCSS: true
    // })
  },
  devtool: conf.build.productionSourceMap ? conf.build.devtool : false,
  output: {
    path: conf.build.assetsRoot,
    publicPath: conf.build.assetsPublicPath,
    filename:  path.join(conf.build.assetsSubDirectory, 'js/[name].[chunkhash].js'),
    chunkFilename: path.join(conf.build.assetsSubDirectory, 'js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: path.join(conf.build.assetsSubDirectory, 'css/[name].[contenthash].css'),
      chunkFilename: path.join(conf.build.assetsSubDirectory, 'css/app.[contenthash:12].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : conf.build.index,
      template: './examples/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    // 启用 HMR
    // new webpack.HotModuleReplacementPlugin(),
    // 在控制台中输出可读的模块名
    // new webpack.NamedModulesPlugin(),
    // 不做改动hash保持不变
    new webpack.HashedModuleIdsPlugin(),
    // 复制文件
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: conf.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    // 使用自定义插件
    // new myPlugin({
      
    // })
  ],
  performance: {
    // false | "error" | "warning"
    hints: "warning",
    // 最大单个资源体积，默认250000 (bytes)
    maxAssetSize: 3000000,
    // 根据入口起点的最大体积，控制webpack何时生成性能提示整数类型（以字节为单位）
    maxEntrypointSize: 5000000
  },
})
// 是否开启压缩
if (conf.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        conf.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (conf.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig