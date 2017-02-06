var express = require('express');
var logfmt = require("logfmt");
var bodyParser = require('body-parser');

var app = express();

app.use(logfmt.requestLogger());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
var port = Number(process.env.PORT || 8000);

app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);
app.use(express.static(__dirname + '/app'));

/*app.get('/', routes.index);
app.get('/views/:name', routes.views);

app.get('/signin', routes.signin);
app.get('/signup', routes.signup);
app.get('/sitemap', routes.sitemap);
app.get('/contact', routes.contact);
app.get('/404', routes.page404);*/

//app.get('*', routes.index);
//app.get('*', function(req, res) {
// res.redirect('/#' + req.originalUrl);
//});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

app.listen(port, function() {
  console.log("Listening on " + port);
});
