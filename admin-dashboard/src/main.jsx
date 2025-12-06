import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("✅ Admin Dashboard Loading...");
console.log("Environment:", import.meta.env.MODE);

try {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
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