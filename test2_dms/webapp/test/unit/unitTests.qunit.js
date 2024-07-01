/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"taqatest/test2_dms/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
