/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comtaqatravelreports/ztravel_reports/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
