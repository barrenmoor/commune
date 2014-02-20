angular.module('navig', ['ngRoute'])

.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			controller:'TeamCtrl',
			templateUrl:'nav.html'
		});
})

.controller('TeamCtrl', function($scope, $location, $routeParams){
	$scope.teams = [{
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
		name : "Clueless"
	}];

	$scope.selectedTeam = "Select Team";

	$scope.changeTeam = function(id) {
		console.log(id);

		for(var i in $scope.teams) {
			if(id == $scope.teams[i].id) {
				$scope.selectedTeam = $scope.teams[i].name;
			}
		}
	};
});
