import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { FileProvider } from "./contexts/FileContext";

// Mock service worker for development
if (process.env.NODE_ENV === "development") {
  import("./mocks/browser").then(({ worker }) => {
    worker.start();
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FileProvider>
      <App />
    </FileProvider>
  </StrictMode>
);
