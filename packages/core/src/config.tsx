import { createContext, useContext, type ReactNode } from "react";
import { defaultLabels, type MediaLabels } from "./i18n";
export const defaultConfig = {
  comparisonStep: 10,
  comparisonInitial: 50,
  locale: "pt-BR",
  seekStep: 5,
  positionRestoreTimeout: 5000,
  volumeStep: 0.05,
  zoomMin: 1,
  zoomMax: 4,
  zoomStep: 0.25,
  panStep: 40,
  rates: [0.5, 0.75, 1, 1.25, 1.5, 2],
};
export type MediaConfig = typeof defaultConfig;
const Context = createContext({ labels: defaultLabels, config: defaultConfig });
export function MediaConfigProvider({
  labels,
  config,
  children,
}: {
  labels?: Partial<MediaLabels>;
  config?: Partial<MediaConfig>;
  children: ReactNode;
}) {
  const parent = useContext(Context);
  return (
    <Context.Provider
      value={{
        labels: { ...parent.labels, ...labels },
        config: { ...parent.config, ...config },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useMediaConfig() {
  return useContext(Context);
}
