import { xhrMock } from "./xhrMock";

export function fetcherFactory(numOfRetry = 3) {
  let retryCounter = numOfRetry;

  return async function fetcher(url: string, signal: AbortSignal) {
    retryCounter = numOfRetry;

    while (true) {
      try {
        return await xhrMock("retryCounter", retryCounter, signal);
      } catch (err) {
        retryCounter--;
        console.log("retry# ", retryCounter);
        if (retryCounter < 1) {
          throw err;
        }
      }
    }
  };
}
