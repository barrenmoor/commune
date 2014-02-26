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

		makeId : function() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for(var i = 0; i < 5; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			return text;
		}
	};
}