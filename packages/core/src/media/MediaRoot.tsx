import { useMediaConfig } from "../config";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { createMediaStore, type MediaStore } from "./store";
import type { MediaRootProps } from "./types";
const Context = createContext<{
  store: MediaStore;
  setHost: (node: HTMLDivElement | null) => void;
} | null>(null);
export function useMediaContext() {
  const value = useContext(Context);
  if (!value) throw new Error("Use este componente dentro de MediaRoot.");
  return value;
}
export function MediaRoot({
  source,
  kind,
  adapterFactory,
  children,
  onError,
}: MediaRootProps) {
  const { labels } = useMediaConfig();
  const [store] = useState(createMediaStore);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const sourceKey = JSON.stringify(source);
  useEffect(() => {
    if (!host) return;
    void store.attach(host, source, kind, adapterFactory, {
      automatic: labels.auto,
      track: labels.track,
    });
    let lastError: unknown = null;
    const unsubscribe = store.subscribe(() => {
      const error = store.getSnapshot().error;
      if (error && error !== lastError) onErrorRef.current?.(error);
      lastError = error;
    });
    return () => {
      unsubscribe();
      store.destroy();
    };
  }, [host, sourceKey, kind, adapterFactory, store]);
  return (
    <Context.Provider value={{ store, setHost }}>{children}</Context.Provider>
  );
}
export function MediaHost(
  props: Omit<HTMLAttributes<HTMLDivElement>, "children">,
) {
  const { setHost } = useMediaContext();
  return <div {...props} ref={setHost} />;
}
