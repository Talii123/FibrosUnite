
function supportsStorageType(storageType) {
  try {
    return storageType in window && window[storageType] !== null;
  } catch(e){
    return false;
  }
}

function persistForSession(key, value) {
	console.log("\n persistForSession(", key, ", ", value, "); \n");
/*	if (supportsStorageType('sessionStorage')) {
		console.log('Using sessionStorage to persist things for this session.');
		persistForSession = function(key, value) {
			console.log("\n persistForSession(", key, ", ", value, "); \n");
			return window.sessionStorage[key] = value;
		}
	}
	else {*/
		console.log('Using cookies to persist things for this session.');
		persistForSession = function(key, value) {
			console.log("\n persistForSession(", key, ", ", value, "); \n");
			return $.cookie(key, value);
		}
	//}

	persistForSession(key, value);
}

function persist(key, value) {
	console.log("\n persist(", key, ", ", value, "); \n");
/*	if (supportsStorageType('localStorage')) {
		console.log('Using localStorage to persist things across sessions.');
		persist = function(key, value) {
			console.log("\n persist(", key, ", ", value, "); \n");
			return window.localStorage[key] = value;
		}
	}
	else {*/
		console.log('Using cookies to persist things.');
		persist = function(key, value) {
			console.log("\n persist(", key, ", ", value, "); \n");
			return $.cookie(key, value, { expires: 365 });
		}
//	}

	persist(key, value);
}

function getPersistedForSession(key) {
	console.log("\n getPersistedForSession(", key, "); \n");
/*	if (supportsStorageType('sessionStorage')) {
		console.log('Using sessionStorage to persist things for this session.');
		getPersistedForSession = function(key) {
			var persisted = window.sessionStorage[key];
			console.log("\n getPersistedForSession(", key, ") -> ", persisted);
			return persisted;
		}
	}
	else {*/
		console.log('Using cookies to get things persisted for this session.');
		getPersistedForSession = function(key) {
			var persisted = $.cookie(key);
			console.log("\n getPersistedForSession(", key, ") -> ", persisted);
			return persisted;
		}
//	}

	return getPersistedForSession(key);
}

function getPersisted(key) {
	console.log("\n getPersisted(", key, "); \n");
/*	if (supportsStorageType('localStorage')) {
		console.log('Using localStorage to read things persisted across sessions.');
		getPersisted = function(key) {
			var persisted = window.localStorage[key];
			console.log("\n getPersisted(", key, ") -> ", persisted);
			return persisted;
		}
	}
	else {*/
		console.log('Using cookies to get things persisted.');
		getPersisted = function(key) {
			var persisted = $.cookie(key);
			console.log("\n getPersisted(", key, ") -> ", persisted);
			return persisted;
		}
//	}

	return getPersisted(key);
}
