export async function xhrMock(url: string, data: any, signal: AbortSignal) {
  let timeout: ReturnType<typeof setTimeout>;

  signal.addEventListener("abort", () => {
    clearTimeout(timeout);
  });

  return new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      const rnd = Math.random();

      rnd > 0.7 ? resolve({ status: "ok" }) : reject({ status: "notOk" });
    }, 1000);
  });
}
