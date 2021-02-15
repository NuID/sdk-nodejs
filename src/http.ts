/**
 * HTTP Utility for interacting with NuID APIs.
 * @module http
 */

import { config, APIConfig, APIName } from './config'
import fetch, { Response } from 'node-fetch'
import * as R from 'ramda'

export type ParsedJSON<Body> = {
  parsedBody: Body
}

export type SDKResponse<T> = Response & ParsedJSON<T>

const apiConfig: (api: APIName) => Promise<APIConfig> = api =>
  new Promise((resolve, reject) => {
    if (R.has(api, config)) {
      resolve(config[api])
    } else {
      reject(new Error(`Unknown api configuration '${api}'`))
    }
  })

async function bodyFromJSON<T>(res: Response): Promise<T> {
  return res.text().then((body: string) => (R.isEmpty(body) ? {} : JSON.parse(body)))
}

async function consumeBody<T>(res: SDKResponse<T>): Promise<SDKResponse<T>> {
  return bodyFromJSON(res).then(body => {
    res.parsedBody = body as T
    return res
  })
}

/**
 * Perform a GET request against a named NuID API.
 * @typeParam ResponseBodyT - The type of the response body after JSON deserialization.
 * @param api - The name of the api configuration to use. @see [[config.APIName]]
 * @param path - The path portion of the URI.
 * @returns - For "ok" responses, the node-fetch 
 *   [`fetch` Response](https://www.npmjs.com/package/node-fetch#class-response) object
 *   with a `parsedBody` key populated to the parsed body of the response.
 *   Non-"ok" responses are `Promise.reject(res)`ed.
 */
export async function get<ResponseBodyT>(
  api: APIName,
  path: string
): Promise<SDKResponse<ResponseBodyT>> {
  return apiConfig(api)
    .then(cfg =>
      fetch(`${cfg.rootUrl}${path}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-API-Key': cfg.apiKey
        }
      })
    )
    .then(res => consumeBody<ResponseBodyT>(res as SDKResponse<ResponseBodyT>))
    .then(res => (res.ok ? res : Promise.reject(res)))
}

/**
 * Perform a POST request against a named NuID API.
 * @typeParam RequestBodyT - The type of the request body after JSON deserialization.
 * @typeParam ResponseBodyT - The type of the response body after JSON deserialization.
 * @param api - The name of the api configuration to use. @see [[config.APIName]]
 * @param path - The path portion of the URI.
 * @param body - The body of the request to be JSON serialized.
 * @returns - For "ok" responses, the node-fetch 
 *   [`fetch` Response](https://www.npmjs.com/package/node-fetch#class-response) object
 *   with a `parsedBody` key populated to the parsed body of the response.
 *   Non-"ok" responses are `Promise.reject(res)`ed.
 */
export async function post<RequestBodyT, ResponseBodyT>(
  api: APIName,
  path: string,
  body: RequestBodyT
): Promise<SDKResponse<ResponseBodyT>> {
  return apiConfig(api)
    .then(cfg =>
      fetch(`${cfg.rootUrl}${path}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': cfg.apiKey
        }
      })
    )
    .then(res => consumeBody<ResponseBodyT>(res as SDKResponse<ResponseBodyT>))
    .then(res => (res.ok ? res : Promise.reject(res)))
}
