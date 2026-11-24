export const providerDefaults = {
  sdkTimeout: 15000,
  readyTimeout: 15000,
  pollInterval: 500,
};
export type ProviderSettings = Partial<typeof providerDefaults>;
