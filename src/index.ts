/**
 * @module index
 */

import * as auth from './api/auth'
import setConfig, { Config } from './config'

export interface ConfiguredAPIs {
  auth: auth.AuthAPI
  config: Config
}

/**
 * NuID API Interface
 * 
 * Example server endpoint handled by [express](https://expressjs.com).
 *
 * For a more detailed example visit the [Integrating with
 * NuID](https://portal.nuid.io/docs/guides/integrating-with-nuid) guide and its
 * accompanying [examples repository](https://github.com/NuID/examples/tree/main)
 * with a [Node.js + express.js
 * example](https://github.com/NuID/examples/blob/daf2a2820e8766871dcf720c02c4e4caa0181544/js-node/src/api.js#L44-L118)
 *
 * @example
 * ```javascript
 * const express = require('express')
 * const nuidApi = require('@nuid/sdk-nodejs').default({
 *   auth: { apiKey: process.env.NUID_API_KEY }
 * })
 * 
 * const app = express()
 * 
 * // See links above for more complete examples
 * app.post('/register', (req, res) => {
 *   return Promise.resolve(req.body.verifiedCredential)
 *     .then(nuidApi.auth.credentialCreate)
 *     .then(res  => res.parsedBody['nu/id'])
 *     .then(nuid => User.create({ nuid, email, first_name, last_name }))
 *     .then(user => res.json({ user }).send(201))
 *     .catch(err => res.json({ errors: ["Failed to create credential"] }).send(500))
 * })
 * 
 * app.listen(process.env.PORT)
 * ```
 */
export default (config: Config): ConfiguredAPIs => {
  setConfig(config)
  return {
    auth,
    config
  }
}
