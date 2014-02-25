angular.module('commune', ['ngRoute', 'components'])

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
		})
		.when('/team/:teamId/showsprint/:sprintId', {
			controller : 'ShowSprintCtrl',
			templateUrl : 'showsprint.html'			
		});
})

.controller('MainCtrl', function($scope, $http, $location, $routeParams){
})

.controller('TeamCtrl', function($scope, $http, $routeParams, $route, $location) {
	var teamId = $routeParams.teamId;

	$http.get('teams/' + teamId).success(function(team) {
		$scope.selectedTeam = team.name;
		$scope.teamMembers = team.members;
		$scope.desc = team.desc;
		$scope.teamId = teamId;

		$http.get('teams/' + teamId + '/sprints').success(function(teamSprints){

			var sprints = [];

			for(var i in teamSprints) {
				var utils = new CommuneUtils();
				var sprintDays = utils.convertToDate(teamSprints[i].dates);

				sprintDays.sort(utils.date_sort_asc);
				var numDays = sprintDays.length;
				
				var startDate = utils.formatDateLong(new Date(sprintDays[0]));
				var endDate = utils.formatDateLong(new Date(sprintDays[numDays - 1]));

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

			$scope.edit = function(teamId, sprintId) {
				$location.path('/team/' + teamId + '/editsprint/' + sprintId);
			}
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
			var utils = new CommuneUtils();
			$scope.title = sprint.name;

			$scope.sprintDays = utils.convertToDate(sprint.dates);
			$scope.sprintDays.sort(utils.date_sort_asc);

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
})

.controller('ShowSprintCtrl', function($scope, $http, $routeParams) {
	var teamId = $routeParams.teamId;
	var sprintId = $routeParams.sprintId;

	$http.get('teams/' + teamId).success(function(team) {
		var showsprint = {};
		$scope.showsprint = showsprint;

		showsprint.selectedTeam = team.name,
		showsprint.teamId = teamId
		showsprint.members = team.members;
		showsprint.statuses = ["New", "In Progress", "Completed", "Blocked", "Descoped"];

		$http.get('teams/' + teamId + '/sprints/' + sprintId).success(function(sprint) {
			var utils = new CommuneUtils();

			showsprint.title = sprint.name;
			showsprint.sprintDays = utils.convertToDate(sprint.dates).sort(utils.date_sort_asc);
			showsprint.startDate = utils.formatDateLong(showsprint.sprintDays[0]);
			showsprint.endDate = utils.formatDateLong(showsprint.sprintDays[showsprint.sprintDays.length - 1]);
			showsprint.sprintItems = utils.flattenStories(sprint.stories);
			showsprint.storyspan = showsprint.sprintDays.length + 5;
			showsprint.shortDates = utils.formatDateShort(showsprint.sprintDays);

			showsprint.edit = function(id) {
				angular.element("#tablerow-" + id + " .cellLabel").hide();
				angular.element("#tablerow-" + id + " .cellEdit").show();
			};

			showsprint.save = function(id) {
				var deepenedStories = {stories : utils.deepenStories(showsprint.sprintItems)};

				$http.put('teams/' + teamId + '/sprints/' + sprintId + '/tasks', deepenedStories).success(function(){
					angular.element("#tablerow-" + id + " .cellLabel").show();
					angular.element("#tablerow-" + id + " .cellEdit").hide();
				})
				.error(function() {
					console.log('error occurred in put');
				});
			};
		});
	});
});







