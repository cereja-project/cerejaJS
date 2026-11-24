import { createRoot } from "react-dom/client";
import { VideoPlayer } from "../../packages/react/src";
import "../../packages/react/src/styles/tokens.css";
import "../../packages/react/src/styles/components.css";
const params = new URLSearchParams(location.search),
  type = params.get("type") === "dash" ? "dash" : "hls";
const src = params.has("live")
  ? "/live-fixture/stream.m3u8?session=" + params.get("session")
  : `/tests/fixtures/streams/${type}/stream.${type === "dash" ? "mpd" : "m3u8"}`;
createRoot(document.getElementById("root")!).render(
  <VideoPlayer label="Transmissão" source={{ type, src }} />,
);
