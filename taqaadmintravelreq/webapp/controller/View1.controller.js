sap.ui.define([
    "taqaadmintravelreq/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter",
    "sap/m/Input",
    "sap/m/DatePicker",
    "sap/m/TextArea",
    "sap/m/TimePicker",
    'sap/m/Token',

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MessageBox,
        Filter,
        FilterOperator,
        formatter,
        Input,
        DatePicker,
        TextArea,
        TimePicker,
        Token
    ) {
        "use strict";
        return BaseController.extend("taqaadmintravelreq.controller.View1", {
            formatter: formatter,
            onInit: function () {
                this.declareModel("PerPersonal");
                this.declareModel("EmpJob");
                this.declareModel("PerPerson");
                this.declareModel("visible");
                this.declareModel("form");
                this.declareModel("Reissuance");

                this.oFilterBar = this.getView().byId("filterbar");
                this.oTable = this.getView().byId("idTravelDetailsTable");

            },
            onCreateRequestButtonPress: function (oEvent) {
                this.openDialog("Travel Request Form", "taqaadmintravelreq.fragments.requestForm");
                this.getView().getModel("visible").setData({
                    "type": false, "ticketcount": false, "Preamount": false, "familytable": false,
                    "draft": false, "submit": false, "emp": false,"delete":false
                });
            },
            onCloseButtonPress: function (oEvent) {
                oEvent.getSource().getParent().close();
                this.getView().getModel("visible").setData({});
                this.getView().getModel("form").setData({});
                this.getView().getModel("PerPersonal").setData({});
                this.getView().getModel("EmpJob").setData({});
                this.getView().getModel("PerPerson").setData({});
                this.ValueStateNone(this);
                this.getView().byId("idTablefamily").unbindItems();
            },
            onComboBoxSelectionChange: function (oEvent) {
                this.ValueStateNone(this);
                var oJsonVisible = this.getView().getModel("visible").getData();
                oJsonVisible.type = true;
                oJsonVisible.draft = true;
                oJsonVisible.submit = true;
                oJsonVisible.emp = true;

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
            onSaveAsDraftButtonPress: function (oEvent) {
                var vText = oEvent.getSource().getText();
                var sCheck = this.CheckRequired();
                if (sCheck === 0) {
                    // Populating payload
                    // var oFinalModel = this.mappingModels(vText);
                    var oFinalModel = this.getView().getModel("form").getData();
                    oFinalModel.Status = (vText === 'Save As Draft' ? "Drafted" : "Submitted");
                    delete oFinalModel.Sector2;
                    delete oFinalModel.Time2;

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

                                        // this.Tablerefresh(oFinalModel.EmployeeID).then((odata) => {
                                        //     this.getView().getModel("TravelDetails").setData(odata);
                                        // }).catch((oError) => {
                                        //     MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                        // });
                                        this.getView().byId("idTravelDetailsTable").getBinding("items").refresh();

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

                                this.getView().byId("idTravelDetailsTable").getBinding("items").refresh();
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

                            this.getView().byId("idTravelDetailsTable").getBinding("items").refresh();
                            oBusyDialog.close();
                        }).catch((oError) => {
                            oBusyDialog.close();
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });

                    }

                }
            },

            onPersonIdExternalInputValueHelpRequest: function (oEvent) {
                this.openDialog("Employee No", "taqaadmintravelreq.fragments.valueHelps.empNo")
            },
            onEmpNoValuehelpOpen: function (oEvent) {
                this.openDialog("Employee ID", "taqaadmintravelreq.fragments.valueHelps.empNo")
            },


            onPerPersonSelectDialogConfirm: function (oEvent) {
                var aSelectedItem = oEvent.getParameter("selectedItem").getTitle();
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                if (oEvent.getSource().getTitle() === 'Employee No') {

                    if (aSelectedItem && aSelectedItem.length > 0) {
                        var oModel = this.getView().getModel("PerPersonal");

                        var oBusyDialog = new sap.m.BusyDialog();
                        oBusyDialog.open();
                        var oSFModel = this.getOwnerComponent().getModel(),
                            sPathPerPerson = "/PerPersonal",
                            sPathEmpJob = "/EmpJob",
                            sPathPerson = "/PerPerson",
                            filtersPerPersonal = new Array(),
                            filtersEmpJob = new Array(),
                            filtersPerson = new Array(),
                            filterByName,
                            filterByUserId,
                            filterByPerson,
                            ID = aSelectedItem,
                            that = this;
                        filterByName = new Filter("personIdExternal", FilterOperator.EQ, ID);
                        filtersPerPersonal.push(filterByName);
                        filterByUserId = new Filter("userId", FilterOperator.EQ, ID);
                        filtersEmpJob.push(filterByUserId);
                        this.ReadOdata(oSFModel, sPathPerPerson, filtersPerPersonal).then((odata) => {
                            oModel.setData(odata.results[0]);
                            // oModel.updateBindings(true);

                        }).catch((oError) => {
                            oBusyDialog.close();
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                        this.ReadOdata(oSFModel, sPathEmpJob, filtersEmpJob).then((odata) => {
                            this.getView().getModel("EmpJob").setData(odata.results[0]);

                        }).catch((oError) => {
                            oBusyDialog.close();
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                        this.ReadOdata(oSFModel, sPathPerson, filtersPerPersonal).then((odata) => {
                            this.getView().getModel("PerPerson").setData(odata.results[0]);
                            this.mappingModels();

                            oBusyDialog.close();
                        }).catch((oError) => {
                            oBusyDialog.close();
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                        //    oModel.getData().personIdExternal = aSelectedItem;
                        this.GetFamilyDetails(aSelectedItem)
                    }
                } else {

                    this.getView().byId("idInputEmpID").setValue(aSelectedItem);
                }
            },

            onPerPersonSelectDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("personIdExternal", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },


            onMultiInputValueHelpRequest: function (oEvent) {
                this.openDialog("Department Select", "taqaadmintravelreq.fragments.valueHelps.department")
            },

            onFODepartmentTableSelectDialogSearch: function (oEvent) {
                this.TableSelectDialogSearch(oEvent);
            },

            onFODepartmentTableSelectDialogConfirm: function (oEvent) {
                this.TableSelectDialogConfirm(oEvent, "idMultiInputDepartment");
            },

            onMultiInputValueHelpRequestDivision: function (oEvent) {
                this.openDialog("Division Select", "taqaadmintravelreq.fragments.valueHelps.division")
            },

            onFODivisionTableSelectDialogSearch: function (oEvent) {
                this.TableSelectDialogSearch(oEvent);
            },

            onFODivisionTableSelectDialogConfirm: function (oEvent) {
                this.TableSelectDialogConfirm(oEvent, "idMultiInputDivision");
            },
            onMultiInputValueHelpRequestLocation: function (oEvent) {
                this.openDialog("Location Select", "taqaadmintravelreq.fragments.valueHelps.location")
            },

            onFOLocationTableSelectDialogSearch: function (oEvent) {
                this.TableSelectDialogSearch(oEvent);
            },

            onFOLocationTableSelectDialogConfirm: function (oEvent) {
                this.TableSelectDialogConfirm(oEvent, "idMultiInputLocation");
            },
            onFilterBarClear:function (oEvent) {
                this.getView().byId("idMultiInputDepartment").setTokens([]);
                this.getView().byId("idMultiInputDivision").setTokens([]);
                this.getView().byId("idMultiInputLocation").setTokens([]);
                this.getView().byId("idInputEmpID").setValue("");
            },
            onColumnListItemPress: function (oEvent) {
                var oSelectedItem = oEvent.getSource().getBindingContext("taqa-srv").getObject();
                this.getView().getModel("form").setData(oSelectedItem);


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

                this.openDialog("Travel Request Form", "taqaadmintravelreq.fragments.requestForm");
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
                        this.GetFamilyDetails(oSelectedItem.EmployeeID)
                        break;
                    case "Emergency Leave":
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, false, false);
                        break;

                }
               

                // debugger;
            },
            onDeleteButtonPress: function (oEvent) {
                var oFinalModel = this.getView().getModel("form").getData();

                var oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open();
                var oCAPMModel = this.getOwnerComponent().getModel("taqa-srv"),
                    sPathTravel = "/TravelDetails(guid'" + oFinalModel.ID + "')";

                this.DeleteRecord(oCAPMModel, sPathTravel).then((odata) => {

                    oEvent.getSource().getParent().close();
                    this.getView().getModel("visible").setData({});
                    this.getView().getModel("form").setData({});

                    this.getView().byId("idTravelDetailsTable").getBinding("items").refresh();

                    oBusyDialog.close();
                }).catch((oError) => {
                    oBusyDialog.close();
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });

            },
            onSearch: function () {
                var aTableFilters = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl();
                    var aFilters = [];

                    // Check the type of control
                    if (oControl instanceof sap.m.MultiInput) {
                        var aTokens = oControl.getTokens();
                        if (aTokens.length > 0) {
                            aTokens.forEach(function (oToken) {
                                var sTokenValue = oToken.getText();
                                if (sTokenValue) {
                                    aFilters.push(new Filter({
                                        path: oFilterGroupItem.getName(),
                                        operator: FilterOperator.EQ,
                                        value1: sTokenValue
                                    }));
                                }
                            });
                        }
                    } else if (oControl instanceof sap.m.Input) {
                        var sInputValue = oControl.getValue();
                        if (sInputValue) {
                            aFilters.push(new Filter({
                                path: oFilterGroupItem.getName(),
                                operator: FilterOperator.EQ,
                                value1: sInputValue
                            }));
                        }
                    }
                    // else if (oControl instanceof sap.m.MultiComboBox){
                    //     aSelectedKeys = oControl.getSelectedKeys(),
                    //     aFilters = aSelectedKeys.map(function (sSelectedKey) {
                    //         return new Filter({
                    //             path: oFilterGroupItem.getName(),
                    //             operator: FilterOperator.Contains,
                    //             value1: sSelectedKey
                    //         });
                    //     });
                    // }


                    // Add filters for this control to the result
                    if (aFilters.length > 0) {
                        aResult.push(new sap.ui.model.Filter({
                            filters: aFilters,
                            and: false // Combine filters with OR
                        }));
                    }

                    return aResult;
                }, []);

                // Apply filters to the table binding
                this.oTable.getBinding("items").filter(aTableFilters);
                this.oTable.setShowOverlay(false);
            },
        });
    });
