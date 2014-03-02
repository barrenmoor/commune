var StoryTransformer = function () {
	var getRemainingTotal = function(stories, day) {
		if(!day) {
			day = 0;
		}

		var total = 0;
		for(var i in stories) {
			if(stories[i].type == "STORY") {
				continue;
			} else {
				if(stories[i].remaining[day]) {
					total += parseInt(stories[i].remaining[day]);
				}
			}
		}
		return total;
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

		getRemainingDone : function(done) {
			var remainingdone = [];
			for(var i = 0; i <= done; i++) {
				remainingdone.push("checked");
			}

			return remainingdone;
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

			var totalPlanned = getRemainingTotal(sprintItems, 0);
			var values = [ ["", totalPlanned] ];

			var numDays = sprintDays.length;
			var dailyReduce = totalPlanned / numDays;

			for(var i = 0; i < numDays; i++) {
				values.push([sprintDays[i].getTime(), totalPlanned - ((i + 1) * dailyReduce)]);
			}

			ideal.values = values;

			values = [ ["", totalPlanned] ];
			for(var i = 0 ; i < done; i++) {
				values.push([sprintDays[i].getTime(), getRemainingTotal(sprintItems, (i + 1))]);
			}
			actual.values = values;

			return [ideal, actual];
		},

		copyValues : function(sprintItems, index) {
			for(var i in sprintItems) {
				if(sprintItems[i].type == "TASK") {
					if(!sprintItems[i].remaining[index]) {
						sprintItems[i].remaining[index] = sprintItems[i].remaining[index - 1];
					}
				}
			}
		}
	};
}