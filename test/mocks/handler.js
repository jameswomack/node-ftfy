module.exports = function mockHandler (req, res, next) {
  res.send('foo')
  next()
}
