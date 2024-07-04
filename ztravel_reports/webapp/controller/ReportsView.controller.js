sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/table/RowSettings",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    
],
    function (Controller, BusyIndicator, JSONModel, RowSettings,Filter,FilterOperator) {
        "use strict";
        var columnData = [
            {
                columnName: "TravelId",
                Label: "TRF Number",
                Level: "HeaderInfo"
            },
            {
                columnName: "EmployeeID",
                Label: "Employee Number",
                Level: "HeaderInfo"
            },
            {
                columnName: "TravelType",
                Label: "Travel Type",
                Level: "HeaderInfo"
            },
            {
                columnName: "EmployeeName",
                Label: "Employee Name",
                Level: "Custom"
            },
            {
                columnName: "CompanyCode",
                Label: "Company Code",
                Level: "HeaderInfo"
            },
            {
                columnName: "Designation",
                Label: "Job Title",
                Level: "HeaderInfo"
            },
            // {
            //     columnName: "TravelType",
            //     Label: "Travel with Family",
            //     Level: "HeaderInfo"
            // },
            {
                columnName: "TravelwithFamily",
                Label: "Travel with Family",
                Level: "Custom"
            },
            {
                columnName: "Function",
                Label: "Function",
                Level: "HeaderInfo"
            },
            {
                columnName: "Deparment",
                Label: "Department",
                Level: "HeaderInfo"
            },
            {
                columnName: "Division",
                Label: "Division",
                Level: "HeaderInfo"
            },
            {
                columnName: "Location",
                Label: "Location",
                Level: "HeaderInfo"
            },
            {
                columnName: "createdAt",
                Label: "Creation Date",
                Level: "HeaderInfo"
            }
            ,
            {
                columnName: "createdBy",
                Label: "Creation By",
                Level: "HeaderInfo"
            },
            {
                columnName: "Status",
                Label: "Status",
                Level: "HeaderInfo"
            },
            {
                columnName: "DepartureDate",
                Label: "Travel Start Date",
                Level: "ItsTraveller"
            },
            {
                columnName: "ReturnDate",
                Label: "Return Date",
                Level: "ItsTraveller"
            },
            {
                columnName: "ExpenseCode",
                Label: "Expense code",
                Level: "HeaderInfo"
            },
            {
                columnName: "ProjectCode",
                Label: "Project Code",
                Level: "HeaderInfo"
            },
            {
                columnName: "Class",
                Label: "Class",
                Level: "HeaderInfo"
            },
            {
                columnName: "Sector",
                Label: "Sector",
                Level: "ItsTicketDetails"
            },
            {
                columnName: "Airline",
                Label: "Airlines",
                Level: "ItsTicketDetails"
            },
            {
                columnName: "TicketNo",
                Label: "Ticket Number",
                Level: "ItsTicketDetails"
            },
            {
                columnName: "BaseFare",
                Label: "Base Amount",
                Level: "ItsTicketDetails"
            },
            {
                columnName: "Taxes",
                Label: "Tax Amount",
                Level: "ItsTicketDetails"
            },
            {
                columnName: "Currency",
                Label: "Currency",
                Level: "ItsTicketDetails"
            },
            {
                columnName: "SeatPreference",
                Label: "Seat Preference",
                Level: "ItsTraveller"
            },
            {
                columnName: "MealPreference",
                Label: "Meal Preference",
                Level: "ItsTraveller"
            },
            {
                columnName: "LocalModbileNumber",
                Label: "Contact Number",
                Level: "ItsTraveller"
            },
        ];
        return Controller.extend("com.taqa.travelreports.ztravelreports.controller.ReportsView", {
            onInit: function () {
                var oSummaryModel = new JSONModel();
                // var dataModel = this.getOwnerComponent().getModel("tableData");
                // this.getView().setModel(dataModel, "DataModel");
                // oSummaryModel.setData(dataModel.getData().d);
                // this.getView().setModel(oSummaryModel,"oHeaderModel");
                // this._onSummaryPress();

                var oModelDetail = this.getOwnerComponent().getModel();
                BusyIndicator.show();

                var that = this;
                oModelDetail.read("/TravelDetails", {
                    filters: [ new Filter("Status", FilterOperator.EQ, 'Completed') ],
                    urlParameters: {
                        "$expand": "ItsTraveller,ItsTicketDetails"
                    },
                    success: function (oData, oResponse) {
                        BusyIndicator.hide();
                        oSummaryModel.setData(oData);
                        that.getView().setModel(oSummaryModel, "oHeaderModel");
                        that._onSummaryPress();
                    },
                    error: function (oError) {

                    },
                    async: false
                });

            },

            _onSummaryPress: function () {
                debugger;
                var AdminStatusList = this.getView().getModel("oHeaderModel").getData();
                var rowData = [];
                AdminStatusList.results.sort(function (a, b) {
                    return parseFloat(a.EmployeeID) - parseFloat(b.EmployeeID);
                });

                // var oArrLength = AdminStatusList.results.length;
                AdminStatusList.results.map(function (oColumns, index) {
                    var ItsTraveller = oColumns.ItsTraveller.results;
                    var ItsTicketDetails = oColumns.ItsTicketDetails.results;

                    ItsTraveller.map(function (oItsLineItem_ObjectData, itsTravellerindex) {
                        var obj = {};
                        var obj1 = {};
                        oPresentEmpNo = oColumns['EmployeeID'];
                        // if(oPreviousEmpNo != "" && oPresentEmpNo != oPreviousEmpNo){
                        //     obj["ReferenceNo"] = "Total";
                        //     rowData.push(obj);
                        //     columnData.map(function(fieldcolumnName){
                        //         switch(fieldcolumnName.Level) {
                        //             case 'Custom':
                        //                 var aColumn = fieldcolumnName.columnName;
                        //                 obj1[aColumn] = oColumns["EmployeeFirstName"]+ " "+oColumns["EmployeeMiddleName"];
                        //                 break;
                        //             case 'ItsTraveller':
                        //                 var aColumn = fieldcolumnName.columnName;
                        //                 obj1[aColumn] = oItsLineItem_ObjectData[aColumn];
                        //                 break;
                        //             case 'ItsTicketDetails':
                        //                 var aColumn = fieldcolumnName.columnName;
                        //                 obj1[aColumn] = ItsTicketDetails[itsTravellerindex][aColumn];
                        //                 break;
                        //             default:
                        //                 var aColumn = fieldcolumnName.columnName;
                        //                 obj1[aColumn] = oColumns[aColumn];
                        //         }
                        //     });
                        //     oPreviousEmpNo = oColumns['EmployeeID'];
                        //     // obj1["ReferenceNo"] = "Total1";
                        //     rowData.push(obj1);
                        // }else{
                        columnData.map(function (fieldcolumnName) {
                            switch (fieldcolumnName.Level) {
                                case 'Custom':
                                    var aColumn = fieldcolumnName.columnName;
                                    if (aColumn === 'TravelwithFamily') {
                                        obj[aColumn] = oColumns.TravelType === 'Family Travel' ?'Yes': 'No';
                                    } else {
                                        obj[aColumn] = oColumns["EmployeeFirstName"] + " " + oColumns["EmployeeMiddleName"];
                                    }

                                    break;
                                case 'ItsTraveller':
                                    var aColumn = fieldcolumnName.columnName;
                                    obj[aColumn] = oItsLineItem_ObjectData[aColumn];
                                    break;
                                case 'ItsTicketDetails':
                                    var aColumn = fieldcolumnName.columnName;
                                    obj[aColumn] = ItsTicketDetails[itsTravellerindex][aColumn];
                                    break;
                                default:
                                    var aColumn = fieldcolumnName.columnName;
                                    obj[aColumn] = oColumns[aColumn];
                            }
                        });

                        rowData.push(obj);
                        //}

                    });
                });
                var oPresentEmpNo,
                    oPreviousEmpNo = "",
                    oEmpCount = 0;
                var oRoeDataLength = rowData.length - 1;
                var oFinalData = [];
                for (var oRow = 0; oRow <= oRoeDataLength; oRow++) {
                    debugger;
                    if (rowData[oRow] != undefined) {
                        oPresentEmpNo = rowData[oRow]['EmployeeID'];
                        if (oPreviousEmpNo != "" && oPresentEmpNo != oPreviousEmpNo) {
                            //obj["ReferenceNo"] = "Total";
                            var obbj = {};

                            // obbj.ReferenceNo = "Total";
                            obbj.TravelId = "Total";
                            obbj.EmployeeID = oEmpCount;

                            oPreviousEmpNo = rowData[oRow]['EmployeeID'];
                            oFinalData.push(obbj);
                            oEmpCount = 1;
                            oRoeDataLength = oRoeDataLength + 1;
                            var rowDataObject = rowData[oRow];
                            oFinalData.push(rowDataObject);
                        } else {
                            oPreviousEmpNo = rowData[oRow]['EmployeeID'];
                            var rowDataObject = rowData[oRow];


                            oFinalData.push(rowDataObject);
                            oEmpCount = oEmpCount + 1;
                        }
                    }
                    else {
                        var obbj = {};
                        // obbj.ReferenceNo = "Total";
                        obbj.TravelId = "Total";
                        obbj.EmployeeID = oEmpCount;
                        //oPreviousEmpNo = rowData[oRow]['EmployeeID'];
                        oFinalData.push(obbj);
                    }

                }


                var oModelTable = new sap.ui.model.json.JSONModel();
                oModelTable.setData({
                    columns: columnData,
                    rows: oFinalData,
                });

                var oTable = this.getView().byId("TravelReport");

                oTable.setModel(oModelTable);
                oTable.bindColumns("/columns", function (sId, oContext) {
                    //var sColumnId = oContext.getObject().columnName;
                    var columnName = oContext.getObject().columnName;
                    var Label = oContext.getObject().Label;
                    return new sap.ui.table.Column({
                        label: Label,
                        width: "7em",
                        template: columnName,
                    });
                });
                oTable.bindRows("/rows");
            }
        });
    });
