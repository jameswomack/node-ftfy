var Restify = require('restify')

var handler = require('./handler')

function createServer () {
  var server = Restify.createServer({
    name: 'ftfy-test'
  })

  server.get(/\/gabbagoo*/, handler)
  server.get('/the-president', handler)
  server.get('/foo/bar/baz/qux', handler)
  server.del('/goo', handler)
  server.put('/fog/bag/zag/guq', handler)

  return server
}

module.exports = createServer
