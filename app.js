var request = require('request'),
    path = require('path'),
    express = require('express'),
    config = require('./config');

var app = express.createServer();

app.use(express.static(path.join(__dirname, 'static')));

app.get('/article', function (req, res) {
  var url = req.query.url;
  request.get({
    uri: "http://www.readability.com/api/content/v1/parser" +
         "?token=" + encodeURIComponent(config.readabilityApiToken) +
         "&url=" + encodeURIComponent(url),
    form: true
  }, function (err, response, body) {
    // TODO: When will err be true? Do something when it happens.
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.send('Bad Gateway', 502);
    }
    return res.send(body, response.statusCode);
  });
});

module.exports = app;
