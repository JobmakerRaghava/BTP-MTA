sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
], function (
    Controller,
    JSONModel,
    Token,
    Filter,
    FilterOperator,
    History,
    UIComponent
) {
    "use strict";

    return Controller.extend("taqa.travelnewmdf.controller.BaseController", {
        openDialog: function (name, path) {
            let sname = name;
            this.mDialogs = this.mDialogs || {};
            let oDialog = this.mDialogs[sname];
            if (!oDialog) {
                oDialog = this.loadFragment({
                    name: path,
                    type: "XML",
                    controller: this

                });
                this.mDialogs[sname] = oDialog;
            }
            oDialog.then(function (pDialog) {
                pDialog.setTitle(name)
                pDialog.open();
            });
        },
        declareModel: function (modelName) {
            // this.getView().setModel(new JSONModel({}), modelName);
            this.getOwnerComponent().setModel(new JSONModel({}), modelName);
        },
        TableSelectDialogSearch: function (oEvent) {
            let sValue = oEvent.getParameter("value");
            let oFilter = new Filter("externalCode", FilterOperator.Contains, sValue);
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        TableSelectDialogConfirm: function (oEvent, ID) {
            let oMultiInput = this.byId(ID);
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);

            let aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
                aContexts.forEach(oContexts => {
                    oMultiInput.addToken(new Token({
                        text: oContexts.getObject().externalCode
                    }));

                });

            }
        },
        onNavBack: function () {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("Route", {}/*no history*/);
			}
            this.getOwnerComponent().getModel("visible").setData({});
		},
        ReadOdata: function (oModel, sPath, oFilters, expand) {
            return new Promise(function (resolve, reject) {
                oModel.read(sPath, {
                    filters: oFilters,
                    urlParameters: { "$expand": expand },
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(new Error(oError));
                    }
                })
            })
        },
        CreateoData: function (oModel, sPath, oPayload) {
            return new Promise(function (resolve, reject) {
                oModel.create(sPath, oPayload, {
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                })
            })
        },
        UpdateRecord: function (oModel, sPath, oPayload) {
            return new Promise(function (resolve, reject) {
                oModel.update(sPath, oPayload, {
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                })
            })
        },
        DeleteRecord: function (oModel, sPath) {
            return new Promise(function (resolve, reject) {
                oModel.remove(sPath, {
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                })
            })
        },
        FieldsHide: function (oJson, value1, value2, value3, value4, value5,value6) {


            oJson.BusinessDates = value1;
            oJson.AnualDate = value2;
            oJson.RotationDate = value3;
            oJson.TrainingDate = value4;
            oJson.NationalID = value5;
            oJson.ext = value6;
           

            this.getView().getModel("visible").updateBindings(true);

        },

    });
});