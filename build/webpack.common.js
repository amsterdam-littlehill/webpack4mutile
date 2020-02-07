const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const utils = require('./util')
const isProduction = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

debugger
let entrys = utils.getEntry('../src/entrys')
let multiHtmlPages = function () {
  let htmlPlugins = []
  for (const entry in entrys) {
    htmlPlugins.push(new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, `../dist/${entry}.html`),
      template: 'src/index.html',
      chunks: ['vendor', 'common', 'manifest',entry],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }))
  }
  return htmlPlugins;
}()
module.exports = {
  context: path.resolve(__dirname, '../'),
  //entry 入口文件配置
  entry: entrys,
  //打包完成后文件输出位置配置
  output: {
    //不携带路径信息
    pathinfo: false,
    //filename 设置打包后文件的名字
    //如果不设置filename，则文件的名字跟入口文件路径的属性名一样
    filename: 'static/[name].bundle.[hash].js',
    //非入口 chunk的名称
    chunkFilename: 'static/[name].bundle.[hash].js',
    //path 设置打包完成后文件输出路径
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve('src'),
      '@asset': resolve('src/asset'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]', //对打包后的图片命名
            outputPath: 'images/', //打包后图片输出的位置&emsp;dist\images
            limit: 20480,
          },
        },
      },
      //使用公共
      /*{
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              //importLoaders
              //用于配置css-loader作用于@import的资源之前有多少个loader先作用于@import的资源
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },*/

    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    /*new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: 'src/index.html',
      chunks: ['vendor','index'],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/second.html'),
      template: 'src/index.html',
      chunks: ['vendor','second'],
    }),*/
  ].concat(multiHtmlPages),
}
