export function modeifyResponseBody(res: Response, body: BodyInit | null | undefined) {
  let newRes = new Response(body, {
    headers: res.headers,
    status: res.status,
    statusText: res.statusText
  });
  Object.defineProperties(newRes,{
    url:{ value: res.url },
    type: {
      value: res.type
    },
  });
  return newRes
}
export function jsonToBlob(data: Object) {
  return new Blob([JSON.stringify(data)], {
    type: 'application/json'
  })
}
export function cloneResponse(res: Response){
  let newRes = res.clone();
  return modeifyResponseBody(res, newRes.body)
}