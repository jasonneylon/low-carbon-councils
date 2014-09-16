var express = require("express"),
  url = require('url'),
  path = require("path"),
  http = require("http"),
  httpProxy = require('http-proxy');
// var logfmt = require("logfmt");
var app = express();

// app.use(logfmt.requestLogger());

app.use(express.static(__dirname + '/app'));

// app.get('/', function(req, res) {
//   res.send('<h1>Low carbon councils</h1>');
// });

app.get('/postcode', function(req, res){
  res.type('text/plain');
  res.send('Getting by postcode');
});

app.get("/data/*", function(req, res) {

  var path = url.parse(req.url).pathname;
  var dataUrl = "http://low-carbon-councils.herokuapp.com" + path;
  console.log("Requesting ", dataUrl);
  http.request(dataUrl).on('response', function(response) {
    var data = '';
    response.on("data", function (chunk) {
        data += chunk;
    });
    response.on('end', function () {
        res.write(data);
        res.end();
    });
  }).end();

})

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});