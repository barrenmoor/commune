var CommuneUtils = function() {
	return {
		formatDate : function(d) {
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

			var month = months[d.getMonth()];
			var date = d.getDate();
			var year = d.getFullYear();
			var day = days[d.getDay()];

			return month + ' ' + date + ', ' + year + ', ' + day;
		},

		date_sort_asc : function (date1, date2) {
			// This is a comparison function that will result in dates being sorted in
			// ASCENDING order.
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
		}
	};
}