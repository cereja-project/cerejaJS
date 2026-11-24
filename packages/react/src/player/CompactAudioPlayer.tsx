import type { PlayerProps, AdapterFactory } from "@cereja-project/ui-core";
import { AudioPlayer } from "./AudioPlayer";
export function CompactAudioPlayer(
  props: PlayerProps & { adapterFactory?: AdapterFactory },
) {
  return (
    <div className="md-compact-audio">
      <AudioPlayer {...props} />
    </div>
  );
}
