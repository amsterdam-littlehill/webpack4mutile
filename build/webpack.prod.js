const merge = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')
const utils = require('./util')
const webpack = require('webpack')
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require(
  'webpack-bundle-analyzer').BundleAnalyzerPlugin
const ManifestPlugin = require('webpack-manifest-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  //开启压缩
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      //css压缩
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css\.*(?!.*map)/g,  //注意不要写成 /\.css$/g
        cssProcessor: require('cssnano'),
        // cssProcessorOptions: cssnanoOptions,
        cssProcessorPluginOptions: {
          preset: [
            'default', {
              discardComments: {
                removeAll: true,
              },
              normalizeUnicode: false,
            }],
        },
        canPrint: true,
      }),
    ],
    //分离代码
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 10,
        },
        common: {
          name: "common",
          chunks: "all",
          minChunks: 2,
          priority: 0,
          enforce: true,
        },
      },
    },
    runtimeChunk: {
      name:'manifest'
    }
  },
  plugins: [
    //自动加载模块
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    //分离css 仅在production不包含style-loader在加载程序链中的构建中使用
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:12].css',
    }),
    //清除无用的css
    /*new PurifyCSS({
      paths: glob.sync([
        // 要做 CSS Tree Shaking 的路径文件
        path.resolve(__dirname, 'src/!*.html'), // 请注意，我们同样需要对 html 文件进行 tree shaking
        path.resolve(__dirname, 'src/!*.js')
      ])
    }),*/
    /*new BundleAnalyzerPlugin({
      //不自动打开浏览器
      openAnalyzer: false,
    }),*/
    //提取Mainfest todo
    //new ManifestPlugin(),
    new webpack.HashedModuleIdsPlugin(),
  ],
  module: {
    rules: utils.styleLoaders({
      sourceMap: true,
      extract: true,
      usePostCSS: true,
    }),
  },
})
