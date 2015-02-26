(function() {
	var app = angular.module('app');
	app.filter('time', function() {
		return function(ms) {
			function pad(nb){
				var str = nb + '';
				while(str.length < 2){
					str = '0' + str;
				}
				return str;
			}

			var s = Math.floor(ms / 1000);
			
			// Minutes
			var m = Math.floor(s/60);
			s -= m*60;

			// Hours
			var h = Math.floor(m/60);
			m -= h*60;

			// Days
			var days = Math.floor(h/24);
			h -= h*24;

			timeString = pad(h) + ':' + pad(m) + ':' + pad(s);
			
			if (days > 0) timeString += (days > 1) ? (days + " days ") : (days + " day ");
			
			return timeString;
		}
	});
})();