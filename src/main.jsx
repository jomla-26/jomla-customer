function showError(err) {
  const msg = (err && (err.message || String(err))) + "\n\n" + (err && err.stack ? err.stack : "");
  const box = document.createElement("pre");
  box.style.cssText = "white-space:pre-wrap;padding:16px;color:#b00;direction:ltr;text-align:left;font-size:13px;background:#fff;position:relative;z-index:9999";
  box.textContent = msg;
  document.body.prepend(box);
}
window.addEventListener("error", (e) => showError(e.error || e.message));
window.addEventListener("unhandledrejection", (e) => showError(e.reason));

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./CustomerApp.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

