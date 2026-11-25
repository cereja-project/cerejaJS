const pending = new Map<string, Promise<unknown>>();
export function loadSdk<T>(key: string, load: () => Promise<T>): Promise<T> {
  const existing = pending.get(key);
  if (existing) return existing as Promise<T>;
  const promise = Promise.resolve().then(load);
  pending.set(key, promise);
  void promise.catch(() => {
    if (pending.get(key) === promise) pending.delete(key);
  });
  return promise;
}
export function waitForSdk<T>(
  promise: Promise<T>,
  signal: AbortSignal,
  timeout: number,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
    };
    function abort() {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    }
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("O provedor não respondeu a tempo."));
    }, timeout);
    signal.addEventListener("abort", abort, { once: true });
    promise.then(
      (value) => {
        cleanup();
        resolve(value);
      },
      (error) => {
        cleanup();
        reject(error);
      },
    );
    if (signal.aborted) abort();
  });
}
