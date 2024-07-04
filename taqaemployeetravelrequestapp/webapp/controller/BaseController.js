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
    "sap/m/ComboBox"


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
    ComboBox

) {
    "use strict";

    return Controller.extend("taqaemployeetravelrequestapp.controller.BaseController", {
        formatter: formatter,
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
                pDialog.open();
            });
        },
        openDialog1: function (name, path) {
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
                pDialog.open();
                pDialog.close();
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
        AutopopulatedFields: function () {
            var oFinalModel = this.getView().getModel("form").getData(),
                oPerPersonModel = this.getView().getModel("PerPerson").getData(),
                oPerPersonalModel = this.getView().getModel("PerPersonal").getData(),
                oEmpjobModel = this.getView().getModel("EmpJob").getData();
            oFinalModel.Age = oPerPersonModel.customLong10;
            oFinalModel.Designation = oEmpjobModel.jobTitle;
            this.getView().getModel("form").refresh();
        },
        mappingModels: function (text) {
            var oFinalModel = this.getView().getModel("form").getData(),
                oPerPersonModel = this.getView().getModel("PerPerson").getData(),
                oPerPersonalModel = this.getView().getModel("PerPersonal").getData(),
                oEmpjobModel = this.getView().getModel("EmpJob").getData();

            oFinalModel.EmployeeID = oPerPersonModel.personIdExternal;
            oFinalModel.EmployeeFirstName = oPerPersonalModel.firstName;
            oFinalModel.EmployeeMiddleName = oPerPersonalModel.middleName;
            oFinalModel.EmployeeLastName = oPerPersonalModel.lastName;
            oFinalModel.Gender = oPerPersonalModel.gender;
            oFinalModel.Position = oEmpjobModel.position;
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
            oFinalModel.Designation = oEmpjobModel.jobTitle;
            oFinalModel.Grade = oEmpjobModel.payGrade;
            oFinalModel.TravelType = this.getView().getModel("visible").getData().trvtype;
            oFinalModel.Status = (text === 'Save As Draft' ? "Drafted" : "Submitted");
            // oFinalModel.TravelId = JSON.stringify(new Date());
            // oFinalModel.TravelId = new Date().toISOString();
            if (!oFinalModel.ID) {
            oFinalModel.TravelId = String(Date.parse(new Date));
            }
            oFinalModel.Age = oPerPersonModel.customLong10;

            // delete oFinalModel.Sector2;
            // delete oFinalModel.Time2;
            // delete oFinalModel.OverseasMobileNumber;
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
                return oControl instanceof Input || oControl instanceof DatePicker || oControl instanceof TextArea || oControl instanceof TimePicker || oControl instanceof ComboBox;
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
                    else if (oField instanceof ComboBox) {
                        sValue = oField.getSelectedKey()
                    }

                    if (!sValue) {
                        oField.setValueState("Error");
                        oField.setValueStateText("Please enter data to Field.");
                        sCheck += 1;
                    } else {
                        oField.setValueState("None");
                    }
                }

            };
            var oFormData = this.getView().getModel("form").getData();
            var oFormData2 = this.getView().getModel("item").getData();
            if (new Date(oFormData2.DepartureDate) <= new Date(oFormData2.ReturnDate) === false && this.getView().byId("idReturnDateDatePicker").getVisible() === true) {
                this.getView().byId("idReturnDateDatePicker").setValueState("Error");
                this.getView().byId("idReturnDateDatePicker").setValueStateText("Return Date must be greater than or equal to Departure Date");
                sCheck += 1;
            }
            if (new Date(oFormData.TrainingStartDate) <= new Date(oFormData.TrainingEndDate) === false && this.getView().byId("idTrainingEndDateDatePicker").getVisible() === true) {
                this.getView().byId("idTrainingEndDateDatePicker").setValueState("Error");
                this.getView().byId("idTrainingEndDateDatePicker").setValueStateText("Training End Date must be greater than or equal to Training Start Date");
                sCheck += 1;
            }
            if (new Date(oFormData.BusStartDate) <= new Date(oFormData.BusEndDate) === false && this.getView().byId("idBusEndDateDatePicker").getVisible() === true) {
                this.getView().byId("idBusEndDateDatePicker").setValueState("Error");
                this.getView().byId("idBusEndDateDatePicker").setValueStateText("Business End Date must be greater than or equal to Business Start Date");
                sCheck += 1;
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

        GetFamilyDetails: function (id) {
            // var filtersEmpId = new Array(),
            //     filterById;
            // filterById = new Filter("personIdExternal", FilterOperator.EQ, id);
            // filtersEmpId.push(filterById);
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

                    template: templates,

                });




        },

        getTicketCount: async function (ID) {
            var oEmpDetails = this.getView().getModel("EmpJob").getData(),
                vRegORrota = oEmpDetails.customString6,
                vWorkscheduleCode = oEmpDetails.workscheduleCode,
                vStartDate = oEmpDetails.startDate,
                vEndDate = oEmpDetails.endDate;

            var oCAPModel = this.getOwnerComponent().getModel("taqa-srv"),
                sPath = "/TravelDetails",
                filters = new Array(),
                filterByName,
                vTakenRequest;

            filters.push(new Filter({
                filters: [
                    new Filter("TravelType", FilterOperator.EQ, "Family Travel"),
                    new Filter("TravelType", FilterOperator.EQ, "Emergency Leave"),
                    new Filter("TravelType", FilterOperator.EQ, "Rotational Leave"),
                    // new Filter("EmployeeID", FilterOperator.EQ, ID)
                ],
                and: false // Use OR condition
            }));
            filterByName = new Filter("EmployeeID", FilterOperator.EQ, ID);
            filters.push(filterByName);

            if (vRegORrota === '627826') //Rotational
            {
                var a = vWorkscheduleCode.split('x')[0];
                a = parseInt(a) * 7;
                let Difference_In_Time = vEndDate.getTime() - vStartDate.getTime();
                // Calculating the no. of days between
                let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

                var vTicketCount = Difference_In_Days / a;
                if (vTicketCount > 10) {
                    vTicketCount = 10;
                }
                await this.ReadOdata(oCAPModel, sPath, filters).then(async (odata) => {
                    vTakenRequest = odata.results.length;

                }).catch((oError) => {
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });
                var sTicketCount = vTicketCount - vTakenRequest;

                if (sTicketCount) {
                    sTicketCount = sTicketCount.toString();
                    this.getView().getModel("form").getData().TicketCount = sTicketCount;
                    this.getView().getModel("form").refresh();
                }
                else {
                    MessageBox.error("You Don't have the Ticket Balnce to Create the Request");
                }
            }
        },

        travellerCreation: async function (parent_ID) {
            var oModel = this.getOwnerComponent().getModel("taqa-srv"),
                oPayload = this.getView().getModel("item").getData(),
                sPath = "/TravelDetails(guid'" + parent_ID + "')/ItsTraveller";

            delete oPayload.ReturnTime;
            await this.CRDoData(oModel, sPath, oPayload).then((odata) => {

                this.getView().getModel("item").setData({});
            }).catch((oError) => {
                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
            });

        },
        travellerUpdate: async function (parent_ID,) {
            var oModel = this.getOwnerComponent().getModel("taqa-srv"),
                oPayload = this.getView().getModel("item").getData(),
                that = this,
                // sPath = "/TravellerDetails(guid'" + child_ID + "')";
                sPath = "/TravelDetails(guid'" + parent_ID + "')";
            var oPayloadFinal = {
                ItsTraveller: [oPayload]

            };

            await this.UpdateRecord(oModel, sPath, oPayloadFinal).then((odata) => {

                this.getView().getModel("item").setData({});
            }).catch((oError) => {
                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
            });


        },

        getEmpDetailsEmail: function (userEmail) {
            return new Promise((resolve, reject) => {
                var oDataModelSF = this.getOwnerComponent().getModel();
                var oFilter1 = new Filter("userNav/email", sap.ui.model.FilterOperator.EQ, userEmail);  //"22647"  39321

                oDataModelSF.read("/EmpJob", {
                    filters: [oFilter1],
                    urlParameters: {
                        $expand: "userNav"
                    },
                    success: (response1) => {
                        this.getView().getModel("EmpJob").setData(response1.results[0]);
                        var tempID = Number(response1.results[0].userId);
                        var oFilter4 = new Filter("person", sap.ui.model.FilterOperator.EQ, tempID);
                        var oFilter5 = new Filter("externalCode", sap.ui.model.FilterOperator.EQ, "Z001");
                        oDataModelSF.read("/FODynamicRole", {
                            filters: [oFilter4, oFilter5],

                            success: (response2) => {
                                if (response2.results.length === 0) {
                                    resolve({
                                        "admin": "no",
                                        "userId": response1.results[0].userId
                                    });
                                } else {
                                    resolve({
                                        "admin": "yes",
                                        "userId": response1.results[0].userId
                                    });
                                }

                            },
                            error: (error) => {
                                reject(error);

                            }
                        });
                        console.log("email :", response1);

                    },
                    error: (error) => {
                        reject(error);

                    }
                });
            });
        },



    });
});