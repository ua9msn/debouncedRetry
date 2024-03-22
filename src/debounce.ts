interface AsyncFn {
  (...args: any): Promise<any>;
}

export function debounce(callee: AsyncFn, timeoutMs: number) {
  let timeout: ReturnType<typeof setTimeout>;

  return async function perform(...args) {
    clearTimeout(timeout);
    return new Promise((resolve, reject) => {
      timeout = setTimeout(
        async () => {
          console.log("run", timeout);
          try {
            const result = await callee(...args);
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
