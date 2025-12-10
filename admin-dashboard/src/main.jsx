import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { themesAPI } from './services/api';
import { applyThemeToRoot } from './utils/theme';

console.log("✅ Admin Dashboard Loading...");
console.log("Environment:", import.meta.env.MODE);

try {
  const root = ReactDOM.createRoot(document.getElementById("root"));

  // Fetch active theme and apply before rendering App so the UI reflects theme immediately
  (async () => {
    try {
      const res = await themesAPI.getActive();
      const payload = res?.data?.data ?? res?.data ?? res;
      applyThemeToRoot(payload);
    } catch (err) {
      // ignore theme errors and continue to render app
      console.warn('Could not load active theme', err?.message || err);
    } finally {
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }
  })();
} catch (error) {
  console.error("Failed to render app:", error);
  document.getElementById("root").innerHTML = `
    <div style="padding: 20px; color: red;">
      <h2>Error loading application</h2>
      <p>${error.message}</p>
      <p>Please check the console for details.</p>
    </div>
  `;
}