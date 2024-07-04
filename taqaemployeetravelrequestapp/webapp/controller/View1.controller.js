sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter",
    "sap/m/Input",
    "sap/m/DatePicker",
    "sap/m/TextArea",
    "sap/m/TimePicker",
    "sap/m/BusyIndicator",
    "sap/m/Token"
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
        BusyIndicator,
        Token
    ) {
        "use strict";
        return BaseController.extend("taqaemployeetravelrequestapp.controller.View1", {
            formatter: formatter,
            onInit: async function () {
                this.declareModel("PerPersonal");
                this.declareModel("EmpJob");
                this.declareModel("PerPerson");
                this.declareModel("visible");
                this.declareModel("form");
                this.declareModel("TravelDetails");
                this.declareModel("Reissuance");
                this.declareModel("FLD");
                this.declareModel("item");
                this.declareModel("Family");

                this.oFilterBar = this.getView().byId("filterbar");
                this.oTable = this.getView().byId("idTravelDetailsTable");

                var oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open();
                // if (sap.ushell.Container) {
                //     var user = sap.ushell.Container.getService("UserInfo").getUser();
                //     // console.log(user)
                //     var userEmail = user.getEmail();
                //     // console.log(userEmail);
                // } else {
                // var userEmail = "vsreenivasulu@kaartech.com"; //"aalthani@tq.com";
                //     var userEmail = "gkanthavelu@kaartech.com"
                // };
                // var userD = await this.getEmpDetailsEmail(userEmail);
                // this.ID = userD.userId;
                // if(userD.admin === "yes"){
                //     };

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
                // this.ID = '32737',//regular
                // this.ID = '37113',//rota
                // this.ID = '31288'; //family
                // this.ID = '27146';//leaves
                this.ID = '10025';
                // this.ID = '1114';

                filterByName = new Filter("personIdExternal", FilterOperator.EQ, this.ID);
                filtersPerPersonal.push(filterByName);
                filterByUserId = new Filter("userId", FilterOperator.EQ, this.ID);
                filtersEmpJob.push(filterByUserId);
                // filterByPerson = new Filter("personIdExternal", FilterOperator.EQ, ID);
                // filtersPerson.push(filterByPerson);
                await this.ReadOdata(oSFModel, sPathPerPerson, filtersPerPersonal).then(async (odata) => {
                    this.getView().getModel("PerPersonal").setData(odata.results[0]);
                    await this.ReadOdata(oSFModel, sPathEmpJob, filtersEmpJob).then(async (odata) => {
                        this.getView().getModel("EmpJob").setData(odata.results[0]);
                        await this.ReadOdata(oSFModel, sPathPerson, filtersPerPersonal).then(async (odata) => {
                            await this.getView().getModel("PerPerson").setData(odata.results[0]);
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
                    oBusyDialog.close();
                }).catch((oError) => {
                    oBusyDialog.close();
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);

                });
                // await oBusyDialog.close();
                // }
            },
            onCreateRequestButtonPress: function (oEvent) {
                this.openDialog("requestForm", "taqaemployeetravelrequestapp.fragments.requestForm");
                this.getView().getModel("visible").setData({
                    "type": false, "ticketcount": false, "Preamount": false, "familytable": false,
                    "draft": false, "submit": false, "delete": false, "TrainingDate": false, "BusinessStartDate": false
                });
            },
            onCloseButtonPress: function (oEvent) {
                oEvent.getSource().getParent().close();
                this.getView().getModel("visible").setData({});
                this.getView().getModel("form").setData({});
                this.getView().getModel("item").setData({});
                this.ValueStateNone(this);
                // this.getView().byId("idTable").refreshBindings();
                this.getView().byId("idTable").removeAllItems();
            },
            onComboBoxSelectionChange: function (oEvent) {
                this.ValueStateNone(this);
                this.AutopopulatedFields();
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
                        this.getTicketCount(this.ID);
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
                            // MessageBox.success("You are Regular Employee.You are Eligible for Family Tavel")
                            this.FieldsHide(oJsonVisible, true, false, true, false, false, true, true, false);
                            // this.GetFamilyDetails(this.ID);
                            // this.getTicketCount(this.ID);
                        } else {
                            this.openDialog("Error", "taqaemployeetravelrequestapp.fragments.dailogs.closepopover");
                            // MessageBox.error("You are not Regular Employee.You are not Eligible for Family Tavel")
                        }
                        oJsonVisible.ftype = false;
                        this.getView().getModel("visible").refresh();
                        break;
                    case "Emergency Leave":
                        this.getTicketCount(this.ID);
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, false, false);
                        break;
                }
            },
            onDeleteButtonPress: function (oEvent) {
                // var oFinalModel = this.mappingModels("vText");
                sID = this.getView().getModel("form").getData().ID;
                var oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open();
                var oCAPMModel = this.getOwnerComponent().getModel("taqa-srv"),
                    sPathTravel = "/TravelDetails(guid'" + sID + "')";
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
            onSaveAsDraftButtonPress: async function (oEvent) {
                // this.openDialog1("Add Family Details1","taqaemployeetravelrequestapp.fragments.family");
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
                var oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open();
                filterByName = new Filter("personIdExternal", FilterOperator.EQ, this.ID);
                filtersPerPersonal.push(filterByName);
                filterByUserId = new Filter("userId", FilterOperator.EQ, this.ID);
                filtersEmpJob.push(filterByUserId);
                // filterByPerson = new Filter("personIdExternal", FilterOperator.EQ, ID);
                // filtersPerson.push(filterByPerson);
                // await this.ReadOdata(oSFModel, sPathPerPerson, filtersPerPersonal).then(async (odata) => {
                //     this.getView().getModel("PerPersonal").setData(odata.results[0]);
                //     await this.ReadOdata(oSFModel, sPathEmpJob, filtersEmpJob).then(async (odata) => {
                //         this.getView().getModel("EmpJob").setData(odata.results[0]);
                //         await this.ReadOdata(oSFModel, sPathPerson, filtersPerPersonal).then(async (odata) => {
                //             await this.getView().getModel("PerPerson").setData(odata.results[0]);
                //             oBusyDialog.close();
                //         }).catch((oError) => {
                //             oBusyDialog.close();
                //             MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                //         });
                //     }).catch((oError) => {
                //         oBusyDialog.close();
                //         MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                //     });
                // }).catch((oError) => {
                //     oBusyDialog.close();
                //     MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                // });


                var vText = oEvent.getSource().getText();
                var sCheck = this.CheckRequired();
                if (sCheck === 0) {
                    // Populating payload
                    var oFinalModel = this.mappingModels(vText);
                    var oItemModel = this.getView().getModel("item").getData();

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
                    var vType = this.getView().getModel("visible").getData().trvtype;
                    if (!oFinalModel.ID) {
                        //validation for Annual leave and Rotational leave

                        if (vType === "Annual Leave" || vType === "Rotational Leave") {
                            this.ReadOdata(oSFModel, sPathTime, filters).then((odata) => {
                                if (odata.results.length === 0) {
                                    oBusyDialog.close();
                                    MessageBox.error("You are not Applied a leave during the Period from " + oItemModel.DepartureDate + " to " + oItemModel.ReturnDate);
                                }
                                else if (odata.results[0].timeType === 'ROT_SHIFT_LEAVE_KSA' || odata.results[0].timeType === 'SA_ANNL10D') {
                                    if (odata.results[0].approvalStatus === 'APPROVED') {
                                        this.CRDoData(oCAPMModel, sPathTravel, oFinalModel).then((odata) => {
                                            // this.getView().getModel("PerPerson").setData(odata.results[0]);
                                            oEvent.getSource().getParent().close();
                                            this.getView().getModel("visible").setData({});
                                            this.getView().getModel("form").setData({});
                                            // debugger;
                                            this.travellerCreation(odata.ID);
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
                                    // else if (odata.results[0].timeType === 'ROT_SHIFT_LEAVE_KSA' || odata.results[0].timeType === 'SA_ANNL10D' ) {
                                    else if (odata.results[0].approvalStatus === 'CANCELLED') {
                                        MessageBox.warning("Your Leave is CANCELLED,Please Reach out Focal Personal");
                                        oBusyDialog.close();
                                        oEvent.getSource().getParent().close();
                                    }
                                    else if (odata.results[0].approvalStatus === 'PENDING') {
                                        MessageBox.warning("Your Leave is not Approved,Please Reach out Focal Personal");
                                        oBusyDialog.close();
                                        oEvent.getSource().getParent().close();
                                    }
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
                        // var oItemID = this.getView().getModel("item").getData().ID;
                        if (vType === "Annual Leave" || vType === "Rotational Leave") {
                            this.ReadOdata(oSFModel, sPathTime, filters).then((odata) => {
                                //if leave is not applied
                                if (odata.results.length === 0) {
                                    oBusyDialog.close();
                                    MessageBox.error("You are not Applied a leave during the Period from " + oItemModel.DepartureDate + " to " + oItemModel.ReturnDate);
                                }
                                else if (odata.results[0].timeType === 'ROT_SHIFT_LEAVE_KSA' || odata.results[0].timeType === 'SA_ANNL10D') {
                                    if (odata.results[0].approvalStatus === 'APPROVED' || odata.results[0].approvalStatus === 'PENDING') {
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
                                            // this.onButtonPress(oFinalModel.ID);
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
                                // this.onButtonPress(oFinalModel.ID);
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
                }
            },
            onColumnListItemPress: async function (oEvent) {
                this.getView().getModel("item").setData({});
                var oSelectedItem = oEvent.getSource().getBindingContext("TravelDetails").getObject();
                this.getView().getModel("form").setData(oSelectedItem);
                var oModel = this.getOwnerComponent().getModel("taqa-srv"),
                    sPath = "/TravelDetails(guid'" + oSelectedItem.ID + "')/ItsTraveller",
                    filterEmpty = new Array();
                await this.ReadOdata(oModel, sPath, filterEmpty).then((odata) => {
                    this.getView().getModel("item").setData(odata.results[0]);
                }).catch((oError) => {
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });
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
                if (oSelectedItem.Status === "Submitted" || oSelectedItem.Status === "Approved" || oSelectedItem.Status === "Initiated Request" || oSelectedItem.Status === "Completed") {
                    oJsonVisible.editable = false;
                    oJsonVisible.draft = false;
                    oJsonVisible.submit = false;
                    oJsonVisible.delete = false;
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
                        this.ReissuanceRefNo();
                        break;
                    case "Family Travel":
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, true, false);
                        oJsonVisible.ftype = false;
                        this.getView().getModel("visible").refresh();
                        // this.GetFamilyDetails(oSelectedItem.EmployeeID);
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
            onAddFamilyButtonPress: function (oEvent) {
                var oModel = this.getOwnerComponent().getModel(),
                    filterById,
                    filtersEmpId = new Array(),
                    sPath = "/PerPersonRelationship";
                var oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open();
                filterById = new Filter("personIdExternal", FilterOperator.EQ, this.ID);
                filtersEmpId.push(filterById);
                this.ReadOdata(oModel, sPath, filtersEmpId).then(async (odata) => {
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

            onTravelIdValueHelpRequest: function (oEvent) {
                //
                var oView = this.getView();
                if (!this._pDialog) {
                    this._pDialog = this.loadFragment({
                        name: "taqaemployeetravelrequestapp.fragments.filtertable",
                        controller: this
                    }).then(function (oDialog) {
                        oDialog.setModel(oView.getModel("TravelDetails"));
                        // oDialog.addStyleClass("customSelectDialogNoSearch");
                        return oDialog;
                    });
                }

                this._pDialog.then(function (oDialog) {
                    oDialog.open();
                }.bind(this));
            },

            onTravelTypeValueHelpRequest: function (oEvent) {
                // this.openDialog("Travel ID Select", "taqaemployeetravelrequestapp.fragments.filtertablebytype");
                var oView = this.getView();
                if (!this._pDialog1) {
                    this._pDialog1 = this.loadFragment({
                        name: "taqaemployeetravelrequestapp.fragments.filtertablebytype",
                        controller: this
                    }).then(function (oDialog) {
                        // oDialog.setModel(oView.getModel("TravelDetails"));
                        // oDialog.addStyleClass("customSelectDialogNoSearch");
                        oDialog._searchField.setVisible(false);
                        return oDialog;
                    });
                }

                this._pDialog1.then(function (oDialog) {
                    oDialog._searchField.setVisible(false);
                    oDialog.open();
                }.bind(this));
            },
            filterIdSelected: function (oEvent) {
                var aSelectedItems = oEvent.getParameter("selectedItems");

                if (aSelectedItems && aSelectedItems.length > 0) {
                    var oMultiInputId = this.byId("idMultiInputTravelId");
                    aSelectedItems.forEach(function (oItem) {
                        oMultiInputId.addToken(new Token({
                            text: oItem.getTitle()
                        }));
                    });
                }


            },
            filterTypeSelected: function (oEvent) {

                var aSelectedItems = oEvent.getParameter("selectedItems");
                if (aSelectedItems && aSelectedItems.length > 0) {
                    var oMultiInput = this.byId("idMultiInputTravelType");
                    aSelectedItems.forEach(function (oItem) {
                        oMultiInput.addToken(new Token({
                            text: oItem.getTitle()
                        }));
                    });
                }


            },
            onSearch: function () {

                var getGroupItems = this.oFilterBar.getFilterGroupItems();

                var aTableFilters = getGroupItems.reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl();
                    // window.console.log(oControl);
                    var aFilters = [];
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
                    }
                    if (aFilters.length > 0) {
                        aResult.push(new Filter({
                            filters: aFilters,
                            and: false // Combine filters with OR
                        }));
                    }
                    return aResult;
                }, []);

                // window.console.log(this.oTableView1);
                var oTableBinding = this.oTable.getBinding("items");
                oTableBinding.filter(aTableFilters);
                this.oTable.setShowOverlay(false);
            },
            onFilterBarClear: function (oEvent) {
                this.getView().byId("idMultiInputTravelType").setTokens([]);
                this.getView().byId("idMultiInputTravelId").setTokens([]);
            },




        });
    });
