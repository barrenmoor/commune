angular.module('navig', ['ngRoute', 'components'])

.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			controller : 'MainCtrl',
			templateUrl : 'main.html'
		}).
		when('/selectteam/:teamId', {
			controller : 'TeamCtrl',
			templateUrl : 'team.html'
		});
})

.controller('MainCtrl', function($scope, $http, $location, $routeParams){
})

.controller('TeamCtrl', function($scope, $http, $routeParams) {
	$http.get('teams/' + $routeParams.teamId).success(function(data) {
		$scope.selectedTeam = data.name;
	});
});
