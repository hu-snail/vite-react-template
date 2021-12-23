# vite + arco-design 创建 React 项目流程

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
