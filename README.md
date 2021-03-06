# node-ftfy
Suggest a URL when someone enters a typo on your Restify server

## Get it
```
npm i ftfy -SE
```

## Test it
```
git clone https://github.com/jameswomack/node-ftfy.git
cd node-ftfy
npm i
npm test
```

## Example Usage

```
var FTFY = require('ftfy')
var server = Restify.createServer()

server.get('/the-president', handler)

server.listen(PORT, function () {
  FTFY.mountTo(server)
})

request
  .get('/teh-president')
  .end(function (err, res) {
    // res.body -> 'Did you mean /the-president ?'
  });

// Default no match message
request
  .get('/8dfhaoyd0a98j')
  .end(function (err, res) {
    // res.body -> 'Url not found'
  });

// Custom no match message
FTFY.NO_MATCH_MESSAGE = 'Whooooooops'
request
  .get('/8dfhaoyd0a98j')
  .end(function (err, res) {
    // res.body -> 'Whooooooops'
  });

```
