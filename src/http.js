/**
 * HTTP Utility for interacting with NuID APIs.
 * @module http
 */

const { config } = require('./config')
const fetch = require('node-fetch')
const R = require('ramda')

/**
 * @typedef ResponseBody
 * @type {object}
 * @desc `JSON.parse`d response via `res.json()` from [node-fetch]{@link https://www.npmjs.com/package/node-fetch#json} .
 */

/**
 * @typedef Response
 * @type {object}
 * @property {boolean} ok - whether response status <400
 * @desc [node-fetch]{@link https://www.npmjs.com/package/node-fetch#class-response} Response object.
 */

/**
 * Fetch a valid config by name, otherwise reject.
 *
 * @access private
 */
const apiConfig = api =>
  Promise.resolve((resolve, reject) => {
    if (R.has(api, config)) {
      resolve(config[api])
    } else {
      reject(new Error(`Unknown api configuration '${api}'`), null)
    }
  })

/**
 * Perform a GET request against a named NuID API.
 *
 * @async
 * @param {string} api - Name of an API configuration found as a top-level
 *   key in the {@link config} module.
 * @param {string} path - Path to resource on the API.
 * @return {Promise<ResponseBody>|Promise<Error, Response>}
 */
module.exports.get = (api, path) =>
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
    .then(res =>
      res.ok ? res.json() : Promise.reject(new Error('Failed to get data'), res)
    )

/**
 * Don't explode `res.json()` if the body is empty.
 *
 * @access private
 */
const bodyFromJSON = res =>
  res.text().then(body => (R.isEmpty(body) ? {} : JSON.parse(body)))

/**
 * Perform a POST request against a named NuID API.
 *
 * @async
 * @param {string} api - Name of an API configuration found as a top-level
 *   key in the {@link config} module.
 * @param {string} path - Path to resource on the API.
 * @return {Promise<ResponseBody>|Promise<Error, Response>}
 */
module.exports.post = (api, path, body) =>
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
    .then(res =>
      res.ok
        ? bodyFromJSON(res)
        : Promise.reject(new Error('Failed to post data'), res)
    )
