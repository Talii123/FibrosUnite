
function initFeatures(FEATURES, featuresToEnable) {

	featuresToEnable = featuresToEnable || {};

	$.each(featuresToEnable, setEnabledFeature);
	$.each(FEATURES, setEnabledFeatureByURL);
	$.each(FEATURES, setupFeature);

	function setEnabledFeature (featureName, isEnabled) {
		var feature = FEATURES[featureName];
		if (typeof feature != "undefined") {
			feature.enabled = isEnabled;
		} else {
			console.error("'" + featureName + "' is not a valid feature");
		}
	}

	function setEnabledFeatureByURL (featureName) {
		var feature;
		if (location.search.indexOf(featureName) >= 0) {
			feature = FEATURES[featureName];
			feature.enabled = true;
			feature.enabledByUrl = true;
		}
	}

	function setupFeature (featureID, featureDefinition) {
		var builder,
			instance,
			callback;

		if (!featureDefinition) {
			console.error("Invalid feature definition for feature: ", featureID);
			return;
		}
		if (!featureDefinition.enabled) {
			console.log("Not enabling feature '" + featureID + "'");
			return;
		}

		if (featureDefinition.requires) {
			var requires = featureDefinition.requires;

			if (requires.test && !requires.test()) {
				loadScript(requires.url, function() {
					setupInstance(featureDefinition);
				});
			} else {
				setupInstance(featureDefinition);
			}
		}
		else {
			setupInstance(featureDefinition);
		}
	}

	function setupInstance (featureDefinition) {
		console.log("setting up feature " + featureDefinition.name + "...");
		instance = featureDefinition.builder();
		instance.init();
		featureDefinition.instance = instance;
		console.log("DONE setting up feature " + featureDefinition.name);			
	}

	function loadScript(url, onLoadCB) {
		function loadLocalScript(url, onLoadCB) {
			var scriptTag;

			console.log("loading local script from url: ", url);

			scriptTag = document.createElement("script");
			scriptTag.type= 'text/javascript';
		    scriptTag.onreadystatechange= function () {
		      if (this.readyState == 'complete') onLoadCB();
		    }
		    scriptTag.onload= onLoadCB;
			scriptTag.src = url;
			console.log("adding script tag to page");
			document.getElementsByTagName('head')[0].appendChild(scriptTag);
		}

		function loadRemoteScript(url, onLoadCB) {
			console.log("loading remote script from url: ", url);
			$.getScript(url).done(onLoadCB).error(function() {
				console.error("Error while loading script; arguments: ", arguments);
			});									
		}

		if (location) {
			if (location.protocol != "file:") {
				loadRemoteScript(url, onLoadCB);
			} else {
				loadLocalScript(url, onLoadCB);
			}
		}
		else {
			console.error("Can't load script; not in a browser environment.");
		}
	}

}

