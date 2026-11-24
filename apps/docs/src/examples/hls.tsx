import { useState } from "react";
import { VideoPlayer } from "@cereja-project/ui-react";
export function HlsExample({ live = false }: { live?: boolean }) {
  const [session] = useState(() => String(Date.now()));
  return (
    <VideoPlayer
      label={
        live ? "HLS — transmissão de teste ao vivo" : "HLS — arquivo segmentado"
      }
      source={{
        type: "hls",
        src: live
          ? "/live-fixture/stream.m3u8?session=" + session
          : "/fixtures/streams/hls/stream.m3u8",
      }}
    />
  );
}
