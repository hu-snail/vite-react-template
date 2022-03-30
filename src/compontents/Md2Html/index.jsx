import React from "react";
import PropTypes from "prop-types";

import "./index.moudle.less";
import "@/styles/gitbook-teal.less";
import "highlight.js/styles/atom-one-light.css";

const Md2Html = (props) => {
  const { html } = props;
  let htmlstr;
  if (html) {
    htmlstr = html
      .replace(/==/g, "<mark>")
      .replace(/::: warning/g, '<div class="warning">')
      .replace(/:::/g, "</div>");
  }
  return (
    <div
      className="md-container"
      dangerouslySetInnerHTML={{ __html: htmlstr }}
    ></div>
  );
};

Md2Html.propTypes = {
  html: PropTypes.string.isRequired,
  toc: PropTypes.array,
  attributes: PropTypes.object,
};

export default React.memo(Md2Html);
