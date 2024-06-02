const END_POINT = "http://localhost:3001/api";

export const request = async (
  url: string,
  payload: {
    method: string;
    body?: Record<string, unknown>;
    headers?: Partial<HeadersInit>;
  },
  options?: { auth?: boolean; toast?: boolean }
) => {
  options = Object.assign({}, { auth: true, toast: true }, options);
  console.log("beforeRequest", { url, payload, options });
  const finalUrl = [END_POINT, url].join("");
  try {
    const res = await fetch(finalUrl, {
      method: payload.method,
      headers: Object.assign(
        {
          "Content-Type": "application/json; charset=utf-8",
        },
        payload.headers
      ) as HeadersInit,
      body: JSON.stringify(payload.body),
    });
    const response = await res.json();
    console.log("afterRequest", { url, res });
    Promise.resolve(response);
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};
