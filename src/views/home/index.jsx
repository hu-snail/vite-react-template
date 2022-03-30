import { Fragment } from "react";
import { Carousel } from "@arco-design/web-react";
// import { html, toc, attributes } from "../md/index.md";
// import Md2Html from "@/compontents/Md2Html";
import "./home.less";
const list = [1, 2, 3, 4];

export default function Home() {
  return (
    <Fragment>
      <Carousel indicatorType={"line"} style={{ height: "320px" }}>
        {list.map((index) => (
          <div className="carouse-item">{index}</div>
        ))}
      </Carousel>
      <div className="content-main">
        <div className="hot-card">
          <h4 className="card-title">热门常用：</h4>
        </div>
      </div>
    </Fragment>
  );
}
