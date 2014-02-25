var CommuneUtils = function() {
	return {
		formatDateLong : function(d) {
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

			var month = months[d.getMonth()];
			var date = d.getDate();
			var year = d.getFullYear();
			var day = days[d.getDay()];

			return month + ' ' + date + ', ' + year + ', ' + day;
		},

		formatDateShort : function(d) {
			if(Object.prototype.toString.call(d) === '[object Array]') {
				var dates = [];
				for(var i in d) {
					dates.push((d[i].getMonth() + 1) + '/' + d[i].getDate());
				}
				return dates;
			} else {
				return (d.getMonth() + 1) + '/' + d.getDate();
			}
		},

		date_sort_asc : function (date1, date2) {
			if (date1.getTime() < date2.getTime()) {
				return -1;
			} else if (date1.getTime() > date2.getTime()) {
				return 1;
			} else {
				return 0;
			}
		},

		convertToDate : function(arr) {
			if(Object.prototype.toString.call(arr) === '[object Array]') {
				var dates = [];
				for(var i in arr) {
					dates.push(new Date(arr[i]));
				}
				return dates;
			} else {
				return new Date(arr);
			}
		},

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
		}
	};
}