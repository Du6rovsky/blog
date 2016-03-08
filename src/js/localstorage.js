'use strict';

/**
* Local storage usage.
*
*/

module.exports = {
	// Fetch array.
	fetchArray: function(key) {
		if (localStorage.getItem(key)) {
			return JSON.parse(localStorage.getItem(key));
		}

		return [];
	},

	// Save array.
	saveArray: function(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	}
};
