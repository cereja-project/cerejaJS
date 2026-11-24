import { normalizeMediaSnapshot } from "@cereja-project/ui-core";
import type {
  MediaAdapter,
  MediaSnapshot,
  MediaCommand,
  CommandResult,
} from "@cereja-project/ui-core";
export function augmentAdapter(
  base: MediaAdapter,
  decorate: (snapshot: MediaSnapshot) => MediaSnapshot,
  command: (cmd: MediaCommand) => Promise<CommandResult | null>,
  cleanup: () => void,
): MediaAdapter & { refresh: () => void } {
  let snapshot = normalizeMediaSnapshot(decorate(base.getSnapshot())),
    destroyed = false;
  const listeners = new Set<() => void>();
  function refresh() {
    if (!destroyed) {
      snapshot = normalizeMediaSnapshot(decorate(base.getSnapshot()));
      listeners.forEach((fn) => fn());
    }
  }
  const off = base.subscribe(refresh);
  return {
    getSnapshot: () => snapshot,
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    refresh,
    async execute(cmd) {
      if (destroyed)
        return {
          ok: false,
          error: {
            code: "aborted",
            message: "Operação cancelada.",
            recoverable: false,
          },
        };
      return (await command(cmd)) ?? base.execute(cmd);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      off();
      listeners.clear();
      cleanup();
      base.destroy();
    },
  };
}
