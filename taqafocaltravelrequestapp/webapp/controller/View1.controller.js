sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "taqafocaltravelrequestapp/controller/BaseController",
    "../model/formatter",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
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
    ) {
        "use strict";

        return BaseController.extend("taqafocaltravelrequestapp.controller.View1", {
            formatter: formatter,
            onInit: function () {
                this.declareModel("form");
                this.declareModel("visible");
                this.declareModel("RowCount");


                this.oFilterBar = this.getView().byId("filterbar");
                this.oTable = this.getView().byId("idTravelDetailsTable");

            },

            onColumnListItemPress: function (oEvent) {
                var oSelectedItem = oEvent.getSource().getBindingContext("taqa-srv").getObject();
                this.getView().getModel("form").setData(oSelectedItem);

                this.openDialog("Detail View", "taqafocaltravelrequestapp.fragments.detailView");

                this.getView().getModel("visible").setData({
                    "ticketcount": false, "Preamount": false, "ReferenceNo": false,
                    "reissurance": false, "tab2": false
                });
                var oJsonVisible = this.getView().getModel("visible").getData();
                var oJsonForm = this.getView().getModel("form").getData();
              
                switch (oJsonForm.TravelType) {
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
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, true, false);
                        this.GetFamilyDetails(oJsonForm.EmployeeID);
                        break;
                    case "Emergency Leave":
                        this.FieldsHide(oJsonVisible, true, false, true, false, false, true, false, false);
                        break;

                }

                

            },
            onInitiateProcess: function (oEvent) {
                var oJSONVisible = this.getView().getModel("visible");
                oJSONVisible.getData().tab2 = true;
                oJSONVisible.updateBindings(true);
            },
            onCloseButtonPress: function (oEvent) {
                oEvent.getSource().getParent().close();
                this.getView().byId("idTablefamily").unbindItems();
                this.getView().getModel("visible").setData({});
                this.getView().getModel("form").setData({});

            },
            onMultiInputValueHelpRequest: function (oEvent) {
                this.openDialog("Department Select", "taqafocaltravelrequestapp.fragments.valueHelps.department")
            },

            onFODepartmentTableSelectDialogSearch: function (oEvent) {
                this.TableSelectDialogSearch(oEvent);
            },

            onFODepartmentTableSelectDialogConfirm: function (oEvent) {
                this.TableSelectDialogConfirm(oEvent, "idMultiInputDepartment");
            },

            onMultiInputValueHelpRequestDivision: function (oEvent) {
                this.openDialog("Division Select", "taqafocaltravelrequestapp.fragments.valueHelps.division")
            },

            onFODivisionTableSelectDialogSearch: function (oEvent) {
                this.TableSelectDialogSearch(oEvent);
            },

            onFODivisionTableSelectDialogConfirm: function (oEvent) {
                this.TableSelectDialogConfirm(oEvent, "idMultiInputDivision");
            },
            onMultiInputValueHelpRequestLocation: function (oEvent) {
                this.openDialog("Location Select", "taqafocaltravelrequestapp.fragments.valueHelps.location")
            },

            onFOLocationTableSelectDialogSearch: function (oEvent) {
                this.TableSelectDialogSearch(oEvent);
            },
            onEmpNoValuehelpOpen: function (oEvent) {
                this.openDialog("Employee ID", "taqafocaltravelrequestapp.fragments.valueHelps.empNo")
            },
            onPerPersonSelectDialogConfirm: function (oEvent) {
                var aSelectedItem = oEvent.getParameter("selectedItem").getTitle();
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                this.getView().byId("idInputEmpID").setValue(aSelectedItem);

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
