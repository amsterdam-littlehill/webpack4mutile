/*抽离webpack-dev-server*/
const webpack = require('webpack');
const path = require('path')
const webpackDevServer = require('webpack-dev-server');
const config = require('./webpack.dev.js');
const options = {
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
        from: /.*/,
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
}
webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(9094, 'localhost', () => {
  console.log('dev server listening on port 5000');
});