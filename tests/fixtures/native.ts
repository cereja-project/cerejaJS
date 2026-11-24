import { createNativeAdapter } from "../../packages/providers/src/native";
const a = await createNativeAdapter({
  host: document.getElementById("host")!,
  source: { type: "file", src: "/tests/fixtures/media/sample.mp4" },
  kind: "video",
  signal: new AbortController().signal,
});
a.subscribe(() => {
  document.getElementById("time")!.textContent = String(
    a.getSnapshot().currentTime,
  );
});
document.getElementById("play")!.onclick = () =>
  void a.execute({ type: "play" });
document.getElementById("pause")!.onclick = () =>
  void a.execute({ type: "pause" });
document.getElementById("seek")!.onclick = () =>
  void a.execute({ type: "seek", time: 5 });
