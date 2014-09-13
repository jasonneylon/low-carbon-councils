var express = require("express"),
  path = require("path");
// var logfmt = require("logfmt");
var app = express();

// app.use(logfmt.requestLogger());

app.use(express.static(__dirname + '/app'));

// app.get('/', function(req, res) {
//   res.send('<h1>Low carbon councils</h1>');
// });

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});