<p align="right"><a href="https://nuid.io"><img src="https://nuid.io/svg/logo.svg" width="20%"></a></p>

# NuID SDK for Node.js

[![](https://img.shields.io/npm/v/@nuid/sdk-nodejs?color=green&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@nuid/sdk-nodejs)
[![](https://img.shields.io/badge/docs-v0.1.0-blue?style=for-the-badge&logo=read-the-docs)](http://libdocs.s3-website-us-east-1.amazonaws.com/sdk-nodejs/v0.1.0/)
[![](https://img.shields.io/badge/docs-platform-purple?style=for-the-badge&logo=read-the-docs)](https://portal.nuid.io/docs)

This repo provides an npm package for interacting with NuID APIs within Node.js
applications.

Read the latest [package
docs](http://libdocs.s3-website-us-east-1.amazonaws.com/sdk-nodejs/v0.1.0/) or
checkout the [platform docs](https://portal.nuid.io/docs) for API docs, guides,
video tutorials, and more.

## Install

With [npm](https://www.npmjs.com/package/@nuid/sdk-nodejs):

```sh
npm install @nuid/sdk-nodejs
```

Or with yarn:

```sh
yarn add @nuid/sdk-nodejs
```

## Usage

Example server endpoint handled by [express](https://expressjs.com).

For a more detailed example visit the [Integrating with NuID](https://portal.nuid.io/docs/guides/integrating-with-nuid) guide and its
accompanying repository
[node-example](https://github.com/NuID/node-example/tree/bj/client-server-apps).

```javascript
const express = require('express')
const nuidApi = require('@nuid/sdk-nodejs')({
  auth: { apiKey: process.env.NUID_API_KEY }
})

const app = express()
app.post('/register', async (req, res) => {
  const body = await nuidApi.auth.credentialCreate(req.body.verifiedCredential)
  const nuid = body['nu/id']
  const user = await User.create({ nuid, email, first_name, last_name })
  res.json({ user }).send(204)
})
app.listen(process.env.PORT)
```
