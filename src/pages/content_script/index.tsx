import ReactDOM from "react-dom";

import { html, waitFor } from "~/lib/dom";

import { ContentScriptApp } from "./ContentScriptApp";

(async () => {
  const container = await waitFor("#notion-app");
  const root = html(
    `<div id="notion-like-bottom" style="position:fixed;right:0;bottom:0;z-index:1001" />`
  );
  container.parentNode?.appendChild(root);

  ReactDOM.render(<ContentScriptApp />, root);
})().catch(console.error);
