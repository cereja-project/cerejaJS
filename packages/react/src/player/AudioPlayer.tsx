import type { PlayerProps, AdapterFactory } from "@cereja-project/ui-core";
import { Player } from "./Player";
export function AudioPlayer(
  props: PlayerProps & { adapterFactory?: AdapterFactory },
) {
  return <Player {...props} kind="audio" />;
}
