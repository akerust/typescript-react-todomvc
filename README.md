# typescript-react-todomvc

本项目参考 [todomvc](https://github.com/tastejs/todomvc) 中的 [typescript-react](https://github.com/tastejs/todomvc/tree/master/examples/typescript-react) 范例，将其代码用TypeScript最新版本的语言特性进行重构，并总结了一些自己的过程实践。

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

```bash
npm run test:auto
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

为什么不直接使用 `ts-loader` ？ 因为我们还会使用mocha进行单元测试，mocha和webpack一样，默认支持对js组织的用例文件进行测试，除非再引用一个 `ts-node` 组件，不然无法直接运行ts组织的用例代码。

我们不希望引入过多的插件扩展，既然通过官方的 `tsc` 结合正确的配置能够满足整个流程所需，就遵循奥卡姆剃刀原则。

目前我们的组件清单如下：

* TypeScript 提供 `tsc` ，将ts和tsx文件转义为js文件，包括使用ts书写的测试用例
* Mocha 运行js用例文件，执行单元测试
* Webpack 提供一个入口js文件，将相关代码打包到单个文件

## 持续单元测试的实践

不去论证 `TDD` 的有效性，但尽可能提高单元测试的覆盖率有助于确保重构过程顺利地展开。

并且，我们希望在每次按下 `Ctrl + S` 保存代码变更时都能做一次回归，所以非常推荐使用mocha的watch功能，监视代码文件的变动，随时执行单元测试。

这样的工作流示意如下：

```
                   [tsc --watch]                            [webpack --watch]
(ts|tsx) files --------------------->      js files      ----------------------> bundle.js
                  trigger on save      (contains tests)      capture changes
                                              |
                              capture changes | [mocha --watch]
                                              |
                                              v
                                       run unit tests
```

也正因为如此，在上面<开发人员的打开方式>中，我们需要启动三个独立的进程，其中 `npm run test:auto` 就负责单元测试的自动运行。

## 配置文件

### package.json命令配置

```javascript
{
  "scripts": {
    // 启动webpack开发服务器
    "start": "./node_modules/.bin/webpack-dev-server",

    // 使用tsc命令读取tsconfig.json配置信息进行一次编译
    "tsc": "./node_modules/.bin/tsc",
    // 同上，但会监视被管理的ts或tsx文件，如有改动，自动编译
    "tsc:auto": "./node_modules/.bin/tsc --watch",

    // 使用mocha执行tests目录下的测试用例
    "test": "./node_modules/.bin/mocha --opts ./mocha.opts \"./tests/**/*.test.js\"",
    // 同上，但会监视被管理的测试文件，如有改动，自动执行单元测试
    "test:auto": "./node_modules/.bin/mocha --opts ./mocha.opts --watch \"./tests/**/*.test.js\"",

    // 联合npm run tsc和webpack两个命令，可在CI服务器使用该命令进行发布构建
    "build": "npm run tsc && npm test && ./node_modules/.bin/webpack"
  }
}
```

### tsconfig.json配置

```javascript
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": true,  // 不允许隐式的any类型声明，即必须显式地标注某个变量的类型是any，推荐启用！
        "strictNullChecks": true,  // 严格的空值检查，对可能会是undefined或null的变量引用提出告警，推荐启用！
        "sourceMap": true,
        "jsx": "react",
        "lib": [
            "dom",
            "es2015"
        ]  // 加上这两个lib，就可以使用ts书写基于协程的同步代码，使用async和await关键字，并且支持输出为es5！
    },
    "include": [
        "./src/**/*",
        "./tests/**/*"
    ]
}
```

### VSCode相关配置

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

## 持续更新中……
