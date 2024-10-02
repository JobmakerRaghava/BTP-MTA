sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/m/p13n/Engine',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",

], function (
    Controller,
    JSONModel, Engine, Filter, FilterOperator
) {
    "use strict";
    return Controller.extend("taqamainttables.controller.BaseController", {
        openDialog: function (name, path) {
            let sname = name;
            this.mDialogs = this.mDialogs || {};
            let oDialog = this.mDialogs[sname];
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
        declareModel: function (modelName) {
            this.getView().setModel(new JSONModel({}), modelName);
        },
        CRDoData: function (oModel, sPath, oPayload) {
            return new Promise(function (resolve, reject) {
                oModel.create(sPath, oPayload, {
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oerror) {
                        reject(oerror);
                    }
                })
            })
        },
        UpdateOData: function (oModel, sPath, oPayload) {
            let sBatchGroupId = "myBatchGroup";
            oModel.setDeferredGroups([sBatchGroupId]);
            return new Promise(function (resolve, reject) {
                oModel.update(sPath, oPayload, {
                    groupId: sBatchGroupId,
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oerror) {
                        reject(oerror);
                    }
                })
            })
        },

        DeleteOData: function (oModel, sPath) {
            let sBatchGroupId = "myBatchGroupDelete";
            oModel.setDeferredGroups([sBatchGroupId]);
            return new Promise(function (resolve, reject) {
                oModel.remove(sPath, {
                    groupId: sBatchGroupId,
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oerror) {
                        reject(oerror);
                    }
                })
            })
        },
        ReadOData: function (oModel, sPath, Filters) {
            let sBatchGroupId = "myBatchGroupRead";
            oModel.setDeferredGroups([sBatchGroupId]);
            return new Promise(function (resolve, reject) {
                oModel.read(sPath, {
                    groupId: sBatchGroupId,
                    filters: Filters,
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oerror) {
                        reject(oerror);
                    }
                })
            })
        },
        removeEmptyProperties: function (obj) {
            Object.keys(obj).forEach(key => {
                if (obj[key] && typeof obj[key] === 'object') {
                    removeEmptyProperties(obj[key]);
                } else if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
                    delete obj[key];
                }
            });
            return obj;
        },

        // ---------------- BY Prajeshwar V -----------------
        sortOdata: function (data, tableName) {

            const sortableColumnMapping = {
                "Actual Payrol Date": { column: "Column1", direction: "desc" },
                "Allowances": { column: "Column1", direction: "asc" },
                "Allowance combination": { column: "Column1", direction: "asc" },
                "Approver Table": { column: "Column6", direction: "asc" },
                "Work Type": { column: "Column2", direction: "asc" },
                "CutOffCycles": { column: "Column1", direction: "desc" },
                "AMPS": { column: "Column1", direction: "asc" }
            };


            const mapping = sortableColumnMapping[tableName];
            if (!mapping) return data;

            const { column, direction } = mapping;

            const sortedData = data.sort((a, b) => {
                const valA = a[column];
                const valB = b[column];

                // Check for numeric values
                if (!isNaN(valA) && !isNaN(valB)) {
                    return valA - valB;
                }

                // // Check for date strings in the format "yyyy-mm-dd"
                // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

                // if (dateRegex.test(valA) && dateRegex.test(valB)) {
                //     return new Date(valA) - new Date(valB);
                // }

                // Default to string comparison
                return valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
            });

            return direction === "desc" ? sortedData.reverse() : sortedData;


        },
        _getKey: function (oControl) {
            return this.getView().getLocalId(oControl.getId());
        },
        onColumnMove: function (oEvt) {
            const oDraggedColumn = oEvt.getParameter("draggedControl");
            const oDroppedColumn = oEvt.getParameter("droppedControl");

            if (oDraggedColumn === oDroppedColumn) {
                return;
            }

            const oTable = this.getView().byId("dynamicTable");
            const sDropPosition = oEvt.getParameter("dropPosition");
            const iDraggedIndex = oTable.indexOfColumn(oDraggedColumn);
            const iDroppedIndex = oTable.indexOfColumn(oDroppedColumn);
            const iNewPos = iDroppedIndex + (sDropPosition == "Before" ? 0 : 1) + (iDraggedIndex < iDroppedIndex ? -1 : 0);
            const sKey = this._getKey(oDraggedColumn);

            Engine.getInstance().retrieveState(oTable).then(function (oState) {

                const oCol = oState.Columns.find(function (oColumn) {
                    return oColumn.key === sKey;
                }) || {
                    key: sKey
                };
                oCol.position = iNewPos;

                Engine.getInstance().applyState(oTable, {
                    Columns: [oCol]
                });
            });
        },
        CheckMandatory: function (oSelectedItems) {
            let check = 0;
            if (this.vTableName === 'Approver Table') {
                oSelectedItems.forEach(function (oSelectedItem) {
                    let aCells = oSelectedItem.getCells();

                    debugger;
                    if (aCells[2].getValue() === '' || aCells[3].getValue() === '' || aCells[12].getValue() === '') {
                        check += 1;
                    }
                })
                return check;
            } else {
                return check;
            }

        },

        CheckDublicates: async function (oSelectedItems) {

            let check = 0;
            let oModel = this.getOwnerComponent().getModel();
            let sPath = '/RowInfo';
            let that = this;
            return new Promise(function (resolve, reject) {
                if (that.vTableName === 'Approver Table') {
                    oSelectedItems.forEach(async function (oSelectedItem) {
                        let aCells = oSelectedItem.getCells();
                        let aFilters = new Array();
                        debugger;
                        aFilters.push(new Filter("Column1", FilterOperator.EQ, aCells[1].getValue()));
                        aFilters.push(new Filter("Column2", FilterOperator.EQ, aCells[2].getValue()));
                        aFilters.push(new Filter("Column3", FilterOperator.EQ, aCells[3].getValue()));
                        aFilters.push(new Filter("Column6", FilterOperator.EQ, aCells[6].getValue()));
                        aFilters.push(new Filter("Column10", FilterOperator.EQ, aCells[10].getValue()));
                        aFilters.push(new Filter("Column12", FilterOperator.EQ, aCells[12].getValue()));
                        aFilters.push(new Filter("Column17", FilterOperator.EQ, aCells[17].getValue()));
                        aFilters.push(new Filter("TableName", FilterOperator.EQ, "Approver Table"));



                        // let Loc = aCells[1].getValue();
                        // let ComCode = aCells[2].getValue();
                        // let EmpId = aCells[3].getValue();
                        // let Depr = aCells[6].getValue();
                        // let Proj = aCells[10].getValue();
                        // let Level = aCells[12].getValue();
                        // let Divi = aCells[17].getValue();
                        await that.ReadOData(oModel, sPath, aFilters).then((odata) => {
                            // if (odata.results.length > 0) {
                            //     check += 1;
                            //     resolve(check);
                            // }
                        }).catch((oError) => {
                            // oBusyDialog.close();
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });

                    });

                    oModel.submitChanges({
                        groupId: 'myBatchGroupRead',
                        success: function (oResponse) {
                            oResponse.__batchResponses.forEach((oItem) => {
                                if (oItem.data.results.length > 0) {
                                    check += 1;
                                }

                            })
                            resolve(check);
                        },
                        error: function (oError) {
                            reject(oError)

                        }
                    });

                } else {
                    resolve(check);
                }
            })

        },

      

    });
});