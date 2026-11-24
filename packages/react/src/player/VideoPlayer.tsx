import type { PlayerProps, AdapterFactory } from "@cereja-project/ui-core";
import { Player } from "./Player";
export function VideoPlayer(
  props: PlayerProps & { adapterFactory?: AdapterFactory },
) {
  return <Player {...props} kind="video" />;
}
