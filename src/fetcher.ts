import { xhrMock } from "./xhrMock";

interface AsyncFn {
  (...args: any): Promise<any>;
}

export function retriable(fn: AsyncFn, numOfRetry = 3) {
  let retryCounter = numOfRetry;

  return async function retrier(...args) {
    retryCounter = numOfRetry;

    while (true) {
      try {
        return await fn(...args);
      } catch (err) {
        retryCounter--;
        if (retryCounter < 1) {
          throw err;
        }
      }
    }
  };
}
