import { createRoot } from "react-dom/client";

import { html, waitFor } from "~/lib/dom";

import { ContentScriptApp } from "./ContentScriptApp";

(async () => {
  const container = await waitFor("#notion-app");
  const root = html(`<div id="notion-like-button" />`);
  container.parentNode?.appendChild(root);

  const reactRoot = createRoot(root);
  reactRoot.render(<ContentScriptApp />);
})().catch(console.error);
