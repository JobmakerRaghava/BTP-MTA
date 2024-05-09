sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter",
    "sap/m/Input",
    "sap/m/DatePicker",
    "sap/m/TextArea",
    "sap/m/TimePicker"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,
        MessageBox,
        Filter,
        FilterOperator,
        formatter,
        Input,
        DatePicker,
        TextArea,
        TimePicker
    ) {
        "use strict";

        return BaseController.extend("taqaemployeetravelrequestapp.controller.View1", {
            formatter: formatter,
            onInit: function () {
                // try {
                //     var vEmail = new sap.ushell.services.UserInfo();
                // } catch (error) {

                var oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open();

                this.declareModel("PerPersonal");
                this.declareModel("EmpJob");
                this.declareModel("PerPerson");
                this.declareModel("visible");
                this.declareModel("form");
                this.declareModel("TravelDetails");
                this.declareModel("Reissuance");



                var oSFModel = this.getOwnerComponent().getModel(),
                    sPathPerPerson = "/PerPersonal",
                    sPathEmpJob = "/EmpJob",
                    sPathPerson = "/PerPerson",
                    filtersPerPersonal = new Array(),
                    filtersEmpJob = new Array(),
                    // filtersPerson = new Array(),
                    filterByName,
                    filterByUserId,
                    // filterByPerson,
                    that = this;
                // ID = '32737',//regular
                // ID = '37113',//rota
                // this.ID = '31288'; //family
                this.ID = '27146';//leaves

                filterByName = new Filter("personIdExternal", FilterOperator.EQ, this.ID);
                filtersPerPersonal.push(filterByName);
                filterByUserId = new Filter("userId", FilterOperator.EQ, this.ID);
                filtersEmpJob.push(filterByUserId);
                // filterByPerson = new Filter("personIdExternal", FilterOperator.EQ, ID);
                // filtersPerson.push(filterByPerson);

                this.ReadOdata(oSFModel, sPathPerPerson, filtersPerPersonal).then((odata) => {
                    this.getView().getModel("PerPersonal").setData(odata.results[0]);
                    this.ReadOdata(oSFModel, sPathEmpJob, filtersEmpJob).then((odata) => {
                        this.getView().getModel("EmpJob").setData(odata.results[0]);
                        this.ReadOdata(oSFModel, sPathPerson, filtersPerPersonal).then((odata) => {
                            this.getView().getModel("PerPerson").setData(odata.results[0]);
                            oBusyDialog.close();
                        }).catch((oError) => {
                            oBusyDialog.close();
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                    }).catch((oError) => {
                        oBusyDialog.close();
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                    });

                }).catch((oError) => {
                    oBusyDialog.close();
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });

                this.Tablerefresh(this.ID).then((odata) => {
                    this.getView().getModel("TravelDetails").setData(odata);
                }).catch((oError) => {
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });

                // oBusyDialog.close();
                // }
            },

            onCreateRequestButtonPress: function (oEvent) {
                this.openDialog("requestForm", "taqaemployeetravelrequestapp.fragments.requestForm");
                this.getView().getModel("visible").setData({
                    "type": false, "ticketcount": false, "Preamount": false, "familytable": false,
                    "draft": false, "submit": false, "delete": false
                });
            },
            onCloseButtonPress: function (oEvent) {
                oEvent.getSource().getParent().close();
                this.getView().getModel("visible").setData({});
                this.getView().getModel("form").setData({});

                this.ValueStateNone(this);
            },

            onComboBoxSelectionChange: function (oEvent) {
                this.ValueStateNone(this);
                var oJsonVisible = this.getView().getModel("visible").getData();
                oJsonVisible.type = true;
                oJsonVisible.draft = true;
                oJsonVisible.submit = true;

                switch (oJsonVisible.trvtype) {
                    case "Business Travel":
                        this.FieldsHide(oJsonVisible, true, true, false, false, false, false, false, false);
                        break;
                    case "Joining Travel":
                        this.FieldsHide(oJsonVisible, false, false, false, false, false, false, false, false);
                        break;
                    case "Training":
                        this.FieldsHide(oJsonVisible, true, false, false, false, true, false, false, false);
                        break;
                    case "Job travel":
                        this.FieldsHide(oJsonVisible, true, false, false, false, false, false, false, false);
                        break;
                    case "Miscellaneous":
                        this.FieldsHide(oJsonVisible, false, false, false, false, false, false, false, false);
                        break;
                    case "Recharge Travel":
                        this.FieldsHide(oJsonVisible, true, false, false, false, false, false, false, false);
                        break;
                    case "Separation Travel":
                        this.FieldsHide(oJsonVisible, true, false, false, false, false, false, false, false);
                        break;
                    case "Annual Leave":
                        this.FieldsHide(oJsonVisible, true, false, false, false, false, false, false, false);
                        break;
                    case "Rotational Leave":
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, false, false);
                        break;
                    case "Reissuance":
                        this.FieldsHide(oJsonVisible, false, false, false, true, false, false, false, true);
                        this.ReissuanceRefNo();
                        break;
                    case "Family Travel":
                        var vRegORrota = this.getView().getModel("EmpJob").getData().customString6;
                        //627825 for regular employee
                        if (vRegORrota === '627825') {
                            MessageBox.success("You are Regular Employee.You are Eligible for Family Tavel")

                            this.GetFamilyDetails(this.ID);

                        } else {
                            MessageBox.error("You are not Regular Employee.You are not Eligible for Family Tavel")
                        }
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, true, false);
                        // oJsonVisible.type = false;
                        break;
                    case "Emergency Leave":
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, false, false);
                        break;

                }

            },
            onDeleteButtonPress: function (oEvent) {
                var oFinalModel = this.mappingModels("vText");
                var oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open();
                var oCAPMModel = this.getOwnerComponent().getModel("taqa-srv"),
                    sPathTravel = "/TravelDetails(guid'" + oFinalModel.ID + "')";

                this.DeleteRecord(oCAPMModel, sPathTravel).then((odata) => {

                    oEvent.getSource().getParent().close();
                    this.getView().getModel("visible").setData({});
                    this.getView().getModel("form").setData({});

                    this.Tablerefresh(this.ID).then((odata) => {
                        this.getView().getModel("TravelDetails").setData(odata);
                    }).catch((oError) => {
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                    });

                    oBusyDialog.close();
                }).catch((oError) => {
                    oBusyDialog.close();
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });

            },

            onSaveAsDraftButtonPress: function (oEvent) {
                var vText = oEvent.getSource().getText();
                var sCheck = this.CheckRequired();
                if (sCheck === 0) {
                    // Populating payload
                    var oFinalModel = this.mappingModels(vText);

                    var oBusyDialog = new sap.m.BusyDialog();
                    oBusyDialog.open();
                    var oCAPMModel = this.getOwnerComponent().getModel("taqa-srv"),
                        oSFModel = this.getOwnerComponent().getModel(),
                        sPathTravel = "/TravelDetails";

                    if (!oFinalModel.ID) {


                        //validation for Annual leave and Rotational leave
                        var vType = this.getView().getModel("visible").getData().trvtype;
                        if (vType === "Annual Leave" || vType === "Rotational Leave") {
                            var sPathTime = "/EmployeeTime",
                                oJsonModel = this.getView().getModel("form").getData(),
                                filters = new Array(),
                                filterByuserId,
                                filterBystartdate,
                                filterByenddate;
                            filterByuserId = new Filter("userId", FilterOperator.EQ, oJsonModel.EmployeeID);
                            filterBystartdate = new Filter("startDate", FilterOperator.EQ, this.dateFormatChange(oJsonModel.DepartureDate));
                            filterByenddate = new Filter("endDate", FilterOperator.EQ, this.dateFormatChange(oJsonModel.ReturnDate));
                            filters.push(filterByuserId);
                            filters.push(filterBystartdate);
                            filters.push(filterByenddate);
                            // var oMatTypeFilter = new Filter({
                            //     and: true,
                            //     filters: [new Filter("userId", FilterOperator.EQ, oJsonModel.EmployeeID),
                            //     new Filter("startDate", FilterOperator.EQ, this.dateFormatChange(oJsonModel.DepartureDate)),
                            //     new Filter("endDate", FilterOperator.EQ, this.dateFormatChange(oJsonModel.ReturnDate))]

                            // });

                            this.ReadOdata(oSFModel, sPathTime, filters).then((odata) => {
                                if (odata.results.length === 0) {
                                    MessageBox.error("You are not Applied a leave during the Period from " + oJsonModel.DepartureDate + " to " + oJsonModel.ReturnDate);
                                    oBusyDialog.close();
                                }
                                else if (odata.results[0].timeType === 'ROT_SHIFT_LEAVE_KSA' || odata.results[0].timeType === 'SA_ANNL10D' && odata.results[0].approvalStatus === 'APPROVED') {

                                    this.CRDoData(oCAPMModel, sPathTravel, oFinalModel).then((odata) => {
                                        // this.getView().getModel("PerPerson").setData(odata.results[0]);
                                        oEvent.getSource().getParent().close();
                                        this.getView().getModel("visible").setData({});
                                        this.getView().getModel("form").setData({});

                                        this.Tablerefresh(this.ID).then((odata) => {
                                            this.getView().getModel("TravelDetails").setData(odata);
                                        }).catch((oError) => {
                                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                        });

                                        oBusyDialog.close();
                                    }).catch((oError) => {
                                        oBusyDialog.close();
                                        MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                    });
                                }
                                else if (odata.results[0].timeType === 'ROT_SHIFT_LEAVE_KSA' || odata.results[0].timeType === 'SA_ANNL10D' && odata.results[0].approvalStatus === 'CANCELLED') {
                                    MessageBox.warning("Your Leave is CANCELLED,Please Reach out Focal Personal");
                                    oBusyDialog.close();
                                }
                                else {
                                    oBusyDialog.close();
                                }

                            }).catch((oError) => {
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            });
                        }
                        else {
                            this.CRDoData(oCAPMModel, sPathTravel, oFinalModel).then((odata) => {
                                // this.getView().getModel("PerPerson").setData(odata.results[0]);
                                oEvent.getSource().getParent().close();
                                this.getView().getModel("visible").setData({});
                                this.getView().getModel("form").setData({});

                                this.Tablerefresh(this.ID).then((odata) => {
                                    this.getView().getModel("TravelDetails").setData(odata);
                                }).catch((oError) => {
                                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                });

                                oBusyDialog.close();
                            }).catch((oError) => {
                                oBusyDialog.close();
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            });

                        }
                    }
                    else {
                        var sPathTravel2 = "/TravelDetails(guid'" + oFinalModel.ID + "')";
                        this.UpdateRecord(oCAPMModel, sPathTravel2, oFinalModel).then((odata) => {
                            // this.getView().getModel("PerPerson").setData(odata.results[0]);
                            oEvent.getSource().getParent().close();
                            this.getView().getModel("visible").setData({});
                            this.getView().getModel("form").setData({});

                            this.Tablerefresh(this.ID).then((odata) => {
                                this.getView().getModel("TravelDetails").setData(odata);
                            }).catch((oError) => {
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            });

                            oBusyDialog.close();
                        }).catch((oError) => {
                            oBusyDialog.close();
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });

                    }

                }
            },
            onColumnListItemPress: function (oEvent) {
                var oSelectedItem = oEvent.getSource().getBindingContext("TravelDetails").getObject();
                this.getView().getModel("form").setData(oSelectedItem);

                this.openDialog("requestForm", "taqaemployeetravelrequestapp.fragments.requestForm");
                // oJsonVisible.getData();
                this.getView().getModel("visible").setData({
                    "ticketcount": false, "Preamount": false, "familytable": false, "ReferenceNo": false,
                    "draft": false, "submit": false, "trvtype": oSelectedItem.TravelType, "reissurance": false
                });
                var oJsonVisible = this.getView().getModel("visible").getData();
                oJsonVisible.type = true;
                oJsonVisible.draft = true;
                oJsonVisible.submit = true;
                oJsonVisible.delete = true;

                switch (oJsonVisible.trvtype) {
                    case "Business Travel":
                        this.FieldsHide(oJsonVisible, true, true, false, false, false, false, false, false);
                        break;
                    case "Joining Travel":
                        this.FieldsHide(oJsonVisible, false, false, false, false, false, false, false, false);
                        break;
                    case "Training":
                        this.FieldsHide(oJsonVisible, true, false, false, false, true, false, false, false);
                        break;
                    case "Job travel":
                        this.FieldsHide(oJsonVisible, true, false, false, false, false, false, false, false);
                        break;
                    case "Miscellaneous":
                        this.FieldsHide(oJsonVisible, false, false, false, false, false, false, false, false);
                        break;
                    case "Recharge Travel":
                        this.FieldsHide(oJsonVisible, true, false, false, false, false, false, false, false);
                        break;
                    case "Separation Travel":
                        this.FieldsHide(oJsonVisible, true, false, false, false, false, false, false, false);
                        break;
                    case "Annual Leave":
                        this.FieldsHide(oJsonVisible, true, false, false, false, false, false, false, false);
                        break;
                    case "Rotational Leave":
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, false, false);
                        break;
                    case "Reissuance":
                        this.FieldsHide(oJsonVisible, false, false, false, true, false, false, false, true);
                        this.ReissuanceRefNo();
                        break;
                    case "Family Travel":
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, true, false);
                        // oJsonVisible.type = false;
                        this.GetFamilyDetails(oSelectedItem.EmployeeID);
                        break;
                    case "Emergency Leave":
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, false, false);
                        break;

                }
              

                // debugger;
            },


        });
    });
