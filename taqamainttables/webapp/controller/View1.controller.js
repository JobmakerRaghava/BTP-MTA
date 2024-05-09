sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,
        MessageToast,
        MessageBox,
        Filter,
        FilterOperator
    ) {
        "use strict";

        return BaseController.extend("taqamainttables.controller.View1", {
            onInit: function () {
                this.declareModel("columnModel");
                this.declareModel("newTable");

            },

            onTableSelectChange: function () {
                var sSelectedTableKey = this.byId("tableSelect").getSelectedKey(),
                    oDynamicTable = this.getView().byId("dynamicTable"),
                    oColumnModel = this.getView().getModel("columnModel"),
                    aColumns,
                    that = this,
                    filters = new Array(),
                    filterByName;

                // this.byId("title").setText(this.byId("tableSelect").getSelectedItem().getText());

                // Clear existing columns and items
                oDynamicTable.destroyColumns();
                oDynamicTable.destroyItems();

                var oModel = this.getOwnerComponent().getModel(),
                    sPath = "/ColumnInfo";
                filterByName = new Filter("TableName", FilterOperator.EQ, sSelectedTableKey);
                filters.push(filterByName);

                var oBusyDialog = new sap.m.BusyDialog({
                    size: "3rem"
                });
                oBusyDialog.open();

                oModel.read(sPath, {
                    filters: filters,
                    success: function (odata) {
                        var oResultsColumns = odata.results[0];
                        var res = [];

                        for (var i in oResultsColumns) {
                            res.push(oResultsColumns[i]);
                        };
                        res.splice(0, 5);
                        res.splice(1, 1);
                        res.splice(17, 1)
                        that.removeEmptyProperties(res);

                        res.forEach(function (sColumn) {
                            if (sColumn.length == 36) {
                                oDynamicTable.addColumn(new sap.m.Column({
                                    header: new sap.m.Label({
                                        text: "ID"
                                    }),
                                    styleClass: "border",
                                    visible: false
                                }));
                            }
                            else {
                                oDynamicTable.addColumn(new sap.m.Column({
                                    header: new sap.m.Label({
                                        text: sColumn
                                    }),
                                    styleClass: "border"
                                }));
                            }

                        });

                        oColumnModel.setData(res);
                        aColumns = res;

                        //fetching row data
                        oModel.read("/RowInfo", {
                            filters: filters,
                            success: (odatarow) => {
                                var vLength = odatarow.results.length;
                                that.getView().byId("title").setText(that.getView().byId("tableSelect").getSelectedItem().getText() + "(" + vLength + ")");
                                odatarow.results.forEach(function (oRowData) {
                                    var oRow = new sap.m.ColumnListItem();
                                    var oColsName = [];
                                    //converting to array of records
                                    for (var i = 1; i <= aColumns.length; i++) {
                                        if (i === 1) {
                                            oColsName.push("ID")
                                        }
                                        oColsName.push("Column" + i);
                                    };

                                    oColsName.forEach(function (sColumn) {
                                        oRow.addCell(new sap.m.Text({
                                            text: oRowData[sColumn]
                                        }));

                                    });
                                    oDynamicTable.addItem(oRow);
                                });
                                oBusyDialog.close();
                            },
                            error: (oErrorRow) => {
                                MessageBox.error(JSON.parse(oErrorRow.responseText).error.message.value);
                                oBusyDialog.close();
                            }
                        })
                    },
                    error: function (oError) {
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        oBusyDialog.close();
                    }
                });

                this.byId("_IDGenButton1").setVisible(true);
                this.byId("_IDGenButton2").setVisible(false);
                this.byId("_IDGenButton3").setVisible(false);
                this.byId("_IDGenButton4").setVisible(false);
                this.byId("_IDGenButton6").setVisible(false);

            },

            onAddRowPress: function () {
                var oDynamicTable = this.getView().byId("dynamicTable"),
                    aColumns = this.getView().getModel("columnModel").getData(),
                    oRow = new sap.m.ColumnListItem();

                // Initialize the new row with Input controls for each column
                aColumns.forEach(function (sColumn) {
                    if (sColumn === 'Start date' || sColumn === 'End date') {
                        oRow.addCell(new sap.m.DatePicker());
                    } else {
                        oRow.addCell(new sap.m.Input(
                            {
                                maxLength: 20
                                //     showValueHelp: true,
                                //     valueHelpRequest: [this.onAlerts, this]
                                //     // valueHelpRequest: this.onAlerts.bind(this) //this also works
                            }
                        ));
                    }

                }.bind(this));

                // Add the new row to the table
                oDynamicTable.insertItem(oRow, 0);
                this.byId("_IDGenButton7").setVisible(false);
                this.byId("_IDGenButton4").setVisible(false);
                this.byId("_IDGenButton3").setVisible(true);
                this.byId("_IDGenButton6").setVisible(false);
                this.byId("_IDGenButton2").setVisible(true);
            },

            onSaveReocrd: function name(oAction) {
                var oDynamicTable = this.getView().byId("dynamicTable"),
                    oSelectedItem = oDynamicTable.getSelectedItem(),
                    oModel = this.getOwnerComponent().getModel(),
                    sPath = "/RowInfo",
                    that = this,

                    oPayload = {};

                if (oSelectedItem) {
                    var aCells = oSelectedItem.getCells(),
                        i = 0;
                    aCells.forEach(function (oCell) {
                        if (i === 0) {
                            var sColumn = "ID";
                            var sValue = "";
                            oPayload[sColumn] = sValue;
                            i += 1;
                        } else {
                            var sColumn = "Column" + i;
                            var sValue = oCell.getValue();
                            oPayload[sColumn] = sValue;
                            i += 1;
                        }
                    });
                    oPayload.TableName = this.getView().byId("tableSelect").getSelectedKey();
                    delete oPayload.ID;

                    aCells.forEach(function (oCell) {
                        var sValue = oCell.getValue();
                        var oText = new sap.m.Text({
                            text: sValue
                        });
                        oSelectedItem.removeCell(oCell);
                        oSelectedItem.addCell(oText);
                    });
                    var oBusyDialog = new sap.m.BusyDialog({
                        size: "3rem"
                    });
                    oBusyDialog.open();
                    this.CRDoData(oModel, sPath, oPayload).then((odata) => {
                        MessageBox.success("Row is Created Successfully");
                        that.onTableSelectChange();
                        oBusyDialog.close();
                    }).catch((oError) => {
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                    });
                } else {
                    sap.m.MessageToast.show("Please select a row to Save");
                }
            },
            onDeleteRowPress: function () {
                var oDynamicTable = this.getView().byId("dynamicTable"),
                    oSelectedItem = oDynamicTable.getSelectedItem(),
                    oModel = this.getOwnerComponent().getModel(),
                    that = this;

                if (oSelectedItem) {
                    try {
                        if (oSelectedItem.getCells()[0].getValue() === '') {
                            oDynamicTable.removeItem(oSelectedItem);
                        }
                    } catch (error) {

                        var aKey = oSelectedItem.getCells()[0].getText(),
                            sPath = "/RowInfo(guid'" + aKey + "')";
                        var oBusyDialog = new sap.m.BusyDialog({
                            size: "3rem"
                        });
                        oBusyDialog.open();
                        this.DeleteOData(oModel, sPath).then((odata) => {
                            that.onTableSelectChange();
                            oBusyDialog.close();
                            MessageBox.success("Row is Deleted Successfully");
                        }).catch((oError) => {
                            oBusyDialog.close();
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                    }

                }
                else {
                    sap.m.MessageToast.show("Please select a row to Delete");
                }
                this.byId("_IDGenButton2").setVisible(false);
                this.byId("_IDGenButton3").setVisible(false);
                this.byId("_IDGenButton4").setVisible(false);
            },
            onEditRowPress: function () {
                var oDynamicTable = this.getView().byId("dynamicTable"),
                    oSelectedItem = oDynamicTable.getSelectedItem();

                if (oSelectedItem) {
                    var aCells = oSelectedItem.getCells();

                    aCells.forEach(function (oCell) {
                        if (oCell instanceof sap.m.Text) {
                            var sText = oCell.getText();
                            if (sText.includes('/', 3, 6)) {
                                var oInput = new sap.m.DatePicker({
                                    value: sText
                                });
                                oSelectedItem.removeCell(oCell);
                                oSelectedItem.addCell(oInput);
                            } else {
                                var oInput = new sap.m.Input({
                                    value: sText,
                                    maxLength: 20
                                });
                                oSelectedItem.removeCell(oCell);
                                oSelectedItem.addCell(oInput);
                            }

                        }
                    });
                } else {
                    sap.m.MessageToast.show("Please select a row to edit");
                }
                this.byId("_IDGenButton2").setVisible(false);
                this.byId("_IDGenButton4").setVisible(false);
                this.byId("_IDGenButton6").setVisible(true);
                this.byId("_IDGenButton7").setVisible(true);

            },
            onEditCancel: function (oAction) {
                this.onTableSelectChange();
                // var oDynamicTable = this.getView().byId("dynamicTable");
                // var oSelectedItem = oDynamicTable.getSelectedItem();

                // if (oSelectedItem) {
                //     var aCells = oSelectedItem.getCells();
                //     var oRowData = {};

                //     var aCells = oSelectedItem.getCells();
                //     aCells.forEach(function (oCell) {
                //         // if (oCell instanceof sap.m.Input) {
                //         var sValue = oCell.getValue();
                //         var oText = new sap.m.Text({
                //             text: sValue
                //         });
                //         oSelectedItem.removeCell(oCell);
                //         oSelectedItem.addCell(oText);
                //         // }
                //     });
                // } else {
                //     sap.m.MessageToast.show("Please select a row to save");
                // }
                this.byId("_IDGenButton7").setVisible(false);
                this.byId("_IDGenButton4").setVisible(true);
            },

            onAddTable: function (oAction) {
                this.openDialog("addTable", "taqamainttables.fragments.addTable")
            },

            onClose: function (oAction) {
                oAction.getSource().getParent().close();
                this.getView().getModel("newTable").setData({});
            },
            onCreate: function (oAction) {
                var oPayload = this.getView().getModel("newTable").getData(),
                    vTablename = this.byId("idTablenameInput").getValue().trim(),
                    vColumn1 = this.byId("idColumnInput").getValue().trim(),
                    oModel = this.getOwnerComponent().getModel(),
                    sPath = "/ColumnInfo";

                if (vTablename === "" || vColumn1 === "") {
                    MessageBox.error("Enter \"Table name\" and \"Column1\"");
                }
                else {
                    var oBusyDialog = new sap.m.BusyDialog({
                        size: "3rem"
                    });
                    oBusyDialog.open();

                    this.CRDoData(oModel, sPath, oPayload).then((odata) => {
                        MessageBox.success("Table got Created Successfully");
                        oBusyDialog.close();
                        this.getView().getModel("newTable").setData({});
                    }).catch((oError) => {
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        oBusyDialog.close();
                    });
                };


            },
            onAlerts: function (oAction) {
                MessageToast.show("ValueHelp Pressed...");
                // var id =oAction.getSource().getParent().getContent()[1].getValue();

            },
            onTableSelectionChange: function (oAction) {
                this.byId("_IDGenButton3").setVisible(true);
                this.byId("_IDGenButton4").setVisible(true);
                this.byId("_IDGenButton2").setVisible(true);
                this.byId("_IDGenButton6").setVisible(false);
                this.byId("_IDGenButton7").setVisible(false);


            },
            onUpdate: function (oAction) {
                var oDynamicTable = this.getView().byId("dynamicTable");
                var oSelectedItem = oDynamicTable.getSelectedItem();
                var oModel = this.getOwnerComponent().getModel(),

                    that = this;

                if (oSelectedItem) {
                    var aCells = oSelectedItem.getCells(),
                        oPayload = {},
                        i = 0;
                    aCells.forEach(function (oCell) {
                        // if (oCell instanceof sap.m.Input) {
                        if (i === 0) {
                            var sColumn = "ID";
                            var sValue = oCell.getValue();
                            oPayload[sColumn] = sValue;
                            i += 1;
                        } else {
                            var sColumn = "Column" + i;
                            var sValue = oCell.getValue();
                            oPayload[sColumn] = sValue;
                            i += 1;
                        }

                        // }
                    });
                    // oPayload.TableName = this.getView().byId("tableSelect").getSelectedKey();
                    delete oPayload.Column17;
                    var sPath = "/RowInfo(guid'" + oPayload.ID + "')";

                    aCells.forEach(function (oCell) {
                        // if (oCell instanceof sap.m.Input) {
                        var sValue = oCell.getValue();
                        var oText = new sap.m.Text({
                            text: sValue
                        });
                        oSelectedItem.removeCell(oCell);
                        oSelectedItem.addCell(oText);
                        // }
                    });

                    var oBusyDialog = new sap.m.BusyDialog({
                        size: "3rem"
                    });
                    oBusyDialog.open();
                    this.UpdateOData(oModel, sPath, oPayload).then((odata) => {
                        that.onTableSelectChange();
                        MessageBox.success("Row is Created Successfully");
                        oBusyDialog.close();
                    }).catch((oError) => {
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        that.onTableSelectChange();
                        oBusyDialog.close();
                    });
                } else {
                    sap.m.MessageToast.show("Please select a row to save");
                }
                this.byId("_IDGenButton7").setVisible(false);
            }
        });
    });

