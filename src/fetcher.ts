import { xhrMock } from "./xhrMock";

interface AsyncFn {
  (...args: any): Promise<any>;
}

export function fetcherFactory(fn: AsyncFn, numOfRetry = 3) {
  let retryCounter = numOfRetry;

  return async function fetcher(...args) {
    retryCounter = numOfRetry;

    while (true) {
      try {
        return await fn(...args);
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
