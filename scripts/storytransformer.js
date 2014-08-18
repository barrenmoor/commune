var StoryTransformer = function () {
	var getRemainingTotal = function(stories, day) {
		var total = 0;
		for(var i in stories) {
			if(stories[i].type == "STORY") {
				continue;
			} else {
				var toSum = day >= 0 ? stories[i].remaining[day] : stories[i].planned;
				if(toSum) {
					total += parseInt(toSum);
				}
			}
		}
		return total;
	};

	var getRemovedDatesIndices = function(oldDates, newDates) {
		var removedIndices = [];
		for(var i in oldDates) {
			var found = false;
			for(var j in newDates) {
				if(oldDates[i].getTime() == newDates[j].getTime()) {
					found = true;
					break;
				}
			}
			if(!found) {
				removedIndices.push(parseInt(i));
			}
		}
		return removedIndices;		
	};

	var getAddedDatesIndices = function(oldDates, newDates) {
		var addedIndices = [];
		for(var i in newDates) {
			var found = false;
			for(var j in oldDates) {
				if(newDates[i].getTime() == oldDates[j].getTime()) {
					found = true;
					break;
				}
			}

			if(!found) {
				addedIndices.push(parseInt(i));
			}
		}
		return addedIndices;
	};

	var cleanOldDates = function(oldDates, removedIndices) {
		for(var i in removedIndices) {
			oldDates.splice(removedIndices[i] - i, 1);
		}
	};

	var cleanTaskEstimates = function(stories, removedIndices) {
		for(var i in stories) {
			for(var j in stories[i].tasks) {
				var task = stories[i].tasks[j];
				var remaining = task.remaining;

				for(var k in removedIndices) {
					remaining.splice(removedIndices[k] - k, 1);
				}
			}
		}		
	};

	var addTaskEstimates = function(done, stories, addedIndices) {
		for(var i in stories) {
			for(var j in stories[i].tasks) {
				var task = stories[i].tasks[j];
				var remaining = task.remaining;

				for(var k in addedIndices) {
					var index = addedIndices[k];
					if(index < done) {
						remaining.splice(index, 0, index == 0 ? task.planned : remaining[index - 1]);
					}
				}
			}
		}
	};

	var findNewDone = function(newDates, doneUpto) {
		var newDone = 0;

		if(!doneUpto) {
			return newDone;
		}
		
		for(var i in newDates) {
			if(newDates[i].getTime() <= doneUpto.getTime()) {
				newDone++;
			}
		}
		return newDone;
	};

	return {
		flattenStories : function(stories) {
			var flattened = [];
			for(var i in stories) {
				var story = stories[i];
				var storyItem = { type : "STORY" };

				storyItem.id = story.id;
				storyItem.name = story.name;

				flattened.push(storyItem);

				for(var j in story.tasks) {
					var task = story.tasks[j];
					var taskItem = { type : "TASK" };

					taskItem.id = task.id;
					taskItem.index = parseInt(task.index);
					taskItem.name = task.name;
					taskItem.status = task.status;
					taskItem.by = task.by;
					taskItem.planned = task.planned;
					taskItem.remaining = task.remaining;

					flattened.push(taskItem);
				}
			}
			return flattened;
		},

		deepenStories : function(flattened) {
			var deepened = [];

			if(!flattened) {
				return deepened;
			}

			for(var i = 0; i < flattened.length; i++) {
				if(flattened[i].type == "STORY") {
					var story = {
						id : flattened[i].id,
						name : flattened[i].name,
						tasks : []
					};
					deepened.push(story);

					for(var j = i + 1; j < flattened.length; j++) {
						if(flattened[j].type == "TASK") {
							var task = {
								id : flattened[j].id,
								index : flattened[j].index,
								name : flattened[j].name,
								status : flattened[j].status,
								by : flattened[j].by,
								planned : flattened[j].planned,
								remaining : flattened[j].remaining
							};
							story.tasks.push(task);
						} else {
							i = j - 1;
							break;
						}
					}
				}
			}

			return deepened;
		},

		getCheckboxValues : function(done) {
			var checkboxValues = [];
			for(var i = 0; i < done; i++) {
				checkboxValues.push("checked");
			}

			return checkboxValues;
		},

		getChartData : function(sprintDays, done, sprintItems) {
			var ideal = {
				key : "Ideal",
				area : true,
				color : "#7777ff"
			};
			var actual = {
				key : "Actual",
				color : "#000000"
			};

			var totalPlanned = getRemainingTotal(sprintItems);
			var values = [ [sprintDays[0].getTime(), totalPlanned] ];

			var numDays = sprintDays.length;
			var dailyReduce = totalPlanned / (numDays - 1);

			for(var i = 1; i < numDays; i++) {
				values.push([sprintDays[i].getTime(), totalPlanned - (i * dailyReduce)]);
			}

			ideal.values = values;

			values = [];
			for(var i = 0 ; i < done; i++) {
				values.push([sprintDays[i].getTime(), getRemainingTotal(sprintItems, i)]);
			}
			actual.values = values;

			return [ideal, actual];
		},

		copyValues : function(sprintItems, index) {
			for(var i in sprintItems) {
				if(sprintItems[i].type == "TASK") {
					if(!sprintItems[i].remaining[index]) {
						sprintItems[i].remaining[index] = index == 0 ? sprintItems[i].planned : sprintItems[i].remaining[index - 1];
					}
				}
			}
		},

		getUpdatedStoriesAndDone : function(oldDates, newDates, done, stories) {
			oldDates = angular.copy(oldDates);
			newDates = angular.copy(newDates);
			stories = angular.copy(stories);

			var doneUpto;
			if(done > 0) {
				doneUpto = oldDates[done - 1];
			}

			var removedIndices = getRemovedDatesIndices(oldDates, newDates);
			cleanOldDates(oldDates, removedIndices);
			cleanTaskEstimates(stories, removedIndices);

			var newDone = findNewDone(newDates, doneUpto);

			if(newDates.length > oldDates.length) {
				var addedIndices = getAddedDatesIndices(oldDates, newDates);
				addTaskEstimates(newDone, stories, addedIndices);
			}

			return {
				done : newDone,
				stories : stories
			};
		}
	};
}
