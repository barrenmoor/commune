var StoryTransformer = function () {
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
		}
	};
}