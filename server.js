var express = require('express'),
	links = require('./serverlib/links');

var app = express();

app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

//app.use(express.bodyParser()); //gives warning about deprecated api in connect module
app.use(express.urlencoded());
app.use(express.json());
app.use('/jive', express.static(__dirname));

app.get('/jive/basic', links.basic);

app.get('/jive/teams', links.teams);
app.get('/jive/teams/:teamId', links.team);

app.get('/jive/teams/:teamId/sprints', links.sprints);
app.get('/jive/teams/:teamId/sprints/:sprintId', links.sprint);
app.put('/jive/teams/:teamId/sprints/:sprintId', links.updateSprint);
app.put('/jive/teams/:teamId/sprints/:sprintId/tasks', links.updateSprint);
app.delete('/jive/teams/:teamId/sprints/:sprintId', links.deleteSprint);
app.post('/jive/teams/:teamId/sprints', links.addSprint);

app.listen(8080);
