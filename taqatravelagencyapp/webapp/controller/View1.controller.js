sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "taqatravelagencyapp/controller/BaseController",
    "../model/formatter",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
	BaseController,
	formatter,
	Token,
	Filter,
	FilterOperator,
	MessageBox,

    ) {
        "use strict";

        return BaseController.extend("taqatravelagencyapp.controller.View1", {
            formatter: formatter,
            onInit: function () {
                this.declareModel("form");
                this.declareModel("visible");
                this.declareModel("item");
                this.declareModel("Family");
                this.declareModel("Ticket");


                this.oFilterBar = this.getView().byId("filterbar");
                this.oTable = this.getView().byId("idTravelDetailsTable");

            },

            onColumnListItemPress: async function (oEvent) {
                var oSelectedItem = oEvent.getSource().getBindingContext("taqa-srv").getObject();
                this.getView().getModel("form").setData(oSelectedItem);
                this.vCountry = oSelectedItem.HomeCountry;
                var oModel = this.getOwnerComponent().getModel("taqa-srv"),
                    sPath = "/TravelDetails(guid'" + oSelectedItem.ID + "')/ItsTraveller",
                    sPathticket = "/TravelDetails(guid'" + oSelectedItem.ID + "')/ItsTicketDetails",
                    filterEmpty = new Array();

                await this.ReadOdata(oModel, sPath, filterEmpty).then((odata) => {
                    this.getView().getModel("item").setData(odata.results[0]);

                }).catch((oError) => {

                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });
                await this.ReadOdata(oModel, sPathticket, filterEmpty).then((odata) => {
                    this.getView().getModel("Ticket").setData(odata.results);

                }).catch((oError) => {

                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });
                this.openDialog("Travel Details", "taqatravelagencyapp.fragments.detailView");

                this.getView().getModel("visible").setData({
                    "ticketcount": false, "Preamount": false, "ReferenceNo": false,
                    "reissurance": false, "tab2": false, "familytable": false
                });
                var oJsonVisible = this.getView().getModel("visible").getData();
                var oJsonForm = this.getView().getModel("form").getData();

                switch (oJsonForm.TravelType) {
                    //     case "Business Travel":
                    //         this.FieldsHide(oJsonVisible, true, true, false, false, false, false, false, false);
                    //         break;
                    //     case "Joining Travel":
                    //         this.FieldsHide(oJsonVisible, false, false, false, false, false, false, false, false);
                    //         break;
                    //     case "Training":
                    //         this.FieldsHide(oJsonVisible, true, false, false, false, true, false, false, false);
                    //         break;
                    //     case "Job travel":
                    //         this.FieldsHide(oJsonVisible, true, false, false, false, false, false, false, false);
                    //         break;
                    //     case "Miscellaneous":
                    //         this.FieldsHide(oJsonVisible, false, false, false, false, false, false, false, false);
                    //         break;
                    //     case "Recharge Travel":
                    //         this.FieldsHide(oJsonVisible, true, false, false, false, false, false, false, false);
                    //         break;
                    //     case "Separation Travel":
                    //         this.FieldsHide(oJsonVisible, true, false, false, false, false, false, false, false);
                    //         break;
                    //     case "Annual Leave":
                    //         this.FieldsHide(oJsonVisible, true, false, false, false, false, false, false, false);
                    //         break;
                    //     case "Rotational Leave":
                    //         this.FieldsHide(oJsonVisible, true, false, true, false, false, true, false, false);
                    //         break;
                    //     case "Reissuance":
                    //         this.FieldsHide(oJsonVisible, false, false, false, true, false, false, false, true);

                    //         break;
                    case "Family Travel":
                        // this.FieldsHide(oJsonVisible, true, false, true, false, false, true, true, false);
                        // this.GetFamilyDetails(oJsonForm.EmployeeID);
                        oJsonVisible.ftype = false;
                        oJsonVisible.familytable = true;
                        this.getView().getModel("visible").refresh();
                        // this.GetFamilyDetails(oSelectedItem.EmployeeID)
                        await this.ReadOdata(oModel, sPath, filterEmpty).then((odata) => {
                            this.getView().getModel("Family").setData(odata.results);

                        }).catch((oError) => {

                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                        //         this.FieldsHide(oJsonVisible, true, false, true, false, false, true, true, false);
                        //         this.GetFamilyDetails(oJsonForm.EmployeeID);
                        //         break;
                        //     case "Emergency Leave":
                        //         this.FieldsHide(oJsonVisible, true, false, true, false, false, true, false, false);
                        break;

                }



            },

            onCloseButtonPress: function (oEvent) {
                oEvent.getSource().getParent().close();
                // this.getView().byId("idTable").getBinding("items").refresh();
                this.getView().getModel("visible").setData({});
                this.getView().getModel("form").setData({});
                this.getView().getModel("item").setData({});
                this.getView().getModel("Ticket").setData({});
                // this.getView().byId("idTable").unbindItems();
            },
            onMultiInputValueHelpRequest: function (oEvent) {
                this.openDialog("Department Select", "taqatravelagencyapp.fragments.valueHelps.department")
            },

            onFODepartmentTableSelectDialogSearch: function (oEvent) {
                this.TableSelectDialogSearch(oEvent);
            },

            onFODepartmentTableSelectDialogConfirm: function (oEvent) {
                this.TableSelectDialogConfirm(oEvent, "idMultiInputDepartment");
            },

            onMultiInputValueHelpRequestDivision: function (oEvent) {
                this.openDialog("Division Select", "taqatravelagencyapp.fragments.valueHelps.division")
            },

            onFODivisionTableSelectDialogSearch: function (oEvent) {
                this.TableSelectDialogSearch(oEvent);
            },

            onFODivisionTableSelectDialogConfirm: function (oEvent) {
                this.TableSelectDialogConfirm(oEvent, "idMultiInputDivision");
            },
            onMultiInputValueHelpRequestLocation: function (oEvent) {
                this.openDialog("Location Select", "taqatravelagencyapp.fragments.valueHelps.location")
            },

            onFOLocationTableSelectDialogSearch: function (oEvent) {
                this.TableSelectDialogSearch(oEvent);
            },
            onEmpNoValuehelpOpen: function (oEvent) {
                this.openDialog("Employee ID", "taqatravelagencyapp.fragments.valueHelps.empNo")
            },
            onPerPersonSelectDialogConfirm: function (oEvent) {
                var aSelectedItem = oEvent.getParameter("selectedItem").getTitle();
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                this.getView().byId("idInputEmpID").setValue(aSelectedItem);

            },
            onPerPersonSelectDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("personIdExternal", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },

            onFOLocationTableSelectDialogConfirm: function (oEvent) {
                this.TableSelectDialogConfirm(oEvent, "idMultiInputLocation");
            },
            onFilterBarClear: function (oEvent) {
                // this.getView().byId("idMultiInputDepartment").setTokens([]);
                // this.getView().byId("idMultiInputDivision").setTokens([]);
                // this.getView().byId("idMultiInputLocation").setTokens([]);
                this.getView().byId("idInputEmpID").setValue("");
                // this.getView().byId("idDatePicker").setValue("");

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
                    else if (oControl instanceof sap.m.DatePicker) {
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
            onAddButtonPress: async function (oEvent) {
                var oModel = this.getOwnerComponent().getModel(),
                    filterById,
                    filtersEmpId = new Array(),
                    sPath = "/Country",
                    vCurrency;
                var oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open();
                filterById = new Filter("code", FilterOperator.EQ, this.vCountry);
                filtersEmpId.push(filterById);
                await this.ReadOdata(oModel, sPath, filtersEmpId).then(async (odata) => {
                    if (odata.results.length === 0) {
                        vCurrency = "";
                        await oBusyDialog.close();
                    }
                    else{
                        vCurrency = odata.results[0].currency;
                        await oBusyDialog.close();
                    }
                   
                }).catch(async (oError) => {
                    await oBusyDialog.close();
                    await MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });

                var oItem = new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Input(),
                        new sap.m.Input(),
                        new sap.m.DatePicker(),
                        new sap.m.Input(),
                        new sap.m.Input(),
                        new sap.m.Input(),
                        new sap.m.Input({ "value": vCurrency }),
                        new sap.m.Input(),]
                });

                var oTable = this.getView().byId("idTable");
                oTable.insertItem(oItem, 0);
            },
            onTravelDetailsTableDelete: function (oEvent) {
                var oTable = this.getView().byId("idTable");
                oTable.removeItem(oEvent.getParameter("listItem"));
            },

            onSubmitButtonPress: function () {
                var oDynamicTable = this.getView().byId("idTable"),
                    sID = this.getView().getModel("form").getData().ID,
                    // oSelectedItem = oDynamicTable.getSelectedItem(),
                    oSelectedItems = oDynamicTable.getSelectedItems(),
                    oModel = this.getOwnerComponent().getModel("taqa-srv"),
                    sPath = "/TravelDetails(guid'" + sID + "')/ItsTicketDetails",
                    // sPath = "/TravellerDetails",
                    that = this,
                    aBatchOperations = [],
                    oPayload = {};

                // var sID = this.getView().getModel("form").getData().ID;

                if (oSelectedItems) {

                    oSelectedItems.forEach(function (oSelectedItem) {
                        var aCells = oSelectedItem.getCells();
                        oPayload["Airline"] = aCells[0].getValue();
                        oPayload["Sector"] = aCells[1].getValue();
                        oPayload["TravelDate"] = aCells[2].getValue();
                        oPayload["TicketNo"] = aCells[3].getValue();
                        oPayload["BaseFare"] = aCells[4].getValue();
                        oPayload["Taxes"] = aCells[5].getValue();
                        oPayload["Currency"] = aCells[6].getValue();
                        oPayload["Comments"] = aCells[7].getValue();
                        oPayload["parent_ID"] = sID;


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
                    });
                    oModel.update("/TravelDetails(guid'" + sID + "')", { "Status": "Completed" }, {

                        success: function (oData, oResponse) {
                            // Handle success for each record creation
                        },
                        error: function (oError) {
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            // Handle error for each record creation
                        }
                    });

                } else {
                    sap.m.MessageToast.show("Please select a row to Save");
                }
            },
        });
    });
