angular.module('components', [])

.directive('navbar', function(){
	return {
		restrict : 'E',
		transclude : true,
		scope : {selectedTeam : "@"},
		template : '<nav class="navbar navbar-default navbar-fixed-top" role="navigation">' +
			'<div class="container-fluid">' +
				'<div class="navbar-header">' +
				'<a class="navbar-brand" href="#/">{{brand}}</a>' +
				'</div>' +
				'<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">' +
					'<div class="nav navbar-nav btn-group">' +
						'<button type="button" class="btn btn-default navbar-btn">{{selectedTeam}}</button>' +
						'<button type="button" class="btn btn-default navbar-btn dropdown-toggle" data-toggle="dropdown">' +
							'<span class="caret"></span>' +
							'<span class="sr-only">Toggle Dropdown</span>' +
						'</button>' +
						'<ul class="dropdown-menu" role="menu">' +
							'<li ng-repeat="team in teams"><a href="#/team/{{team.id}}">{{team.name}}</a></li>' +
						'</ul>' +
					'</div>' +
					'<form class="navbar-form navbar-left" role="search">' +
						'<div class="form-group">' +
							'<input type="text" class="form-control" placeholder="Search">' +
						'</div>' +
						'<button type="button" class="btn btn-default"><span class="glyphicon glyphicon-search"></span></button>' +
					'</form>' +
					'<ul class="nav navbar-nav navbar-right">' +
						'<li><a href="#/"><span class="glyphicon glyphicon-refresh"></span> Refresh</a></li>' +
					'</ul>' +
				'</div>' +
			'</div>' +
			'</nav>',
		replace : true,
		controller : function($scope, $element, $http) {
			$http.get('basic').success(function(basicData) {
				$scope.brand = basicData.brand;
				$http.get('teams').success(function(teamSummary) {
					$scope.teams = teamSummary.teams;
					$scope.selectedTeam = $element.attr("selectedTeam");
				});
			});
		}
	};
});