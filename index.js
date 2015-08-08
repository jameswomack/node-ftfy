var didYouMean = require('didyoumean')

var REN = require('./lib/restify-event-names')

var NO_MATCH_MESSAGE = 'URL not found'

function retrieveURLs (server) {
  return Object.keys(server.router.mounts)
    .map(function (mountKey) {
      return server.router.mounts[mountKey].spec
    })
    .filter(function (spec) {
      return typeof spec.path === 'string' &&
             spec.method === 'GET'
    })
    .map(function (spec) {
      return spec.path
    })
}

function determineSuggestion (potentialURLs, typoURL) {
  var suggestion = didYouMean(typoURL, potentialURLs)

  return suggestion ? 'Did you mean ' + suggestion + ' ?' : suggestion
}

function addHandlerToServer (handler, server) {
  var notFoundURLHandler = handler.bind(null, this.retrieveURLs(server))

  server.on(REN.NotFound, function onNotFound (req, res, err, next) {
    res.send(notFoundURLHandler(req.url) || this.NO_MATCH_MESSAGE)
    return next()
  }.bind(this))
}

var FTFY = Object.create({
  NO_MATCH_MESSAGE : NO_MATCH_MESSAGE,
  suggest          : determineSuggestion,
  retrieveURLs     : retrieveURLs
})

FTFY.mountTo = addHandlerToServer.bind(FTFY, determineSuggestion)

module.exports = FTFY
