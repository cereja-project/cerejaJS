import { createRoot } from "react-dom/client";
import { App } from "../../apps/docs/src/App";
import "../../packages/react/src/styles/all.css";
import "../../apps/docs/src/docs.css";
createRoot(document.getElementById("root")!).render(<App />);
