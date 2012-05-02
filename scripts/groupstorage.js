window.yammerEnhance = {};

/* Stores groups in localStorage, hooah */
(function() {
	var GroupStorage = function() {},
		storageKey = 'yammerEnhance.groups';

	GroupStorage.prototype = {
		groups: [],

		any: function() {
			return this.groups && this.groups.length > 0;
		},

		reloadFromStorage: function() {
			/* values in localStorage are stored as strings, so 
			 	 we have to dig it out and parse it */
			var value = localStorage[storageKey];
			if (value && value.length > 0) {
				try { 
					this.groups = JSON.parse(value);
				} catch (ex) {
					console.log("error reading from localstorage", ex);
				}
			}
		},
		saveToStorage: function() {
			localStorage[storageKey] = JSON.stringify(this.groups);
		},

		add: function(id) {
			var id = id.toString();
			if (this.groups.indexOf(id) >= 0) return;

			console.log('added to storage - ', id);
			this.groups.push(id);
			this.saveToStorage();
		},
		remove: function(id) {
			var id = id.toString();
			this.groups.splice(this.groups.indexOf(id), 1);
			console.log(this.groups);
			this.saveToStorage();
		}
	};

	window.yammerEnhance.GroupStorage = new GroupStorage();

})();