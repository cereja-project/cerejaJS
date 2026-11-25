import { useSyncExternalStore } from "react";
import { useMediaContext } from "./MediaRoot";
import { serverSnapshot } from "./store";
export function useMedia() {
  const { store } = useMediaContext();
  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => serverSnapshot,
  );
  return { snapshot, execute: store.execute };
}
