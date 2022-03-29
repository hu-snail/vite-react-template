---
title: Awesome Title
description: Describe this awesome content
tags:
  - "great"
  - "awesome"
  - "rad"
---

# vite + arco-design 创建 React 项目流程

==Marked text

::: warning
_here be dragons_

vite + arco-design 创建 React 项目流程
:::

## Horizontal Rules

---

---

---

## Emphasis

**This is bold text**

**This is bold text**

_This is italic text_

_This is italic text_

~~Strikethrough~~

## Tables

| Option | Description                                                               |
| ------ | ------------------------------------------------------------------------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default.    |
| ext    | extension to be used for dest files.                                      |

Right aligned columns

| Option |                                                               Description |
| -----: | ------------------------------------------------------------------------: |
|   data | path to data files to supply the data that will be passed into templates. |
| engine |    engine to be used for processing templates. Handlebars is the default. |
|    ext |                                      extension to be used for dest files. |

> 前端业务代码工具库,业务开发过程中，会经常用到日期格式化、url 参数转对象、浏览器类型判断、节流函数等常用函数，为避免不同项目多次复制粘贴的麻烦，这里统一封装，并发布到 npm，以提高开发效率

`code`测试数据

### 1.快速开始

```shell
yarn create vite vite-react-app --template react
cd vite-react-app
yarn
yarn dev
```

此时已经运行 vite 创建的 react 项目

### 2.安装路由

##### 2.1 安装`react-router-dom`

```shell
yarn add react-router-dom
# or
npm i react-router-dom
```

##### 2.2 创建文件

在`src`目录下创建`views`,完整目录如下：

```shell
└── src
    ├── views # 所有页面文件
    │   └── home # 首页
    │       ├── index.jsx
    │   └── detail # 详情页
    │       ├── index.jsx
```

##### 2.3 创建页面布局文件

在`src`目录下创建`layout/index.jsx`

```js
// layout/index.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "@arco-design/web-react";

function PublicLayout() {
  const { Header, Footer, Content } = Layout;
  return (
    <Layout>
      <Header>Header</Header>
      <Content>
        <Outlet />
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}

export default React.memo(PublicLayout);
```

其中`<Outlet/>`类似于 vue 路由中的`<router-view></router-view>`

##### 2.4 创建路由配置文件

在`src`目录下创建`routers/index.jsx`路由文件,注意！！！只能为`jsx`文件，不能创建`js`文件

```js
import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

import LayoutPage from "../layout";

const Home = lazy(() => import("../views/home"));
const Detail = lazy(() => import("../views/detail"));

const routeList = [
  {
    path: "/",
    element: <LayoutPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "detail",
        element: <Detail />,
      },
    ],
  },
];

const RenderRouter = () => {
  const element = useRoutes(routeList);
  console.log(element);
  return element;
};

export default RenderRouter;
```

##### 2.5 修改`main.jsx`文件

在`main.jsx`文件中新增`BrowserRouter`,完整内容如下：

```jsx
// main.jsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
```

##### 2.6 修改`App.jsx`文件

```jsx
// App.jsx
import React, { Suspense, lazy } from "react";
import LoadingComponent from "./compontents/Loading";
import RenderRouter from "./router";

export default function App() {
  return (
    <div>
      <Suspense fallback={<LoadingComponent />}>
        <RenderRouter />
      </Suspense>
    </div>
  );
}
```

`LoadingComponent`组件在`src/compontents`中创建`Loading.jsx`,组件内容如下：

先安装`nprogress`

```shell
yarn add nprogress
# or
npm i nprogress
```

```jsx
import React, { Component } from "react";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default class LoadingComponent extends Component {
  constructor(props) {
    super(props);
    NProgress.start();
  }

  componentDidMount() {
    NProgress.done();
  }

  render() {
    return <div />;
  }
}
```

### 3.arco-design 按需加载

##### 3.1 安装 arco-design

```shell
npm i @arco-design/web-react
# or
yarn add @arco-design/web-react
```

##### 3.2 安装 vite-plugin-imp

用于按需加载样式

```shell
npm i vite-plugin-imp -D
# or
yarn add vite-plugin-imp -D
```

##### 3.3 安装 less

由于`arco-design`是基于`less`开发，所以建议使用 less,安装如下：

```shell
npm i less -D
# or
yarn add less -D
```

##### 3.4.vite.config.js 配置

安装完相关依赖后，接下来我们进行按需加载配置，具体配置如下：

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 引入按需加载插件
import vitePluginImp from "vite-plugin-imp";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginImp({
      libList: [
        {
          libName: "@arco-design/web-react",
          style: (name) => {
            return [
              // 加载框架的主要样式文件 index.less
              "@arco-design/web-react/lib/style/index.less",
              // 根据name值按需加载相关组件样式
              `@arco-design/web-react/lib/${name}/style/index.less`,
            ];
          },
        },
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      },
    },
  },
});
```

因为上述配置我们使用的是 `less`，并且我们需要配置 `javascriptEnabled` 为 `true`，支持 `less` 内联 `JS`。

##### 3.5.使用

```jsx
iport React from "react";
import ReactDOM from "react-dom";
import { Button } from "@arco-design/web-react";

ReactDOM.render(
  <Button type="primary">Hello Arco</Button>,
  document.querySelector("#root")
);

```

重新运行`yarn dev`可以看到效果！

##### 3.5.打包

```shell
yarn build
# or
npm run build
```

![WechatIMG96.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/238d344a8d46470c870b85e63bb0ba51~tplv-k3u1fbpfcp-watermark.image?)

从打包信息可以看出 css 文件大小为`40.02KiB`,完美解决按需加载问题！！！

### 4、别名配置

在`vite.config.js`配置别名，具体配置如下：

```js
const path = require("path");
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"), // 根路径
      "@": path.resolve(__dirname, "src"), // src 路径
    },
  },
}
```

# UI 库

## Element-Plus

`Element Plus`，一套为开发者、设计师和产品经理准备的基于 Vue 3.0 的桌面端组件库

![start](https://img.shields.io/github/stars/element-plus/element-plus?style=social)

#### 资源地址

- 官方文档：
  - [旧版本文档](https://doc-archive.element-plus.org/#/zh-CN/component/installation)
  - [新版本文档](https://element-plus.gitee.io/zh-CN/guide/installation.html)
- 仓库资源：
  - [github 地址](https://github.com/element-plus/element-plus)
  - [gitee 地址](https://gitee.com/element-plus/element-plus)

## Ant Design Vue

`Ant Design Vue` 是 Ant Design 的 Vue.js 实现，开发和服务于企业级后台产品

![start](https://img.shields.io/github/stars/vueComponent/ant-design-vue?style=social)

#### 资源地址

- 官方文档：[文档地址](https://antdv.com/docs/vue/introduce-cn/)
- 仓库资源：
  - [github 地址](https://github.com/vueComponent/ant-design-vue/)
  - [gitee 地址](https://gitee.com/ant-design-vue/ant-design-vue)

#### 特性

- 提炼自企业级中后台产品的交互语言和视觉风格。
- 开箱即用的高质量 Vue 组件。
- 共享 Ant Design of React 设计工具体系。

## Arco Design Vue

字节跳动基于 [Arco Design](https://arco.design/) 开源的 Vue UI 组件库。60 多个开箱即用的高质量组件, 可以覆盖绝大部份的业务场景。

![start](https://img.shields.io/github/stars/arco-design/arco-design-vue?style=social)

#### 资源地址

- 官方文档：[文档地址](https://arco.design/vue/docs/start)
- 仓库资源：[github 地址](https://github.com/arco-design/arco-design-vue)

## Quasar

构建高性能的 VueJS 用户界面,开箱即用,支持桌面和**移动浏览器**（包括 iOS Safari！）

![start](https://img.shields.io/github/stars/quasarframework/quasar?style=social)

#### 资源地址

- 官方文档：[文档地址](https://quasar.dev/introduction-to-quasar)
- 仓库资源：[github 地址](https://github.com/quasarframework/quasar)

## Naive UI

`Naive UI` 一个 Vue 3 组件库，比较完整，主题可调，使用 TypeScript，不算太慢,有点意思

![start](https://img.shields.io/github/stars/TuSimple/naive-ui?style=social)

#### 资源地址

- 官方文档：[文档地址](https://www.naiveui.com/zh-CN/light)
- 仓库资源：
  - [github 地址](https://github.com/TuSimple/naive-ui)
  - [gitee 地址](https://gitee.com/ant-design-vue/ant-design-vue)

## Element3

Element3，一套为开发者、设计师和产品经理准备的基于 Vue 3.0 的桌面端组件库

![start](https://img.shields.io/github/stars/hug-sun/element3?style=social)

#### 资源地址

- 官方文档：[文档地址](https://element3-ui.com/#/)
- 仓库资源：[github 地址](https://github.com/hug-sun/element3)

## Heyui

HeyUI@2.0 是一套基于 Vue3.0 的开源 UI 组件库，主要服务于一些中后台产品。

![start](https://img.shields.io/github/stars/heyui/heyui?style=social)

#### 资源地址

- 官方文档：[文档地址](https://v2.heyui.top/component/guide)
- 仓库资源：[github 地址](https://github.com/heyui/heyui)

#### 特性

HeyUI 提供的是一整套解决方案，所有的组件提供全局的可配置模式。

- 真正的数据驱动。
- 全局的配置模式。
- 数据字典化。

## BalmUI

`BalmUI` 是为 Vue.js 3.0 量身订制的模块化且高可定制化的 Material Design UI 库。

![start](https://img.shields.io/github/stars/balmjs/balm-ui?style=social)

#### 资源地址

- 官方文档：[文档地址](https://next-material.balmjs.com/#/guide/intro)
- 仓库资源：[github 地址](https://github.com/balmjs/balm-ui)

#### 特性

- 提炼自企业级中后台产品的交互效果和视觉风格
- 开箱即用的高质量 Vue 组件/插件/指令/常用工具库
- 深入每个细节的主题定制能力
- 集成完整最新的 Material Icons
- 所有组件和插件均高可定制化，并且可被独立使用

## Vuestic UI

`Vuestic-ui` 是 Vue 最漂亮的开源管理面板之一，擅长编写可维护的 Vue 代码，制作灵活的组件和接口。

![start](https://img.shields.io/github/stars/epicmaxco/vuestic-ui?style=social)

#### 资源地址

- 官方文档：[文档地址](https://vuestic.dev/zh/introduction/overview)
- 仓库资源：[github 地址](https://github.com/epicmaxco/vuestic-ui)

## IDUX UI

`IDUX UI`是一套企业级中后台 UI 组件库, 致力于提供高效愉悦的开发体验。
基于 Vue 3.x + TypeScript 开发, 全部代码开源并遵循 MIT 协议，任何企业、组织及个人均可免费使用。

![start](https://img.shields.io/github/stars/IDuxFE/idux?style=social)

#### 资源地址

- 官方文档：[文档地址](https://idux.site/docs/introduce/zh)
- 仓库资源：[github 地址](https://github.com/IDuxFE/idux)

#### 特性

- Monorepo 管理模式：cdk, components, pro
- 全面拥抱 Composition Api，从源码到文档
- 完全使用 TypeScript 开发，提供完整的类型定义
- 开箱即用的 Tree Shaking
- 高覆盖率的单元测试
- 国际化语言支持
- 灵活的全局配置
- 深入细节的主题定制能力

## RelaxPlus

`RelaxPlus`，一套为开发者学习 Vue 3.x 而准备的友好、简洁、轻盈、精致的桌面端组件库

![start](https://img.shields.io/github/stars/yanghuanrong/RelaxPlus?style=social)

#### 资源地址

- 官方文档：[文档地址](https://bsie.gitee.io/relaxplus/#/)
- 仓库资源：[github 地址](https://github.com/yanghuanrong/RelaxPlus)

## Viewer Design

`Viewer Design`是一款基于 Vue3.0 + typescript 开发的中后台 UI 组件库, 组件的高配置性 + 传统的 UI 组件库的特性 + 更好的交互体验,为用户的使用提供了很大的便利

![start](https://img.shields.io/github/stars/a572251465/viewer-design?style=social)

#### 资源地址

- 官方文档：[文档地址](http://121.196.212.200/#/introduce)
- 仓库资源：[github 地址](https://github.com/a572251465/viewer-design)

#### 特性

- 丰富的组件以及功能，满足大部分中后台产品的业务场景；
- 每个组件都用于高配置性，例如属性 styles，满足您的各种定制化
- 所有组件基于 typescript ,CompositionAPI 以及 tsx 开发。是 Vuetypescript 爱好者绝佳学习对象。如果你希望使用 tsx 开-发高质量的 Vue 组件，那么强烈推荐尝试基于 Viewer-Design 的组件来封装
- 支持组件按需引入，支持图标按需加载，组件库使用了 yarn + lerna 管理模式，可以单独下载并使用某一个组件
- 为了满足日常的业务需求，从使用的角度提供了更多的指令，方便快捷。例如：复制文本,避免了单独下载插件来实现
  实- 现过程中，所有使用到的组件都手写并且公开，没有用到任何外部组件, 所以无需担心下载包过大

## Vexip UI

`Vexip UI` 提供了一系类开箱即用的组件。
该组件库使用全新的 vue3.0 组合式 Api 编写，开发脚手架为最新的 vite2.0，并且应用 monorepo 的管理思想使得可以为每个组件启动独立的开发服务与建立单独的开发文件，是新一代 vue 组件库项目的一次尝试。

![start](https://img.shields.io/github/stars/qmhc/vexip-ui?style=social)

#### 资源地址

- 官方文档：[文档地址](https://www.vexipui.com/guide/setup)
- 仓库资源：[github 地址](https://github.com/qmhc/vexip-ui)

#### 特性

- 丰富的组件和功能，为网站开发助力，大幅提高效率
- 开箱即用的高质量 Vue3 组件
- 符合直觉的 api 设计，易于理解与使用
- 完全使用组合式 api 编写，拥有优秀的性能与拓展性

## Bin UI Next

`Bin-UI-Next` 是 bin-ui 的 vue3 升级版，目前组件库已经基本完成重构，整体组件依赖 vue3

![start](https://img.shields.io/github/stars/wangbin3162/bin-ui-next?style=social)

#### 资源地址

- 官方文档：[文档地址](https://wangbin3162.gitee.io/bin-ui-next/#/guide)
- 仓库资源：[github 地址](https://github.com/wangbin3162/bin-ui-next)

#### 特性

- 基于 Vue 3.0 Composition API
- 最新图标基于阿里 iconfont ant-design 官方图标精简版
- 移除了部分冗余代码
- 部分组件代码进行重构
