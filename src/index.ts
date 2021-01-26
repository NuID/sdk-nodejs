/**
 *
 * @module index
 */

import * as auth from './api/auth'
import setConfig, { Config } from './config'

export interface ConfiguredAPIs {
  auth: auth.IAuthAPI
  config: Config
}

/**
 * NuID API Interface
 *
 * @example
 * ```javascript
 * const express = require('express')
 * const nuidApi = require('@nuid/sdk-nodejs')({
 *   auth: { apiKey: process.env.NUID_API_KEY }
 * })
 * 
 * const app = express()
 * app.post('/register', async (req, res) => {
 *   const body = await nuidApi.auth.credentialCreate(req.body.verifiedCredential)
 *   const nuid = body['nu/id']
 *   const user = await User.create({ nuid, email, first_name, last_name })
 *   res.json({ user }).send(204)
 * })
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
