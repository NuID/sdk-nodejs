/**
 * API Configuration module
 * @module config
 */

import * as R from 'ramda'

/**
 * Valid config keys.
 */
export type APIName = 'auth'

/**
 * Valid configuration for the NuID Auth API.
 * @see [[api/auth.credentialCreate]] et al
 */
export interface AuthAPIConfig {
  apiKey: string
  rootUrl: string
}

/**
 * API Configuration master object. Contains config for each
 * underlying NuID API.
 */
export interface Config {
  /**
   * NuID Auth API config
   */
  auth: AuthAPIConfig
}

export type APIConfig = AuthAPIConfig // | FooAPIConfig | BarAPICOnfig

const defaultConfig = {
  auth: {
    apiKey: '',
    rootUrl: 'https://auth.nuid.io'
  }
}

/**
 * The config object for reading.
 */
export let config: Config = defaultConfig

type KVPair = Array<string> // prettier puking on tuple, should be [string, string|object]
type KeyPath = string[]

const deepPathsReducer: (acc: KeyPath[], [k, v]: KVPair) => KeyPath[] = (
  acc,
  [k, v]
) => {
  if (R.is(Object, v)) {
    return R.pipe(deepPaths, R.map(R.concat([k])), R.concat(acc))(v)
  }
  return R.append([k], acc)
}

const deepPaths: (v: string | Object) => KeyPath[] = v =>
  R.pipe(R.toPairs, R.reduce(deepPathsReducer, []))(v)

/**
 * Setter for the config object. Prevents setting arbitrary keys.
 */
const setConfig: (cfg: Config) => Config = cfg => {
  config = R.reduce(
    (acc: Config, path: string[]) => {
      const val = R.path(path, cfg)
      if (!R.isNil(val)) {
        return R.assocPath(path, val, acc)
      }
      return acc
    },
    config,
    deepPaths(config)
  )
  return config
}

export default setConfig
