# NuID API JavaScript Lib

This repo provides an npm package for calling the NuID APIs with standard config
and error handling.

## Install

```sh
npm install @nuid/api
```

## Usage

Example server endpoint handled by [express](https://expressjs.com).

```javascript
const nuidApi = require('@nuid/api')({
  auth: { apiKey: process.env.NUID_API_KEY }
})
const app = express()

app.post('/register', async (req, res) => {
  const body = await nuidApi.auth.credentialCreate(req.body.verifiedCredential)
  const nuid = body['nu/id']
  const user = await User.create({ nuid, email, first_name, last_name })
  res.json({ user }).send(204)
})
```
