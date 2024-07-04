sap.ui.define([
    "sap/ui/core/mvc/Controller",
   
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet',
    "sap/ui/core/BusyIndicator",
    'sap/ui/model/odata/v2/ODataModel',
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "taqasummaryreporttimesheet/util/xlsx",
    "sap/m/MessageBox"
],
function (Controller, exportLibrary, Spreadsheet, BusyIndicator, ODataModel, JSONModel, Export, ExportTypeCSV, xlsx, MessageBox) {
    "use strict";
    var aAllowances = [
        {
            "Value": "Job Bonus",
            "Key": ""
        },
        {
            "Value": "Overtime",
            "Key": ""
        },
        {
            "Value": "Critical Bonus",
            "Key": ""
        },
        {
            "Value": "Job Bonus %",
            "Key": ""
        },
        {
            "Value": "Meal Allowance",
            "Key": ""
        },
        {
            "Value": "Travel Bonus",
            "Key": ""
        },
        {
            "Value": "Trip Bonus",
            "Key": ""
        },
        {
            "Value": "Tier1",
            "Key": ""
        },
        {
            "Value": "Tier2",
            "Key": ""
        },
        {
            "Value": "Tier3",
            "Key": ""
        },
        {
            "Value": "ZERO NPT Bonus",
            "Key": ""
        },
        {
            "Value": "FTA Bonus",
            "Key": ""
        }
    ];

    return Controller.extend("taqasummaryreporttimesheet.controller.View1", {
        onInit: function () {

        },
        handleSelectionChange: function (oEvent) {
            //var selectedItems = oEvent.getSource().getSelectedKeys()
            var Filters = oEvent.getSource().getSelectedKeys();
            var oFilterdata = this.getView().getModel("oFilterModel").getData().rows;
            var oFiltered = [];
            //var oFilter= [];
            var tab = this.getView().byId("SummaryTable");
            if (Filters.length == 0) {
                tab.getModel().getData().rows = oFilterdata;
            } else {
                oFilterdata.map(function (items, index) {
                    var oValues = Object.values(items);
                    const intersection = oValues.filter(element => Filters.includes(element));
                    if (intersection.length == 1) {
                        oFiltered.push(items);
                    }
                });
                tab.getModel().getData().rows = oFiltered;
            }
            tab.getModel().refresh(true);
        },
        _convert_Date:function(value){
            var date = new Date(value);

            // Get the year, month, and day
            var year = date.getFullYear();
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);
            
            // Form the ISO date format string
            var isoDateString = year + "-" + month + "-" + day;
            return isoDateString;
        },

        _onSummaryPress: function () {

            BusyIndicator.show();
            var oHeaderModel = new JSONModel();
            var oAllowancesModel = new JSONModel();
            oAllowancesModel.setData(aAllowances);
            this.getView().setModel(oAllowancesModel, "oAllowancesModel");
            var oSummaryModel = new JSONModel();

            var StartDate_time = this.getView().byId("StartDate").getProperty("value");
            var EndDate_time = this.getView().byId("EndDate").getProperty("value");
            // var StartDate_time = this.getView().byId("StartDate").getValue();
            // var EndDate_time = this.getView().byId("EndDate").getValue();
            var StartDateObject = new Date(StartDate_time);
            var EndDateObject = new Date(EndDate_time);
           
            // var oStart = StartDateObject.toLocaleDateString().split("/").reverse().join("-");
            // var oEnd = EndDateObject.toLocaleDateString().split("/").reverse().join("-");

            var oStart = this._convert_Date(StartDateObject);
            var oEnd = this._convert_Date(EndDateObject);

            //Load JSON Data
            // oSummaryModel.setData(dataModel.getData().d);
            // this.getView().setModel(oSummaryModel, "oHeaderModel");
            // this._onSummaryPress();
            // this._onSortData(dataModel.getData().d, oHeaderModel);

            var that = this;
            var oFilters = [];
            var oModelDetail = this.getOwnerComponent().getModel();
            // oFilters.push(new sap.ui.model.Filter(
            //     {
            //         filters:
            //             [
            //                 new sap.ui.model.Filter("Date", sap.ui.model.FilterOperator.BT, oStart, oEnd)
            //             ],
            //         and: true
            //     }
            // ));
            oFilters.push(new sap.ui.model.Filter("Date", sap.ui.model.FilterOperator.BT,oStart,oEnd));
            oModelDetail.read("/TimeSheetDetails", {
                filters: [oFilters],
                urlParameters: {
                    "$expand": "ItsAllowances"
                },
                success: function (oData, oResponse) {
                    BusyIndicator.hide();
                    if(oData.results.length == 0){
                        MessageBox.information("We couldn't find data for the given dates");
                    }else{
                        oSummaryModel.setData(oData);
                        that.getView().setModel(oSummaryModel,"oHeaderModel");
                        that._onSummaryReport();
                        that._onDetailedReport(oData, oHeaderModel);
                    }
                    
                },
                error: function (oError) {

                },
                async: false
            });
        },

        _onSummaryReport: function () {
            var that = this;
            var AdminStatusList = this.getView().getModel("oHeaderModel").getData();
            var rowData = [];
            
            AdminStatusList.results.map(function (oColumns, index) {
                var StartDate_time = that.getView().byId("StartDate").getProperty("value");
                var EndDate_time = that.getView().byId("EndDate").getProperty("value");
                var StartDateObject = new Date(StartDate_time);
                var EndDateObject = new Date(EndDate_time).getTime();
                if (oColumns.Date != "") {
                    const foundEmpId = rowData.some(e1 => (e1.EmployeeID == oColumns.EmployeeID));
                    //if(!foundEmpId) rowData.push(objj);
                    var oInnerAllowances = oColumns.ItsAllowances.results;
                    if (oInnerAllowances != "") {
                        oInnerAllowances.map(function (itAllowances, index1) {
                            var objj = {
                                // "Index": index,
                                "EmployeeID": oColumns.EmployeeID,
                                "EmployeeName": oColumns.EmployeeName,
                                "Department": oColumns.Department,
                                "Division": oColumns.Division,
                                "Location": oColumns.Location,
                                "WbsCode": oColumns.WbsCode,
                                "JobTitle":oColumns.JobTitle
                            };
                            
                            for (var d = StartDateObject; d <= EndDateObject; d.setDate(d.getDate() + 1)) {
                                // var oDatee = d.toLocaleDateString().split("/").reverse().join("-");
                                var oDatee =  that._convert_Date(d);
                                objj[oDatee] = "";
                            }
                            if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc == "Overtime") {
                                var odate = itAllowances.Date;
                                objj[odate] = itAllowances.AllowanceDesc
                            }
                            if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc == "Job Bonus") {
                                var odate = itAllowances.Date;
                                objj[odate] = itAllowances.AllowanceDesc
                            }
                            if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc == "Trip Bonus") {
                                var odate = itAllowances.Date;
                                objj[odate] = itAllowances.AllowanceDesc
                            }
                            if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc == "ZERO NPT Bonus") {
                                var odate = itAllowances.Date;
                                objj[odate] = itAllowances.AllowanceDesc
                            }
                            if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc == "Critical Bonus") {
                                var odate = itAllowances.Date;
                                objj[odate] = itAllowances.AllowanceDesc
                            }
                            if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc == "Job Bonus %") {
                                var odate = itAllowances.Date;
                                objj[odate] = itAllowances.AllowanceDesc
                            }
                            if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc == "Meal Allowance") {
                                var odate = itAllowances.Date;
                                objj[odate] = itAllowances.AllowanceDesc
                            }
                            rowData.push(objj);
                        });
                    }
                }
            });
            rowData.sort(function (a, b) {
                return parseFloat(a.EmployeeID) - parseFloat(b.EmployeeID);
            });
            var columnData = [
                {
                    columnName: "EmployeeID"
                },
                {
                    columnName: "EmployeeName"
                },
                {
                    columnName: "JobTitle"
                },
                {
                    columnName: "Department"
                },
                {
                    columnName: "Division"
                },
                {
                    columnName: "Location"
                },
                {
                    columnName: "WbsCode"
                }
            ];
            var StartDate_time = this.getView().byId("StartDate").getProperty("value");
            var EndDate_time = this.getView().byId("EndDate").getProperty("value");
            var StartDateObject = new Date(StartDate_time);
            var EndDateObject = new Date(EndDate_time).getTime();
            // var StartDate = this.getView().byId("StartDate").getProperty("dateValue");
            // var EndDate = this.getView().byId("EndDate").getProperty("dateValue");
            // var start = StartDateObject;
            // var endTime = EndDateObject.toString();
            // endTime = endTime.getTime();
            for (var start_Date = StartDateObject; start_Date <= EndDateObject; start_Date.setDate(start_Date.getDate() + 1)) {
                //columnData.columnName = omonthStart;
                var oMonth = {
                    // "columnName": start_Date.toISOString().substring(0, 10)
                    // "columnName": start_Date.toLocaleDateString().split("/").reverse().join("-")
                    "columnName":  that._convert_Date(start_Date)
                }
                columnData.push(oMonth);
            }
            var oModelTable = new sap.ui.model.json.JSONModel();
            oModelTable.setData({
                columns: columnData,
                rows: rowData,
            });
            var oFilterModel = new JSONModel();
            oFilterModel.setData({
                columns: columnData,
                rows: rowData,
            });
            this.getView().setModel(oFilterModel, "oFilterModel");
            var oTable = this.getView().byId("SummaryTable");
            oTable.setModel(oModelTable);
            this.getView().setModel(oModelTable, "oSummaryModel");
            oTable.bindColumns("/columns", function (sId, oContext) {
                //var sColumnId = oContext.getObject().columnName;
                var columnName = oContext.getObject().columnName;
                return new sap.ui.table.Column({
                    label: columnName,
                    width: "7em",
                    template: columnName,
                });
            });
            oTable.bindRows("/rows");
            // oTable.bindItems("/rows", function(index, context) {
            //     var obj = context.getObject();
            //     var row = new sap.m.ColumnListItem();
            //     for(var k in obj) {
            //         row.addCell(new sap.m.Text({text : obj[k]}));
            //     }
            //     return row;
            // });
        },
        _onDetailedReport: function (oData, oHeaderModel) {
            var oResults = oData.results;
            var OHeaderResults = [];
            oResults.map(function (item, index, array) {
                var oHeader = {
                    "EmployeeID": "",
                    "EmployeeName": "",
                    "Date": "",
                    "WbsCode": "",
                    "WorkType": "",
                    "TotalHours": "",
                    "OvertimeHours": "",
                    "JobBonus": "",
                    "CriticalBonus": "",
                    "JobBonusPer": "",
                    "MealAllowance": "",
                    "TravelBonus": "",
                    "TripBonus": "",
                    "Tier1Bonus": "",
                    "Tier2Bonus": "",
                    "Tier3Bonus": "",
                    "ZERONPTBonus": "",
                    "FTABonus": ""
                };
                oHeader.EmployeeID = item.EmployeeID;
                oHeader.EmployeeName = item.EmployeeName;
                oHeader.Date = item.Date;
                oHeader.WbsCode = item.WbsCode;
                oHeader.WorkType = item.WorkType;
                oHeader.TotalHours = item.TotalHours;
                oHeader.OvertimeHours = item.OvertimeHours;
                var oInnerAllowances = item.ItsAllowances.results;
                oInnerAllowances.map(function (itAllowances, index1) {
                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc == "Job Bonus") {
                        oHeader['JobBonus'] = itAllowances.Amount
                    }
                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc == "Trip Bonus") {
                        oHeader['TripBonus'] = itAllowances.Amount
                    }
                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc == "ZERO NPT Bonus") {
                        oHeader['ZERONPTBonus'] = itAllowances.Amount
                    }
                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc == "Critical Bonus") {
                        oHeader['CriticalBonus'] = itAllowances.Amount
                    }
                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc == "Meal Allowance") {
                        oHeader['MealAllowance'] = itAllowances.Amount
                    }
                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc == "Job Bonus %") {
                        oHeader['JobBonusPer'] = itAllowances.Amount
                    }
                });
                OHeaderResults.push(oHeader);
            });
            OHeaderResults.sort(function (a, b) {
                return parseFloat(a.EmployeeID) - parseFloat(b.EmployeeID);
            });
            oHeaderModel.setData(OHeaderResults);
            this.getView().setModel(oHeaderModel, "AdminStatusList");
        },
        onGetData: function(){
            var StartDate = this.getView().byId("StartDate").getProperty("dateValue");
            var EndDate = this.getView().byId("EndDate").getProperty("dateValue");
            
            
            const obj = StartDate;
            // const month   = dateObj.getUTCMonth(); // months from 1-12
            // const day     = dateObj.getUTCDate();
            // const year    = dateObj.getUTCFullYear();

            

            //let obj = new Date(); 
            let day = obj.getDate(); 
            let month = obj.getMonth() + 1;  
            let year = obj.getFullYear(); 
            console.log(`Day: ${day}, Month: ${month}, Year: ${year}`);

            const newDate = year + "/" + month + "/" + day;
            alert(newDate);
        },
        onExportPress: function () {

            const binding = this.byId("table").getBinding("rows");
            var MyDataModel = this.getView().getModel("oSummaryModel");
            //var myResultArray = MyDataModel.getProperty("/results");
            var oColumns = MyDataModel.getData().rows;
            var oSummaryResults = [];
            for (var iSummary = 0; iSummary <= oColumns.length - 1; iSummary++) {
                var oColumname = oColumns[iSummary].columnName;
                var oSummaryColumn = {};
                oSummaryColumn[oColumname] = "";
                //oSummaryColumn[iSummary].columnName = ""
                oSummaryResults.push(oSummaryColumn);
            }
            var worksheet = XLSX.utils.json_to_sheet(oColumns);

            var oResults = [];
            var MyDataModel1 = this.getView().byId("table").getBinding("rows").getModel("AdminStatusList").getProperty(binding.getPath());
            for (var i = 0; i <= MyDataModel1.length - 1; i++) {
                var object1 = {
                    "Employee ID": MyDataModel1[i].EmployeeID,
                    "Employee Name": MyDataModel1[i].EmployeeName,
                    "Date": MyDataModel1[i].Date,
                    "WBS/CC": MyDataModel1[i].WbsCode,
                    "Working Type": MyDataModel1[i].WorkType,
                    "Total Hours": MyDataModel1[i].TotalHours,
                    "Overtime": MyDataModel1[i].OvertimeHours,
                    "Job Bonus": MyDataModel1[i].JobBonus,
                    "Critical Bonus": MyDataModel1[i].CriticalBonus,
                    "Job Bonus %": MyDataModel1[i].JobBonusPer,
                    "Meal Allowance": MyDataModel1[i].MealAllowance,
                    "Travel Bonus": MyDataModel1[i].TravelBonus,
                    "Trip Bonus": MyDataModel1[i].TripBonus,
                    "Tier1": MyDataModel1[i].Tier1Bonus,
                    "Tier2": MyDataModel1[i].Tier2Bonus,
                    "Tier3": MyDataModel1[i].Tier3Bonus,
                    "ZERO NPT Bonus": MyDataModel1[i].ZERONPTBonus,
                    "FTA Bonus": MyDataModel1[i].FTABonus,
                    "Leave Accrual": ""
                };
                oResults.push(object1);
            }
            // oResults.sort((a, b) => {
            //     // Only sort on age if not identical
            //     if (a["Employee ID"] < b["Employee ID"]) return -1;
            //     if (a["Employee ID"] < b["Employee ID"]) return 1;

            //     // Both idential, return 0
            //     return 0;
            //   });
            //var myResultArray1 = MyDataModel1.getProperty("/results");
            var worksheet1 = XLSX.utils.json_to_sheet(oResults);

            var workBook = XLSX.utils.book_new();
            // var workBook1 = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workBook, worksheet, "Summary Report");
            XLSX.utils.book_append_sheet(workBook, worksheet1, "Detailed Report");
            var sFilename = "MyData.xlsx";
            XLSX.writeFile(workBook, sFilename);
        }
    });
});
