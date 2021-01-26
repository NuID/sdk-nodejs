/**
 * HTTP Utility for interacting with NuID APIs.
 * @module http
 */

import { config, APIConfig, APIName } from './config'
import fetch, { Response } from 'node-fetch'
import * as R from 'ramda'

const apiConfig: (api: APIName) => Promise<APIConfig> = api =>
  new Promise((resolve, reject) => {
    if (R.has(api, config)) {
      resolve(config[api])
    } else {
      reject(new Error(`Unknown api configuration '${api}'`))
    }
  })

/**
 * Perform a GET request against a named NuID API.
 * @typeParam ResponseBody - The type of the response body after JSON deserialization.
 * @param api - The name of the api configuration to use. @see [[config.APIName]]
 * @param path - The path portion of the URI.
 * @returns - The specified `ResponseBody` object, or the
 *   [`fetch` Response](https://www.npmjs.com/package/node-fetch#class-response) object
 *   if the request was not `res.ok`.
 */
export const get: <ResponseBody>(
  api: APIName,
  path: string
) => Promise<ResponseBody> = (api, path) =>
  apiConfig(api)
    .then(cfg =>
      fetch(`${cfg.rootUrl}${path}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-API-Key': cfg.apiKey
        }
      })
    )
    .then(res => (res.ok ? res.json() : Promise.reject(res)))

const bodyFromJSON: <ResponseBody>(
  res: Response
) => Promise<ResponseBody> = res =>
  res.text().then((body: string) => (R.isEmpty(body) ? {} : JSON.parse(body)))

/**
 * Perform a POST request against a named NuID API.
 * @typeParam ResponseBody - The type of the response body after JSON deserialization.
 * @param api - The name of the api configuration to use. @see [[config.APIName]]
 * @param path - The path portion of the URI.
 * @param body - The body of the request to be JSON serialized.
 * @returns - The specified `ResponseBody` object, or the
 *   [`fetch` Response](https://www.npmjs.com/package/node-fetch#class-response) object
 *   if the request was not `res.ok`.
 */
export const post: <RequestBody, ResponseBody>(
  api: APIName,
  path: string,
  body: RequestBody
) => Promise<ResponseBody> = (api, path, body) =>
  apiConfig(api)
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
    .then(res => (res.ok ? bodyFromJSON(res) : Promise.reject(res)))
