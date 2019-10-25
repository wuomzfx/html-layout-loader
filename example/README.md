相信很多人是像我一样正在学习webpack loader写法，从[知乎的这个问题](https://zhuanlan.zhihu.com/p/30053483)过来的，这个example可以较为完整的展示这个loader从配置到真正落地一个文件的过程。

首先搭建一个简单的webpack编译环境。

```js
// webpack.config.js
const path = require('path');
module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './index.html'),
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: [
                    'file-loader?name=[name].[ext]',
                    // 'extract-loader',
                    {
                        loader: path.resolve(__dirname, '../index.js'),
                        options: {
                            placeholder: '{{__content__}}'
                        },
                    },
                ],
            }
        ]
    },
};
```

通常来说，很多html相关的loader都是把html代码“嵌入”到js-bundle中，但是**这个loader直接输出了“裸露”的html代码**，所以不使用[extract-loader](https://github.com/peerigon/extract-loader)抽离js中的html。这应该就是这个[issue](https://github.com/wuomzfx/html-layout-loader/issues/3)里遇到的问题。
最后还需要把本loader输出的代码“落地”成一个文件，所以这里使用了[file-loader](https://github.com/webpack-contrib/file-loader)，把输出的html代码落地成文件。

还有这个loader的options一定要有值（起码是个`{}`），因为没有判空导致了`Object.assign(undefined, {})`报错。

这里的入口直接就是一个html文件，也就是`index.html`，文件内容与作者README里的相似。

```html
@layout(./layout.html)
<div class="main">
  main content
</div>
```

可以看到这个html需要引入一个`./layout.html`文件，所以创建与作者README里相同内容的`layout.html`文件。
```html
<!-- 其他都不重要 -->
{{__content__}}
<!-- 这里的占位符要和loader配置一样 -->
```
安装上面说到的依赖。
```bash
yarn init -y
yarn add -D file-loader webpack webpack-cli
```

在package.json中添加脚本（新手yarn玩家，没找到yarn的npx）
```json
{
    "scripts": {
        "build": "webpack"
    }
}
```

然后在命令行里执行`yarn build`。可以看到dist文件夹内出现index.html文件就是我们期望的结果。

希望可以帮到大家~
