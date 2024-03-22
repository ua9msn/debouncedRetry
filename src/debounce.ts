interface AsyncFn {
  (arg: any, signal: AbortSignal): Promise<any>;
}

export function debounce(callee: AsyncFn, timeoutMs: number) {
  let timeout: ReturnType<typeof setTimeout>;
  let con: AbortController;

  return async function perform(...args) {
    if (con) {
      con.abort();
    }

    con = new AbortController();

    console.log("calling perform", timeout);
    clearTimeout(timeout);
    return new Promise((resolve, reject) => {
      timeout = setTimeout(
        async () => {
          console.log("run", timeout);
          try {
            const result = await callee(args, con.signal);
            timeout = 0;
            resolve(result);
          } catch (err) {
            reject(err);
          }
        },
        timeout ? timeoutMs : 0,
      );
    });
  };
}
