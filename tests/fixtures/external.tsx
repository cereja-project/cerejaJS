import { createRoot } from "react-dom/client";
import { VideoPlayer } from "../../packages/react/src";
import "../../packages/react/src/styles/tokens.css";
import "../../packages/react/src/styles/components.css";
const params = new URLSearchParams(location.search);
const type = params.get("provider") === "vimeo" ? "vimeo" : "youtube";
createRoot(document.getElementById("root")!).render(
  <VideoPlayer
    label="Vídeo incorporado"
    source={{
      type,
      id: params.get("id") ?? (type === "vimeo" ? "76979871" : "M7lc1UVf-VE"),
    }}
    loadStrategy="on-interaction"
  />,
);
