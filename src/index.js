/**
 * NuID API Interface
 *
 * ```javascript
 * const nuidApi = require('@nuid/api')({
 *   auth: { apiKey: process.env.NUID_API_KEY }
 * })
 * const app = express()
 * 
 * app.post('/register', async (req, res) => {
 *   const body = await nuidApi.auth.credentialCreate(req.body.verifiedCredential)
 *   const nuid = body['nu/id']
 *   const user = await User.create({ nuid, email, first_name, last_name })
 *   res.json({ user }).send(204)
 * })

 * ```
 * 
 * @module index
 */

const auth = require('./api/auth')
const config = require('./config')

/**
 * @typedef ConfiguredAPIs
 * @type {object}
 * @property {object} auth - Auth API access object
 * @property {object} config - Config object for managing api configs.
 */

/**
 * API Interface configurator.
 * @see {@linkcode config|Config} module
 * @param {object} config - Object for configuring the APIs.
 * @return {ConfiguredAPIs} An object for accessing individual APIs and configuration.
 */
module.exports = cfg => {
  config.set(cfg)
  return {
    auth,
    config: cfg
  }
}
