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
		}
	};
}