webpack配置生成多页面html，一般有两种：多页应用，[多个单页应用](https://webpack.wuhaolin.cn/3%E5%AE%9E%E6%88%98/3-10%E7%AE%A1%E7%90%86%E5%A4%9A%E4%B8%AA%E5%8D%95%E9%A1%B5%E5%BA%94%E7%94%A8.html)。此处主要学习了多入口应用。

配置生成html的插件采用`html-webpack-plugin`，主要作用是：根据模板生成页面/无模板生成页面、自动引入js等外部资源、设置title/meta等标签内容。

主要考虑一下四点；

1. 目录功能划分
2. 配置多入口
3. 一对一生成html
4. 页面间的公共模块抽离

#### 目录功能划分

根据具体的技术选型（是否使用模板引擎等），本次调研为了简化，以js文件作为入口，生成对应的html文件。

#### 配置多入口

统一抽离`src/entrys`目录下js文件，作为入口

```javascript
function (url) {
  let jsDir = path.resolve(__dirname, url);
  let entryFiles = glob.sync(jsDir + '/*.js');
  let map = {};

  entryFiles.forEach(function(filePath) {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    map[filename] = filePath;
  });
  return map;
}
```

函数返回一个对象，类似于

```javascript
{
    'index':'./src/entrys/index.js',
    ...
}
```

配置在enrty中。

#### 生成HTML

在SPA中，我们只有一个入口文件以及一个HTML，那么在多页应用中，既然有多个入口，那么也就需要使用`html-webpack-plugin`生成与入口文件一一对应的html

当页面个数增多时，为了编写简化，抽离一个函数统一生成HTML

```javascript
function () {
  //  HtmlWebpackPlugin数组
  let htmlPlugins = []
  //entrys 入口文件对象，与hmtl一一对应
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
}
```

最后将此数组***HtmlWebpackPlugin***配置在webpack 的 *plugins* 中

#### 公共部分抽取

在webpack4中新引入了***splitChunks***进行code split。

具体使用场景举个例子：

**print.js**

```javascript
export default function printMe() {
    console.log('print')
}
```

**index.js:**

```javascript
import image from '@/image/11.png'
import printMe from '@/print'

let img = new Image()
printMe()
img.src = image
document.body.append(img)
```

**second.js:**

```javascript
import printMe from '@/print'
const  helpers = require('../common.js')
document.body.append(
  _.join(['Another', 'module', 'loaded!'], ' '),
)
printMe()
debugger;
helpers.test()

```

正如我们所见，`index.js`和`second.js`同时引用`print.js`

对于两个页面`index.html`和`second.html`含有公共代码，我们可以将此模块提取出`common.js`

```javascript
... ...
vendor: {
  name: "vendor",
  test: /[\\/]node_modules[\\/]/,
  chunks: "all",
  priority: 10
},
common: {
  name: "common",
  chunks: "all",
  minChunks: 2,
  priority: 0,
  enforce: true,
},
... ...
```


