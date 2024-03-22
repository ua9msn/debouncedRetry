interface AsyncFn {
  (...args: any): Promise<any>;
}

export function abortable(fn: AsyncFn) {
  let con: AbortController;

  return async function aborter(...args) {
    if (con) {
      con.abort();
    }
    con = new AbortController();

    return fn(...args, con.signal);
  };
}
