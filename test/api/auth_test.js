const assert = require('assert')
const R = require('ramda')
const sdk = require('../../src/index').default
const Zk = require('@nuid/zk')
const { Config } = require('../../src/config')

const isPresent = R.pathSatisfies(R.compose(R.complement(R.isEmpty), R.complement(R.isNil)))
const decodeClaims = R.pipe(
  R.split('.'),
  parts => parts[1],
  encoded => Buffer.from(encoded, 'base64'),
  rawClaims => JSON.parse(rawClaims)
)

describe('api/auth', () => {

  it('should fail on invalid configuration', () => {
    const badConfigs = [
      { auth: {} },
      { auth: {apiKey: null} },
      { auth: {apiKey: undefined} },
      { auth: {apiKey: ''} },
      { auth: {apiKey: '123', host: null} },
      { auth: {apiKey: '123', host: undefined} },
      { auth: {apiKey: '123', host: ''} },
      { auth: {apiKey: '', host: ''} }
    ]
    
    R.forEach(() => {
      assert.throws(badConfig => {
        sdk(badConfig)
      }, badConfigs)
    })
  })

  it('should configure the api key and host', () => {
    const config = sdk({ auth: {
      apiKey: 'api key test',
      host: 'host test'
    }}).config
    assert.equal('api key test', config.auth.apiKey, 'apiKey is not present')
    assert.equal('host test', config.auth.host, 'apiKey is not present')
  })

  it('test roundtrip', () => {
    const { auth } = sdk({ auth: {
      apiKey: 'ACrED3gWyu7wBVFmXJoZB43aog1G07Kq86qsYI03',
      host: 'https://auth.stage-coach.io'
    }})

    const secret = "my secret password of doom"

    return Promise
      .resolve(Zk.verifiableFromSecret(secret))
      .then(auth.credentialCreate)
      .then (res => {
        assert.equal(res.status, 201, `credentialCreate failed with ${res.status} ${res.parsedBody}`)
        return res.parsedBody['nu/id']
      })
      .then(auth.credentialGet)
      .then(res => {
        assert.equal(res.status, 200, `credentialGet failed with ${res.status} ${res.parsedBody}`)
        return res.parsedBody['nuid/credential']
      })
      .then(auth.challengeGet)
      .then(res => {
        assert.equal(res.status, 201, `challengeGet failed with ${res.status} ${res.parsedBody}`)
        return res.parsedBody['nuid.credential.challenge/jwt']
      })
      .then(challengeJWT => {
        const claims = decodeClaims(challengeJWT)
        const proof = Zk.proofFromSecretAndChallenge(secret, claims)
        return auth.challengeVerify(challengeJWT, proof)
      })
      .then(res => {
        assert.equal(res.status, 200, `challengeVerify failed with ${res.status} ${res.parsedBody}`)
      })
  })
})
