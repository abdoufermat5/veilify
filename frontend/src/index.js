import React from "react";
import ReactDOM from "react-dom/client";
import { inject } from '@vercel/analytics';
import "./index.css";
import "cropperjs/dist/cropper.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
inject();
