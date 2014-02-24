angular.module('navig', ['ngRoute', 'components'])

.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			controller : 'MainCtrl',
			templateUrl : 'main.html'
		})
		.when('/team/:teamId', {
			controller : 'TeamCtrl',
			templateUrl : 'team.html'
		})
		.when('/team/:teamId/addsprint', {
			controller : 'AddSprintCtrl',
			templateUrl : 'addeditsprint.html'
		})
		.when('/team/:teamId/editsprint/:sprintId', {
			controller : 'EditSprintCtrl',
			templateUrl : 'addeditsprint.html'			
		});
})

.controller('MainCtrl', function($scope, $http, $location, $routeParams){
})

.controller('TeamCtrl', function($scope, $http, $routeParams, $route) {
	var teamId = $routeParams.teamId;

	$http.get('teams/' + teamId).success(function(team) {
		$scope.selectedTeam = team.name;
		$scope.teamMembers = team.members;
		$scope.desc = team.desc;
		$scope.teamId = teamId;

		$http.get('teams/' + teamId + '/sprints').success(function(teamSprints){

			var sprints = [];

			for(var i in teamSprints) {
				teamSprints[i].dates.sort();
				var numDays = teamSprints[i].dates.length;

				var utils = new CommuneUtils();
				var startDate = utils.formatDate(new Date(teamSprints[i].dates[0]));
				var endDate = utils.formatDate(new Date(teamSprints[i].dates[numDays - 1]));

				sprints.push({
					id : teamSprints[i].id,
					name : teamSprints[i].name,
					startDate : startDate,
					endDate : endDate
				});
			}

			$scope.sprints = sprints;

			$scope.delete = function() {
				angular.element('#warning').on('hidden.bs.modal', function(e) {
					$http.delete('teams/' + $scope.delete.teamId + '/sprints/' + $scope.delete.sprintId).success(function() {
						$route.reload();
					})
					.error(function() {
						console.log('some error occurred in delete');
					});
				});
			};

			$scope.confirmDelete = function(teamId, sprintId) {
				$scope.delete.teamId = teamId;
				$scope.delete.sprintId = sprintId;
			};
		});
	});
})

.controller('AddSprintCtrl', function($scope, $http, $routeParams, $location) {
	var teamId = $routeParams.teamId;
	$http.get('teams/' + teamId).success(function(team) {
		$scope.selectedTeam = team.name;
		$scope.teamId = teamId;

		$scope.save = function() {
			$scope.sprintDays = $('.datePicker').datepicker('getUTCDates');

			var sprint = {
				name : $scope.title,
				dates : $scope.sprintDays
			};

			$http.post('teams/' + teamId + '/sprints', sprint).success(function() {
				$location.path('team/' + teamId);
			})
			.error(function() {
				console.log('error occurred in post');
			});
		}
	});
})

.controller('EditSprintCtrl', function($scope, $http, $routeParams, $location) {
	var teamId = $routeParams.teamId;
	var sprintId = $routeParams.sprintId;

	$http.get('teams/' + teamId).success(function(team) {
		$scope.selectedTeam = team.name;
		$scope.teamId = teamId;

		$http.get('teams/' + teamId + '/sprints/' + sprintId).success(function(sprint) {
			$scope.title = sprint.name;

			$scope.sprintDays = [];
			for(var i in sprint.dates) {
				$scope.sprintDays.push(new Date(sprint.dates[i]));
			}

			$scope.sprintDays.sort();

			$scope.save = function() {
				$scope.sprintDays = $('.datePicker').datepicker('getUTCDates');
				var sprint = {
					name : $scope.title,
					dates : $scope.sprintDays
				};

				$http.put('teams/' + teamId + '/sprints/' + sprintId, sprint).success(function() {
					$location.path('team/' + teamId);
				})
				.error(function() {
					console.log('error occurred in put');
				});

			};
		});
	});
});







