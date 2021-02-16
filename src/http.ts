/**
 * HTTP Utility for interacting with NuID APIs.
 * @module http
 */

import { config, APIConfig, APIName } from './config'
import fetch, { Response } from 'node-fetch'
import * as R from 'ramda'

/**
 * @typeParam T - The type of the expected response body for valid responses.
 */
export type ParsedJSON<T> = {
  /**
   * JSON-parsed object of type `T`, for use with specifying HTTP response bodies.
   */
  parsedBody: T
}

/**
 * Union of [`fetch` Response](https://www.npmjs.com/package/node-fetch#class-response)
 * type and [[ParsedJSON]].
 *
 * Provides a [[parsedBody]] attribute alongside the regular response object
 * for working with the JSON-parsed body.
 *
 * @typeParam T - The type of the expected response body for valid responses.
 */
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
  return bodyFromJSON(res).then(R.assoc('parsedBody', R.__, res))
}

function getOpts(cfg: APIConfig): Object {
  return {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-Key': cfg.apiKey
    }
  }
}

function postOpts<T>(cfg: APIConfig, body: T): Object {
  return {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': cfg.apiKey
    }
  }
}

/**
 * Perform a GET request against a named NuID API.
 * @typeParam ResponseBodyT - The type of the response body after JSON deserialization.
 * @param api - The name of the api configuration to use. @see [[config.APIName]]
 * @param path - The path portion of the URI.
 * @returns - The [`fetch`
 *   Response](https://www.npmjs.com/package/node-fetch#class-response) object
 *   with a [[parsedBody]] attribute of type `ResponseBodyT`.
 * @throws The [`fetch`
 *   Response](https://www.npmjs.com/package/node-fetch#class-response) object
 *   will be thrown `if (!res.ok)`. The [[parsedBody]] attribute may be set with
 *   an object of type `ResponseBodyT`.
 */
export async function get<ResponseBodyT>(
  api: APIName,
  path: string
): Promise<SDKResponse<ResponseBodyT>> {
  return apiConfig(api)
    .then(cfg => fetch(`${cfg.host}${path}`, getOpts(cfg)))
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
 * @returns - The [`fetch`
 *   Response](https://www.npmjs.com/package/node-fetch#class-response) object
 *   with a [[parsedBody]] attribute of type `ResponseBodyT`.
 * @throws The [`fetch`
 *   Response](https://www.npmjs.com/package/node-fetch#class-response) object
 *   will be thrown `if (!res.ok)`. The [[parsedBody]] attribute may be set with
 *   an object of type `ResponseBodyT`.
 */
export async function post<RequestBodyT, ResponseBodyT>(
  api: APIName,
  path: string,
  body: RequestBodyT
): Promise<SDKResponse<ResponseBodyT>> {
  return apiConfig(api)
    .then(cfg => fetch(`${cfg.host}${path}`, postOpts(cfg, body)))
    .then(res => consumeBody<ResponseBodyT>(res as SDKResponse<ResponseBodyT>))
    .then(res => (res.ok ? res : Promise.reject(res)))
}
