var teams = [{
			id : "100",
			name : "Evoque"
		}, {
			id : "101",
			name : "Hummer"
		}, {
			id : "102",
			name : "Range Rover"
		}, {
			id : "103",
			name : "Snipers"
		}, {
			id : "104",
			name : "Vipers"
		},{
			id: "105",
			name : "Aventadors"
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