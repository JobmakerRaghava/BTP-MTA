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
    "sap/m/Token",
    "taqaadmintravelreq/util/jspdf.umd.min",
    "taqaadmintravelreq/util/html2canvas.min",
    "taqaadmintravelreq/util/purify.min",
    "taqaadmintravelreq/util/html2pdf.bundle.min",
    "sap/m/BusyIndicator",
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
        TimePicker,
        Token,
        JspdfUmdmin,
        HtmlcanvasMin,
        PurifyMin,
        HtmlpdfBundlemin,
        BusyIndicator,
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
                this.declareModel("FLD");
                this.declareModel("item");
                this.declareModel("Family");
                this.declareModel("Ticket");
                this.oFilterBar = this.getView().byId("filterbar");
                this.oTable = this.getView().byId("idTravelDetailsTable");
                // if (sap.ushell.Container) {
                //     var user = sap.ushell.Container.getService("UserInfo").getUser();
                //     // console.log(user)
                //     var userEmail = user.getEmail();
                //     // console.log(userEmail);
                // } else {
                //     // var userEmail = "vsreenivasulu@kaartech.com"; //"aalthani@tq.com";
                //     var userEmail = "gkanthavelu@kaartech.com"
                // };
                // var userD = await this.getEmpDetailsEmail(userEmail);
                // this.ID = userD.userId;
                // if(userD.admin === "yes"){
                //     };
            },
            onRefreshTable: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open();
                this.getView().byId("idTravelDetailsTable").getBinding("items").refresh();
                oBusyDialog.close();
            },
            onCreateRequestButtonPress: function (oEvent) {
                this.openDialog("Travel Request Form", "taqaadmintravelreq.fragments.requestForm");
                this.getView().getModel("visible").setData({
                    "type": false, "ticketcount": false, "Preamount": false, "familytable": false,
                    "draft": false, "submit": false, "emp": false, "delete": false, "TrainingDate": false, "BusinessStartDate": false
                });
            },
            onCloseButtonPress: function (oEvent) {
                oEvent.getSource().getParent().close();
                this.getView().getModel("visible").setData({});
                this.getView().getModel("form").setData({});
                this.getView().getModel("PerPersonal").setData({});
                this.getView().getModel("EmpJob").setData({});
                this.getView().getModel("PerPerson").setData({});
                this.getView().getModel("FLD").setData({});
                this.getView().getModel("item").setData({});
                this.getView().getModel("Ticket").setData({});
                this.ValueStateNone(this);
                // this.getView().byId("idTablefamily").unbindItems();
                this.getView().byId("idTable").removeAllItems();
            },
            onComboBoxSelectionChange: function (oEvent) {
                this.ValueStateNone(this);
                this.AutopopulatedFields();
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
                        break;
                    case "Family Travel":
                        // var vRegORrota = this.getView().getModel("EmpJob").getData().customString6;
                        //627825 for regular employee
                        // if (vRegORrota === '627825') {
                        // MessageBox.success("You are Regular Employee.You are Eligible for Family Tavel");
                        // this.getTicketCount(this.ID);
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, true, false);
                        // } else {
                        // this.openDialog("Error", "taqaadmintravelreq.fragments.dailogs.closepopover");
                        // MessageBox.error("You are not Regular Employee.You are not Eligible for Family Tavel")
                        // }
                        // oJsonVisible.type = false;
                        oJsonVisible.ftype = false;
                        this.getView().getModel("visible").refresh();
                        break;
                    case "Emergency Leave":
                        // this.getTicketCount(this.ID);
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
                    var oItemModel = this.getView().getModel("item").getData();
                    oFinalModel.Status = (vText === 'Save As Draft' ? "Drafted" : "Submitted");
                    // delete oFinalModel.Sector2;
                    // delete oFinalModel.Time2;
                    var oBusyDialog = new sap.m.BusyDialog();
                    oBusyDialog.open();
                    var oCAPMModel = this.getOwnerComponent().getModel("taqa-srv"),
                        oSFModel = this.getOwnerComponent().getModel(),
                        sPathTravel = "/TravelDetails",
                        vTrvType = this.getView().getModel("visible").getData().trvtype;
                    var sPathTime = "/EmployeeTime",
                        oJsonModel = this.getView().getModel("form").getData(),
                        filters = new Array(),
                        filterByuserId,
                        filterBystartdate,
                        filterByenddate;
                    filterByuserId = new Filter("userId", FilterOperator.EQ, oJsonModel.EmployeeID);
                    filterBystartdate = new Filter("startDate", FilterOperator.EQ, this.dateFormatChange(oItemModel.DepartureDate));
                    filterByenddate = new Filter("endDate", FilterOperator.EQ, this.dateFormatChange(oItemModel.ReturnDate));
                    filters.push(filterByuserId);
                    filters.push(filterBystartdate);
                    filters.push(filterByenddate);
                    if (!oFinalModel.ID) {
                        //validation for Annual leave and Rotational leave
                        var vType = this.getView().getModel("visible").getData().trvtype;
                        if (vType === "Annual Leave" || vType === "Rotational Leave") {
                            this.ReadOdata(oSFModel, sPathTime, filters).then((odata) => {
                                //if leave is not applied
                                if (odata.results.length === 0) {
                                    // MessageBox.error("You are not Applied a leave during the Period from " + oItemModel.DepartureDate + " to " + oItemModel.ReturnDate);
                                    this.CRDoData(oCAPMModel, sPathTravel, oFinalModel).then((odata) => {
                                        // this.getView().getModel("PerPerson").setData(odata.results[0]);
                                        oEvent.getSource().getParent().close();
                                        this.getView().getModel("visible").setData({});
                                        this.getView().getModel("form").setData({});
                                        // debugger;
                                        this.travellerCreation(odata.ID);
                                        // this.Tablerefresh(this.ID).then((odata) => {
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
                                    oBusyDialog.close();
                                }
                                else if (odata.results[0].timeType === 'ROT_SHIFT_LEAVE_KSA' || odata.results[0].timeType === 'SA_ANNL10D') {
                                    if (odata.results[0].approvalStatus === 'APPROVED' || odata.results[0].approvalStatus === 'PENDING') {
                                        this.CRDoData(oCAPMModel, sPathTravel, oFinalModel).then((odata) => {
                                            // this.getView().getModel("PerPerson").setData(odata.results[0]);
                                            oEvent.getSource().getParent().close();
                                            this.getView().getModel("visible").setData({});
                                            this.getView().getModel("form").setData({});
                                            // debugger;
                                            this.travellerCreation(odata.ID);
                                            // this.Tablerefresh(this.ID).then((odata) => {
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
                                    // else if (odata.results[0].timeType === 'ROT_SHIFT_LEAVE_KSA' || odata.results[0].timeType === 'SA_ANNL10D' ) {
                                    else if (odata.results[0].approvalStatus === 'CANCELLED') {
                                        MessageBox.warning("Your Leave is CANCELLED,Please Reach out Focal Personal");
                                        oBusyDialog.close();
                                        oEvent.getSource().getParent().close();
                                    }
                                    // else if (odata.results[0].approvalStatus === 'PENDING') {
                                    //     MessageBox.warning("Your Leave is not Approved,Please Reach out Focal Personal");
                                    //     oBusyDialog.close();
                                    //     oEvent.getSource().getParent().close();
                                    // }
                                }
                                // else if (odata.results[0].timeType === 'ROT_SHIFT_LEAVE_KSA' || odata.results[0].timeType === 'SA_ANNL10D') {
                                // }
                                else {
                                    oBusyDialog.close();
                                    MessageBox.warning("Your are Not Applied Annual/Rotational Leaves during the Period");
                                }
                            }).catch((oError) => {
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                oBusyDialog.close();
                            });
                        }
                        else {
                            this.CRDoData(oCAPMModel, sPathTravel, oFinalModel).then((odata) => {
                                // this.getView().getModel("PerPerson").setData(odata.results[0]);
                                oEvent.getSource().getParent().close();
                                this.getView().getModel("visible").setData({});
                                this.getView().getModel("form").setData({});
                                if (vTrvType === 'Family Travel') {
                                    this.onButtonPress(odata.ID);
                                } else {
                                    this.travellerCreation(odata.ID);
                                }
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
                        if (vType === "Annual Leave" || vType === "Rotational Leave") {
                            this.ReadOdata(oSFModel, sPathTime, filters).then((odata) => {
                                //if leave is not applied
                                if (odata.results.length === 0) {
                                    delete oFinalModel.ItsTraveller;
                                    delete oFinalModel.ItsTicketDetails;
                                    this.UpdateRecord(oCAPMModel, sPathTravel2, oFinalModel).then((odata) => {
                                        // this.getView().getModel("PerPerson").setData(odata.results[0]);
                                        oEvent.getSource().getParent().close();
                                        this.getView().getModel("visible").setData({});
                                        this.getView().getModel("form").setData({});
                                        if (vTrvType === 'Family Travel') {
                                            this.onButtonPress(oFinalModel.ID);
                                        } else {
                                            this.travellerUpdate(oFinalModel.ID);
                                        }
                                        this.getView().byId("idTravelDetailsTable").getBinding("items").refresh();
                                        oBusyDialog.close();
                                    }).catch((oError) => {
                                        oBusyDialog.close();
                                        MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                    });
                                }
                                else if (odata.results[0].timeType === 'ROT_SHIFT_LEAVE_KSA' || odata.results[0].timeType === 'SA_ANNL10D') {
                                    if (odata.results[0].approvalStatus === 'APPROVED' || odata.results[0].approvalStatus === 'PENDING') {
                                        delete oFinalModel.ItsTraveller;
                                        delete oFinalModel.ItsTicketDetails;
                                        this.UpdateRecord(oCAPMModel, sPathTravel2, oFinalModel).then((odata) => {
                                            // this.getView().getModel("PerPerson").setData(odata.results[0]);
                                            oEvent.getSource().getParent().close();
                                            this.getView().getModel("visible").setData({});
                                            this.getView().getModel("form").setData({});
                                            if (vTrvType === 'Family Travel') {
                                                this.onButtonPress(oFinalModel.ID);
                                            } else {
                                                this.travellerUpdate(oFinalModel.ID,);
                                            }
                                            this.getView().byId("idTravelDetailsTable").getBinding("items").refresh();
                                            oBusyDialog.close();
                                        }).catch((oError) => {
                                            oBusyDialog.close();
                                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                        });
                                    }
                                    // else if (odata.results[0].timeType === 'ROT_SHIFT_LEAVE_KSA' || odata.results[0].timeType === 'SA_ANNL10D' ) {
                                    else if (odata.results[0].approvalStatus === 'CANCELLED') {
                                        oBusyDialog.close();
                                        MessageBox.warning("Your Leave is CANCELLED,Please Reach out Focal Personal");
                                        oEvent.getSource().getParent().close();
                                    }
                                }
                                else {
                                    oBusyDialog.close();
                                    MessageBox.warning("Your are Not Applied Annual/Rotational Leaves during the Period");
                                }
                            }).catch((oError) => {
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                oBusyDialog.close();
                            });
                        }
                        else {
                            delete oFinalModel.ItsTraveller;
                            delete oFinalModel.ItsTicketDetails;
                            this.UpdateRecord(oCAPMModel, sPathTravel2, oFinalModel).then((odata) => {
                                // this.getView().getModel("PerPerson").setData(odata.results[0]);
                                oEvent.getSource().getParent().close();
                                this.getView().getModel("visible").setData({});
                                this.getView().getModel("form").setData({});
                                if (vTrvType === 'Family Travel') {
                                    this.onButtonPress(oFinalModel.ID);
                                } else {
                                    this.travellerUpdate(oFinalModel.ID,);
                                }
                                this.getView().byId("idTravelDetailsTable").getBinding("items").refresh();
                                oBusyDialog.close();
                            }).catch((oError) => {
                                oBusyDialog.close();
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            });
                        }
                    }
                }
            },
            onPersonIdExternalInputValueHelpRequest: function (oEvent) {
                this.openDialog("Employee No", "taqaadmintravelreq.fragments.valueHelps.empNo")
            },
            onEmpNoValuehelpOpen: function (oEvent) {
                this.openDialog("Employee ID", "taqaadmintravelreq.fragments.valueHelps.empNo")
            },
            onPerPersonSelectDialogConfirm: async function (oEvent) {
                // this.getView().getModel("form").setData({});
                var aSelectedItem = oEvent.getParameter("selectedItem").getTitle();
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                this.ID = aSelectedItem;
                if (oEvent.getSource().getTitle() === 'Employee No') {
                    if (aSelectedItem && aSelectedItem.length > 0) {
                        var oModel = this.getView().getModel("PerPersonal");
                        var oBusyDialog = new sap.m.BusyDialog();
                        oBusyDialog.open();
                        var oSFModel = this.getOwnerComponent().getModel(),
                            sPathPerPerson = "/PerPersonal",
                            sPathEmpJob = "/EmpJob",
                            sPathPerson = "/PerPerson",
                            sPathPhone = "/PerPhone",
                            filtersPerPersonal = new Array(),
                            filtersEmpJob = new Array(),
                            filtersPerson = new Array(),
                            filterByName,
                            filterByUserId,
                            filterByPerson,
                            that = this;
                        filterByName = new Filter("personIdExternal", FilterOperator.EQ, this.ID);
                        filtersPerPersonal.push(filterByName);
                        filterByUserId = new Filter("userId", FilterOperator.EQ, this.ID);
                        filtersEmpJob.push(filterByUserId);
                        await this.ReadOdata(oSFModel, sPathPerPerson, filtersPerPersonal).then(async (odata) => {
                            await oModel.setData(odata.results[0]);
                            // oModel.updateBindings(true);
                        }).catch(async (oError) => {
                            await oBusyDialog.close();
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                        await this.ReadOdata(oSFModel, sPathEmpJob, filtersEmpJob).then(async (odata) => {
                            await this.getView().getModel("EmpJob").setData(odata.results[0]);
                        }).catch(async (oError) => {
                            await oBusyDialog.close();
                            await MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                        await this.ReadOdata(oSFModel, sPathPerson, filtersPerPersonal).then(async (odata) => {
                            await this.getView().getModel("PerPerson").setData(odata.results[0]);
                            await this.mappingModels();
                            oBusyDialog.close();
                        }).catch(async (oError) => {
                            await oBusyDialog.close();
                            await MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                        await this.ReadOdata(oSFModel, sPathPhone, filtersPerPersonal).then(async (odata) => {
                            if (odata.results.length === 0) {
                                this.getView().getModel("form").getData().ContactNo = "";
                            } else {
                                this.getView().getModel("form").getData().ContactNo = odata.results[0].phoneNumber;
                                this.getView().getModel("form").refresh();
                            }
                            oBusyDialog.close();
                        }).catch(async (oError) => {
                            await oBusyDialog.close();
                            await MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                        //    oModel.getData().personIdExternal = aSelectedItem;
                        // this.GetFamilyDetails(aSelectedItem);
                        this.ReissuanceRefNo(aSelectedItem);
                        var vRegORrota = this.getView().getModel("EmpJob").getData().customString6;
                        var sTrvType = this.getView().getModel("visible").getData().trvtype;
                        if (sTrvType === 'Family Travel') {
                            if (vRegORrota === '627825') {
                                // MessageBox.success("You are Regular Employee.You are Eligible for Family Tavel");
                                // this.getTicketCount(this.ID);
                            } else {
                                this.openDialog("Error", "taqaadmintravelreq.fragments.dailogs.closepopover");
                                // MessageBox.error("You are not Regular Employee.You are not Eligible for Family Tavel")
                            }
                        }
                        //627825 for regular employee
                        // oJsonVisible.type = false;
                        // oJsonVisible.ftype = false;
                        // this.getView().getModel("visible").refresh();
                    }
                } else {
                    this.getView().byId("idInputEmpID").setValue(this.ID);
                };
                var oForm = this.getView().getModel("form").getData();
                if (oForm.TravelType === 'Rotational Leave' || oForm.TravelType === 'Family Travel' || oForm.TravelType === 'Emergency Travel') {
                    this.getTicketCount(this.ID);
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
            onFilterBarClear: function (oEvent) {
                this.getView().byId("idMultiInputDepartment").setTokens([]);
                this.getView().byId("idMultiInputDivision").setTokens([]);
                this.getView().byId("idMultiInputLocation").setTokens([]);
                this.getView().byId("idInputEmpID").setValue("");
            },
            onColumnListItemPress: async function (oEvent) {
                this.getView().getModel("item").setData({});
                this.getView().getModel("form").setData({});
                var oSelectedItem = oEvent.getSource().getBindingContext("taqa-srv").getObject();
                this.getView().getModel("form").setData(oSelectedItem);
                this.ID = oSelectedItem.EmployeeID;
                var oModel = this.getOwnerComponent().getModel("taqa-srv"),
                    sPath = "/TravelDetails(guid'" + oSelectedItem.ID + "')/ItsTraveller",
                    sPathticket = "/TravelDetails(guid'" + oSelectedItem.ID + "')/ItsTicketDetails",
                    filterEmpty = new Array();
                await this.ReadOdata(oModel, sPath, filterEmpty).then((odata) => {
                    if (odata.results.length != 0) {
                        this.getView().getModel("item").setData(odata.results[0]);
                    }
                }).catch((oError) => {
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });
                await this.ReadOdata(oModel, sPathticket, filterEmpty).then((odata) => {
                    if (odata.results.length != 0) {
                        this.getView().getModel("Ticket").setData(odata.results[0]);
                    }
                }).catch((oError) => {
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });
                // oJsonVisible.getData();
                this.getView().getModel("visible").setData({
                    "ticketcount": false, "Preamount": false, "familytable": false, "ReferenceNo": false,
                    "draft": false, "submit": false, "trvtype": oSelectedItem.TravelType, "reissurance": false, "tab2": false
                });
                var oJsonVisible = this.getView().getModel("visible").getData();
                oJsonVisible.type = true;
                oJsonVisible.draft = true;
                oJsonVisible.submit = true;
                oJsonVisible.delete = true;
                if (oSelectedItem.Status === 'Initiated Request' || oSelectedItem.Status === "Completed") {
                    oJsonVisible.initiate = false;
                    oJsonVisible.tab2 = true;
                }
                if (oSelectedItem.Status === 'Submitted' || oSelectedItem.Status === 'Approved' || oSelectedItem.Status === "Initiated Request" || oSelectedItem.Status === "Completed") {
                    oJsonVisible.draft = false;
                    oJsonVisible.submit = false;
                    // oJsonVisible.delete = false;
                    oJsonVisible.editable = false;
                };
                if (oSelectedItem.Status === 'Approved' || oSelectedItem.Status === 'Initiated Request' || oSelectedItem.Status === "Completed") {
                    this.openDialog("Detail View", "taqaadmintravelreq.fragments.detailView");
                } else {
                    this.openDialog("Travel Request Form", "taqaadmintravelreq.fragments.requestForm");
                }
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
                        this.ReissuanceRefNo(oSelectedItem.EmployeeID);
                        break;
                    case "Family Travel":
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, true, false);
                        oJsonVisible.ftype = false;
                        this.getView().getModel("visible").refresh();
                        // this.GetFamilyDetails(oSelectedItem.EmployeeID)
                        await this.ReadOdata(oModel, sPath, filterEmpty).then((odata) => {
                            this.getView().getModel("Family").setData(odata.results);
                        }).catch((oError) => {
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                        break;
                    case "Emergency Leave":
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, false, false);
                        break;
                }
                // debugger;
            },
            onDeleteButtonPress: function (oEvent) {
                var oDynamicTable = this.getView().byId("idTravelDetailsTable");
                var oSelectedItems = oDynamicTable.getSelectedItems();
                var oCAPMModel = this.getOwnerComponent().getModel("taqa-srv"),
                    that = this;
                if (oSelectedItems) {
                    var oBusyDialog = new sap.m.BusyDialog();
                    oBusyDialog.open();
                    oSelectedItems.forEach(function (oSelectedItem) {
                        var sID = oSelectedItem.getBindingContext("taqa-srv").getProperty("ID");
                        var sPathTravel = "/TravelDetails(guid'" + sID + "')";
                        that.DeleteRecord(oCAPMModel, sPathTravel).then((odata) => {
                        }).catch((oError) => {
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                    });
                    oCAPMModel.submitChanges({
                        success: function (oResponse) {
                            oBusyDialog.close();
                            that.getView().getModel("visible").setData({});
                            that.getView().getModel("form").setData({});
                            that.getView().byId("idTravelDetailsTable").getBinding("items").refresh();
                        },
                        error: function (oError) {
                            oBusyDialog.close();
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        }
                    });
                }
                else {
                    sap.m.MessageToast.show("Please select a row to Delete");
                }
                // var oFinalModel = this.getView().getModel("form").getData();
                // var oBusyDialog = new sap.m.BusyDialog();
                // oBusyDialog.open();
                // var oCAPMModel = this.getOwnerComponent().getModel("taqa-srv"),
                //     sPathTravel = "/TravelDetails(guid'" + oFinalModel.ID + "')";
                // this.DeleteRecord(oCAPMModel, sPathTravel).then((odata) => {
                //     oEvent.getSource().getParent().close();
                //     this.getView().getModel("visible").setData({});
                //     this.getView().getModel("form").setData({});
                //     this.getView().byId("idTravelDetailsTable").getBinding("items").refresh();
                //     oBusyDialog.close();
                // }).catch((oError) => {
                //     oBusyDialog.close();
                //     MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                // });
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
            onAddFamilyButtonPress: async function (oEvent) {
                var oModel = this.getOwnerComponent().getModel(),
                    filterById,
                    filtersEmpId = new Array(),
                    // sPath = "/PerEmergencyContacts";
                    sPath = "/PerPersonRelationship";
                var oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open();
                // filterById = new Filter("personIdExternal", FilterOperator.EQ, this.ID);
                filterById = new Filter("personIdExternal", FilterOperator.EQ, this.ID);
                filtersEmpId.push(filterById);
                await this.ReadOdata(oModel, sPath, filtersEmpId).then(async (odata) => {
                    await this.getView().getModel("FLD").setData(odata.results);
                    await oBusyDialog.close();
                }).catch(async (oError) => {
                    await oBusyDialog.close();
                    await MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });
                var aFilters = [
                    new Filter("PickListV2_id", FilterOperator.EQ, "YesNo")  // Example filter: contains 'f'
                ];
                var aFiltersTrans = [
                    new Filter("PickListV2_id", FilterOperator.EQ, "TRANSPORTATIONFORM")  // Example filter: contains 'f'
                ];
                var oItem = new sap.m.ColumnListItem({
                    cells: [
                        // new sap.m.Input(),
                        new sap.m.ComboBox({
                            required: true,
                            items: {
                                path: 'FLD>/',
                                template: new sap.ui.core.ListItem({ key: '{FLD>firstName} {FLD>lastName}', text: '{FLD>firstName} {FLD>lastName}' })
                            }
                        }),
                        new sap.m.ComboBox({
                            required: true,
                            items: {
                                path: 'FLD>/',
                                template: new sap.ui.core.ListItem({
                                    key: { path: 'FLD>relationshipType' },
                                    text: {
                                        path: 'FLD>relationshipType',
                                        // formatter: this.formatter.relationLabel.bind(this)
                                    }
                                })
                            }
                        }),
                        new sap.m.Input(),
                        new sap.m.DatePicker(),
                        new sap.m.Input(),
                        new sap.m.DatePicker(),
                        new sap.m.Input(),
                        new sap.m.TimePicker(),
                        new sap.m.DatePicker(),
                        new sap.m.Input(),
                        new sap.m.TimePicker(),
                        // new sap.m.Input(),
                        // country
                        new sap.m.ComboBox({
                            showSecondaryValues: true,
                            items: {
                                path: '/Country',
                                length: 300,
                                template: new sap.ui.core.ListItem({ key: '{code}', text: '{externalName_en_US}', additionalText: "{code}" })
                            }
                        }),
                        new sap.m.Input(),
                        new sap.m.Input(),
                        new sap.m.Input(),
                        new sap.m.Input(),
                        new sap.m.Input(),
                        // new sap.m.Input(),
                        new sap.m.ComboBox({
                            showSecondaryValues: true,
                            items: {
                                path: '/PickListValueV2',
                                filters: aFilters,
                                template: new sap.ui.core.ListItem({ key: '{externalCode}', text: '{externalCode}', additionalText: "{label_en_US}" })
                            }
                        }),
                        new sap.m.Input(),
                        // new sap.m.Input()
                        //tranportation
                        new sap.m.ComboBox({
                            showSecondaryValues: true,
                            items: {
                                path: '/PickListValueV2',
                                filters: aFiltersTrans,
                                template: new sap.ui.core.ListItem({ key: '{externalCode}', text: '{externalCode}', additionalText: "{label_en_US}" })
                            }
                        }),
                    ]
                });
                var oTable = this.getView().byId("idTable");
                oTable.insertItem(oItem, 0);
                // this.openDialog("Add Family Details", "taqaemployeetravelrequestapp.fragments.family");
                // this.GetFamilyDetails(this.ID);
                // this.getView().byId("idTable").bindItems(
                //     {
                //         path: 'FLD>/',
                //         template: oItem,
                //     });
            },
            onTableDelete: function (oEvent) {
                var oTable = this.getView().byId("idTable");
                oTable.removeItem(oEvent.getParameter("listItem"));
            },
            onOKPress: function (oEvent) {
                oEvent.getSource().getParent().close();
                this.byId("idDialogReq").close();
            },
            onButtonPress: function (parent_ID) {
                var oDynamicTable = this.getView().byId("idTable"),
                    // oSelectedItem = oDynamicTable.getSelectedItem(),
                    oSelectedItems = oDynamicTable.getSelectedItems(),
                    oModel = this.getOwnerComponent().getModel("taqa-srv"),
                    sPath = "/TravelDetails(guid'" + parent_ID + "')/ItsTraveller",
                    // sPath = "/TravellerDetails",
                    that = this,
                    aBatchOperations = [],
                    oPayload = {};
                // var sID = this.getView().getModel("form").getData().ID;
                if (oSelectedItems) {
                    oSelectedItems.forEach(function (oSelectedItem) {
                        var aCells = oSelectedItem.getCells();
                        oPayload["RelationName"] = aCells[0].getSelectedKey();
                        oPayload["Relationship"] = aCells[1].getSelectedKey();
                        oPayload["Phone"] = aCells[2].getValue();
                        oPayload["DateOfBirth"] = aCells[3].getValue();
                        oPayload["TravelDetails"] = aCells[4].getValue();
                        oPayload["DepartureDate"] = aCells[5].getValue();
                        oPayload["DepartureSector"] = aCells[6].getValue();
                        oPayload["DepartureTime"] = aCells[7].getValue();
                        oPayload["ReturnDate"] = aCells[8].getValue();
                        oPayload["ReturnSector"] = aCells[9].getValue();
                        oPayload["ReturnTime"] = aCells[10].getValue();
                        oPayload["TravelCountry"] = aCells[11].getValue();
                        oPayload["AirportCity"] = aCells[12].getValue();
                        oPayload["ReasonForTravel"] = aCells[13].getValue();
                        oPayload["LocalModbileNumber"] = aCells[14].getValue();
                        oPayload["SeatPreference"] = aCells[15].getValue();
                        oPayload["MealPreference"] = aCells[16].getValue();
                        oPayload["VisaRequirement"] = aCells[17].getValue();
                        oPayload["FrequentFlyerNumber"] = aCells[18].getValue();
                        oPayload["Transportation"] = aCells[19].getValue();
                        oPayload["parent_ID"] = parent_ID;
                    });
                    aBatchOperations.push(oPayload);
                    // if (!sID) {
                    //     aBatchOperations.push(this.getView().getModel("item").getData())
                    //     debugger;
                    // }
                    var oBusyDialog = new sap.m.BusyDialog({
                    });
                    oBusyDialog.open();
                    aBatchOperations.forEach(function (oRecord) {
                        oModel.createEntry(sPath, {
                            properties: oRecord,
                            success: function (oData, oResponse) {
                                // Handle success for each record creation
                            },
                            error: function (oError) {
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                // Handle error for each record creation
                            }
                        });
                    });
                    oModel.submitChanges({
                        success: function (oData, oResponse) {
                            oBusyDialog.close();
                            // that.onTableSelectChange();
                            // Handle success for batch submission
                        },
                        error: function (oError) {
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            // Handle error for batch submission
                        }
                    })
                } else {
                    sap.m.MessageToast.show("Please select a row to Save");
                }
            },
            onInitiateProcess: function (oEvent) {
                var oJSONVisible = this.getView().getModel("visible");
                oJSONVisible.getData().tab2 = true;
                oJSONVisible.updateBindings(true);
                var oCAPMModel = this.getOwnerComponent().getModel("taqa-srv"),
                    oFinalModel = this.getView().getModel("form").getData(),
                    sPathTravel2 = "/TravelDetails(guid'" + oFinalModel.ID + "')";
                oFinalModel.Status = "Initiated Request";
                var oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open();
                delete oFinalModel.ItsTicketDetails;
                delete oFinalModel.ItsTraveller;
                this.UpdateRecord(oCAPMModel, sPathTravel2, oFinalModel).then((odata) => {
                    this.oTable.getBinding("items").refresh();
                    oBusyDialog.close();
                }).catch((oError) => {
                    oBusyDialog.close();
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });
            },
            onPdfDownload: function (oEvent) {

                var oSelectedHeader = this.getView().getModel("form").getData();
                var oSelectedItem = this.getView().getModel("item").getData();
                //var oItem = this.getView().getModel("item").getData();
                var oSelectedTicket = this.getView().getModel("Ticket").getData();
                var difftime = Math.abs(new Date(oSelectedItem.ReturnDate) - new Date(oSelectedItem.DepartureDate));
                var NoOfDays = Math.ceil(difftime / (1000 * 60 * 60 * 24));
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
                var yyyy = today.getFullYear();
                var date = yyyy + '-' + mm + '-' + dd;
                if (oSelectedHeader.ReissuranceRefNo) {
                    var RefNo = oSelectedHeader.ReissuranceRefNo + "_01";
                }
                else {
                    var RefNo = oSelectedItem.TravelCountry + "/" + yyyy;
                }
                var logo = "../util/taqalogo.webp";
                // var logo = "https://logowik.com/content/uploads/images/taqa1132.logowik.com.webp";
                var html_start = "<!DOCTYPE html><html>";
                var mainhead = `<head>
                    <meta charset='utf-8'>
                    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                    <title>" + oSelectedItem.TravelType + "</title>
                    <meta name='viewport' content='width=device-width, initial-scale=1'>
                     <style type='text/css'>
                    body {
                    margin: 10px 10px 10px 10px;
                    // "font-family: 'Consolas', 'Trebuchet MS', sans-serif;" +
                    width: fit-content;
                     }
                    .vertical_line {
                    border-right: 1px solid #000033;
                    }
                    .left_margin {
                    margin-left: 10px;
                    }
                    table
                     {
                     border-collapse: collapse;
                     padding: 3px;
                    
                     }
                    
                     
                    body {background-color: powderblue;}
                              h1   {font-size:20px}
                              p    {font-size:10px}
                              b    {font-size:10px}
                              label    {font-size:10px}
                              th {font-size:10px}
                              td {font-size:10px}
                              h3 {font-size:15px}
                              h2 {font-size:20px}
                             

                    </style>
                    </head>`;
                // // <img src="https://logowik.com/content/uploads/images/taqa1132.logowik.com.webp" class='left_margin' height='80px' width='100px'>
                var reIssuanceBody1 = `<body>
                    <div style='border: 1px solid #000033;'>
                        <div style='display: flex; flex-direction: row;border-bottom: 1px solid #000033;'>
                            <div style='display: flex; flex-direction: row; align-items: left; width: 50%;' class='vertical_line' > 
                                <img src="${logo}" class='left_margin' height='80px' width='100px'>
                                <h3>TRAVEL REQUEST/LPO FORM (TRF)</h3>
                            </div>
                            <div class='left_margin vertical_line' style='width: 25%;'>
                                <h6>(Div-Country/initial/S.No/Year)</h6>
                                <h4>${RefNo}</h4>
                            </div>
                            <div class='left_margin' style='width: 25%;'>
                                <h5>Date :</h5>
                                <h4 id="date">${date}</h4>
                            </div>
                        </div>
                        `;
                var reIssuanceBody2 = `
                        <div style='border-bottom: 1px solid #000033;padding: 5px;'>
                            <input type='checkbox'>
                                <label>New Booking</label>
                                <input type='checkbox'>
                                    <label>Others</label>
                                    <input type='checkbox'>
                                        <label>For Office Staff</label>
                                        <input type='checkbox'>
                                            <label>For Field Staff</label>
                                        </div>
                                        <div style='display: flex; flex-direction: row;border-bottom: 1px solid #000033;'>
                                            <div style='display: flex; flex-direction: row; align-items: center; width: 33%;padding: 5px;' class='vertical_line'>
                                                <b>Focal Person :</b>
                                                <label>${oSelectedHeader.FocalPerson}</label>
                                            </div>
                                            <div class='left_margin vertical_line' style='width: 33%;padding: 5px;'>
                                                <b>Department :</b>
                                                <label>${oSelectedHeader.Deparment}</label>
                                            </div>
                                            <div class='left_margin' style='width: 33%;padding: 5px;'>
                                                <b>Contact No :</b>
                                                <label>${oSelectedHeader.ContactNo}</label>
                                            </div>
                                        </div>
                                        <div style='width: 100%;'>
                                            <table style='width: 100%'; border='1'>
                                                <caption style='padding: 5px;'><b style='color: rebeccapurple;'>Traveller Information</b></caption>
                                                <tr>
                                                    <th>Title</th>
                                                    <th style='width:8%'>First Name</th>
                                                    <th style='width:9%'>Last Name</th>
                                                    <th style='width:11%'>Middle Name</th>
                                                    <th style='width:10%'>Date of Birth</th>
                                                    <th>Emp.No</th>
                                                    <th style='width:12%'>Travel Purpose</th>
                                                    <th>Code Div/Territory</th>
                                                    <th style='width:11%'>Expense Code</th>
                                                    <th style='width:10%'>Project Code</th>
                                                    <th style='width:9%'>Designation</th>
                                                    <th>Age</th>
                                                </tr>
                                                <tr>
                                                    <td>Mr</td>
                                                    <td>${oSelectedHeader.EmployeeLastName}</td>
                                                    <td>${oSelectedHeader.EmployeeFirstName}</td>
                                                    <td>${oSelectedHeader.EmployeeMiddleName}</td>
                                                    <td>${oSelectedHeader.DateOfBirth}</td>
                                                    <td>${oSelectedHeader.EmployeeID}</td>
                                                    <td>${oSelectedHeader.TravelType}</td>
                                                    <td>${oSelectedHeader.CodeDiv}/</td>
                                                    <td>${oSelectedHeader.ExpenseCode}</td>
                                                    <td>${oSelectedHeader.ProjectCode}</td>
                                                    <td>${oSelectedHeader.Designation}</td>
                                                    <td>${oSelectedHeader.Age}</td>
                                                </tr>
                                            </table>
                                        </div>
                                        `;
                var reIssuanceBody3 = `
                                        <div style='border-bottom: 1px solid #000033;padding: 5px;'>
                                            <b>Type of Travel :</b>
                                            <input type='checkbox'>
                                                <label>One Way</label>
                                                <input type='checkbox'>
                                                    <label>Return</label>
                                                    <b>Class :</b>
                                                    <input type='checkbox'>
                                                        <label>Business</label>
                                                        <input type='checkbox'>
                                                            <label>Economy</label>
                                                            <b>Business Trip Approved By CEO :</b>
                                                            <input type='checkbox'>
                                                                <label>Yes</label>
                                                                <input type='checkbox'>
                                                                    <label>No</label>
                                                                    <input type='checkbox'>
                                                                        <label>NA</label>
                                                                    </div>
                                                                    <div style='border-bottom: 1px solid #000033;padding: 5px;'>
                                                                        <b>Approve Type :</b>
                                                                        <input type='checkbox'>
                                                                            <label>Leave Approved</label>
                                                                            <input type='checkbox'>
                                                                                <label>Trip Approved</label>
                                                                                <input type='checkbox'>
                                                                                    <label>Family Approved</label>
                                                                                    <b>Family Comments:</b>
                                                                                    <label>comments</label>
                                                                                </div>
                                                                                <div style='width: 100%;'>
                                                                                    <table style='width: 100%;' border='1'>
                                                                                        <caption style='padding: 5px;'><b style='color: rebeccapurple;'>Travel Itinerary Required</b></caption>
                                                                                        <tr>
                                                                                            <th>Departure Date</th>
                                                                                            <th>Sector</th>
                                                                                            <th>Time</th>
                                                                                            <th>Return Date</th>
                                                                                            <th>Sector</th>
                                                                                            <th>Time</th>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td align='center'>${oSelectedItem.DepartureDate}</td>
                                                                                            <td align='center'>${oSelectedItem.DepartureSector}</td>
                                                                                            <td align='center'>${oSelectedItem.DepartureTime}</td>
                                                                                            <td align='center'>${oSelectedItem.ReturnDate}</td>
                                                                                            <td align='center'>${oSelectedItem.ReturnSector}</td>
                                                                                            <td align='center'>${oSelectedItem.ReturnTime}</td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </div>
                                                                                <div style='height: 30px;'></div>
                                                                                <div style='border: 1px solid #000033;'>
                                                                                    <div style='display: flex; flex-direction: row;border-bottom: 1px solid #000033;'>
                                                                                        <div style='width:25%;padding: 5px;'>
                                                                                            <b>Local Mob No:</b>
                                                                                            <label>${oSelectedItem.LocalModbileNumber}</label>
                                                                                        </div>
                                                                                        <div class='left_margin' style='width: 25%;padding: 5px;'>
                                                                                            <b>Overseas Mob No :</b>
                                                                                            <label>${oSelectedHeader.OverseasMobileNumber}</label>
                                                                                        </div>
                                                                                        <div class='left_margin' style='width: 25%;padding: 5px;'>
                                                                                            <b>Seat Preference :</b>
                                                                                            <label>${oSelectedItem.SeatPreference}</label>
                                                                                        </div>
                                                                                        <div class='left_margin' style='width: 25%;padding: 5px;'>
                                                                                            <b>Meal Preference :</b>
                                                                                            <label>${oSelectedItem.MealPreference}</label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>`;
                var reIssuanceBody4 = `
                                                                                <div style='display: flex; flex-direction: row;border-bottom: 1px solid #000033;'>
                                                                                    <div style=' width:50%;padding: 5px;'>
                                                                                        <b>Do You Have Travel Visa</b>
                                                                                        <input type='checkbox'>
                                                                                            <label>Yes</label>
                                                                                            <input type='checkbox'>
                                                                                                <label>No</label>
                                                                                            </div>
                                                                                            <div style='padding: 5px;'>
                                                                                                <b>Frequently Flyer No. If any:</b>
                                                                                                <label>${oSelectedItem.FrequentFlyerNumber}</label>
                                                                                            </div>
                                                                                    </div>
                                                                                    <div style='text-align: center;border-bottom: 1px solid #000033;padding: 5px;'>
                                                                                        <caption><b>LPO</b></caption>
                                                                                    </div>
                                                                                    <div style='display: flex; flex-direction: row;border-bottom: 1px solid #000033;'>
                                                                                        <div style='width: 40%;padding: 5px;' class='vertical_line'>
                                                                                            <b>Lpo no</b>
                                                                                        </div>
                                                                                        <div class='left_margin vertical_line' style='width: 40%;padding: 5px;'>
                                                                                            <label></label>
                                                                                        </div>
                                                                                        <div class='left_margin vertical_line' style='width: 10%;padding: 5px;'>
                                                                                            <b>Currency</b>
                                                                                        </div>
                                                                                        <div class='left_margin' style='width: 10%;padding: 5px;'>
                                                                                            <label></label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div style='width: 100%;'>
                                                                                        <table style='width: 100%;' border='1'>
                                                                                            <tr>
                                                                                                <th>Airline</th>
                                                                                                <th>Sector</th>
                                                                                                <th>Travel Date</th>
                                                                                                <th>Ticket No</th>
                                                                                                <th>Base Fare</th>
                                                                                                <th>Taxes</th>
                                                                                                <th>Curency Total</th>
                                                                                                <th>Remarks:To be filled by MSE Travel Focal Point,if any</th>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align='center'>${oSelectedTicket.Airline}</td>
                                                                                                <td align='center'>${oSelectedTicket.Sector}</td>
                                                                                                <td align='center'>${oSelectedTicket.TravelDate}</td>
                                                                                                <td align='center'>${oSelectedTicket.TicketNo}</td>
                                                                                                <td align='center'>${oSelectedTicket.BaseFare}</td>
                                                                                                <td align='center'>${oSelectedTicket.Taxes}</td>
                                                                                                <td align='center'>${oSelectedTicket.Currency}</td>
                                                                                                <td align='center'>${oSelectedTicket.Comments}</td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </div>
                                                                                    <div style='display: flex; flex-direction: row;border-bottom: 1px solid #000033;'>
                                                                                        <div style=' width:30%;padding: 5px;'>
                                                                                            <b>Total Amount:</b>
                                                                                            <label></label>
                                                                                        </div>
                                                                                        <div style='padding: 5px;'>
                                                                                            <b>Total in Words:</b>
                                                                                            <label></label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div style='display: flex; flex-direction: row;border-bottom: 1px solid #000033;'>
                                                                                        <div style='width: 70%;padding: 5px;' class='vertical_line'>
                                                                                            <b>Approver Details:</b>
                                                                                            <label></label>
                                                                                        </div>
                                                                                        <div class='left_margin' style='width: 30%;padding: 5px;'>
                                                                                            <b>PO number:</b>
                                                                                            <label></label>
                                                                                        </div>
                                                                                    </div>
                                                                                    </body>
                                                                                    `;
                var approverPage1 = `<div style='width: 100%;'>
                                                                                        <table style='width: 100%;' border='1'>
                                                                                            <tr>
                                                                                                <th>Level</th>
                                                                                                <th>Employee</th>
                                                                                                <th>Name</th>
                                                                                                <th>Position</th>
                                                                                                <th>Status</th>
                                                                                                <th>Comments</th>
                                                                                                <th>Date</th>
                                                                                                <th>Time</th>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </div>
                                                                                </div>
                                                                            </body>`;
                var approverPage2 = `<div style='width: 100%;'>
                                                                                <table style='width: 100%;' border='1'>
                                                                                    <tr>
                                                                                        <th>Level</th>
                                                                                        <th>Employee</th>
                                                                                        <th>Name</th>
                                                                                        <th>Position</th>
                                                                                        <th>Status</th>
                                                                                        <th>Comments</th>
                                                                                        <th>Date</th>
                                                                                        <th>Time</th>
                                                                                    </tr>
                                                                                </table>
                                                                            </div>
                                                                    </div>
                                                                </body>`;
                var html_end = "</html>";
                switch (oSelectedHeader.TravelType) {
                    case "Annual Leave":
                        var dependendentHtml = `<tr>
                                                                <th>S.No</th>
                                                                <th>Dependent Name</th>
                                                                <th>Date of Birth</th>
                                                            </tr>
                                                            `;
                        var head = `<head>
                        <meta charset='utf-8'>
                        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                        <title>" + oSelectedItem.TravelType + "</title>
                        <meta name='viewport' content='width=device-width, initial-scale=1'>
                         <style type='text/css'>
                        
                        body {background-color: powderblue;}
                                  h1   {font-size:20px}
                                  p    {font-size:10px}
                                  b    {font-size:10px}
                                  label    {font-size:10px}
                                  th {font-size:10px}
                                  td {font-size:10px
                                  h3 {font-size:30px}
                                  h2 {font-size:20px}
                                 
    
                        </style>`;


                        var annualBody = `<body>
                                                                                <div style='border: 1px solid #000033;margin: 10px 10px 10px 10px;'>
                                                                                    <div style='display: flex; justify-content: center; align-items: center;'>
                                                                                        <h2 style='margin-left: auto;'><u>Leave Application</u></h2>
                                                                                        <div style='border: 1px solid #000033; margin-left: auto; margin-right:35px; padding: 5px;'>
                                                                                            <b>Leave Type :</b>
                                                                                            <label>${oSelectedHeader.TravelType}</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <table border='1' style='margin: 20px 20px 20px 20px; width: 95%;'>
                                                                                            <tr>
                                                                                                <td><b>Employee No :</b><label>${oSelectedHeader.EmployeeID}</label></td>
                                                                                                <td><b>Employee Name :</b><label>${oSelectedHeader.EmployeeLastName}</label></td>
                                                                                                <td><b>Employee Department :</b><label>${oSelectedHeader.Deparment} Tech</label></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td><b>Leave Schedule :</b><label>${oSelectedHeader.LeaveSchedule}</label></td>
                                                                                                <td><b>Company name :</b><label>${oSelectedHeader.CompanyCode}</label></td>
                                                                                                <td><b>Position :</b><label>${oSelectedHeader.Position}</label></td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </div>
                                                                                    <div style='border-bottom: 1px solid #000033;'></div>
                                                                                    <div style='margin: 20px;'>
                                                                                        <b style='padding: 5px;'>Leave Details:</b>
                                                                                    </div>
                                                                                    <div style='display: flex;flex-direction: row;margin: 5px 5% 10px 10%;'>
                                                                                        <div>
                                                                                            <table border='1' style='width: 200%;'>
                                                                                                <tr>
                                                                                                    <th style='text-align: center;'>Leave Type</th>
                                                                                                    <td style='text-align: center;'>${oSelectedHeader.TravelType}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th style='text-align: center;'>From Date</th>
                                                                                                    <td style='text-align: center;'>${oSelectedItem.DepartureDate}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th style='text-align: center;'>To Date</th>
                                                                                                    <td style='text-align: center;'>${oSelectedItem.ReturnDate}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th style='text-align: center;'>No of Days</th>
                                                                                                    <td style='text-align: center;'>${NoOfDays}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th style='text-align: center;'>Contact number</th>
                                                                                                    <td style='text-align: center;'>${oSelectedHeader.ContactNo}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th style='text-align: center;'>Reason</th>
                                                                                                    <td style='text-align: center;'></td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th style='text-align: center;'>Comments</th>
                                                                                                    <td style='text-align: center;'>${oSelectedHeader.Comments}</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>
                                                                                        <div style='margin-left: auto;'>
                                                                                            <table border='1'>
                                                                                                <tr><td><b>Leave App No: </b><label></label></td></tr>
                                                                                                <tr><td><b>Leave Balance : </b><label></label></td></tr>
                                                                                            </table>
                                                                                        </div>
                                                                                    </div>
                                                                                    <b style='padding: 5px;margin: 10px 10px 10px 10px;'>Travel Details :</b>
                                                                                    <div style='margin: 0% 2% 1% 2%; padding: 5px'>
                                                                                        <div style='display: flex; flex-direction: row;padding: 5px;margin: 10px 10px 10px 10px;'>
                                                                                            <b>Travel Arrangements :&nbsp</b>
                                                                                            <input type='checkbox'>
                                                                                                <label>Applicable</label>
                                                                                                <input type='checkbox'>
                                                                                                    <label>Not Applicable</label>
                                                                                                </div>
                                                                                                <div style='display: flex; flex-direction: row;padding: 5px;margin: 10px 10px 10px 10px;'>
                                                                                                    <b>Excursion Date &nbsp&nbsp&nbsp&nbsp&nbsp:&nbsp</b>
                                                                                                    <label>From &nbsp</label>
                                                                                                    <label>Auh &nbsp</label>
                                                                                                    <label>To &nbsp</label>
                                                                                                    <label>Hyd &nbsp</label>
                                                                                                    <label>Return &nbsp</label>
                                                                                                    <label>Leh</label>
                                                                                                </div>
                                                                                                <div style='display: flex; flex-direction: row;padding: 5px;margin: 10px 10px 10px 10px;'>
                                                                                                    <b>Dependent Details :</b>
                                                                                                    <table style='width: auto;' border='1'>
                                                                                                        ${dependendentHtml}
                                                                                                    </table>
                                                                                                </div>
                                                                                                <div style='display: flex; flex-direction: row;padding: 5px;margin: 10px 10px 10px 10px;'>
                                                                                                    <b>Other Details &nbsp&nbsp&nbsp:&nbsp</b>
                                                                                                    <table style='width: auto;' border='1'>
                                                                                                        <tr>
                                                                                                            <td>Return Date : ${oSelectedItem.ReturnDate}</td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <td>Travel Date : ${oSelectedItem.DepartureDate}</td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </div>
                                                                                        </div>
                                                                                        <b style='padding: 5px;margin: 10px 10px 10px 10px;'>Approver Details :</b><br>
                                                                                            <table border='1'><tr><td><b>Leave Case:</b> General</td></tr>
                                                                                                <div style='margin: 10px 10px 10px 10px;'>
                                                                                                    <table style='width: 100%;' border='1'>
                                                                                                        <tr>
                                                                                                            <th>Level</th>
                                                                                                            <th>Employee No</th>
                                                                                                            <th>Employee Name</th>
                                                                                                            <th>Position</th>
                                                                                                            <th>Comments</th>
                                                                                                            <th>Status</th>
                                                                                                            <th>Date</th>
                                                                                                            <th>Time</th>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>
                                                                                        </body>
                                                                                    </html>
                                                                                    `;
                        var annualLeavePage = `${reIssuanceBody1}${reIssuanceBody2}${reIssuanceBody3}${reIssuanceBody4}`;
                        var approverPage12 = `<div style='width: 100%;'>
                                                                                        <table style='width: 100%;' border='1'>
                                                                                            <tr>
                                                                                                <th>Level</th>
                                                                                                <th>Employee</th>
                                                                                                <th>Name</th>
                                                                                                <th>Position</th>
                                                                                                <th>Status</th>
                                                                                                <th>Comments</th>
                                                                                                <th>Date</th>
                                                                                                <th>Time</th>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </div>
                                                                                </div>
                                                                            </body>`;
                        var approverPage22 = `<div style='width: 100%;'>
                                                                                <table style='width: 100%;' border='1'>
                                                                                    <tr>
                                                                                        <th>Level</th>
                                                                                        <th>Employee</th>
                                                                                        <th>Name</th>
                                                                                        <th>Position</th>
                                                                                        <th>Status</th>
                                                                                        <th>Comments</th>
                                                                                        <th>Date</th>
                                                                                        <th>Time</th>
                                                                                    </tr>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </body>`;
                        var oAnnualvarter = head + annualBody;
                        // var annualWindowWindow = window.open("B", "PrintProgram");
                        var annualLeaveApprover1 = `<html>${mainhead}<div style="page-break-before: always;">${annualLeavePage}${approverPage12}</html>`;
                        // var annualLeaveApprover2 = `<html>${head}<div style="page-break-before: always;">${annualLeavePage}${approverPage22}</html>`;
                        // annualWindowWindow.document.write(oAnnualvarter);
                        // annualWindowWindow.document.write(annualLeaveApprover1);
                        // //annualWindowWindow.document.write(annualLeaveApprover2);
                        // //annualWindowWindow.document.close();
                        // annualWindowWindow.focus();
                        // setTimeout(function () {
                        //     annualWindowWindow.print("download2");
                        //     annualWindowWindow.close();
                        // }, 1000);
                        var oFilename = `${oSelectedHeader.TravelType}_${oSelectedHeader.EmployeeID}.pdf`;
                        const oOptions4 = {
                            margin: [0.3, 0.3, 0.3, 0.3],
                            filename: oFilename,
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'in', format: 'A4', orientation: 'p' },
                            // pagebreak: {avoid: 'tr' }
                        };
                        html2pdf().set(oOptions4).from(oAnnualvarter + annualLeaveApprover1).save();
                        // var z = html2pdf().set(oOptions).from(businessTrip + businessTripApprover1).save();
                        // var a = new Blob([z], { type: 'application/pdf' });

                        // var form = new FormData();
                        // form.append("cmisaction", "createDocument");
                        // form.append("propertyId[0]", "cmis:name");
                        // form.append("propertyValue[0]", "admin.pdf");
                        // form.append("propertyId[1]", "cmis:objectTypeId");
                        // form.append("propertyValue[1]", "cmis:document");
                        // form.append("succinct", "true");
                        // form.append("filename","admin.pdf");
                        // form.append("_charset_", "UTF-8");
                        // form.append("includeAllowableActions", "true");
                        // form.append("media", a, "");
                        // var settings = {
                        //   "url": "TAQA_DMS/browser/395e84fc-d97f-4197-adaa-10aca70a7cca/root/Public root folder/Timesheet",
                        //   "method": "POST",
                        //   "timeout": 0,
                        //   "processData": false,
                        //   "mimeType": "multipart/form-data",
                        //   "contentType": false,
                        //   "data": form
                        // };
                        // $.ajax(settings).done(function (response) {
                        //   console.log(response);
                        // });
                        break;
                    case "Rotational Leave":
                        var head = `<head>
                        <meta charset='utf-8'>
                        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                        <title>" + oSelectedItem.TravelType + "</title>
                        <meta name='viewport' content='width=device-width, initial-scale=1'>
                         <style type='text/css'>
                        body {background-color: powderblue;}
                                  h1   {font-size:20px}
                                  p    {font-size:10px}
                                  b    {font-size:10px}
                                  label    {font-size:10px}
                                  th {font-size:10px}
                                  td {font-size:10px}
                                  h3 {font-size:30px}
                                  h2 {font-size:20px}
                                  table
                                  {
                                  border-collapse: collapse;
                                  padding: 3px;
                                 
                                  }
    
                        </style>`;

                        var rotationLeaveBody = `<body>
                                                                                        <div style='border: 1px solid #000033;margin: 10px 10px 10px 10px;'>
                                                                                            <div style='display: flex; justify-content: center; align-items: center;'>
                                                                                                <h2 style='margin-left: auto;'><u>Leave Application</u></h2>
                                                                                                <div style='border: 1px solid #000033; margin-left: auto; margin-right:35px; padding: 5px;'>
                                                                                                    <b>Leave Type :</b>
                                                                                                    <label>${oSelectedHeader.TravelType}</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div>
                                                                                                <table border='1' style='margin: 20px 20px 20px 20px; width: 95%;'>
                                                                                                    <tr>
                                                                                                        <td><b>Employee No :</b><label>${oSelectedHeader.EmployeeID}</label></td>
                                                                                                        <td><b>Employee Name :</b><label>${oSelectedHeader.EmployeeFirstName}</label></td>
                                                                                                        <td><b>Employee Department :</b><label>${oSelectedHeader.Deparment}</label></td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td><b>Leave Schedule :</b><label>${oSelectedHeader.LeaveSchedule}</label></td>
                                                                                                        <td><b>Company name :</b><label>${oSelectedHeader.CompanyCode}</label></td>
                                                                                                        <td><b>Position :</b><label>${oSelectedHeader.Position}</label></td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </div>
                                                                                            <div style='border-bottom: 1px solid #000033;'></div>
                                                                                            <div style='margin: 20px;'>
                                                                                                <b style='padding: 5px;'>Leave Details:</b>
                                                                                            </div>
                                                                                            <div style='display: flex;flex-direction: row;margin: 5px 5% 10px 10%;'>
                                                                                                <div>
                                                                                                    <table border='1' style='width: 200%;'>
                                                                                                        <tr>
                                                                                                            <th style='text-align: center;'>Leave Type</th>
                                                                                                            <td style='text-align: center;'>${oSelectedHeader.TravelType}</td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <th style='text-align: center;'>From Date</th>
                                                                                                            <td style='text-align: center;'>${oSelectedItem.DepartureDate}</td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <th style='text-align: center;'>To Date</th>
                                                                                                            <td style='text-align: center;'>${oSelectedItem.ReturnDate}</td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <th style='text-align: center;'>No of Days</th>
                                                                                                            <td style='text-align: center;'>${NoOfDays}</td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <th style='text-align: center;'>Contact number</th>
                                                                                                            <td style='text-align: center;'>${oSelectedHeader.ContactNo}</td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <th style='text-align: center;'>Reason</th>
                                                                                                            <td style='text-align: center;'>${oSelectedItem.ReasonForTravel}</td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <th style='text-align: center;'>Comments</th>
                                                                                                            <td style='text-align: center;'>${oSelectedTicket.Comments}</td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </div>
                                                                                                <div style='margin-left: auto;'>
                                                                                                    <table border='1'>
                                                                                                        <tr><td><b>Leave App No: </b><label></label></td></tr>
                                                                                                        <tr><td><b>Leave Balance : </b><label></label></td></tr>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div style='display: flex; flex-direction: row;padding: 5px;margin: 10px 10px 10px 10px;'>
                                                                                                <b style='margin-right: 10px;'>Travel Arrangements :</b>
                                                                                                <label>Applicable</label>
                                                                                                <b style='margin-left: 10%;'>Home Airport :</b>
                                                                                                <label>${oSelectedHeader.HomeCountry}</label>
                                                                                            </div>
                                                                                            <div style='display: flex; flex-direction: row;padding: 5px;margin: 20px 10px 10px 10px;'>
                                                                                                <b>Contact Details On Vaccation :</b>
                                                                                                <table>
                                                                                                    <tr><td> <label>Address: </label> </td></tr>
                                                                                                    <tr><td><label>Number: ${oSelectedHeader.OverseasMobileNumber}</label></td></tr>
                                                                                                </table>
                                                                                            </div>
                                                                                            <b style='margin: 10px 10px 0px 10px;'>Approver Details :</b><br>
                                                                                                <div style='margin: 5px 10px 10px 10px;'>
                                                                                                    <table border='1'><tr><td><b>Leave Case:</b> More than Schedule(Rotational Leave)</td></tr>
                                                                                                        <table style='width: 100%;' border='1'>
                                                                                                            <tr>
                                                                                                                <th>Level</th>
                                                                                                                <th>Employee No</th>
                                                                                                                <th>Employee Name</th>
                                                                                                                <th>Position</th>
                                                                                                                <th>Comments</th>
                                                                                                                <th>Status</th>
                                                                                                                <th>Date</th>
                                                                                                                <th>Time</th>
                                                                                                            </tr>
                                                                                                        </table>
                                                                                                </div>
                                                                                        </div>
                                                                                    </body>
                                                                                    `;
                        var rotationPage = `${reIssuanceBody1}${reIssuanceBody2}${reIssuanceBody3}${reIssuanceBody4}`;
                        var approverPage13 = `<div style='width: 100%;'>
                                                                                        <table style='width: 100%;' border='1'>
                                                                                            <tr>
                                                                                                <th>Level</th>
                                                                                                <th>Employee</th>
                                                                                                <th>Name</th>
                                                                                                <th>Position</th>
                                                                                                <th>Status</th>
                                                                                                <th>Comments</th>
                                                                                                <th>Date</th>
                                                                                                <th>Time</th>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </div>
                                                                                </div>
                                                                            </body>`;
                        var approverPage23 = `<div style='width: 100%;'>
                                                                                <table style='width: 100%;' border='1'>
                                                                                    <tr>
                                                                                        <th>Level</th>
                                                                                        <th>Employee</th>
                                                                                        <th>Name</th>
                                                                                        <th>Position</th>
                                                                                        <th>Status</th>
                                                                                        <th>Comments</th>
                                                                                        <th>Date</th>
                                                                                        <th>Time</th>
                                                                                    </tr>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </body>`;
                        var rotationLeave = `<html>${head}${rotationLeaveBody}</html>`;
                        // var rotationLeave = oReissurance;
                        var rotationLeavePage2 = `<html>${mainhead}<div style="page-break-before: always;">${rotationPage}${approverPage13}<div style="page-break-after: always;"></div></html>`;
                        // var rotationLeavePage3 = `<html>${head}${style}<div style="page-break-before: always;">${rotationPage}${approverPage23}</div></html>`;
                        // var rotationWindow = window.open("B", "PrintProgram");
                        // rotationWindow.document.write(rotationLeave);
                        // rotationWindow.document.write(rotationLeavePage2);
                        // // rotationWindow.document.write(rotationLeavePage3);
                        // //rotationWindow.document.close();
                        // rotationWindow.focus();
                        // setTimeout(function () {
                        //     rotationWindow.print("download2");
                        //     rotationWindow.close();
                        // }, 1000);
                        var oFilename = `${oSelectedHeader.TravelType}_${oSelectedHeader.EmployeeID}.pdf`;
                        const oOptions3 = {
                            margin: [0.3, 0.3, 0.3, 0.3],
                            filename: oFilename,
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'in', format: 'A4', orientation: 'p' },
                            // pagebreak: {avoid: 'tr' }
                        };
                        html2pdf().set(oOptions3).from(rotationLeave + rotationLeavePage2).save();
                        // var z = html2pdf().set(oOptions).from(businessTrip + businessTripApprover1).save();
                        // var a = new Blob([z], { type: 'application/pdf' });

                        // var form = new FormData();
                        // form.append("cmisaction", "createDocument");
                        // form.append("propertyId[0]", "cmis:name");
                        // form.append("propertyValue[0]", "admin.pdf");
                        // form.append("propertyId[1]", "cmis:objectTypeId");
                        // form.append("propertyValue[1]", "cmis:document");
                        // form.append("succinct", "true");
                        // form.append("filename","admin.pdf");
                        // form.append("_charset_", "UTF-8");
                        // form.append("includeAllowableActions", "true");
                        // form.append("media", a, "");
                        // var settings = {
                        //   "url": "TAQA_DMS/browser/395e84fc-d97f-4197-adaa-10aca70a7cca/root/Public root folder/Timesheet",
                        //   "method": "POST",
                        //   "timeout": 0,
                        //   "processData": false,
                        //   "mimeType": "multipart/form-data",
                        //   "contentType": false,
                        //   "data": form
                        // };
                        // $.ajax(settings).done(function (response) {
                        //   console.log(response);
                        // });
                        break;
                    case "Business Travel":
                        var head = `<head>
                                                                        <meta charset='utf-8'>
                                                                            <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                                                                                <title>Business Leave</title>
                                                                                <meta name='viewport' content='width=device-width, initial-scale=1'>
                                                                                    <style>
                                                                                        body {background-color: powderblue;}
                                                                                        h1   {font-size:20px}
                                                                                        p    {font-size:10px}
                                                                                        b    {font-size:10px}
                                                                                        label {font-size:10px}
                                                                                        h3 {font-size:30px}
                                                                                        h2 {font-size:20px}
                                                                                        .vertical_line {
                                                                                            border-right: 1px solid #000033;
                                                                                            }
                                                                                            .left_margin {
                                                                                            margin-left: 10px;
                                                                                            }
                                                                                            
                                                                                    </style>`;
                        // <img src="https://logowik.com/content/uploads/images/taqa1132.logowik.com.webp" class=\"left_margin\" height='100px' width='100px'></img>
                        // </div>
                        // <div style='text-align: right;'>
                        var businessBody = `<body>
                        <div style='border: 1px solid #000033;'>
                        <div style='display: flex; flex-direction: row;'>
                            <div style='display: flex; flex-direction: row; align-items: center;width:70%' > 
                                   
                                                                                               <img src="${logo}" class='left_margin' height='80px' width='100px'></img>
                                                                                               <h2 style='text-align: center;'><u>Trip Request Form</u></h2>
                                                                                            </div>
                                                                                            <div style='text-align: right;'display: flex; flex-direction: row; align-items: center;'>
                                                                                                <b>Date:</b> <label>${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()}</label>
                                                                                            
                                                                                            </br>
                                                                                                <b>Request Number:</b> <label>00000</label>
                                                                                            </div>
                                                                                        </div>
                                                                                   
                                                                                    <div>
                                                                                        <div style='margin-left: 2px'><b>Employee Details</b></div>
                                                                                        <table border='1' style='margin: 20px 0px 0px 0px; width: 100%;'>
                                                                                            <tr>
                                                                                                <td><b>Employee No :</b><label>${oSelectedHeader.EmployeeID}</label></td>
                                                                                                <td><b>Last Name :</b><label>${oSelectedHeader.EmployeeLastName}</label></td>
                                                                                                <td><b>Gender :</b><label>${oSelectedHeader.Gender}</label></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td><b>Position :</b><label>${oSelectedHeader.Position}</label></td>
                                                                                                <td><b>First name :</b><label>${oSelectedHeader.EmployeeFirstName}</label></td>
                                                                                                <td><b>Leave Schedule :</b><label></label></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td><b>Company Code :</b><label>${oSelectedHeader.CompanyCode}</label></td>
                                                                                                <td><b>Middle name :</b><label>${oSelectedHeader.EmployeeMiddleName}</label></td>
                                                                                                <td><b>Home Country :</b><label>${oSelectedHeader.HomeCountry}</label></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td><b>Department :</b><label>${oSelectedHeader.Deparment}</label></td>
                                                                                                <td><b>DOB :</b><label>${oSelectedHeader.DateOfBirth}</label></td>
                                                                                                <td><b>Contact No :</b><label>${oSelectedHeader.ContactNo}</label></td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <table border='1' style='margin: 0px 0px 20px 0px; width: 100%;'>
                                                                                            <tr>
                                                                                                <td><b>Employee Full Name :</b><label>${oSelectedHeader.EmployeeFirstName} ${oSelectedHeader.EmployeeMiddleName} ${oSelectedItem.EmployeeLastName}</label></td>
                                                                                                <td><b>Reporting Manager :</b><label>${oSelectedHeader.ReportingManager}</label></td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </div>
                                                                                    <div>
                                                                                        <div style='margin-left: 2px'><b>Trip Details</b></div>
                                                                                        <table border='1' style='margin: 20px 0px 20px 0px; width: 100%;'>
                                                                                            <tr>
                                                                                                <td><b>Trip Type :</b><label>${oSelectedHeader.TravelType}</label></td>
                                                                                                <td><b>Trip Subject :</b><label>${oSelectedItem.TravelCountry}</label></td>
                                                                                                <td><b>Trip Description :</b><label></label></td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </div>
                                                                                    <div>
                                                                                        <div style='margin-left: 2px'><b>Travel Details</b></div>
                                                                                        <table border='1' style='margin: 20px 0px 20px 0px; width: 100%;'>
                                                                                            <tr>
                                                                                                <td><b>Trip Start Date :</b><label>${oSelectedItem.DepartureDate}</label></td>
                                                                                                <td><b>Trip End Date :</b><label>${oSelectedItem.ReturnDate}</label></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td><b>Trip Country :</b><label>${oSelectedItem.TravelCountry}</label></td>
                                                                                                <td><b>Airport City :</b><label>${oSelectedItem.AirportCity}</label></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td><b>Reason for Trip :</b><label>${oSelectedItem.ReasonForTravel}</label></td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </div>
                                                                                    <div>
                                                                                        <div style='margin-left: 2px'><b>Approver Details</b></div>
                                                                                        <table border='1' style='margin: 20px 0px 0px 0px; width: 100%;'>
                                                                                            <tr>
                                                                                                <th><b>Levels</b></th>
                                                                                                <td><b>Employee</b></th>
                                                                                                <th><b>Name</b></th>
                                                                                                <th><b>Status</b></th>
                                                                                                <th><b>Comments</b></th>
                                                                                                <th><b>Date</b></th>
                                                                                                <th><b>Time</b></th>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td></td>
                                                                                                <td></td>
                                                                                                <td></td>
                                                                                                <td></td>
                                                                                                <td></td>
                                                                                                <td></td>
                                                                                                <td></td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </div>
                                                                                <div style="page-break-after: always;">
                                                                                </div>
                                                                            </body>
                                                                            `;
                        var businessPage = `${reIssuanceBody1}${reIssuanceBody2}${reIssuanceBody3}${reIssuanceBody4}`;
                        var approverPage14 = `<div style='width: 100%;'>
                                                                                <table style='width: 100%;' border='1'>
                                                                                    <tr>
                                                                                        <th>Level</th>
                                                                                        <th>Employee</th>
                                                                                        <th>Name</th>
                                                                                        <th>Position</th>
                                                                                        <th>Status</th>
                                                                                        <th>Comments</th>
                                                                                        <th>Date</th>
                                                                                        <th>Time</th>
                                                                                    </tr>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </body>`;
                        var approverPage24 = `<div style='width: 100%;'>
                                                                        <table style='width: 100%;' border='1'>
                                                                            <tr>
                                                                                <th>Level</th>
                                                                                <th>Employee</th>
                                                                                <th>Name</th>
                                                                                <th>Position</th>
                                                                                <th>Status</th>
                                                                                <th>Comments</th>
                                                                                <th>Date</th>
                                                                                <th>Time</th>
                                                                            </tr>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </body>`;
                        var businessTrip = `<html>${head}${businessBody}</html>`;
                        var businessTripApprover1 = `<html>${mainhead}${businessPage}${approverPage14}</html>`;
                        //// var businessTripApprover2 = `<html>${head}${style}<div style="page-break-before: always;">${businessPage}${approverPage24}</html>`;
                        // var businessWindow = window.open("B", "PrintProgram");
                        // businessWindow.document.write(businessTrip);
                        // businessWindow.document.write(businessTripApprover1);
                        // //businessWindow.document.write(businessTripApprover2);
                        // //businessWindow.document.close();
                        // businessWindow.focus();
                        // setTimeout(function () {
                        //     businessWindow.print("download2");
                        //     businessWindow.close();
                        // }, 1000);
                        var oFilename = `${oSelectedHeader.TravelType}_${oSelectedHeader.EmployeeID}.pdf`;
                        const oOptions = {
                            margin: [0.3, 0.3, 0.3, 0.3],
                            filename: oFilename,
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'in', format: 'A4', orientation: 'p' },
                            // pagebreak: {avoid: 'tr' }
                        };
                        html2pdf().set(oOptions).from(businessTrip + businessTripApprover1).save();
                        // var z = html2pdf().set(oOptions).from(businessTrip + businessTripApprover1).save();
                        // var a = new Blob([z], { type: 'application/pdf' });

                        // var form = new FormData();
                        // form.append("cmisaction", "createDocument");
                        // form.append("propertyId[0]", "cmis:name");
                        // form.append("propertyValue[0]", "admin.pdf");
                        // form.append("propertyId[1]", "cmis:objectTypeId");
                        // form.append("propertyValue[1]", "cmis:document");
                        // form.append("succinct", "true");
                        // form.append("filename","admin.pdf");
                        // form.append("_charset_", "UTF-8");
                        // form.append("includeAllowableActions", "true");
                        // form.append("media", a, "");
                        // var settings = {
                        //   "url": "TAQA_DMS/browser/395e84fc-d97f-4197-adaa-10aca70a7cca/root/Public root folder/Timesheet",
                        //   "method": "POST",
                        //   "timeout": 0,
                        //   "processData": false,
                        //   "mimeType": "multipart/form-data",
                        //   "contentType": false,
                        //   "data": form
                        // };
                        // $.ajax(settings).done(function (response) {
                        //   console.log(response);
                        // });


                        break;
                    default:
                        //var oReissurance = html_start + mainhead + reIssuanceBody1 + reIssuanceBody2 + reIssuanceBody3 + reIssuanceBody4 + approverPage1 + html_end;
                        var reIssuancePage = `${html_start}${mainhead}${reIssuanceBody1}${reIssuanceBody2}${reIssuanceBody3}${reIssuanceBody4}${html_end}`;
                        // var reissuanceWindow = window.open("A", "PrintProgram");
                        // //reissuanceWindow.document.write(oReissurance);
                        // reissuanceWindow.document.write(`${reIssuancePage}${approverPage2}</html>`);
                        // //reissuanceWindow.document.close();
                        // reissuanceWindow.focus();
                        // setTimeout(function () {
                        //     reissuanceWindow.print("download2");
                        //     reissuanceWindow.close();
                        // }, 1000);
                        var oFilename = `${oSelectedHeader.TravelType}_${oSelectedHeader.EmployeeID}.pdf`;
                        const oOptions2 = {
                            margin: [0.3, 0.3, 0.3, 0.3],
                            filename: oFilename,
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'in', format: 'A4', orientation: 'p' },
                            // pagebreak: {avoid: 'tr' }
                        };
                        html2pdf().set(oOptions2).from(reIssuancePage).save();
                        // var z = html2pdf().set(oOptions).from(businessTrip + businessTripApprover1).save();
                        // var a = new Blob([z], { type: 'application/pdf' });

                        // var form = new FormData();
                        // form.append("cmisaction", "createDocument");
                        // form.append("propertyId[0]", "cmis:name");
                        // form.append("propertyValue[0]", "admin.pdf");
                        // form.append("propertyId[1]", "cmis:objectTypeId");
                        // form.append("propertyValue[1]", "cmis:document");
                        // form.append("succinct", "true");
                        // form.append("filename","admin.pdf");
                        // form.append("_charset_", "UTF-8");
                        // form.append("includeAllowableActions", "true");
                        // form.append("media", a, "");
                        // var settings = {
                        //   "url": "TAQA_DMS/browser/395e84fc-d97f-4197-adaa-10aca70a7cca/root/Public root folder/Timesheet",
                        //   "method": "POST",
                        //   "timeout": 0,
                        //   "processData": false,
                        //   "mimeType": "multipart/form-data",
                        //   "contentType": false,
                        //   "data": form
                        // };
                        // $.ajax(settings).done(function (response) {
                        //   console.log(response);
                        // });
                        break;
                }
            },
            onReissuanceComboBoxSelectionChange: async function (oEvent) {
                var oModel = this.getOwnerComponent().getModel("taqa-srv"),
                    sID = oEvent.getParameter("selectedItem").getKey(),
                    oFilter = new Array(),
                    filterByName,
                    that = this,
                    sPath = "/TravelDetails?$filter=TravelId eq '" + sID + "'&$expand=ItsTicketDetails";
                filterByName = new Filter("TravelId", FilterOperator.EQ, sID);
                oFilter.push(filterByName);
                oModel.read(sPath, {
                    filters: oFilter,
                    urlParameters: {
                        $expand: "ItsTicketDetails"
                    },
                    success: function (odata) {
                        try {
                            var vOldammount = odata.results[0].ItsTicketDetails.results[0].BaseFare;
                        } catch (error) {
                            var vOldammount = "";
                        }
                        // var vOldammount = odata.results[0].ItsTicketDetails.results[0].BaseFare;
                        that.getView().getModel("form").getData().PrevFareAmt = vOldammount;
                        that.getView().getModel("form").refresh();
                    },
                    error: function (oError) {
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value)
                    }
                })
            },

            handleUploadPress: function (oEvent) {
                var oFile = this.getView().byId("fileUploader").oFileUpload.files[0];
                var that = this;

                // var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];
                var oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open();
                var form = new FormData();
                form.append("cmisaction", "createDocument");
                form.append("propertyId[0]", "cmis:name");
                form.append("propertyValue[0]", oFile.name);
                form.append("propertyId[1]", "cmis:objectTypeId");
                form.append("propertyValue[1]", "cmis:document");
                form.append("succinct", "true");
                form.append("filename", oFile.name);
                form.append("_charset_", "UTF-8");
                form.append("includeAllowableActions", "true");
                form.append("media", oFile, "");

                var settings = {
                    "url": "TAQA_DMS/browser/395e84fc-d97f-4197-adaa-10aca70a7cca/root/Public root folder/Travel",
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form
                };

                $.ajax(settings).done(function (response) {
                    var obid = JSON.parse(response).succinctProperties['cmis:objectId'];
                    var name = JSON.parse(response).succinctProperties['cmis:name'];
                    // console.log(response);


                    var oModel = that.getOwnerComponent().getModel("taqa-srv"),
                        parent_ID = that.getView().getModel("form").getData().ID,
                        oPayload = {
                            "Attachment": obid,
                            "FileName": name
                        },
                        sPath = "/TravelDetails(guid'" + parent_ID + "')";
                    delete oPayload.ReturnTime;
                    var oPayloadFinal = {
                        ItsTraveller: [oPayload]
                    };

                    that.UpdateRecord(oModel, sPath, oPayloadFinal).then((odata) => {
                        oBusyDialog.close();
                    }).catch((oError) => {
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        oBusyDialog.close();
                    });

                });
            },
        });
    });
