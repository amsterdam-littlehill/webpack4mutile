const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack');
const utils = require('./util')

debugger;
module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: utils.styleLoaders({
      sourceMap: true,
      usePostCSS: true
    })
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
  ]

})