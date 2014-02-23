var makeId = function() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for(var i = 0; i < 5; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
};

var teams = [{
	id : "100",
	name : "Evoque",
	members : [{name : "Arun"}, {name : "Vineesh"}, {name : "Riyad"}, {name : "Vishwas"}, {name : "Rupesh"}]
}, {
	id : "101",
	name : "Hummer",
	members : [{name : "Divya"}, {name : "Kala"}, {name : "Manish"}, {name : "Shikhar"}, {name : "Benny"}]
}, {
	id : "102",
	name : "Range Rover",
	members : [{name : "Venu"}, {name : "Shailja"}, {name : "Sushree"}, {name : "Atulya"}, {name : "Sandeep"}]
}, {
	id : "103",
	name : "Snipers",
	members : [{name : "Yogi"}, {name : "Prabhu"}, {name : "Sridhar"}, {name : "Meyyappan"}, {name : "Ravi"}]
}, {
	id : "104",
	name : "Vipers",
	members : [{name : "Sneha"}, {name : "Raj"}, {name : "Vishal"}, {name : "Sunil"}]
}];

var sprints = [{
	id : "200",
	name : "Sprint 102",
	teamId : "104",
	dates : [new Date(Date.UTC(2014, 1, 12)), new Date(Date.UTC(2014, 0, 31)), new Date(Date.UTC(2014, 1, 3)), new Date(Date.UTC(2014, 1, 4)), new Date(Date.UTC(2014, 1, 5)), new Date(Date.UTC(2014, 1, 6)),
	new Date(Date.UTC(2014, 1, 7)), new Date(Date.UTC(2014, 1, 10)), new Date(Date.UTC(2014, 1, 11))]
}, {
	id : "201",
	name : "Sprint 103",
	teamId : "104",
	dates : [new Date(Date.UTC(2014, 1, 19)), new Date(Date.UTC(2014, 1, 20)), new Date(Date.UTC(2014, 1, 21)), new Date(Date.UTC(2014, 1, 24)), new Date(Date.UTC(2014, 1, 25))]
}];

exports.basic = function(req, res) {
	res.send({brand : "CUIC Sprint Task Board"});
};

exports.teams = function(req, res) {
	res.send({teams : teams});
};

exports.team = function(req, res) {
	var found = false;
	for(var i in teams) {
		if(req.params.teamId == teams[i].id) {
			res.send(teams[i]);
			found = true;
			break;
		}
	}

	if(!found) {
		res.status(404).send({});
	}
};

exports.sprints = function(req, res) {
	var teamId = req.params.teamId;
	var results = [];
	for(var i in sprints) {
		if(teamId == sprints[i].teamId) {
			results.push(sprints[i]);
		}
	}
	res.send(results);
};

exports.sprint = function(req, res) {
	var sprintId = req.params.sprintId;
	var found = false;
	for(var i in sprints) {
		if(req.params.sprintId == sprints[i].id) {
			res.send(sprints[i]);
			found = true;
			break;			
		}
	}

	if(!found) {
		res.status(404).send({});
	}
};

exports.addSprint = function(req, res) {
	var sprint = {
		id : makeId(),
		name : req.body.name,
		teamId : req.params.teamId,
		dates : req.body.dates
	};

	console.log(sprint);
	sprints.push(sprint);
	res.status(201).send({});
};

exports.updateSprint = function(req, res) {
	var id = req.params.sprintId;
	var found = false;
	for(var i in sprints) {
		if(req.params.sprintId == sprints[i].id) {
			sprints[i].name = req.body.name;
			sprints[i].dates = req.body.dates;

			res.status(200).send();

			found = true;
			break;
		}
	}

	if(!found) {
		res.status(404).send({});
	}
};

exports.deleteSprint = function(req, res) {
	var id = req.params.sprintId;
	var index = -1;
	for(var i in sprints) {
		if(req.params.sprintId == sprints[i].id) {
			index = i;
			break;
		}
	}

	if(index != -1) {
		sprints.splice(index, 1);
		res.status(200).send({});
	} else {
		res.status(404).send({});
	}
};

