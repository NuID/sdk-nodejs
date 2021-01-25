/**
 * API Configuration module
 * @module config
 */

const R = require('ramda')

/**
 * @typedef AuthAPIConfig
 * @type {object}
 * @property {string} rootUrl - Root URL of the NuID Auth API
 * @property {string} apiKey - API Key to access the NuID Auth API
 */

/**
 * @typedef Config
 * @type {object}
 * @property {AuthAPIConfig} auth - Auth API Configuration
 */

const defaultConfig = {
  auth: {
    rootUrl: 'https://auth.nuid.io',
    apiKey: ''
  }
}

/**
 * The config object.
 * @type {Config}
 */
let config = (module.exports.config = defaultConfig)

const deepPathsReducer = (acc, [k, v]) => {
  if (R.is(Object, v)) {
    return R.pipe(deepPaths, R.map(R.concat([k])), R.concat(acc))(v)
  }
  return R.append([k], acc)
}

const deepPaths = R.pipe(R.toPairs, R.reduce(deepPathsReducer, []))

/**
 * Setter for the config object. Does not allow setting arbitrary keys.
 * @param {Config} cfg - A whole or partial Config object to set.
 * @return {Config} the {@linkcode Config Config} object with new properties set.
 */
module.exports.set = cfg => {
  config = R.reduce(
    (acc, path) => {
      const val = R.path(path, cfg)
      if (!R.isNil(val)) {
        return R.assocPath(path, val, acc)
      }
      return acc
    },
    config,
    deepPaths(config)
  )
}
