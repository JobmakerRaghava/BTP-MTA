sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Input",
    "sap/m/DatePicker",
    "sap/m/TextArea",
    "sap/m/TimePicker",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "../model/formatter",
    "sap/m/Token"


], function (
    Controller,
    JSONModel,
    Input,
    DatePicker,
    TextArea,
    TimePicker,
    Filter,
    FilterOperator,
    MessageBox,
    formatter,
    Token
) {
    "use strict";

    return Controller.extend("taqaadmintravelreq.controller.BaseController", {

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
                pDialog.setTitle(name)
                pDialog.open();
            });
        },
        declareModel: function (modelName) {
            this.getView().setModel(new JSONModel({}), modelName);
        },
        ReadOdata: function (oModel, sPath, oFilters) {
            return new Promise(function (resolve, reject) {
                oModel.read(sPath, {
                    filters: oFilters,
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                })
            })
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
        ValueStateNone: function (that) {
            var aFields = that.getView().findAggregatedObjects(true, function (oControl) {
                return oControl instanceof Input || oControl instanceof DatePicker || oControl instanceof TextArea || oControl instanceof TimePicker;
            });
            for (var i = 0; i < aFields.length; i++) {
                var oField = aFields[i];
                oField.setValueState("None");
            }
        },
        mappingModels: function () {
            var oFinalModel = this.getView().getModel("form").getData(),
                oPerPersonModel = this.getView().getModel("PerPerson").getData(),
                oPerPersonalModel = this.getView().getModel("PerPersonal").getData(),
                oEmpjobModel = this.getView().getModel("EmpJob").getData();

            oFinalModel.EmployeeID = oPerPersonModel.personIdExternal;
            oFinalModel.EmployeeFirstName = oPerPersonalModel.firstName;
            oFinalModel.EmployeeMiddleName = oPerPersonalModel.middleName;
            oFinalModel.EmployeeLastName = oPerPersonalModel.lastName;
            oFinalModel.Gender = oPerPersonalModel.gender;
            // oFinalModel.Position = 
            oFinalModel.LeaveSchedule = oEmpjobModel.workscheduleCode;
            oFinalModel.CompanyCode = oEmpjobModel.company;
            oFinalModel.HomeCountry = oPerPersonModel.countryOfBirth;
            oFinalModel.Deparment = oEmpjobModel.department;
            oFinalModel.Division = oEmpjobModel.division;
            oFinalModel.Function = oEmpjobModel.businessUnit;
            oFinalModel.DateOfBirth = formatter.dateChange(oPerPersonModel.dateOfBirth);

            // oFinalModel.ContactNo = 
            oFinalModel.ReportingManager = oEmpjobModel.managerId;
            // oFinalModel.JobDetails = 
            oFinalModel.Location = oEmpjobModel.location;
            // oFinalModel.Grade =
            oFinalModel.TravelType = this.getView().getModel("visible").getData().trvtype;
            // oFinalModel.Status = (text === 'Save As Draft' ? "Drafted" : "Submitted");
            // oFinalModel.TravelId = JSON.stringify(new Date());
            oFinalModel.TravelId = new Date().toISOString();

            delete oFinalModel.Sector2;
            delete oFinalModel.Time2;
            this.getView().getModel("form").refresh();
            return oFinalModel;

        },
        CRDoData: function (oModel, sPath, oPayload) {
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
        Tablerefresh: function (vUUID) {
            var that = this,
                oModel = this.getOwnerComponent().getModel("taqa-srv"),
                filtersEmpID = new Array(),
                filterByEmpID;
            filterByEmpID = new Filter("EmployeeID", FilterOperator.EQ, vUUID);
            filtersEmpID.push(filterByEmpID);

            return new Promise(function (resolve, reject) {
                oModel.read("/TravelDetails", {
                    filters: filtersEmpID,
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                })
            })
        },

        dateFormatChange: function (sValue) {
            var odataformat = sValue + "T03:00:00";
            return odataformat
        },

        ReissuanceRefNo: function () {
            var vEmpID = this.getView().getModel("PerPerson").getData().personIdExternal,
                oModel = this.getOwnerComponent().getModel("taqa-srv"),
                sPath = "/TravelDetails",
                filtersEmpId = new Array(),
                filterById;
            filterById = new Filter("EmployeeID", FilterOperator.EQ, vEmpID);
            filtersEmpId.push(filterById);

            this.ReadOdata(oModel, sPath, filtersEmpId).then((odata) => {
                this.getView().getModel("Reissuance").setData(odata.results);

            }).catch((oError) => {

                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
            });
        },

        CheckRequired: function () {
            var aFields = this.getView().findAggregatedObjects(true, function (oControl) {
                return oControl instanceof Input || oControl instanceof DatePicker || oControl instanceof TextArea || oControl instanceof TimePicker;
            });
            var sCheck = 0;
            for (var i = 0; i < aFields.length; i++) {
                var oField = aFields[i];
                if (oField.getRequired() === true && oField.getVisible() === true) {
                    var sValue;

                    if (oField instanceof Input || oField instanceof TextArea) {
                        sValue = oField.getValue().trim();
                    } else if (oField instanceof DatePicker || oField instanceof TimePicker) {
                        sValue = oField.getDateValue();
                    }

                    if (!sValue) {
                        oField.setValueState("Error");
                        oField.setValueStateText("Please enter data to Field.");
                        sCheck += 1;
                    } else {
                        oField.setValueState("None");
                    }
                }

            }
            return sCheck;
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
                {
                    path: '/PerEmergencyContacts',
                    parameters: { expand: "relationshipNav/picklistLabels" },
                    template: templates,
                    filters: filtersEmpId
                });

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



    });
});