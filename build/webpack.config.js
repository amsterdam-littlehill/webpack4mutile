const path = require('path')
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  //mode development: 开发环境&emsp;production：生产环境
  mode: 'development',
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '../'),
  //entry 入口文件配置
  entry: {
    app: './src/index.js',
    //print: './src/print.js',
  },
  //打包完成后文件输出位置配置
  output: {
    //filename 设置打包后文件的名字
    //如果不设置filename，则文件的名字跟入口文件路径的属性名一样
    filename: '[name].bundle-[hash].js',
    //path 设置打包完成后文件输出路径
    path: path.resolve(__dirname, '../dist'),
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
      {
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
      },

    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ManifestPlugin(),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: 'src/index.html',
      chunks: ['app'],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
      },
    }),
  ],
  /*抽离到dev-server.js*/
  /*devServer: {
    publicPath:'/',
    contentBase: path.join(__dirname, 'dist'),
    //progress:true,//运行进度条 只用于命令行工具(CLI)
    //stats: 'errors-only',//控制要显示的 bundle 信息 string: 'none' | 'errors-only' | 'minimal' | 'normal' | 'verbose' object
    //useLocalIp: true,//允许浏览器使用本地 IP 打开。
    //watchContentBase: false,  //开启此选项后，在文件修改之后，会触发一次完整的页面重载。
    watchOptions: { //轮询监测文件变动
      poll:false
    },
    index: 'index.html',
    headers: {
      'X-Custom-Foo': 'test'
    },
    clientLogLevel: 'none',
    //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: {
      rewrites: [
        {
          from: /.*!/,
          to: path.posix.join('/', 'index.html'),
        },
      ],
    },
    //color: true,//开始控制台彩色输出  只用于命令行工具(CLI)
    hot: true,//启用 webpack 的 模块热替换 功能
    compress: true,//gzip压缩
    host: 'localhost',
    port:  9094,
    //open: true,
  }*/
}
