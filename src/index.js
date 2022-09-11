import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./client";

const el = document.getElementById("__root__");
if (el) {
  ReactDOM.createRoot(el).render(React.createElement(App));
} else {
  console.error("Unable to mount react app, root element is not found!!");
}
