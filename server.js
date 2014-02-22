var express = require('express'),
	links = require('./routes/links');

var app = express();

app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

app.use('/commune', express.static(__dirname));

app.get('/commune/basic', links.basic);
app.get('/commune/teams', links.teams);
app.get('/commune/teams/:teamId', links.team);

app.listen(8080);