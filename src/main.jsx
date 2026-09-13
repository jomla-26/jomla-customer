window.addEventListener("error", (e) => {
  document.body.innerHTML =
    '<pre style="white-space:pre-wrap;padding:16px;color:#b00;direction:ltr;text-align:left;font-size:12px">' +
    (e.error?.stack || e.message) + "</pre>";
});
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./CustomerApp.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

