/*global QUnit*/

sap.ui.define([
	"comtaqatravelreports/ztravel_reports/controller/ReportsView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ReportsView Controller");

	QUnit.test("I should test the ReportsView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
