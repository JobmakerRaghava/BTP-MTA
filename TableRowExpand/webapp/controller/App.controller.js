sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.trail.TableRowExpand.controller.App", {
		onTableRowSelect: function (oEvent) {
			console.log("ola");
		},
		onRowShiftAction: function (oEvent) {
			var oSource = oEvent.getSource(),
				oRow = oSource.getParent();
			if (oSource.getSrc() === "sap-icon://expand") {
				oSource.setSrc("sap-icon://collapse");
				oRow.getCells()[5].setVisible(true);
			} else {
				oSource.setSrc("sap-icon://expand");
				oRow.getCells()[5].setVisible(false);
			}
		}
	});
});