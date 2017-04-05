# typescript-react-todomvc

本项目参考自 [todomvc](https://github.com/tastejs/todomvc) 中的 [typescript-react](https://github.com/tastejs/todomvc/tree/master/examples/typescript-react) 范例，将其代码用TypeScript最新版本的语言特性进行重构，并总结了一些自己的过程实践。

## [!] 不再使用tsd或typings命令

网络上许多陈旧资料并没有更新提及，在TypeScript 2.0以后，社区开始使用npm管理tsd文件。

非常简单，每次使用npm安装完一个第三方库后，在库名前添加 `@types/` 前缀即可安装对应的tsd文件，如：

```bash
npm install react react-dom
npm install @types/react @types/react-dom
```

更棒地是，对于像mocha这类需在全局名字空间注入 `describe` 等声明的类库，也不用再记住得将其安装为一个全局模块：

```bash
typings install env~mocha --global
```

只需：

```bash
npm install @types/mocha
```

所以，忘记tsd和typings吧！

## 打开方式

```bash
npm install
npm start
```

### 开发人员的打开方式

在不同的命令行窗口独立启动：

```bash
npm run tsc:auto
```

```
npm start
```

## 与webpack的衔接

webpack虽然可以使用 `ts-load` 插件扩展直接对ts文件进行打包，但本项目的实践做法是：

```
                [tsc]             [webpack]
(ts|tsx) files -------> js files -----------> bundle.js
```

因为webpack默认就支持对js文件进行打包，所以我们先使用 `tsc` 命令，根据 `tsconfig.json` 配置文件描述的信息，将相应的ts及tsx文件编译为js文件，随后webpack根据 `webpack.config.js` 配置文件描述的信息，读取入口js文件，将所有相关代码打包为 `bundle.js` 。

## package.json命令配置

```javascript
{
  "scripts": {
    // 启动webpack开发服务器
    "start": "./node_modules/.bin/webpack-dev-server",

    // 使用tsc命令读取tsconfig.json配置信息进行一次编译
    "tsc": "./node_modules/.bin/tsc",

    // 同上，但会监视被管理的ts或tsx文件，如有改动，自动变异
    "tsc:auto": "./node_modules/.bin/tsc --watch",

    // 联合npm run tsc和webpack两个命令，可在CI服务器使用该命令进行发布构建
    "build": "npm run tsc && ./node_modules/.bin/webpack"
  }
}
```

## VSCode相关配置

```json
{
    "files.exclude": {
        "**/.git": true,
        "**/.svn": true,
        "**/.hg": true,
        "**/.DS_Store": true,
        "**/*.js": {
            "when": "$(basename).ts"
        },
        "**/**.js": {
            "when": "$(basename).tsx"
        },
        "**/*.js.map": true,
        "**/*.zip": true
    }
}
```

现有的 `tsconfig.json` 配置，会在编译ts文件时在同目录中生成对应名称的js和map文件，而我们又不希望这部分编译生成的文件出现在文件浏览或快速跳转文件列表中，就在编辑器的配置清单中加入上述JSON段。

特别地，我们又希望只隐藏那些由ts或tsx编译而来的js文件，对此我们做了条件判断，仅当同目录存在同名的ts或tsx文件时才进行过滤。
