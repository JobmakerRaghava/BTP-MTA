sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (

    Controller,
    JSONModel,
    Token,
    Filter,
    FilterOperator
) {
    "use strict";

    return Controller.extend("taqafocaltravelrequestapp.controller.BaseController", {

        openDialog: function (name, path) {
            var sname = name;
            this.mDialogs = this.mDialogs || {};
            var oDialog = this.mDialogs[sname];
            if (!oDialog) {
                oDialog = this.loadFragment({
                    name: path,
                    type: "XML",
                    controller: this

                });
                this.mDialogs[sname] = oDialog;
            }
            oDialog.then(function (pDialog) {
                pDialog.setTitle(name);
                pDialog.open();
            });
        },
        declareModel: function (modelName) {
            this.getView().setModel(new JSONModel({}), modelName);
        },
        getCount: function () {
            var oTable = this.getView().byId("idTravelDetailsTable"),
                oBinding = oTable.getBinding("items"),
                oModel = this.getView().getModel("RowCount");
            oModel.setProperty("/Count", oBinding.getLength());
        },
        FieldsHide: function (oJson, value1, value2, value3, value4, value5, value6, value7, value8) {
            oJson.focalperson = value1;
            oJson.Region = value2;
            oJson.BusinessStartDate = value2;
            oJson.BusinessEndDate = value2;
            oJson.Hotel = value2;
            oJson.ExitReEntry = value2;
            oJson.ticketcount = value3;
            oJson.Preamount = value4;
            oJson.TrainingDate = value5;
            oJson.ReferenceNo = value6;
            oJson.familytable = value7;
            oJson.reissurance = value8;

            this.getView().getModel("visible").updateBindings(true);

        },
        TableSelectDialogSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("externalCode", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        TableSelectDialogConfirm: function (oEvent, ID) {
            var oMultiInput = this.byId(ID);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);

            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
                aContexts.forEach(oContexts => {
                    oMultiInput.addToken(new Token({
                        text: oContexts.getObject().externalCode
                    }));

                });

            }
        },
        GetFamilyDetails: function (id) {
            var filtersEmpId = new Array(),
                filterById;
            filterById = new Filter("personIdExternal", FilterOperator.EQ, id);
            filtersEmpId.push(filterById);
            var templates = new sap.m.ColumnListItem({
                cells: [
                    new sap.m.Text({
                        text: "{name}"
                    }),
                    new sap.m.Text({
                        text: "{relationship}"
                    }),
                    new sap.m.Text({
                        text: "{phone}"
                    }),
                    new sap.m.Text({
                        text: "{gender}"
                    }),
                    new sap.m.Text({
                        text: "{dateOfBirth}"
                    })
                ]
            });
            this.getView().byId("idTablefamily").bindItems(
                {path:'/PerEmergencyContacts',
                parameters : {expand:"relationshipNav/picklistLabels"},
                template:templates,
                filters:filtersEmpId});

        },
    });
});