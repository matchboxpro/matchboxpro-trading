import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setupErrorReporting } from "./utils/errorReporter";

// Setup error reporting to capture all client-side errors
setupErrorReporting();

createRoot(document.getElementById("root")!).render(<App />);
