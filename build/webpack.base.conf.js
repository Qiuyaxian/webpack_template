'use strict'
const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const ENV = (process.env.ENV = process.env.NODE_ENV = 'production');
const conf = require('../config');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    main: resolve('./examples/index.js')// 应用主入口
  },
  output: {
    path: resolve('dist'), // 输出到目录
    filename: '[name].js'
  },
  resolve: {
    extensions: ['*', '.js', '.json']
  },
  module: {
    rules: [
      //加载css
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        include: [resolve('./examples')]
      }
    ]
  },
  optimization: {
    
  },
  node: {
    global: true,
    crypto: 'empty',
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false,
    fs: 'empty'
  }
}

