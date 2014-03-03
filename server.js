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
app.use('/commune', express.static(__dirname));

app.get('/commune/basic', links.basic);

app.get('/commune/teams', links.teams);
app.get('/commune/teams/:teamId', links.team);

app.get('/commune/teams/:teamId/sprints', links.sprints);
app.get('/commune/teams/:teamId/sprints/:sprintId', links.sprint);
app.put('/commune/teams/:teamId/sprints/:sprintId', links.updateSprint);
app.put('/commune/teams/:teamId/sprints/:sprintId/tasks', links.updateSprint);
app.delete('/commune/teams/:teamId/sprints/:sprintId', links.deleteSprint);
app.post('/commune/teams/:teamId/sprints', links.addSprint);

app.listen(8080);