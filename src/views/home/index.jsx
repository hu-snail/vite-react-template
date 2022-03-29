import React from "react";
import { Button } from "@arco-design/web-react";
import { html, toc, attributes } from "../md/index.md";

export default function Home() {
  let htmlstr = html
    .replace(/==/g, "<mark>")
    .replace(/::: warning/g, '<div class="warning">')
    .replace(/:::/g, "</div>");
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: htmlstr }}></div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 100px)",
          gridRowGap: 24,
          gridColumnGap: 24,
        }}
      >
        <Button type="primary" status="warning">
          Warning
        </Button>
        <Button status="warning">Warning</Button>
        <Button type="outline" status="warning">
          Warning
        </Button>
        <Button type="text" status="warning">
          Warning
        </Button>

        <Button type="primary" status="danger">
          Danger
        </Button>
        <Button status="danger">Danger</Button>
        <Button type="outline" status="danger">
          Danger
        </Button>
        <Button type="text" status="danger">
          Danger
        </Button>

        <Button type="primary" status="success">
          Success
        </Button>
        <Button status="success">Success</Button>
        <Button type="outline" status="success">
          Success
        </Button>
        <Button type="text" status="success">
          Success
        </Button>
      </div>
    </>
  );
}
