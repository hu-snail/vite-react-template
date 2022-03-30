import React from "react";
import { Outlet } from "react-router-dom";
import "./style/index.less";
import { Layout, Menu } from "@arco-design/web-react";

export default function index() {
  const { Header, Footer, Content } = Layout;
  const MenuItem = Menu.Item;

  return (
    <Layout className="layout-container" style={{ height: "100vh" }}>
      <Header className="layout-header">
        <div className="layout-header-wrap">
          <Menu mode="horizontal" defaultSelectedKeys={["1"]}>
            <MenuItem key="0" style={{ padding: 0, marginRight: 38 }} disabled>
              <h1>LOGO</h1>
            </MenuItem>
            <MenuItem key="1">首页</MenuItem>
            <MenuItem key="2">推荐</MenuItem>
            <MenuItem key="3">文档</MenuItem>
            <MenuItem key="4">工具下载</MenuItem>
          </Menu>
        </div>
      </Header>
      <Content>
        <div className="layout-content-wrap">
          <Outlet />
        </div>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}
