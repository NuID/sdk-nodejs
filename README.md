<p align="right"><a href="https://nuid.io"><img src="https://nuid.io/svg/logo.svg" width="20%"></a></p>

# NuID SDK for Node.js

[![](https://img.shields.io/npm/v/@nuid/sdk-nodejs?color=green&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@nuid/sdk-nodejs)
[![](https://img.shields.io/badge/docs-v0.2.1-blue?style=for-the-badge&logo=read-the-docs)](http://libdocs.s3-website-us-east-1.amazonaws.com/sdk-nodejs/v0.2.1/)
[![](https://img.shields.io/badge/docs-platform-purple?style=for-the-badge&logo=read-the-docs)](https://portal.nuid.io/docs)

This repo provides an npm package for interacting with NuID APIs within Node.js
applications.

Read the latest [package
docs](http://libdocs.s3-website-us-east-1.amazonaws.com/sdk-nodejs/v0.2.1/) or
checkout the [platform docs](https://portal.nuid.io/docs) for API docs, guides,
video tutorials, and more.

This package is written with typescript so you should be able to get valid type
definitions in your editor when importing this package. Using typescript is not
a requirement to use this package.

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

For a more detailed example visit the [Integrating with
NuID](https://portal.nuid.io/docs/guides/integrating-with-nuid) guide and its
accompanying [examples repository](https://github.com/NuID/examples/tree/main)
with a [Node.js + express.js
example](https://github.com/NuID/examples/blob/daf2a2820e8766871dcf720c02c4e4caa0181544/js-node/src/api.js#L44-L118)
.

```javascript
const express = require('express')
const nuidApi = require('@nuid/sdk-nodejs').default({
  auth: { apiKey: process.env.NUID_API_KEY }
})

const app = express()

// See links above for more complete examples
app.post('/register', (req, res) => {
  return Promise.resolve(req.body.verifiedCredential)
    .then(nuidApi.auth.credentialCreate)
    .then(res  => res.parsedBody['nu/id'])
    .then(nuid => User.create({ nuid, email, first_name, last_name }))
    .then(user => res.json({ user }).send(201))
    .catch(err => res.json({ errors: ["Failed to create credential"] }).send(500))
})

app.listen(process.env.PORT)
```
