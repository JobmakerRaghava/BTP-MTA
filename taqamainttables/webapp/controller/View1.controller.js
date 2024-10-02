sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/export/Spreadsheet',
    "sap/ui/comp/filterbar/FilterGroupItem",
    "sap/m/BusyDialog",
    "taqamainttables/util/xlsx.full.min"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,
        MessageToast,
        MessageBox,
        Filter,
        FilterOperator,
        Spreadsheet,
        FilterGroupItem,
        BusyDialog
    ) {
        "use strict";
        return BaseController.extend("taqamainttables.controller.View1", {
            onInit: async function () {
                this.declareModel("columnModel");
                this.declareModel("newTable");
                this.declareModel("excelData");
                this.declareModel("tables");
                this.declareModel("linemanagerRows");
                this.declareModel("linemanagerColumns");

            },
            massupload: async function () {
                this.openDialog("upload", "taqamainttables.fragments.upload");
            },
            onInputValueHelpRequest: async function () {
                let oModel = this.getOwnerComponent().getModel(),
                    sPath = "/ColumnInfo";
                let that = this;
                let oBusyDialog = new BusyDialog();
                oBusyDialog.open();
                await oModel.read(sPath, {
                    success: function (odata) {
                        let oTableModel = odata.results;
                        oTableModel.push({ "TableName": "Line Manager Approver Table" });
                        that.getView().getModel("tables").setData(oTableModel);
                        that.openDialog("valueHelp", "taqamainttables.fragments.tablesNames");
                        oBusyDialog.close();
                    },
                    error: function (error) {
                        oBusyDialog.close();
                        MessageBox.error(JSON.parse(error.responseText).error.message.value)
                    }
                });
            },
            onTableSelectChange: async function () {
                let sSelectedTableKey = this.getView().byId("idInput").getValue();
                this._columnOrder = ['ID', 'Column2', 'Column1', 'Column3'];
                this.oFilterApply = "true";
                if (this.vTableName === sSelectedTableKey) {
                    this.oFilterApply = 'false';
                }
                this.vTableName = sSelectedTableKey;
                this.byId("_IDGenButton0").setVisible(true);
                if (this.vTableName === 'Line Manager Approver Table') {
                    // oBusyDialog.open();
                    this.getView().byId("idFilterBar").setVisible(false);
                    this.getView().byId("dynamicTable").setVisible(false);
                    this.getView().byId("idFilterBar2").setVisible(true);
                    this.getView().byId("dynamicTable2").setVisible(true);
                    this.byId("_IDGenButton12").setVisible(true);
                    this.byId("_IDGenButton22").setVisible(false);
                    this.byId("_IDGenButton32").setVisible(false);
                    this.byId("_IDGenButton42").setVisible(false);
                    this.byId("_IDGenButton62").setVisible(false);
                    this.byId("idSpreadSheetUploadButton2").setVisible(true);
                    this.byId("idButtonExcel2").setVisible(true);
                    // this.LineMrefresh();
                    this.onFilterBarSearch2();
                } else {
                    this.getView().byId("idFilterBar").setVisible(true);
                    this.getView().byId("dynamicTable").setVisible(true);
                    this.getView().byId("idFilterBar2").setVisible(false);
                    this.getView().byId("dynamicTable2").setVisible(false);
                    let oDynamicTable = this.getView().byId("dynamicTable");
                    let oColumnModel = this.getView().getModel("columnModel");
                    let aColumns;
                    let that = this,
                        filters = new Array(),
                        filterByName;
                    this._originalData = [];
                    oDynamicTable.destroyColumns();
                    oDynamicTable.destroyItems();
                    let oModel = this.getOwnerComponent().getModel(),
                        sPath = "/ColumnInfo";
                    filterByName = new Filter("TableName", FilterOperator.EQ, sSelectedTableKey);
                    filters.push(filterByName);
                    let oBusyDialog = new BusyDialog();
                    oBusyDialog.open();
                    oModel.read(sPath, {
                        filters: filters,
                        success: function (odata) {
                            let oResultsColumns = odata.results[0];
                            let res = [];
                            for (let i in oResultsColumns) {
                                res.push(oResultsColumns[i]);
                            };
                            res.splice(0, 5);
                            res.splice(1, 1);
                            res.splice(19, 1)
                            that.removeEmptyProperties(res);
                            //need to impletement column position change
                            // let sortedColumns = that._columnOrder.filter(col => res.includes(col));
                            //.........................
                            res.forEach(function (sColumn) {
                                oDynamicTable.addColumn(new sap.m.Column({
                                    header: new sap.m.Label({
                                        text: sColumn,
                                        tooltip: sColumn
                                    }),
                                    styleClass: "border"
                                }));
                            });
                            oDynamicTable.getColumns()[0].setVisible(false);
                            // if (sSelectedTableKey === 'Approver Table') {  // hide sr.No column for Approver Table
                            //     oDynamicTable.getColumns()[1].setVisible(false);
                            // };
                            oColumnModel.setData(res);
                            aColumns = res;
                            // oColumnModel.setData(sortedColumns);
                            // aColumns = sortedColumns;
                            if (that.oFilterApply === 'true') {
                                that.applyFilters(odata.results[0], sSelectedTableKey);
                                oModel.read("/RowInfo", {
                                    filters: filters,
                                    success: (odatarow) => {
                                        let vLength = odatarow.results.length;
                                        // that._originalData = odatarow.results;
                                        // ---------------- BY Prajeshwar V -----------------
                                        that._originalData = that.sortOdata(odatarow.results, that.vTableName)
                                        // ---------------- BY Prajeshwar V -----------------
                                        that.getView().byId("title").setText(that.getView().byId("idInput").getValue() + "(" + vLength + ")");
                                        odatarow.results.forEach(function (oRowData) {
                                            let oRow = new sap.m.ColumnListItem();
                                            // New updated code
                                            let new_columns = [...aColumns].filter(obj => obj)
                                            let oColsName = [];
                                            //Changed i=1 to i=0 and changed aColumns.length 
                                            for (let i = 0; i < new_columns.length; i++) {
                                                //changed 1 to 0
                                                if (i === 0) {
                                                    oColsName.push("ID")
                                                }
                                                //added the else block
                                                else {
                                                    oColsName.push("Column" + i);
                                                }
                                            };
                                            oColsName.forEach(function (sColumn) {
                                                // let vDate = oRowData[sColumn];
                                                //added the question mark
                                                if (oRowData[sColumn] !== undefined && oRowData[sColumn]?.charAt(4) === '-' && oRowData[sColumn]?.charAt(7) === '-') {
                                                    const [year, month, day] = oRowData[sColumn].split('-');
                                                    oRowData[sColumn] = `${day}-${month}-${year}`;
                                                }
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
                            }
                            else {
                                that.onFilterBarSearch();
                                oBusyDialog.close();
                            }
                        },
                        error: function (oError) {
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            oBusyDialog.close();
                        }
                    });
                }
                this.getView().byId("dynamicTable").removeSelections();
                // this.getView().byId("dynamicTable").setSticky(["HeaderToolbar","ColumnHeaders"]);
                this.byId("_IDGenButton1").setVisible(true);
                this.byId("_IDGenButton2").setVisible(false);
                this.byId("_IDGenButton0").setVisible(false);
                this.byId("_IDGenButton3").setVisible(false);
                this.byId("_IDGenButton4").setVisible(false);
                this.byId("_IDGenButton6").setVisible(false);
                this.byId("idSpreadSheetUploadButton").setVisible(true);
                this.byId("idButtonExcel").setVisible(true);
                //  ----------------- Prajeshwar V -------------
                // this.byId("_IDGenButton10").setVisible(false);
                // this.byId("_IDGenButton10").setEnabled(false);
                // ---------------------------------------------
            },
            onAddRowPress: function () {
                let oDynamicTable = this.getView().byId("dynamicTable"),
                    aColumns;
                aColumns = this.getView().getModel("columnModel").getData();
                let oRow = new sap.m.ColumnListItem();
                // Initialize the new row with Input controls for each column
                aColumns.forEach(function (sColumn) {
                    if (sColumn.includes("date") || sColumn.includes("Date")) {
                        oRow.addCell(new sap.m.DatePicker({
                            displayFormat: "dd-MM-yyyy",
                            valueFormat: "yyyy-MM-dd"
                        }));
                    } else {
                        oRow.addCell(new sap.m.Input(
                            {
                                maxLength: 60
                                //     showValueHelp: true,
                                //     valueHelpRequest: [this.onAlerts, this]
                                //     // valueHelpRequest: this.onAlerts.bind(this) //this also works
                            }
                        ));
                    }
                });
                oDynamicTable.insertItem(oRow, 0);
                oDynamicTable.setSelectedItem(oRow);
                this.byId("_IDGenButton7").setVisible(false);
                this.byId("_IDGenButton4").setVisible(false);
                this.byId("_IDGenButton3").setVisible(true);
                this.byId("_IDGenButton6").setVisible(false);
                this.byId("_IDGenButton2").setVisible(true);
                this.byId("_IDGenButton0").setVisible(true);
            },
            onSaveReocrd: async function name() {
                let oDynamicTable = this.getView().byId("dynamicTable"),
                    oSelectedItems = oDynamicTable.getSelectedItems(),
                    oModel = this.getOwnerComponent().getModel(),
                    that = this,
                    sPath,
                    aBatchOperations = [];
                if (oSelectedItems.length != 0) {
                    let oMandat = that.CheckMandatory(oSelectedItems);
                    if (oMandat === 0) {

                        let oDublicates = await that.CheckDublicates(oSelectedItems);
                        if (oDublicates === 0) {
                            debugger;
                            oSelectedItems.forEach(function (oSelectedItem) {
                                let aCells = oSelectedItem.getCells(),
                                    oPayload = {},
                                    i = 0;
                                sPath = "/RowInfo";
                                aCells.forEach(function (oCell) {
                                    if (i === 0) {
                                        let sColumn = "ID";
                                        let sValue = "";
                                        oPayload[sColumn] = sValue;
                                        i += 1;
                                    } else {
                                        let sColumn = "Column" + i;
                                        let sValue = oCell.getValue();
                                        if ((sValue.charAt(1) === '/' && sValue.charAt(3) === '/') ||
                                            (sValue.charAt(1) === '/' && sValue.charAt(4) === '/') ||
                                            (sValue.charAt(2) === '/' && sValue.charAt(4) === '/') ||
                                            (sValue.charAt(2) === '/' && sValue.charAt(5) === '/') ||
                                            (sValue.charAt(2) === '-' && sValue.charAt(5) === '-')) {
                                            sValue = that.convertDateString(sValue);
                                            oPayload[sColumn] = sValue.trim();
                                            i += 1;
                                        }
                                        else {
                                            oPayload[sColumn] = sValue.trim();
                                            i += 1;
                                        }
                                        // oPayload[sColumn] = sValue.trim();
                                        // i += 1;
                                    }
                                });
                                oPayload.TableName = that.getView().byId("idInput").getValue();
                                // };
                                delete oPayload.ID;
                                aBatchOperations.push(oPayload);
                                aCells.forEach(function (oCell) {
                                    let sValue = oCell.getValue();
                                    // if (sValue !== undefined && sValue.charAt(4) === '-' && sValue.charAt(7) === '-') {
                                    //     const [year, month, day] = sValue.split('-');
                                    //     sValue = `${day}-${month}-${year}`;
                                    //    
                                    // }
                                    let oText = new sap.m.Text({
                                        text: sValue
                                    });
                                    oSelectedItem.removeCell(oCell);
                                    oSelectedItem.addCell(oText);
                                });
                            });

                            let oBusyDialog = new BusyDialog();
                            oBusyDialog.open();
                            aBatchOperations.forEach(function (oRecord) {
                                oModel.createEntry(sPath, {
                                    properties: oRecord,
                                    success: function (oData, oResponse) {
                                    },
                                    error: function (oError) {
                                        MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                    }
                                });
                            });
                            oModel.submitChanges({
                                success: function (oData, oResponse) {
                                    oBusyDialog.close();
                                    that.onTableSelectChange();
                                },
                                error: function (oError) {
                                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                }
                            })
                        } else {
                            MessageBox.error("Same Approver EmployeeID,CompanyCode,Location,Department,Project,Division and Levels Should not be Allowed");
                        }

                    } else {
                        MessageBox.error("Approver EmployeeID,Companycode and Levels are Mandatory");
                    }
                } else {
                    sap.m.MessageToast.show("Please select a row to Save");
                }
            },
            onDeleteRowPress: function () {
                let oDynamicTable = this.getView().byId("dynamicTable"),
                    oSelectedItems = oDynamicTable.getSelectedItems(),
                    oModel = this.getOwnerComponent().getModel(),
                    that = this;
                let oBusyDialog = new sap.m.BusyDialog();
                if (oSelectedItems.length != 0) {
                    oSelectedItems.forEach(function (oSelectedItem) {
                        try {
                            if (oSelectedItem.getCells()[0].getValue() === '') {
                                oDynamicTable.removeItem(oSelectedItem);
                            }
                        } catch (error) {
                            let aKey = oSelectedItem.getCells()[0].getText(),
                                sPath;
                            // sPath = "/RowInfo(guid'" + aKey + "')";
                            // sPath = `/RowInfo(${aKey})`;
                            // sPath = "/RowInfo(ID=guid'" + aKey + "')";
                            sPath = "/RowInfo(guid\'" + aKey + "\')";
                            oBusyDialog.open();
                            that.DeleteOData(oModel, sPath).then((odata) => {
                                //
                            }).catch((oError) => {
                                oBusyDialog.close();
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            });


                        }
                    });
                    oModel.submitChanges({
                        groupId: 'myBatchGroupDelete',
                        success: function (oResponse) {
                            oBusyDialog.close();
                            // MessageBox.success("Selected Rows are Deleted Successfully");
                            that.onTableSelectChange();
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
                this.byId("_IDGenButton2").setVisible(false);
                this.byId("_IDGenButton0").setVisible(false);
                this.byId("_IDGenButton3").setVisible(false);
                this.byId("_IDGenButton4").setVisible(false);
            },
            onEditRowPress: function () {
                let oDynamicTable = this.getView().byId("dynamicTable"),
                    oSelectedItems = oDynamicTable.getSelectedItems();
                if (oSelectedItems) {
                    oSelectedItems.forEach(function (oSelectedItem) {
                        let aCells = oSelectedItem.getCells();
                        aCells.forEach(function (oCell) {
                            if (oCell instanceof sap.m.Text) {
                                let sText = oCell.getText();
                                if (sText.charAt(2) === '-' && sText.charAt(5) === '-') {
                                    // sText = new Date(sText);
                                    let oInput = new sap.m.DatePicker({
                                        value: sText,
                                        displayFormat: "dd-MM-yyyy",
                                        // valueFormat: "yyyy-MM-dd"
                                    });
                                    oSelectedItem.removeCell(oCell);
                                    oSelectedItem.addCell(oInput);
                                } else {
                                    let oInput = new sap.m.Input({
                                        value: sText,
                                        maxLength: 60
                                    });
                                    oSelectedItem.removeCell(oCell);
                                    oSelectedItem.addCell(oInput);
                                }
                            }
                        });
                    })
                } else {
                    sap.m.MessageToast.show("Please select a row to edit");
                }
                this.byId("_IDGenButton2").setVisible(false);
                this.byId("_IDGenButton0").setVisible(false);
                this.byId("_IDGenButton4").setVisible(false);
                this.byId("_IDGenButton6").setVisible(true);
                this.byId("_IDGenButton7").setVisible(true);
            },
            onEditCancel: function (oEvent) {
                this.onTableSelectChange();
                this.byId("_IDGenButton7").setVisible(false);
                this.byId("_IDGenButton4").setVisible(false);
            },
            onAddTable: function (oEvent) {
                this.openDialog("addTable", "taqamainttables.fragments.addTable")
            },
            onClose: function (oEvent) {
                oEvent.getSource().getParent().close();
                this.getView().getModel("newTable").setData({});
            },
            onCreate: function (oEvent) {
                let oPayload = this.getView().getModel("newTable").getData(),
                    vTablename = this.byId("idTablenameInput").getValue().trim(),
                    vColumn1 = this.byId("idColumnInput").getValue().trim(),
                    oModel = this.getOwnerComponent().getModel(),
                    sPath = "/ColumnInfo";
                if (vTablename === "" || vColumn1 === "") {
                    MessageBox.error("Enter \"Table name\" and \"Column1\"");
                }
                else {
                    let oBusyDialog = new sap.m.BusyDialog({
                        size: "3rem"
                    });
                    oBusyDialog.open();
                    this.CRDoData(oModel, sPath, oPayload).then((odata) => {
                        oEvent.getSource().getParent().close();
                        MessageBox.success("Table is Created Successfully");
                        oBusyDialog.close();
                        this.getView().getModel("newTable").setData({});
                    }).catch((oError) => {
                        MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        oBusyDialog.close();
                    });
                };
            },
            onTableSelectionChange: function (oEvent) {
                let oSelectedItems = oEvent.getSource().getSelectedItems();
                if (oSelectedItems.length !== 0) {
                    this.byId("_IDGenButton3").setVisible(true);
                    this.byId("_IDGenButton4").setVisible(true);
                    this.byId("_IDGenButton2").setVisible(true);
                    this.byId("_IDGenButton0").setVisible(true);
                    this.byId("_IDGenButton6").setVisible(false);
                    this.byId("_IDGenButton7").setVisible(false);
                    let allCellsAreInputs = false;
                    // Iterate over each selected item
                    oSelectedItems.forEach(oSelectedItem => {
                        // Get all cells of the selected row
                        let aCells = oSelectedItem.getCells();
                        // Check if all cells are instances of sap.m.Input
                        if (!(aCells[1] instanceof sap.m.Text)) {
                            allCellsAreInputs = true;

                        }
                    });
                    if (allCellsAreInputs && oSelectedItems.length > 0) {
                        this.byId("_IDGenButton4").setVisible(false);
                        this.byId("_IDGenButton6").setVisible(true);
                        // this.byId("_IDGenButton2").setVisible(false);
                    } else {
                        // this.byId("_IDGenButton4").setVisible(true);
                        // this.byId("_IDGenButton2").setVisible(false);
                    }
                } else {
                    this.byId("_IDGenButton3").setVisible(false);
                    this.byId("_IDGenButton4").setVisible(false);
                    this.byId("_IDGenButton2").setVisible(false);
                    this.byId("_IDGenButton0").setVisible(false);
                    this.byId("_IDGenButton6").setVisible(false);
                    this.byId("_IDGenButton7").setVisible(false);
                }
                // -------------------- Prajeshwar V ----------------
                // let allCellsAreInputs = false;
                // // Iterate over each selected item
                // oSelectedItems.forEach(oSelectedItem => {
                //     // Get all cells of the selected row
                //     let aCells = oSelectedItem.getCells();
                //     // Check if all cells are instances of sap.m.Input
                //     if (!(aCells[1] instanceof sap.m.Text)) {
                //         allCellsAreInputs = true;

                //     }

                //     // aCells.forEach(oCell => {
                //     //     if (!(oCell instanceof sap.m.Text)) {
                //     //         allCellsAreInputs = true;
                //     //         break;
                //     //     }
                //     // });
                // });
                // if (allCellsAreInputs && oSelectedItems.length > 0) {
                //     this.byId("_IDGenButton4").setVisible(false);
                //     this.byId("_IDGenButton6").setVisible(true);
                //     this.byId("_IDGenButton2").setVisible(false);
                // } else {
                //     // this.byId("_IDGenButton4").setVisible(true);
                // }
                // -------------------- Prajeshwar V ----------------
            },
            onUpdate: async function (oEvent) {
                let oDynamicTable = this.getView().byId("dynamicTable");
                let oSelectedItems = oDynamicTable.getSelectedItems();
                let oModel = this.getOwnerComponent().getModel(),
                    that = this,
                    sPath;
                let oBusyDialog = new sap.m.BusyDialog();
                if (oSelectedItems.length != 0) {
                    let oMandat = that.CheckMandatory(oSelectedItems);
                    if (oMandat === 0) {

                        // let oDublicates = await that.CheckDublicates(oSelectedItems);
                        // if (oDublicates === 0) {
                        oSelectedItems.forEach(function (oSelectedItem) {
                            let aCells = oSelectedItem.getCells(),
                                oPayload = {},
                                i = 0;
                            aCells.forEach(function (oCell) {
                                if (i === 0) {
                                    let sColumn = "ID";
                                    let sValue = oCell.getValue();
                                    oPayload[sColumn] = sValue;
                                    i += 1;
                                } else {
                                    let sColumn = "Column" + i;
                                    let sValue = oCell.getValue();
                                    if ((sValue.charAt(1) === '/' && sValue.charAt(3) === '/') ||
                                        (sValue.charAt(1) === '/' && sValue.charAt(4) === '/') ||
                                        (sValue.charAt(2) === '/' && sValue.charAt(4) === '/') ||
                                        (sValue.charAt(2) === '/' && sValue.charAt(5) === '/') ||
                                        (sValue.charAt(2) === '-' && sValue.charAt(5) === '-')) {
                                        sValue = that.convertDateString(sValue);
                                        oPayload[sColumn] = sValue.trim();
                                        i += 1;
                                    }
                                    else {
                                        oPayload[sColumn] = sValue.trim();
                                        i += 1;
                                    }
                                }
                            });
                            delete oPayload.Column19;
                            sPath = "/RowInfo(guid'" + oPayload.ID + "')";
                            // sPath = `/RowInfo(${oPayload.ID})`;
                            // sPath = "/RowInfo(ID=guid'" + oPayload.ID + "')";
                            // };
                            aCells.forEach(function (oCell) {
                                let sValue = oCell.getValue();
                                let oText = new sap.m.Text({
                                    text: sValue
                                });
                                oSelectedItem.removeCell(oCell);
                                oSelectedItem.addCell(oText);
                                // }
                            });
                            oBusyDialog.open();
                            that.UpdateOData(oModel, sPath, oPayload).then((odata) => {
                            }).catch((oError) => {
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                // MessageBox.error(oError);
                            });
                        });
                        oModel.submitChanges({
                            groupId: 'myBatchGroup',
                            success: function (oResponse) {
                                // Handle success
                                that.onTableSelectChange();
                                // MessageBox.success("Selected Rows are Updated Successfully");
                                oBusyDialog.close();
                            },
                            error: function (oError) {
                                // Handle error
                                that.onTableSelectChange();
                                oBusyDialog.close();
                                // MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                MessageBox.error(oError);
                            }
                        });
                        // } else {
                        //     MessageBox.error("Same Approver EmployeeID,CompanyCode,Location,Department,Project,Division and Levels Should not be Allowed");
                        // }

                    } else {
                        MessageBox.error("Approver EmployeeID,Companycode and Levels are Mandatory");
                    }
                } else {
                    sap.m.MessageToast.show("Please select a row to save");
                }
                this.byId("_IDGenButton7").setVisible(false);
            },
            onColumnInfoSelectDialogConfirm: function (oEvent) {
                let aSelectedItem = oEvent.getParameter("selectedItem").getTitle();
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                this.getView().byId("idInput").setValue(aSelectedItem);
                this.onTableSelectChange();
            },
            onColumnInfoSelectDialogSearch: function (oEvent) {
                let sValue = oEvent.getParameter("value");
                let oFilter = new Filter("TableName", FilterOperator.Contains, sValue);
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },
            onCancelButtonPress: function (oEvent) {
                oEvent.getSource().getParent().close();
                this.getView().byId("idFileUploader").clear();
                this.getView().getModel("excelData").setData({});
            },
            onUploadButtonPress: async function (oEvent) {
                let oExcelData = this.getView().getModel("excelData").getData(),
                    oModel = this.getOwnerComponent().getModel(),
                    that = this,
                    sPath;
                if (oExcelData.length > 0) {


                    let oBusyDialog = new sap.m.BusyDialog();
                    oBusyDialog.open();
                    if (that.vTableName === 'Line Manager Approver Table') {
                        sPath = "/LineManagerApproverTable";
                    }
                    else {
                        sPath = "/RowInfo";
                    };
                    oExcelData.forEach(function (oRecord, index) {
                        oModel.createEntry(sPath, {
                            properties: oRecord,
                            success: function (oData, oResponse) {
                            },
                            error: function (oError) {
                                MessageToast.show(JSON.parse(oError.responseText).error.message.value);
                            }
                        });
                    });
                    oModel.submitChanges({
                        success: function (oData, oResponse) {
                            oBusyDialog.close();
                            if (that.vTableName === 'Line Manager Approver Table') {
                                that.onFilterBarSearch2();
                            }
                            else {
                                that.onTableSelectChange();
                            };
                            oEvent.getSource().getParent().close();
                            that.getView().byId("idFileUploader").clear();
                            that.getView().getModel("excelData").setData({});
                        },
                        error: function (oError) {
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        }
                    })
                } else {
                    MessageBox.warning("Please upload the File")
                }
            },
            onFileUploaderChange: function (oEvent) {
                let file = oEvent.getParameter("files") && oEvent.getParameter("files")[0],
                    that = this,
                    excelData = {},
                    excelDataTemp = {},
                    vSheetName = this.getView().byId("idInput").getValue();
                if (file && window.FileReader) {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        let data = e.target.result;
                        // read data from excel sheet
                        let workbook = XLSX.read(data, {
                            type: 'binary'
                        });
                        excelDataTemp = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[vSheetName], { defval: null });
                        function processData(data) {
                            return data.map(record => {
                                let processedRecord = {};
                                for (let key in record) {
                                    // record[key].trim();//remove spaces from column
                                    if (typeof record[key] === 'number') {
                                        processedRecord[key] = String(record[key]);
                                        processedRecord[key].trim();
                                    } else if (record[key] === undefined || record[key] === null) {
                                        processedRecord[key] = "";
                                    } else {
                                        processedRecord[key] = record[key];
                                        processedRecord[key].trim();
                                    }
                                }
                                return processedRecord;
                            });
                        };
                        excelData = processData(excelDataTemp);
                        if (excelData.length === 0) {
                            MessageBox.error("Either no ROWS are added in excel file or SheetName not be same as Table Name");
                            that.getView().getDependents()[1].close();
                            that.getView().byId("idFileUploader").clear();
                        }
                        else {
                            let oExcelData;
                            if (that.vTableName === 'Line Manager Approver Table') {
                                oExcelData = excelData.map(function (obj) {
                                    let oKeys = Object.keys(obj);
                                    let oRowData = {
                                        EmployeeID: obj[oKeys[0]],
                                        EmployeeName: obj[oKeys[1]],
                                        EmployeeEmailID: obj[oKeys[2]],
                                        ApproverName: obj[oKeys[3]],
                                        ApproverEmpID: obj[oKeys[4]],
                                        ApproverEmailID: obj[oKeys[5]],
                                        CompanyCode: obj[oKeys[6]],
                                        Levels: obj[oKeys[7]]
                                    };
                                    //remove the no data properties
                                    return Object.fromEntries(
                                        Object.entries(oRowData).filter(([key, value]) => value !== undefined)
                                    );
                                });
                            }
                            else {
                                oExcelData = excelData.map(function (obj) {
                                    let oKeys = Object.keys(obj);
                                    let oRowData = {
                                        Column1: obj[oKeys[0]],
                                        Column2: obj[oKeys[1]],
                                        Column3: obj[oKeys[2]],
                                        Column4: obj[oKeys[3]],
                                        Column5: obj[oKeys[4]],
                                        Column6: obj[oKeys[5]],
                                        Column7: obj[oKeys[6]],
                                        Column8: obj[oKeys[7]],
                                        Column9: obj[oKeys[8]],
                                        Column10: obj[oKeys[9]],
                                        Column11: obj[oKeys[10]],
                                        Column12: obj[oKeys[11]],
                                        Column13: obj[oKeys[12]],
                                        Column14: obj[oKeys[13]],
                                        Column15: obj[oKeys[14]],
                                        Column16: obj[oKeys[15]],
                                        Column17: obj[oKeys[16]],
                                        Column18: obj[oKeys[17]],
                                        TableName: that.getView().byId("idInput").getValue()
                                    };
                                    //remove the no data properties
                                    return Object.fromEntries(
                                        Object.entries(oRowData).filter(([key, value]) => value !== undefined)
                                    );
                                });
                            }
                            // Setting the data to the local model 
                            that.getView().getModel("excelData").setData(oExcelData);
                        }
                    };
                    reader.onerror = function (ex) {
                        console.log(ex);
                    };
                    reader.readAsArrayBuffer(file);
                }
            },
            onDownloadTemplateButtonPress: function (oEvent) {
                let oColumns;
                if (this.vTableName === 'Line Manager Approver Table') {
                    oColumns = this.getView().byId("dynamicTable2").getColumns();
                }
                else {
                    oColumns = this.getView().byId("dynamicTable").getColumns();
                };
                let ColumnsLabels = [];
                oColumns.forEach(function (column) {
                    ColumnsLabels.push({ property: column.getHeader().getText() });
                });
                ColumnsLabels.splice(0, 1);
                let oSettings = {
                    workbook: {
                        columns: ColumnsLabels,
                        hierarchyLevel: 'Level',
                        context: {
                            sheetName: this.getView().byId("idInput").getValue()
                        }
                    },
                    dataSource: [{}],
                    fileName: this.getView().byId("idInput").getValue() + '_Template.xlsx'
                    // worker: false // We need to disable worker because we are using a MockServer as OData Service
                };
                let oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            onExcelButtonPress: function (oEvent) {
                let oColumns,
                    oRowBinding;
                if (this.vTableName === 'Line Manager Approver Table') {
                    oColumns = this.getView().byId("dynamicTable2").getColumns(),
                        oRowBinding = this.getView().byId("dynamicTable2").getItems();
                }
                else {
                    oColumns = this.getView().byId("dynamicTable").getColumns(),
                        oRowBinding = this.getView().byId("dynamicTable").getItems();
                }
                let ColumnsLabels = [],
                    data = [];
                oColumns.forEach(function (column) {
                    ColumnsLabels.push({ property: column.getHeader().getText() });
                });
                ColumnsLabels.splice(0, 1);
                oRowBinding.forEach(function (oItem) {
                    let itemData = {};
                    oColumns.forEach(function (oColumn, index) {
                        let columnId = oColumn.getHeader().getText();
                        let cell = oItem.getCells()[index];
                        try {
                            itemData[columnId] = cell.getText(); // Adjust this based on your cell content
                        } catch (error) {
                            itemData[columnId] = cell.getValue(); // Adjust this based on your cell content
                        }

                    });
                    data.push(itemData);
                });
                let oSettings = {
                    workbook: {
                        columns: ColumnsLabels,
                        context: {
                            sheetName: this.getView().byId("idInput").getValue()
                        }
                    },
                    dataSource: data,
                    fileName: this.getView().byId("idInput").getValue() + '.xlsx',
                    worker: false
                };
                let oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            applyFilters: function (oEvent, tablename) {
                let oEvents = oEvent,
                    vTable = tablename,
                    oFilterBar = this.getView().byId("idFilterBar");
                oFilterBar.destroyFilterGroupItems();
                let propsToDelete = ['DELETED', 'ID', 'TableName', 'createdAt', 'createdBy', 'modifiedAt', 'modifiedBy', '__metadata'];
                propsToDelete.forEach(prop => {
                    delete oEvents[prop];
                });
                Object.keys(oEvents).forEach(key => {
                    if (oEvents[key] === '' || oEvents[key] === null || oEvents[key] === undefined) {
                        delete oEvents[key];
                    }
                });
                let oColumnFilters = Object.entries(oEvents);
                if (vTable === "Approver Table") {
                    let vTrue = true;
                    let vFalse = false;
                    oColumnFilters.forEach(function (oColumn, index) {
                        let oMultiInput = new sap.m.MultiInput({
                            name: oColumn[0],
                            showValueHelp: false,
                        });
                        oMultiInput.addValidator(function (oEvent) {
                            return new sap.m.Token({ key: oEvent.text, text: oEvent.text });
                        });
                        oFilterBar.addFilterGroupItem(new FilterGroupItem({
                            groupName: 'Group' + index,
                            name: oColumn[0],
                            label: oColumn[1],
                            control: oMultiInput,
                            // control: new sap.m.Input({ name: oColumn[0] }),
                            visibleInFilterBar: index == 2 || index == 5 ? vTrue : vFalse
                        }));
                    });
                } else {
                    oColumnFilters.forEach(function (oColumn, index) {
                        let oMultiInput = new sap.m.MultiInput({
                            name: oColumn[0],
                            showValueHelp: false,
                        });
                        oMultiInput.addValidator(function (oEvent) {
                            return new sap.m.Token({ key: oEvent.text, text: oEvent.text });
                        });
                        oFilterBar.addFilterGroupItem(new FilterGroupItem({
                            groupName: 'Group' + index,
                            name: oColumn[0],
                            label: oColumn[1],
                            control: oMultiInput,
                            // control: new sap.m.Input({ name: oColumn[0] }),
                        }));
                    });
                }
            },
            onFilterBarSearch: async function () {
                // this.onTableSelectChange();
                let oFilterBar = this.getView().byId("idFilterBar"),
                    oTable = this.getView().byId("dynamicTable"),
                    filters = new Array(),
                    filterByName,
                    oModel = this.getOwnerComponent().getModel();
                let oBusyDialog = new BusyDialog(),
                    aTableFilters = oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                        let oControl = oFilterGroupItem.getControl(),
                            aFilters = [];
                        if (oControl instanceof sap.m.Input) {
                            let sInputValue = oControl.getValue();
                            if (sInputValue) {
                                aFilters.push(new Filter({
                                    path: oFilterGroupItem.getName(),
                                    operator: FilterOperator.EQ,
                                    value1: sInputValue,
                                    // caseSensitive: false
                                }));
                            }
                        }
                        if (oControl instanceof sap.m.MultiInput) {
                            const aTokens = oControl.getTokens();
                            if (aTokens.length > 0) {
                                aTokens.forEach(oToken => {
                                    const sTokenValue = oToken.getText();
                                    if (sTokenValue) {
                                        aFilters.push(new Filter({
                                            path: oFilterGroupItem.getName(),
                                            operator: FilterOperator.EQ,
                                            value1: sTokenValue,
                                            and: false
                                        }));
                                    }
                                });
                            }
                        }
                        if (aFilters.length > 0) {
                            aResult.push(new sap.ui.model.Filter({
                                filters: aFilters,
                                and: false // Combine filters with OR
                            }));
                        }
                        return aResult;
                    }, []);
                oBusyDialog.open();
                let that = this;
                filterByName = new Filter("TableName", FilterOperator.EQ, this.vTableName);
                filters.push(filterByName);
                await oModel.read("/RowInfo", {
                    filters: filters,
                    success: (odatarow) => {
                        // let _originalData = odatarow.results;
                        // ---------------- BY Prajeshwar V -----------------
                        let _originalData = that.sortOdata(odatarow.results, that.vTableName);
                        // ---------------- BY Prajeshwar V -----------------
                        const filteredData = _originalData.filter(item => {
                            return aTableFilters.every(filterGroup => {
                                return filterGroup.aFilters.some(filter => {
                                    // return item[filter.sPath] === filter.oValue1;
                                    const itemValue = (item[filter.sPath]).toLowerCase();
                                    const filterValue = (filter.oValue1).toLowerCase();
                                    return itemValue.includes(filterValue);
                                });
                            });
                        });
                        // Clear the table and populate it with filtered data
                        oTable.destroyItems();
                        this.populateTableWithRowData(this.getView().getModel("columnModel").getData(), filteredData, oTable);
                        oBusyDialog.close();
                    },
                    error: (oErrorRow) => {
                        MessageBox.error(JSON.parse(oErrorRow.responseText).error.message.value);
                        oBusyDialog.close();
                    }
                })
            },
            populateTableWithRowData: function (aColumns, rowData, oDynamicTable) {
                const vLength = rowData.length;
                this.getView().byId("title").setText(`${this.getView().byId("idInput").getValue()} (${vLength})`);
                rowData.forEach(oRowData => {
                    const oRow = new sap.m.ColumnListItem(),
                        oColsName = [];
                    for (let i = 1; i <= aColumns.length; i++) {
                        if (i === 1) {
                            oColsName.push("ID")
                        }
                        oColsName.push("Column" + i);
                    };
                    //     oColsName.forEach(sColumn => {
                    //         if (oRowData[sColumn] !== undefined && oRowData[sColumn].length === 10 && oRowData[sColumn].charAt(4) === '-' && oRowData[sColumn].charAt(7) === '-') {
                    //             const [year, month, day] = oRowData[sColumn].split('-');
                    //             oRowData[sColumn] = `${day}-${month}-${year}`;
                    //         }
                    //         oRow.addCell(new sap.m.Text({ text: oRowData[sColumn] }));
                    //     });
                    //     oDynamicTable.addItem(oRow);
                    // });
                    // New Updated Code
                    oColsName.forEach(sColumn => {
                        if (oRowData[sColumn] !== undefined && oRowData[sColumn] !== null) {
                            // console.log(oRowData[sColumn].length);
                            if (oRowData[sColumn].length === 10 && oRowData[sColumn].charAt(4) === '-' && oRowData[sColumn].charAt(7) === '-') {
                                const [year, month, day] = oRowData[sColumn].split('-');
                                oRowData[sColumn] = `${day}-${month}-${year}`;
                            }
                            oRow.addCell(new sap.m.Text({ text: oRowData[sColumn] }));
                        } else {
                            console.log(`oRowData[${sColumn}] is undefined or null`);
                        }
                    });
                    oDynamicTable.addItem(oRow);
                });
            },
            convertDateString: function (dateString) {
                if (dateString.includes('-')) {
                    const [day, month, year] = dateString.split('-');
                    return `${year}-${month}-${day}`;
                }
                else {
                    // Create a Date object from the input string
                    const [month, day, year] = dateString.split('/').map(Number);
                    // Convert two-digit year to four-digit year
                    const fullYear = year < 100 ? 2000 + year : year;
                    // Use Date object to ensure proper formatting
                    const date = new Date(fullYear, month - 1, day);
                    // Extract year, month, and day, ensuring two digits for month and day
                    const yyyy = date.getFullYear();
                    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                    const dd = String(date.getDate()).padStart(2, '0');
                    // Format as YYYY-MM-DD
                    return `${yyyy}-${mm}-${dd}`;
                }
            },
            LineMAddRowPress: function (oEvent) {
                let oDynamicTable = this.getView().byId("dynamicTable2"),
                    aColumns = oDynamicTable.getColumns();
                let oRow = new sap.m.ColumnListItem();
                // Initialize the new row with Input controls for each column
                aColumns.forEach(function (sColumn) {
                    oRow.addCell(new sap.m.Input(
                        {
                            maxLength: 60
                            //     showValueHelp: true,
                            //     valueHelpRequest: [this.onAlerts, this]
                            //     // valueHelpRequest: this.onAlerts.bind(this) //this also works
                        }
                    ));
                });
                oDynamicTable.insertItem(oRow, 0);
                this.byId("_IDGenButton72").setVisible(false);
                this.byId("_IDGenButton42").setVisible(false);
                this.byId("_IDGenButton32").setVisible(true);
                this.byId("_IDGenButton62").setVisible(false);
                this.byId("_IDGenButton22").setVisible(true);
            },
            LineMSaveReocrd: function (oEvent) {
                let oDynamicTable = this.getView().byId("dynamicTable2"),
                    oSelectedItems = oDynamicTable.getSelectedItems(),
                    oModel = this.getOwnerComponent().getModel(),
                    that = this,
                    sPath,
                    aBatchOperations = [];
                if (oSelectedItems.length != 0) {
                    oSelectedItems.forEach(function (oSelectedItem) {
                        let aCells = oSelectedItem.getCells(),
                            oPayload = {
                                "EmployeeID": aCells[1].getValue(),
                                "EmployeeName": aCells[2].getValue(),
                                "EmployeeEmailID": aCells[3].getValue(),
                                "ApproverName": aCells[4].getValue(),
                                "ApproverEmpID": aCells[5].getValue(),
                                "ApproverEmailID": aCells[6].getValue(),
                                "CompanyCode": aCells[7].getValue(),
                                "Levels": aCells[8].getValue()
                            };
                        // i = 0;
                        // let aColumns = oDynamicTable.getColumns();
                        // aColumns.forEach(function (oColumn) {
                        //     let sColumnName = oColumn.getHeader().getText();  // Get column header text
                        //     let oCell = aCells[i];
                        //     if (oCell) {
                        //         let sValue = oCell.getText();
                        //         oPayload[sColumnName] = sValue ? sValue.trim() : "";
                        //         i += 1;
                        //     }
                        // });
                        // delete oPayload.ID;
                        aBatchOperations.push(oPayload);
                        aCells.forEach(function (oCell) {
                            let sValue = oCell.getValue();
                            // if (sValue !== undefined && sValue.charAt(4) === '-' && sValue.charAt(7) === '-') {
                            //     const [year, month, day] = sValue.split('-');
                            //     sValue = `${day}-${month}-${year}`;
                            //    
                            // }
                            let oText = new sap.m.Text({
                                text: sValue
                            });
                            oSelectedItem.removeCell(oCell);
                            oSelectedItem.addCell(oText);
                        });
                    });
                    let oBusyDialog = new BusyDialog();
                    oBusyDialog.open();
                    sPath = "/LineManagerApproverTable";
                    aBatchOperations.forEach(function (oRecord) {
                        oModel.createEntry(sPath, {
                            properties: oRecord,
                            success: function (oData, oResponse) {
                            },
                            error: function (oError) {
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            }
                        });
                    });
                    oModel.submitChanges({
                        success: function (oData, oResponse) {
                            oBusyDialog.close();
                            // oModel.refresh();
                            // that.LineMrefresh();
                            that.onFilterBarSearch2();
                        },
                        error: function (oError) {
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        }
                    })
                } else {
                    sap.m.MessageToast.show("Please select a row to Save");
                }
            },
            LineMDeleteRowPress: function (oEvent) {
                let oDynamicTable = this.getView().byId("dynamicTable2"),
                    oSelectedItems = oDynamicTable.getSelectedItems(),
                    oModel = this.getOwnerComponent().getModel(),
                    that = this,
                    aBatchOperations = [];
                let oBusyDialog = new sap.m.BusyDialog();
                if (oSelectedItems.length != 0) {
                    oSelectedItems.forEach(function (oSelectedItem) {
                        try {
                            if (oSelectedItem.getCells()[0].getValue() === '') {
                                oDynamicTable.removeItem(oSelectedItem);
                            }
                        } catch (error) {
                            let aKey = oSelectedItem.getCells()[0].getText(),
                                sPath;
                            sPath = "/LineManagerApproverTable(guid'" + aKey + "')";
                            // sPath = `/LineManagerApproverTable(${aKey})`;
                            // sPath = "/LineManagerApproverTable(ID=guid'" + aKey + "')";
                            oBusyDialog.open();
                            that.DeleteOData(oModel, sPath).then((odata) => {
                                //
                            }).catch((oError) => {
                                oBusyDialog.close();
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            });
                        }
                    });
                    oModel.submitChanges({
                        groupId: 'myBatchGroupDelete',
                        success: function (oResponse) {

                            oBusyDialog.close();
                            that.onFilterBarSearch2();

                            // MessageBox.success("Selected Rows are Deleted Successfully");
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
                this.byId("_IDGenButton22").setVisible(false);
                this.byId("_IDGenButton32").setVisible(false);
                this.byId("_IDGenButton42").setVisible(false);
            },
            LineMSelectionChange: function (oEvent) {
                let oSelectedItems = oEvent.getSource().getSelectedItems();
                if (oSelectedItems.length != 0) {
                    this.byId("_IDGenButton32").setVisible(true);
                    this.byId("_IDGenButton42").setVisible(true);
                    this.byId("_IDGenButton22").setVisible(true);
                    this.byId("_IDGenButton62").setVisible(false);
                    this.byId("_IDGenButton72").setVisible(false);
                } else {
                    this.byId("_IDGenButton32").setVisible(false);
                    this.byId("_IDGenButton42").setVisible(false);
                    this.byId("_IDGenButton22").setVisible(false);
                    this.byId("_IDGenButton62").setVisible(false);
                    this.byId("_IDGenButton72").setVisible(false);
                }
            },
            LineMUpdate: async function (oEvent) {
                let oDynamicTable = this.getView().byId("dynamicTable2");
                let oSelectedItems = oDynamicTable.getSelectedItems();
                let oModel = this.getOwnerComponent().getModel(),
                    that = this,
                    sPath;
                let oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open();
                if (oSelectedItems.length !== 0) {
                    // Start by setting a deferred group for batching
                    const sGroupId = "batchUpdateGroup";
                    oModel.setDeferredGroups([sGroupId]);
                    oSelectedItems.forEach(function (oSelectedItem) {
                        let aCells = oSelectedItem.getCells(),
                            oPayload = {
                                "ID": aCells[0].getValue(),
                                "EmployeeID": aCells[1].getValue(),
                                "EmployeeName": aCells[2].getValue(),
                                "EmployeeEmailID": aCells[3].getValue(),
                                "ApproverName": aCells[4].getValue(),
                                "ApproverEmpID": aCells[5].getValue(),
                                "ApproverEmailID": aCells[6].getValue(),
                                "CompanyCode": aCells[7].getValue(),
                                "Levels": aCells[8].getValue()
                            };
                        sPath = "/LineManagerApproverTable(guid'" + oPayload.ID + "')";
                        // sPath = `/LineManagerApproverTable(${oPayload.ID})`;
                        // sPath = "/LineManagerApproverTable(ID=guid'" + oPayload.ID + "')";
                        // delete oPayload.ID;
                        aCells.forEach(function (oCell) {
                            let sValue = oCell.getValue();
                            let oText = new sap.m.Text({
                                text: sValue
                            });
                            oSelectedItem.removeCell(oCell);
                            oSelectedItem.addCell(oText);
                            // }
                        });
                        // Use oModel.update with the specified groupId
                        oModel.update(sPath, oPayload, {
                            groupId: sGroupId,
                            success: function () {
                                // Handle individual success if needed
                            },
                            error: function (oError) {
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            }
                        });
                    });
                    // Submit the batch changes
                    oModel.submitChanges({
                        groupId: sGroupId,
                        success: function () {
                            oBusyDialog.close();
                            that.onFilterBarSearch2();
                            // that.LineMrefresh();
                            // MessageBox.success("Selected Rows are Updated Successfully");
                        },
                        error: function (oError) {
                            oBusyDialog.close();
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        }
                    });
                } else {
                    sap.m.MessageToast.show("Please select a row to save");
                }
                this.byId("_IDGenButton72").setVisible(false);
            },
            LineMEditRowPress: function (oEvent) {
                let oDynamicTable = this.getView().byId("dynamicTable2"),
                    oSelectedItems = oDynamicTable.getSelectedItems();
                if (oSelectedItems) {
                    oSelectedItems.forEach(function (oSelectedItem) {
                        let aCells = oSelectedItem.getCells();
                        aCells.forEach(function (oCell) {
                            if (oCell instanceof sap.m.Text) {
                                let sText = oCell.getText();
                                if (sText.charAt(2) === '-' && sText.charAt(5) === '-') {
                                    // sText = new Date(sText);
                                    let oInput = new sap.m.DatePicker({
                                        value: sText,
                                        displayFormat: "dd-MM-yyyy",
                                        // valueFormat: "yyyy-MM-dd"
                                    });
                                    oSelectedItem.removeCell(oCell);
                                    oSelectedItem.addCell(oInput);
                                } else {
                                    let oInput = new sap.m.Input({
                                        value: sText,
                                        maxLength: 60
                                    });
                                    oSelectedItem.removeCell(oCell);
                                    oSelectedItem.addCell(oInput);
                                }
                            }
                        });
                    })
                } else {
                    sap.m.MessageToast.show("Please select a row to edit");
                }
                this.byId("_IDGenButton22").setVisible(false);
                this.byId("_IDGenButton42").setVisible(false);
                this.byId("_IDGenButton62").setVisible(true);
                this.byId("_IDGenButton72").setVisible(true);
            },
            LineMEditCancel: function (oEvent) {
                this.getView().getModel().refresh();
                // let oDynamicTable = this.getView().byId("dynamicTable2"),
                //     oSelectedItems = oDynamicTable.getSelectedItems();
                //     oDynamicTable.getBinding("items").refresh();
                // if (oSelectedItems) {
                //     oSelectedItems.forEach(function (oSelectedItem) {
                //         let aCells = oSelectedItem.getCells();
                //         aCells.forEach(function (oCell) {
                //             if (oCell instanceof sap.m.Input) {
                //                 let sText = oCell.getValue();
                //                 // if (sText.charAt(2) === '-' && sText.charAt(5) === '-') {
                //                 //     // sText = new Date(sText);
                //                 //     let oInput = new sap.m.DatePicker({
                //                 //         value: sText,
                //                 //         displayFormat: "dd-MM-yyyy",
                //                 //         // valueFormat: "yyyy-MM-dd"
                //                 //     });
                //                 //     oSelectedItem.removeCell(oCell);
                //                 //     oSelectedItem.addCell(oInput);
                //                 // } else {
                //                 let oInput = new sap.m.Text({
                //                     text: sText
                //                 });
                //                 oSelectedItem.removeCell(oCell);
                //                 oSelectedItem.addCell(oInput);
                //             }
                //         })
                //     });
                // } else {
                //     sap.m.MessageToast.show("Please select a row to edit");
                // }
                // this.LineMrefresh();
                this.onFilterBarSearch2();
                this.byId("_IDGenButton72").setVisible(false);
                this.byId("_IDGenButton42").setVisible(true);
            },
            onFilterBarSearch2: async function () {
                let oFilterBar = this.getView().byId("idFilterBar2"),
                    oTable = this.getView().byId("dynamicTable2"),
                    filters = new Array(),
                    filterByName,
                    that = this,
                    oModel = this.getOwnerComponent().getModel();
                let oBusyDialog = new BusyDialog(),
                    aTableFilters = oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                        let oControl = oFilterGroupItem.getControl(),
                            aFilters = [];
                        if (oControl instanceof sap.m.Input) {
                            let sInputValue = oControl.getValue();
                            if (sInputValue) {
                                aFilters.push(new Filter({
                                    path: oFilterGroupItem.getName(),
                                    operator: FilterOperator.Contains,
                                    value1: sInputValue,
                                    caseSensitive: false
                                }));
                            }
                        }
                        if (aFilters.length > 0) {
                            aResult.push(new sap.ui.model.Filter({
                                filters: aFilters,
                                and: false // Combine filters with OR
                            }));
                        }
                        return aResult;
                    }, []);
                oBusyDialog.open();
                // filterByName = new Filter("TableName", FilterOperator.EQ, this.vTableName);
                // filters.push(filterByName);
                var templates = new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({
                            text: "{linemanagerRows>ID}"
                        }),
                        new sap.m.Text({
                            text: "{linemanagerRows>EmployeeID}"
                        }),
                        new sap.m.Text({
                            text: "{linemanagerRows>EmployeeName}"
                        }),
                        new sap.m.Text({
                            text: "{linemanagerRows>EmployeeEmailID}"
                        }),
                        new sap.m.Text({
                            text: "{linemanagerRows>ApproverName}"
                        }),
                        new sap.m.Text({
                            text: "{linemanagerRows>ApproverEmpID}"
                        }),
                        new sap.m.Text({
                            text: "{linemanagerRows>ApproverEmailID}"
                        }),
                        new sap.m.Text({
                            text: "{linemanagerRows>CompanyCode}"
                        }),
                        new sap.m.Text({
                            text: "{linemanagerRows>Levels}"
                        })
                    ]
                });
                await oModel.read("/LineManagerApproverTable", {
                    filters: aTableFilters,
                    success: (odata) => {
                        let oDynamicTable = that.getView().byId("dynamicTable2");
                        oDynamicTable.destroyItems();
                        that.getView().getModel("linemanagerRows").destroy();
                        that.getView().getModel("linemanagerRows").setData(odata.results);
                        that.getView().byId("title2").setText(that.getView().byId("idInput").getValue() + "(" + odata.results.length + ")");
                        oBusyDialog.close();
                        that.getView().getModel("linemanagerRows").refresh();
                        // let oDynamicTable = this.getView().byId("dynamicTable2");
                        oDynamicTable.bindItems({
                            path: "linemanagerRows>/",
                            template: templates
                        });
                        oDynamicTable.getBinding("items").refresh(true);
                        // let _originalData = odatarow.results;
                        // const filteredData = _originalData.filter(item => {
                        //     return aTableFilters.every(filterGroup => {
                        //         return filterGroup.aFilters.some(filter => {
                        //             // return item[filter.sPath] === filter.oValue1;
                        //             const itemValue = (item[filter.sPath]).toLowerCase();
                        //             const filterValue = (filter.oValue1).toLowerCase();
                        //             return itemValue.includes(filterValue);
                        //         });
                        //     });
                        // });
                        // // Clear the table and populate it with filtered data
                        // oTable.destroyItems();
                        // // this.populateTableWithRowData(this.getView().getModel("columnModel").getData(), filteredData, oTable);
                        // oBusyDialog.close();
                    },
                    error: (oErrorRow) => {
                        MessageBox.error(JSON.parse(oErrorRow.responseText).error.message.value);
                        oBusyDialog.close();
                    }
                })
            },
            onCopyRecord: function () {
                // Get the table control
                let oDynamicTable = this.getView().byId("dynamicTable");
                let oSelectedItems = oDynamicTable.getSelectedItems();
                oDynamicTable.removeSelections()
                console.log(oSelectedItems);
                let i = 0;
                // if (oSelectedItems.length === 1) {
                if (oSelectedItems.length > 0) {
                    // let oCopyObjects = [];
                    oSelectedItems.forEach(oSelectedItem => {
                        // let oSelectedItem = oSelectedItems[0];
                        let aCells = oSelectedItem.getCells();
                        // let sCopyObject = {};
                        let oRow = new sap.m.ColumnListItem();
                        aCells.forEach(function (oCell) {
                            let sValue;
                            if (oCell instanceof sap.m.Input) {
                                sValue = oCell.getValue();
                                if (sValue.charAt(2) === '-' && sValue.charAt(5) === '-') {

                                    oRow.addCell(new sap.m.DatePicker({
                                        value: sValue.trim(),
                                        displayFormat: "dd-MM-yyyy",
                                        // valueFormat: "yyyy-MM-dd"
                                    }));
                                } else {
                                    oRow.addCell(new sap.m.Input(
                                        {
                                            maxLength: 60,
                                            value: sValue.trim()
                                        }
                                    ));
                                }

                            } else if (oCell instanceof sap.m.Text || oCell instanceof sap.m.Label) {
                                sValue = oCell.getText();
                                if (sValue.charAt(2) === '-' && sValue.charAt(5) === '-') {

                                    oRow.addCell(new sap.m.DatePicker({
                                        value: sValue,
                                        displayFormat: "dd-MM-yyyy",
                                        // valueFormat: "yyyy-MM-dd"
                                    }));
                                } else {
                                    oRow.addCell(new sap.m.Input(
                                        {
                                            maxLength: 60,
                                            value: sValue.trim()
                                        }
                                    ));
                                }
                            }
                            // else if (oCell instanceof sap.m.CheckBox) {
                            //     sValue = oCell.getSelected();
                            // }
                            else if (oCell instanceof sap.m.DatePicker) {
                                sValue = oCell.getValue();
                                oRow.addCell(new sap.m.DatePicker({
                                    displayFormat: "dd-MM-yyyy",
                                    valueFormat: "yyyy-MM-dd",
                                    value: sValue
                                }));
                            } else {
                                // Add more control types as needed
                                sValue = oCell.getText ? oCell.getText() : "";
                                oRow.addCell(new sap.m.Input(
                                    {
                                        maxLength: 60,
                                        value: sValue.trim()
                                    }
                                ));
                            }
                            // if (i === 0) {
                            //     sCopyObject["ID"] = sValue;
                            // } else {
                            //     sCopyObject["Column" + i] = sValue;
                            // }
                            // i += 1;
                            // oDynamicTable.insertItem(oRow, 0);
                        });
                        oDynamicTable.insertItem(oRow, 0);
                        oDynamicTable.setSelectedItem(oRow);
                        this.getView().byId("_IDGenButton4").setVisible(false);
                        // oCopyObjects.push(sCopyObject);
                    })



                    // console.log(copyObject);
                    // const oCopyModel = new sap.ui.model.json.JSONModel(oCopyObjects);
                    // this.getView().setModel(oCopyModel, "oCopyModel");
                    // this.byId("_IDGenButton10").setVisible(true);
                }
                else {
                    if (oSelectedItems.length === 0) {
                        sap.m.MessageToast.show("Please select a row to copy");
                    }
                    else {
                        sap.m.MessageToast.show("Please select atmost one row to copy");
                    }
                }
            },
            onPasteRecord: function () {
                let oDynamicTable = this.getView().byId("dynamicTable");
                let oSelectedItems = oDynamicTable.getSelectedItems();
                let copyPayload = this.getView().getModel("oCopyModel").getData();
                oSelectedItems.forEach(oSelectedItem => {
                    let aCells = oSelectedItem.getCells();
                    let i = 0;
                    aCells.forEach(aCell => {
                        if (i !== 0) {
                            aCell.setValue(copyPayload["Column" + i]);
                        }
                        i += 1;
                    });
                });
            }
        });
    });
