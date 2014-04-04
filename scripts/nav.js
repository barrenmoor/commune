angular.module('jive', ['ngRoute', 'components'])

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
	$http.get('basic').success(function(basicData) {
		$scope.brand = basicData.brand;
		$http.get('teams').success(function(teamSummary) {
			$scope.teams = teamSummary.teams;
		});
	});
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

			$scope.confirmDelete = function(teamId, sprintId, sprintName) {
				$scope.delete.teamId = teamId;
				$scope.delete.sprintId = sprintId;
				$scope.delete.sprintName = sprintName;
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
		$scope.action = "ADD";

		$scope.save = function() {
			$scope.sprintDays = $('.datePicker').datepicker('getUTCDates');

			if(!$scope.title || $scope.title.length == 0 || $scope.sprintDays.length == 0) {
				angular.element('#alert').show();
				return;
			}

			var sprint = {
				name : $scope.title,
				dates : $scope.sprintDays,
				done : 0
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
	$scope.action = "EDIT";

	$http.get('teams/' + teamId).success(function(team) {
		$scope.selectedTeam = team.name;
		$scope.teamId = teamId;

		$http.get('teams/' + teamId + '/sprints/' + sprintId).success(function(sprint) {
			var utils = new CommuneUtils();
			$scope.title = sprint.name;
			$scope.stories = sprint.stories;
			$scope.done = sprint.done;
			$scope.sprintDays = utils.convertToDate(sprint.dates);
			$scope.sprintDays.sort(utils.date_sort_asc);

			$scope.save = function() {
				angular.element('#warning').on('hidden.bs.modal', function(e) {
					var storyTransformer = new StoryTransformer();
					
					var newDates = $('.datePicker').datepicker('getUTCDates');

					if(!$scope.title || $scope.title.length == 0 || newDates.length == 0) {
						angular.element('#alert').show();
						return;
					}

					newDates.sort(utils.date_sort_asc);
					var updated = storyTransformer.getUpdatedStoriesAndDone($scope.sprintDays, newDates, $scope.done, $scope.stories);

					$scope.sprintDays = newDates;

					var sprint = {
						name : $scope.title,
						done : updated.done,
						dates : $scope.sprintDays,
						stories : updated.stories
					};

					$http.put('teams/' + teamId + '/sprints/' + sprintId, sprint).success(function() {
						$location.path('team/' + teamId);
					})
					.error(function() {
						console.log('error occurred in put');
					});
				});
			};
		});
	});
})

.controller('ShowSprintCtrl', function($scope, $http, $routeParams, $route, $timeout) {
	var teamId = $routeParams.teamId;
	var sprintId = $routeParams.sprintId;

	$http.get('teams/' + teamId).success(function(team) {
		var chart;
		var showsprint = {};
		$scope.showsprint = showsprint;

		showsprint.selectedTeam = team.name,
		showsprint.teamId = teamId
		showsprint.members = team.members;
		showsprint.statuses = ["New", "In Progress", "Completed", "Blocked", "Descoped"];

		$http.get('teams/' + teamId + '/sprints/' + sprintId).success(function(sprint) {
			var utils = new CommuneUtils();
			var storyTransformer = new StoryTransformer();

			showsprint.title = sprint.name;
			showsprint.sprintDays = utils.convertToDate(sprint.dates).sort(utils.date_sort_asc);
			showsprint.done = sprint.done;
			showsprint.startDate = utils.formatDateLong(showsprint.sprintDays[0]);
			showsprint.endDate = utils.formatDateLong(showsprint.sprintDays[showsprint.sprintDays.length - 1]);
			showsprint.sprintItems = storyTransformer.flattenStories(sprint.stories);
			showsprint.storyspan = showsprint.sprintDays.length + 5;
			showsprint.shortDates = utils.formatDateShort(showsprint.sprintDays);
			showsprint.checkboxValues = storyTransformer.getCheckboxValues(sprint.done);

			showsprint.edit = function(id) {
				var index = utils.findById(showsprint.sprintItems, id);
				if(index != -1) {
					showsprint.edit[id] = angular.copy(showsprint.sprintItems[index]);
				}

				angular.element("#tablerow-" + id + " .cellLabel").hide();
				angular.element("#tablerow-" + id + " .cellEdit").show();
			};

			showsprint.save = function(id) {
				var deepenedStories = {stories : storyTransformer.deepenStories(showsprint.sprintItems)};

				$http.put('teams/' + teamId + '/sprints/' + sprintId + '/tasks', deepenedStories).success(function(){
					if(id) {
						angular.element("#tablerow-" + id + " .cellLabel").show();
						angular.element("#tablerow-" + id + " .cellEdit").hide();
						showsprint.updateChart();						
					}
				})
				.error(function() {
					console.log('error occurred in put');
				});
			};

			showsprint.cancel = function(id) {
				var index = utils.findById(showsprint.sprintItems, id);
				if(index != -1) {
					showsprint.sprintItems[index] = showsprint.edit[id];
				}

				angular.element("#tablerow-" + id + " .cellEdit").hide();
				angular.element("#tablerow-" + id + " .cellLabel").show();
			}

			showsprint.addStory = function() {
				var id = utils.makeId();
				showsprint.sprintItems.push({type : "STORY", id : id});

				$timeout(function() {
					showsprint.edit(id);
				}, 100);
			};

			showsprint.addTask = function(id) {
				var findTaskIndexAndPosition = function(startIndex) {
					var taskIndex = 0;
					while(startIndex < showsprint.sprintItems.length) {
						if(showsprint.sprintItems[startIndex].type == "STORY") {
							return {index : taskIndex, position : startIndex};
						}
						taskIndex++;
						startIndex++;
					}
					return {index : taskIndex, position : startIndex};
				};

				var taskId = utils.makeId();
				var taskIndexAndPosition;

				for(var i in showsprint.sprintItems) {
					if(id == showsprint.sprintItems[i].id) {
						taskIndexAndPosition = findTaskIndexAndPosition(parseInt(i) + 1);
					}
				}

				var task = {
					index : taskIndexAndPosition.index,
					type : "TASK",
					id : taskId,
					status : "New",
					remaining : []
				};

				showsprint.sprintItems.splice(taskIndexAndPosition.position, 0, task);

				$timeout(function() {
					showsprint.edit(taskId);
				}, 100);
			};

			showsprint.delete = function() {
				var findTaskCount = function(startIndex) {
					var taskCount = 0;
					while(startIndex < showsprint.sprintItems.length && showsprint.sprintItems[startIndex++].type != "STORY") {
						taskCount++;
					}
					return taskCount;
				};

				var updateTaskIndices = function(startIndex) {
					while(startIndex < showsprint.sprintItems.length && showsprint.sprintItems[startIndex].type != "STORY") {
						showsprint.sprintItems[startIndex].index--;
						startIndex++;
					}
				};

				var index = -1;
				for(var i in showsprint.sprintItems) {
					if(showsprint.delete.itemId == showsprint.sprintItems[i].id) {
						index = parseInt(i);
						break;
					}
				}

				if(index >= 0) {
					var subItemCount = showsprint.sprintItems[index].type == "STORY" ? findTaskCount(index + 1) : 0;
					updateTaskIndices(index + 1);
					showsprint.sprintItems.splice(index, subItemCount + 1);

					var deepenedStories = {stories : storyTransformer.deepenStories(showsprint.sprintItems)};

					$http.put('teams/' + teamId + '/sprints/' + sprintId + '/tasks', deepenedStories).success(function(){
						showsprint.updateChart();
					})
					.error(function() {
						console.log('error occurred in put');
					});
				}
			};

			showsprint.confirmDelete = function(id) {
				for(var i in showsprint.sprintItems) {
					if(id == showsprint.sprintItems[i].id) {
						showsprint.delete.itemType = showsprint.sprintItems[i].type.toLowerCase();
						showsprint.delete.itemName = showsprint.sprintItems[i].name;
						showsprint.delete.itemId = id;
					}
				}
			};

			showsprint.updateChart = function(index) {
				var storyTransformer = new StoryTransformer();

				if(index >= 0) {
					if(showsprint.checkboxValues[index] == "unchecked") {
						showsprint.checkboxValues = storyTransformer.getCheckboxValues(index);
						showsprint.done = index;

					} else if(showsprint.checkboxValues[index] == "checked") {
						showsprint.checkboxValues = storyTransformer.getCheckboxValues(index + 1);
						showsprint.done = index + 1;

						storyTransformer.copyValues(showsprint.sprintItems, index);
						showsprint.save();
					}

					$http.put('teams/' + teamId + '/sprints/' + sprintId, {done : showsprint.done}).success(function() {
						//do nothing
					})
					.error(function() {
						console.log('update sprint:done failed');
					});
				}

				var chartData = storyTransformer.getChartData(showsprint.sprintDays, showsprint.done, showsprint.sprintItems);

				if(!chart) {
					chart = nv.addGraph(function() {
						var chart = nv.models.lineChart()
							.useInteractiveGuideline(true)
							.margin({top: 5, right: 100, bottom: 50, left: 100})
							.showLegend(true)
							.showYAxis(true)
							.showXAxis(true)
							.x(function(d,i) { return i })
							.y(function(d,i) {return d[1] });
						;

						chart.xAxis
							.axisLabel('Sprint Days')
							.tickFormat(function(d) {
								if(chartData[0].values[d] && chartData[0].values[d][0] == "") {
									return d3.time.format('');
								}
								var dx = chartData[0].values[d] && chartData[0].values[d][0] || 0;
								return d3.time.format('%m/%d')(new Date(dx))
							});

						chart.yAxis //Chart y-axis settings
							.axisLabel('Remaining')
							.tickFormat(d3.format(',f'));

						d3.select('#chart svg')
							.datum(chartData)
							.transition()
							.duration(350)
							.call(chart);

						nv.utils.windowResize(chart.update); 
						return chart;
					});
				} else {
					chart.update();
				}
			};

			showsprint.updateChart();
		});
	});
});







