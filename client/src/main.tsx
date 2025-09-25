import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { RemindersProvider } from "@/components/reminders/RemindersContext";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <RemindersProvider>
      <App />
    </RemindersProvider>
  </React.StrictMode>
);
