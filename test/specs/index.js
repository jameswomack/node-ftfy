var chai    = require('chai')
var rewire  = require('rewire')
var request = require('supertest')
var sinon   = require('sinon')

chai.use(require('sinon-chai'))
var expect = chai.expect

var didYouMean = require('didyoumean')

var FTFY = rewire('../../')

var createServer = require('../mocks/server')
var expectedURLs = require('../expectations/urls')
var expectedResponses = require('../expectations/responses')

var PORT = 1337

describe('Fixed that for you...', function () {
  var server

  beforeEach(function () {
    server = createServer()
  })

  afterEach(function () {
    server = null
  })

  describe('FTFY.retrieveURLs', function () {
    it('reduces server.routes to it\'s determinable paths', function () {
      var potentialURLs = FTFY.retrieveURLs(server)

      expect(potentialURLs).to.eql(expectedURLs)
    })
  })

  describe('FTFY.suggest', function () {
    it('takes in a list & typo and returns a suggestion', function () {
      var dymSpy = sinon.spy(didYouMean)

      FTFY.__with__({
        didYouMean: dymSpy
      })(function () {
        // Close enough to find
        var suggestion = FTFY.suggest(FTFY.retrieveURLs(server), '/teh-president')

        expect(suggestion).to.eql(expectedResponses[0])
        expect(dymSpy).to.have.been.calledOnce

        // Not close enough
        var nonSuggestion = FTFY.suggest(FTFY.retrieveURLs(server), '/$$$')

        expect(nonSuggestion).to.eql(null)
        expect(dymSpy).to.have.been.calledTwice

        dymSpy.reset()
      })
    })
  })

  describe('FTFY.mountTo', function () {
    var _NO_MATCH_MESSAGE_

    beforeEach(function (next) {
      server.listen(PORT, function () {
        _NO_MATCH_MESSAGE_ = FTFY.NO_MATCH_MESSAGE
        FTFY.mountTo(server)
        next()
      })
    })

    afterEach(function (next) {
      FTFY.NO_MATCH_MESSAGE = _NO_MATCH_MESSAGE_
      server.close(next)
    })

    it('attaches an event handler that renders a suggestion', function (next) {
      return request(server)
        .get('/teh-president')
        .set('Accept', 'text/plain')
        .expect('Did you mean /the-president ?')
        .end(next);
    })

    it('has a default message', function (next) {
      return request(server)
        .get('/$$$')
        .set('Accept', 'text/plain')
        .expect('URL not found')
        .end(next);
    })

    it('has a changeable default message', function (next) {
      FTFY.NO_MATCH_MESSAGE = 'Whooooooops'

      return request(server)
        .get('/$$$')
        .set('Accept', 'text/plain')
        .expect('Whooooooops')
        .end(next);
    })
  })
})
