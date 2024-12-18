sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/json/JSONModel",
    "taqasummaryreporttimesheet/util/xlsx",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
    "sap/m/IllustratedMessage"
],
    function (Controller,
        BusyIndicator,
        JSONModel,
        xlsx,
        MessageBox,
        Filter,
        FilterOperator,
        Token,
        IllustratedMessage) {
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
                "Value": "Tier 1",
                "Key": ""
            },
            {
                "Value": "Tier 2",
                "Key": ""
            },
            {
                "Value": "Tier 3",
                "Key": ""
            },
            {
                "Value": "Zero NPT bonus",
                "Key": ""
            },
            {
                "Value": "Special FTA Bonus",
                "Key": ""
            },
            {
                "Value": "Standby Bonus",
                "Key": ""
            }
        ];
        let AMPSDatanew = [
            { "Value": "Unpaid Days", "Key": "" },
            { "Value": "Unauthorized Absence", "Key": "" },
            { "Value": "Annual Leave", "Key": "" },
            { "Value": "Accrued day Off Leave", "Key": "" },
            { "Value": "Sick Leave", "Key": "" },
            { "Value": "Other Leaves", "Key": "" },
            { "Value": "Location Bonus", "Key": "" },
            { "Value": "Field Bonus", "Key": "" },
            { "Value": "Marine Bonus", "Key": "" },
            { "Value": "DP Bonus Rate", "Key": "" },
            { "Value": "Rig Bonus", "Key": "" },
            { "Value": "Stand by Bonus", "Key": "" },
            { "Value": "Transportation", "Key": "" },
            { "Value": "Workshop Allowance Daily", "Key": "" },
            { "Value": "Risk Allowance Daily", "Key": "" },
            { "Value": "Field Allowance Rate", "Key": "" },
            { "Value": "Field Bonus IN Rate", "Key": "" },
            { "Value": "Field Bonus OUT Rate", "Key": "" },
            { "Value": "Location Bonus IN Rate", "Key": "" },
            { "Value": "Location Bonus OUT Rate", "Key": "" },
            { "Value": "Internallowance Bonus", "Key": "" },
            { "Value": "Desert Allowance Per Day", "Key": "" },
            { "Value": "Marine Overstay Bonus Rate", "Key": "" },
            { "Value": "Location Overstay Bonus Rate", "Key": "" },
            { "Value": "Risk Allowance (IQ) Rate", "Key": "" },
            { "Value": "Risk Allowance (SA) Rate", "Key": "" },
            { "Value": "Field Bonus + Coefficient Rate", "Key": "" },
            { "Value": "Food Allowance", "Key": "" },
            { "Value": "Half Rig Bonus", "Key": "" },
            { "Value": "EID Bonus /Public Holiday", "Key": "" },
            { "Value": "Rest Day Pay", "Key": "" },
            { "Value": "3 Hours Overtime", "Key": "" },
            { "Value": "Rest Day Pay (130%)", "Key": "" },
            { "Value": "Rest Day Pay (170%)", "Key": "" },
            { "Value": "Trip Allowance", "Key": "" },
            { "Value": "Geographical Allow Operation", "Key": "" },
            { "Value": "Geographical Allow WorkShop", "Key": "" },
            { "Value": "Geographical Allow StandB", "Key": "" },
            { "Value": "Geographical Allowance", "Key": "" },
            { "Value": "Other Variable 1", "Key": "" },
            { "Value": "Other Variable 2", "Key": "" },
            { "Value": "Other Variable 3", "Key": "" },
            { "Value": "Qarun Bonus", "Key": "" },
            { "Value": "Food Allowance(Qatar)2", "Key": "" },
            { "Value": "Per Diem", "Key": "" },
            { "Value": "Field Allowance(D-Onshore)", "Key": "" },
            { "Value": "Field Allowance(D-Offshore)", "Key": "" },
            { "Value": "Hardship Allowance", "Key": "" },
          
            { "Value": "MRP", "Key": "" },
            { "Value": "MPLT / MIT / Memory Camera", "Key": "" },
            {"Value":"Bottom Hole Sampling SPS / PDS"},
            {"Value":"Memory Gauge/Echometer/Shut"},
            {"Value":"Rig + Coefficient"},
            {"Value":"Supervising Bonus Rate"}
          
        ];

        let AMPSData = [];

        return Controller.extend("taqasummaryreporttimesheet.controller.View1", {
            onInit: async function () {

                if (sap.ushell.Container) {
                    let user = sap.ushell.Container.getService("UserInfo").getUser();
                    // console.log(user)
                    let userEmail = user.getEmail();
                    // userEmail = 'pantothomasraja@kaartech.com';
                //    let userEmail = 'vsreenivasulu@kaartech.com';
                    console.log(userEmail);
                    if (userEmail !== undefined) {
                        let oBusydailog = new sap.m.BusyDialog();
                        oBusydailog.open();
                        //Load AMPS Data
                        await this.AMPSDataLoad(); // parallel call
                       

                        let userD = await this.getEmpDetailsEmail(userEmail, true);
                        oBusydailog.close();
                        if (userD.admin === "yes") {
                            let fnValidator = function (args) {
                                let text = args.text;
                                return new Token({ key: text, text: text });
                            };
                            let oMultiInput1 = this.getView().byId("idInput");
                            oMultiInput1.addValidator(fnValidator);

                            let oModel = this.getOwnerComponent().getModel(),
                                sPath = "/RowInfo",
                                filters = new Array(),
                                filterByName,
                                filterByStartDate,
                                filterByEndDate,
                                that = this;
                            filterByName = new Filter("TableName", FilterOperator.EQ, "CutOffCycles");
                            filterByStartDate = new Filter("Column1", FilterOperator.LE, this._convert_Date2(new Date()));
                            filterByEndDate = new Filter("Column2", FilterOperator.GE, this._convert_Date2(new Date()));

                            filters.push(filterByName);
                            filters.push(filterByStartDate);
                            filters.push(filterByEndDate);
                            // that.getView().byId("idDatePicker").setDateValue(new Date(odata.results[0].Column1));
                            // that.getView().byId("idDatePicker").setSecondDateValue(new Date(odata.results[0].Column2));

                            await oModel.read(sPath, {
                                filters: filters,
                                success: async function (odata) {
                                    // that.getView().byId("StartDate").setValue(odata.results[0].Column1);
                                    // that.getView().byId("EndDate").setValue(odata.results[0].Column2);
                                    that.getView().byId("idDatePicker").setDateValue(new Date(odata.results[0].Column1));
                                    that.getView().byId("idDatePicker").setSecondDateValue(new Date(odata.results[0].Column2));
                                    // var oFilters = [];
                                    // oFilters.push(new sap.ui.model.Filter("Date", sap.ui.model.FilterOperator.BT, odata.results[0].Column1, odata.results[0].Column2));
                                    that.onSearch();
                                    // that._onSummaryPress(oFilters);
                                    // BusyIndicator.hide()

                                },
                                error: function (error) {
                                    MessageBox.error(error);
                                }
                            });

                        } else {
                            let oPage = this.getView().byId("page");
                            oPage.removeAllContent();
                            let oIllustratedMessage = new IllustratedMessage({
                                illustrationType: "sapIllus-ErrorScreen",
                                title: "Access Denied",
                                description: "You need permission to access this page. Request access from your administrator."
                            });

                            oPage.addContent(oIllustratedMessage);
                        }
                    }
                    else {
                        let oPage = this.getView().byId("page");
                        oPage.removeAllContent();
                        let oIllustratedMessage = new IllustratedMessage({
                            illustrationType: "sapIllus-ErrorScreen",
                            title: "Undefined"
                        });

                        oPage.addContent(oIllustratedMessage);
                    }
            }

            },
            allowanceTable: function (dataRecieved) {
                return new Promise(async (resolve, reject) => {
                  let oDataModel = this.getOwnerComponent().getModel();
                  let gFilter = [];
                  let oFilter1 = new sap.ui.model.Filter("TableName", sap.ui.model.FilterOperator.EQ, "Approver Allowance");
                  gFilter.push(oFilter1);
                  let oFilter2;
                  await dataRecieved;
                  let oTableModelDepartment = this.getView().getModel("tableModel").getData().emp;

                  let oTableModelCompany = this.getView().getModel("tableModel").getData().company;

                  if (this.isAMPSAdmin) {
                    
                    oTableModelCompany.forEach(oItem => {
                    if(oItem.company !== null || oItem.company !== ""){
                      oFilter2 = new sap.ui.model.Filter("Column6", sap.ui.model.FilterOperator.EQ, oItem.company);
                      gFilter.push(oFilter2);
                    }
                    });
                    // oFilter2 = new sap.ui.model.Filter("Column11", sap.ui.model.FilterOperator.EQ, "X");
                  } else {

                    oTableModelDepartment.forEach(oItem => {
                    if(oItem.department !== "" || oItem.department !== null){
                      oFilter2 = new sap.ui.model.Filter("Column2", sap.ui.model.FilterOperator.EQ, oItem.department);
                      gFilter.push(oFilter2);
                    }
                    });
                    // oFilter2 = new sap.ui.model.Filter("Column11", sap.ui.model.FilterOperator.NE, "X");
                  }
                  let oFilter3 = new sap.ui.model.Filter("Column3", sap.ui.model.FilterOperator.NE, "");
                  gFilter.push(oFilter3);
                  oDataModel.read("/RowInfo", {
                    filters: gFilter,
                    urlParameters: {
                      "$select": "Column3,Column4"
                    },
                    success: (response) => {
                      var uniqueResults = response.results.reduce((acc, item) => {
                        if (!acc.map[item.Column3]) {
                          acc.map[item.Column3] = true;
                          acc.results.push(item);
                        }
                        return acc;
                      }, { map: {}, results: [] }).results;
         
                      uniqueResults = uniqueResults.map(item => ({
                        Column2: item.Column4,
                        Column9: item.Column3
                    }));
                    uniqueResults.push({Column2:"Overtime",Column9:"Overtime"})
                    let model = new sap.ui.model.json.JSONModel();
                    model.setData(uniqueResults)
                  
                    this.getView().setModel(model,"allowanceTableModel")
         
                      resolve(uniqueResults); // Resolve with allowance data
                    },
                    error: function (oError) {
                      console.log("Error loading data:", oError);
                    //   reject(oError);
                    }
                  });
                });
              },
            // allowanceTable:function(){
            //     // return new Promise((resolve, reject) => {
            //         let oDataModel = this.getOwnerComponent().getModel();
            //         let oFilter1 = new sap.ui.model.Filter("TableName", sap.ui.model.FilterOperator.EQ, "Allowances");
            //       let oFilter2;
            //         if(this.isAMPSAdmin){
            //         oFilter2 = new sap.ui.model.Filter("Column11", sap.ui.model.FilterOperator.EQ, "X");
            //         }
            //         else{
            //             oFilter2 = new sap.ui.model.Filter("Column11", sap.ui.model.FilterOperator.NE, "X");
            //         }
            //         oDataModel.read("/RowInfo", {
            //             filters: [oFilter1,oFilter2],
            //             urlParameters: {
            //                 "$select": "Column2,Column9" // Replace with the actual field names you want to select
            //             },

            //             success: (response) => {
            //                 var model = new sap.ui.model.json.JSONModel();
            //                 var uniqueResults = response.results.reduce((acc, item) => {
            //                     if (!acc.map[item.Column2]) {  // Replace Description with the correct property name
            //                         acc.map[item.Column2] = true;
            //                         acc.results.push(item);
            //                     }
            //                     return acc;
            //                 }, { map: {}, results: [] }).results;
            //                 // uniqueResults.push({})
            //                 model.setData(uniqueResults)
            //                 this.allowanceModelData = uniqueResults;
            //                 this.getView().setModel(model,"allowanceTableModel")
                           
                            
            //             },
            //             error: function (oError) {
            //                 // MessageToast.show("Error loading data: ", oError);
            //                 console.log("Error loading data:", oError);
            //                 // reject(false);
            //             }
            //         });

            //     // });
            // },

            getEmailVariations: function (email) {
                // Split the email into two parts: the part before and after the '@'
                var emailParts = email.split("@");
                var localPart = emailParts[0]; // Part before '@'
                var domainPart = emailParts[1]; // Part after '@'

                // Create two variations for the domain part
                var domainUpperCase = domainPart.toUpperCase(); // All caps
                var domainLowerCase = domainPart.toLowerCase(); // All lowercase

                // Build the two email variations
                var emailUpperCase = localPart + "@" + domainUpperCase;
                var emailLowerCase = localPart + "@" + domainLowerCase;

                // Return the two variations as an array
                return [emailUpperCase, emailLowerCase];
            },

            AMPSDataLoad: function () {
                return new Promise((resolve, reject) => {
                    let oDataModel = this.getOwnerComponent().getModel();
                    let oFilter1 = new sap.ui.model.Filter("TableName", sap.ui.model.FilterOperator.EQ, "AMPS");

                    oDataModel.read("/RowInfo", {
                        filters: [oFilter1],
                        success: (response) => {
                            response.results.forEach(oItem => {
                                AMPSData.push(oItem.Column1);
                            });
                            resolve(true);
                        },
                        error: function (oError) {
                            // MessageToast.show("Error loading data: ", oError);
                            console.log("Error loading data:", oError);
                            reject(false);
                        }
                    });

                });
            },
            handleSelectionChange: function (oEvent) {
                //var selectedItems = oEvent.getSource().getSelectedKeys()

            },
            handleSelectionFinish: function (oEvent) {
                var oSelectedkeys = this.getView().byId("idMultiComboBox").getSelectedKeys();
                console.log("Selected Keys:", oSelectedkeys);
                this._onSummaryReport();
            },
            _convert_Date2: function (value) {
                let date = new Date(value);

                // Get the year, month, and day
                let year = date.getFullYear();
                let month = ("0" + (date.getMonth() + 1)).slice(-2);
                let day = ("0" + date.getDate()).slice(-2);

                // Form the ISO date format string
                let isoDateString = year + "-" + month + "-" + day;
                // let isoDateString = day + "-" + month + "-" + year;
                return isoDateString;
            },
            _convert_Date: function (value) {
                let date = new Date(value);

                // Get the year, month, and day
                let year = date.getFullYear();
                let month = ("0" + (date.getMonth() + 1)).slice(-2);
                let day = ("0" + date.getDate()).slice(-2);

                // Form the ISO date format string
                // let isoDateString = year + "-" + month + "-" + day;
                let isoDateString = day + "-" + month + "-" + year;
                return isoDateString;
            },
            onDateObject: function (value) {

                return new Date(value);
            },
            onFormateDate: function (value) {

                var dateObject = new Date(value);

                // Extract the day, month, and year
                var day = String(dateObject.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
                var month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1) and pad with leading zero
                var year = dateObject.getFullYear(); // Get the full year

                // Format as DD-MM-YYYY
                return `${day}-${month}-${year}`;
            },

            _onSummaryPress: async function (oFilters) {
                await this.allowanceTable();
              
                BusyIndicator.show();
            
                let oHeaderModel = new JSONModel();
                let oAllowancesModel = new JSONModel();

                if (this.isAMPSAdmin) {
                    oAllowancesModel.setData(AMPSDatanew);
                    this.getView().setModel(oAllowancesModel, "oAllowancesModel");
                    // var oAllowancesModel = new sap.ui.model.json.JSONModel(AMPSDatanew);
                    // this.getView().setModel(oAllowancesModel, "oAllowancesModel");
                    console.log("AMPS Data:", AMPSDatanew);
                } else {
                    oAllowancesModel.setData(aAllowances);
                    this.getView().setModel(oAllowancesModel, "oAllowancesModel");
                    // var oAllowancesModel = new sap.ui.model.json.JSONModel(aAllowances);
                    // this.getView().setModel(oAllowancesModel, "oAllowancesModel");
                    console.log("TAQA DATA:", aAllowances)
                }


                // oAllowancesModel.setData(aAllowances);
                // this.getView().setModel(oAllowancesModel, "oAllowancesModel");
                let oSummaryModel = new JSONModel();

                // let StartDate_time = this.getView().byId("StartDate").getProperty("value");
                // let EndDate_time = this.getView().byId("EndDate").getProperty("value");

                // let StartDate_time = this.getView().byId("idDatePicker").getFrom();
                // let EndDate_time = this.getView().byId("idDatePicker").getTo();

                // debugger;
                // var StartDate_time = this.getView().byId("StartDate").getValue();
                // var EndDate_time = this.getView().byId("EndDate").getValue();
                // let StartDateObject = new Date(StartDate_time);
                // let EndDateObject = new Date(EndDate_time);



                // let oStart = this._convert_Date(StartDateObject);
                // let oEnd = this._convert_Date(EndDateObject);



                var that = this;
                // var oFilters = [];
                var oModelDetail = this.getOwnerComponent().getModel();

                oFilters.push(new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'Approved'));
                oModelDetail.read("/TimeSheetDetails", {
                    filters: [oFilters],
                    urlParameters: {
                        "$expand": "ItsAllowances"


                    },
                    success: function (oData, oResponse) {
                        BusyIndicator.hide();
                        if (oData.results.length === 0) {
                            MessageBox.information("We couldn't find data for the given dates");
                            that.getView().getModel("AdminStatusList").setData({});
                            that.getView().byId("SummaryTable").unbindRows()

                        } else {
                            oSummaryModel.setData(oData);
                            that.getView().setModel(oSummaryModel, "oHeaderModel");
                            that._onSummaryReport();
                            var allowanceModelData = [];

                            oData.results.forEach(function (item) {
                              
                                if (Array.isArray(item.ItsAllowances.results)) {
                                    item.ItsAllowances.results.forEach(function (allowance) {
                                        // if (allowance.AllowanceDesc === "Overtime") {
                                        //     return; // Skip this allowance
                                        // }
                                        // Check if the combination of AllowanceId and AllowanceDesc already exists
                                        var exists = allowanceModelData.some(function (existingAllowance) {
                                            return existingAllowance.AllowanceId === allowance.AllowanceID && 
                                                   existingAllowance.AllowanceDesc === allowance.AllowanceDesc;
                                        });
                            
                                        // If it doesn't exist, add it to the allowanceModelData
                                        if (!exists) {
                                            allowanceModelData.push({
                                                AllowanceId: allowance.AllowanceID,
                                                AllowanceDesc: allowance.AllowanceDesc
                                            });
                                        }
                                    });
                                } else {
                                    console.warn("ItsAllowances is not an array or is missing for item:", item);
                                }
                            });
                            var allowanceModel = new sap.ui.model.json.JSONModel(allowanceModelData);
                            that.getView().setModel(allowanceModel,"AllowanceModelData");
                            

                            if (that.isAMPSAdmin) {
                                var visibleModel = new sap.ui.model.json.JSONModel({amps:true,taqa:false});
                        

                                that.getView().setModel(visibleModel,"visible");
                               
                            
                                // that.getView().setModel(visibleModel,"visible");
                              
                                
                                that._onDetailedReportAMPS(oData, oHeaderModel);
                            }
                            else {
                                var visibleModel = new sap.ui.model.json.JSONModel({amps:false,taqa:true});
                        

                                that.getView().setModel(visibleModel,"visible");
                             
                                
                                that._onDetailedReport(oData, oHeaderModel);
                            };

                            that.getView().byId("idDownloadExcelButton").setEnabled(true);
                        }

                    },
                    error: function (oError) {
                        BusyIndicator.hide();
                        MessageBox.error(oError);

                    },
                    // async: false
                });
            },

            _onSummaryReport: function () {
                let that = this;
                let AdminStatusList = this.getView().getModel("oHeaderModel").getData();
                let dummyData = JSON.parse(JSON.stringify(AdminStatusList));
                let rowData = [];
                let AllowanceModel = this.getView().getModel("allowanceTableModel").getData()
                console.log(AllowanceModel);
                let oSelectedkeys = this.getView().byId("idMultiComboBox").getSelectedKeys();

                if (oSelectedkeys.length !== 0) {
                    dummyData.results = dummyData.results.map(function (item) {
                        if (Array.isArray(item.ItsAllowances.results)) {
                            item.ItsAllowances.results = item.ItsAllowances.results.filter(function (allowance) {
                            let normalizedAllowanceDesc;
                            if(allowance.AllowanceDesc !== "Overtime"){
                             normalizedAllowanceDesc = allowance.AllowanceID
                            }
                            else{
                                normalizedAllowanceDesc = allowance.AllowanceDesc.toLowerCase();
                            }
                                const normalizedSelectedKeys = oSelectedkeys.map(key => key.toLowerCase().replace(/\s+/g, "").trim());
                    
                                // Check if the normalized allowance description is included in the normalized selected keys
                                return normalizedSelectedKeys.includes(normalizedAllowanceDesc);
                            });
                        } else {
                            console.warn("ItsAllowances is not an array or is missing for item:", item);
                        }
                        return item;
                    });
                    debugger;
                }


                dummyData.results.map(function (oColumns) {
                    // let StartDate_time = that.getView().byId("StartDate").getProperty("value");
                    // let EndDate_time = that.getView().byId("EndDate").getProperty("value");
                    let StartDate_time = that.getView().byId("idDatePicker").getFrom();
                    let EndDate_time = that.getView().byId("idDatePicker").getTo();
                    let StartDateObject = new Date(StartDate_time);
                    let EndDateObject = new Date(EndDate_time).getTime();
                    if (oColumns.Date != "") {
                        // const foundEmpId = rowData.some(e1 => (e1.EmployeeID == oColumns.EmployeeID));
                        //if(!foundEmpId) rowData.push(objj);
                        let oInnerAllowances = oColumns.ItsAllowances.results;

                        if (oInnerAllowances != "") {
                            let existingEmployee = rowData.find(e => e["Employee ID"] === oColumns.EmployeeID);

                            let objj;
                            if (!existingEmployee) {
                                objj = {
                                    "Employee ID": oColumns.EmployeeID,
                                    "Employee Name": oColumns.EmployeeName,
                                    "Location": oColumns.LocationDesc,
                                    "Department": oColumns.DepartmentDesc,
                                    "Division": oColumns.DivisionDesc,
                                    "Project Code": `${oColumns.WbsCode} ${oColumns.CostCenter} ${oColumns.InternalOrder}`,
                                    "Job Title": oColumns.JobTitle,
                                    "Project Desc": oColumns.ProjectDesc,
                                    "Total Amount": 0
                                };

                                for (let d = StartDateObject; d <= EndDateObject; d.setDate(d.getDate() + 1)) {
                                    // var oDatee = d.toLocaleDateString().split("/").reverse().join("-");
                                    let oDatee = that._convert_Date(d);
                                    // objj[oDatee] = "";
                                    objj[oDatee] = "";
                                }
                                rowData.push(objj); // Add a new entry for this employee
                            } else {
                                objj = existingEmployee; // Use the existing employee data
                            }
                            let oAllAllowance = {};
                            oInnerAllowances.map(function (itAllowances) {
                                if (itAllowances.HistoryRecord === '') { // for active records

                                    // if (itAllowances.Amount !== undefined && itAllowances.AllowanceDesc !== "MRP" ) {
                                    if (itAllowances.Amount !== undefined && itAllowances.Amount !== "" && itAllowances.Amount !== null && itAllowances.Amount !== NaN) {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // if(itAllowances.AllowanceDesc !== "Overtime"){
                                        objj[odate] += itAllowances.AllowanceDesc + '\n';
                                        // }
                                        if(itAllowances.Amount !== "" && itAllowances.Amount !== null && itAllowances.Amount !== NaN){
                                            objj["Total Amount"] = (parseFloat(objj["Total Amount"]) + parseFloat(itAllowances.Amount)).toFixed(2);
                                        }
                                    }
                                }
                            });

                            // Merge the allowances into the employee object
                            // Object.assign(objj, oAllAllowance);
                            // rowData.push(objj);
                            //     let objj = {
                            //         // "Index": index,
                            //         "Employee ID": oColumns.EmployeeID,
                            //         "Employee Name": oColumns.EmployeeName,
                            //         // "Location": oColumns.Location,
                            //         "Location": oColumns.LocationDesc,
                            //         // "Department": oColumns.Department,
                            //         "Department": oColumns.DepartmentDesc,
                            //         // "Division": oColumns.Division,
                            //         "Division": oColumns.DivisionDesc,
                            //         "Project Code": `${oColumns.WbsCode} ${oColumns.CostCenter} ${oColumns.InternalOrder}`,
                            //         "Job Title": oColumns.JobTitle,
                            //         "Project Desc": oColumns.ProjectDesc,
                            //         "Total Amount": 0
                            //     };

                            //     let oAllAllowance = {};
                            //     oInnerAllowances.map(function (itAllowances) {
                            //         // let objj = {
                            //         //     // "Index": index,
                            //         //     "Employee ID": oColumns.EmployeeID,
                            //         //     "Employee Name": oColumns.EmployeeName,
                            //         //     // "Location": oColumns.Location,
                            //         //     "Location": oColumns.LocationDesc,
                            //         //     // "Department": oColumns.Department,
                            //         //     "Department": oColumns.DepartmentDesc,
                            //         //     // "Division": oColumns.Division,
                            //         //     "Division": oColumns.DivisionDesc,
                            //         //     "Project Code": `${oColumns.WbsCode} ${oColumns.CostCenter} ${oColumns.InternalOrder}`,
                            //         //     "Job Title": oColumns.JobTitle,
                            //         //     "Project Desc":oColumns.ProjectDesc
                            //         // };

                            //         if (itAllowances.HistoryRecord === '') {//for active records 


                            //             for (let d = StartDateObject; d <= EndDateObject; d.setDate(d.getDate() + 1)) {
                            //                 // var oDatee = d.toLocaleDateString().split("/").reverse().join("-");
                            //                 let oDatee = that._convert_Date(d);
                            //                 // objj[oDatee] = "";
                            //                 oAllAllowance[oDatee] = "";
                            //             }
                            //             if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Overtime") {
                            //                 let odate = that._convert_Date(itAllowances.Date);
                            //                 // objj[odate] += itAllowances.AllowanceDesc
                            //                 oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                            //                 objj["Total Amount"] +=  Number(itAllowances.Amount);

                            //             }
                            //             if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Job Bonus") {
                            //                 let odate = that._convert_Date(itAllowances.Date);
                            //                 // objj[odate] = itAllowances.AllowanceDesc
                            //                 oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                            //                 objj["Total Amount"] +=  Number(itAllowances.Amount);
                            //             }
                            //             if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Trip Bonus") {
                            //                 let odate = that._convert_Date(itAllowances.Date);
                            //                 // objj[odate] = itAllowances.AllowanceDesc
                            //                 oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                            //                 objj["Total Amount"] +=  Number(itAllowances.Amount);
                            //             }
                            //             if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Zero NPT bonus") {
                            //                 let odate = that._convert_Date(itAllowances.Date);
                            //                 // objj[odate] = itAllowances.AllowanceDesc
                            //                 oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                            //                 objj["Total Amount"] +=  Number(itAllowances.Amount);
                            //             }
                            //             if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Critical Bonus") {
                            //                 let odate = that._convert_Date(itAllowances.Date);
                            //                 // objj[odate] = itAllowances.AllowanceDesc
                            //                 oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                            //                 objj["Total Amount"] +=  Number(itAllowances.Amount);
                            //             }
                            //             if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Job Bonus %") {
                            //                 let odate = that._convert_Date(itAllowances.Date);
                            //                 // objj[odate] = itAllowances.AllowanceDesc
                            //                 oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                            //                 objj["Total Amount"] +=  Number(itAllowances.Amount);
                            //             }
                            //             if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Meal Allowance") {
                            //                 let odate = that._convert_Date(itAllowances.Date);
                            //                 // objj[odate] = itAllowances.AllowanceDesc
                            //                 oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                            //                 objj["Total Amount"] +=  Number(itAllowances.Amount);

                            //             }
                            //             if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Tier 2") {
                            //                 let odate = that._convert_Date(itAllowances.Date);
                            //                 // objj[odate] += itAllowances.AllowanceDesc
                            //                 oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                            //                 objj["Total Amount"] +=  Number(itAllowances.Amount);

                            //             }
                            //             if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Tier 1") {
                            //                 let odate = that._convert_Date(itAllowances.Date);
                            //                 // objj[odate] = itAllowances.AllowanceDesc
                            //                 oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                            //                 objj["Total Amount"] +=  Number(itAllowances.Amount);
                            //             }
                            //             if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Tier 3") {
                            //                 let odate = that._convert_Date(itAllowances.Date);
                            //                 // objj[odate] = itAllowances.AllowanceDesc
                            //                 oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                            //                 objj["Total Amount"] +=  Number(itAllowances.Amount);
                            //             }
                            //             if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Travel Bonus") {
                            //                 let odate = that._convert_Date(itAllowances.Date);
                            //                 // objj[odate] = itAllowances.AllowanceDesc
                            //                 oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                            //                 objj["Total Amount"] +=  Number(itAllowances.Amount);
                            //             }
                            //             if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "FTA Trial Bonus Rate") {
                            //                 let odate = that._convert_Date(itAllowances.Date);
                            //                 // objj[odate] = itAllowances.AllowanceDesc
                            //                 oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                            //                 objj["Total Amount"] +=  Number(itAllowances.Amount);
                            //             }
                            //             if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Standby Bonus") {
                            //                 let odate = that._convert_Date(itAllowances.Date);
                            //                 // objj[odate] = itAllowances.AllowanceDesc
                            //                 oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                            //                 objj["Total Amount"] +=  Number(itAllowances.Amount);
                            //             }
                            //             // rowData.push(objj);
                            //         }
                            //     });

                            //     Object.assign(objj, oAllAllowance);
                            //     rowData.push(objj);
                        }
                    }
                });
                rowData.sort(function (a, b) {
                    return parseFloat(a.EmployeeID) - parseFloat(b.EmployeeID);
                });
                let columnData = [
                    {
                        columnName: "Employee ID"
                    },
                    {
                        columnName: "Employee Name"
                    },
                    {
                        columnName: "Job Title"
                    },
                    {
                        columnName: "Location"
                    },
                    // {
                    //     columnName: "LocationDescription"
                    // },
                    {
                        columnName: "Department"
                    },
                    // {
                    //     columnName: "DepartmentDescription"
                    // },
                    {
                        columnName: "Division"
                    },
                    // {
                    //     columnName: "DivisionDescription"
                    // },
                    {
                        columnName: "Project Code"
                    },
                    {
                        columnName: "Project Desc"
                    },
                    {
                        columnName: "Total Amount"
                    }
                ];
                // let StartDate_time = this.getView().byId("StartDate").getProperty("value");
                // let EndDate_time = this.getView().byId("EndDate").getProperty("value");
                let StartDate_time = this.getView().byId("idDatePicker").getFrom();
                let EndDate_time = this.getView().byId("idDatePicker").getTo();

                let StartDateObject = new Date(StartDate_time);
                let EndDateObject = new Date(EndDate_time).getTime();
                // var StartDate = this.getView().byId("StartDate").getProperty("dateValue");
                // var EndDate = this.getView().byId("EndDate").getProperty("dateValue");
                // var start = StartDateObject;
                // var endTime = EndDateObject.toString();
                // endTime = endTime.getTime();
                for (let start_Date = StartDateObject; start_Date <= EndDateObject; start_Date.setDate(start_Date.getDate() + 1)) {
                    //columnData.columnName = omonthStart;
                    let oMonth = {
                        // "columnName": start_Date.toISOString().substring(0, 10)
                        // "columnName": start_Date.toLocaleDateString().split("/").reverse().join("-")
                        "columnName": that._convert_Date(start_Date)
                    }
                    columnData.push(oMonth);
                }
                let oModelTable = new sap.ui.model.json.JSONModel();

                oModelTable.setData({
                    columns: columnData,
                    rows: rowData,
                });
                let oFilterModel = new JSONModel();
                oFilterModel.setData({
                    columns: columnData,
                    rows: rowData,
                });

                this.getView().setModel(oFilterModel, "oFilterModel");
                let oTable = this.getView().byId("SummaryTable");
                oTable.setModel(oModelTable);
                this.getView().setModel(oModelTable, "oSummaryModel");
                
                oTable.bindColumns("/columns", function (sId, oContext) {
                    //var sColumnId = oContext.getObject().columnName;
                    let columnName = oContext.getObject().columnName;
                    console.log(columnName);
                    let oTemplate = new sap.m.Text({
                        text: `{${columnName}}`,
                        class: "multilines"
                    });
                    // oTemplate.addStyleClass("multilines");
                    return new sap.ui.table.Column({
                        label: columnName,
                        width: "8em",
                        template: oTemplate,
                        sortProperty: columnName,

                    });
                });
                oTable.bindRows("/rows");

            },
            _onDetailedReport: function (oData, oHeaderModel) {
                let oResults = oData.results;
                let OHeaderResults = [];
                let that = this;
                oResults.map(function (item) {
                    let oHeader = {
                        "EmployeeID": "",
                        "EmployeeName": "",
                        "Date": "",
                        "ProjectCode": "",
                        "WorkType": "",
                        "TotalHours": "",
                        "OvertimeHours": "",
                        "OvertimeType": "",
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
                        "FTABonus": "",
                        "LeaveAccrual": "",
                        "CostCenter": "",
                        "InternalOrder": "",
                        "StandbyBonus": "",
                        "ProjectDesc": "",
                        "WbsCode": ""
                    };
                    oHeader.EmployeeID = item.EmployeeID;
                    oHeader.EmployeeName = item.EmployeeName;
                    // oHeader.Date = that._convert_Date(item.Date);
                    oHeader.Date = that.onDateObject(item.Date);
                    oHeader.ProjectCode = item.WbsCode;
                    oHeader.WorkType = item.WorkType;
                    oHeader.TotalHours = item.TotalHours;
                    oHeader.OvertimeHours = item.OvertimeHours;
                    oHeader.InternalOrder = item.InternalOrder;
                    oHeader.CostCenter = item.CostCenter;
                    oHeader.WbsCode = item.WbsCode;
                    oHeader.ProjectDesc = item.ProjectDesc;
                    oHeader.OvertimeType = item.OvertimeType;
                    if (item.RotationalLeaveBalance !== 'NaN') {
                        oHeader.LeaveAccrual = item.RotationalLeaveBalance;
                    }
                    let oInnerAllowances = item.ItsAllowances.results;
                    oInnerAllowances.map(function (itAllowances) {
                        if (itAllowances.Amount != undefined  && itAllowances.AllowanceID === '9050') {//"Job Bonus"
                            oHeader['JobBonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined  && itAllowances.AllowanceID === "9080") { //Trip Bonus
                            oHeader['TripBonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined  && itAllowances.AllowanceID === "9265") { //ZERO NPT Bonus
                            oHeader['ZERONPTBonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined  && itAllowances.AllowanceID === "9070") { //Critical Bonus "9070"
                            oHeader['CriticalBonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined  && itAllowances.AllowanceID === "9100") { //Meal Allowance
                            oHeader['MealAllowance'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined  && itAllowances.AllowanceID === "9040") { //Job Bonus % "9040"1179
                            oHeader['JobBonusPer'] = itAllowances.Number
                        }
                        if (itAllowances.Amount != undefined  && itAllowances.AllowanceID === '9225') { //Tier1
                            oHeader['Tier1Bonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined  && itAllowances.AllowanceID === '9235') { //Tier2
                            oHeader['Tier2Bonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined  && itAllowances.AllowanceID === '9245') { //Tier3
                            oHeader['Tier3Bonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Travel Bonus") { //TravelBonus 9090   ititAllowances.Amount != undefined && itAllowances.AllowanceID === '1183'
                            oHeader['TravelBonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '9080') { //TripBonus 9080 1182
                            oHeader['TripBonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "FTA Trial Bonus Rate") { //FTABonus  ititAllowances.Amount != undefined && itAllowances.AllowanceID === '9246'
                            oHeader['FTABonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Standby Bonus") {
                            oHeader['StandbyBonus'] = itAllowances.Amount
                        }

                    });
                    OHeaderResults.push(oHeader);
                });
                OHeaderResults.sort(function (a, b) {
                    // return parseFloat(a.EmployeeID) - parseFloat(b.EmployeeID);

                    const employeeIdComparison = a.EmployeeID.localeCompare(b.EmployeeID);
                    if (employeeIdComparison !== 0) {
                        return employeeIdComparison;
                    }
                    // return a.Date.localeCompare(b.Date);
                    const dateA = new Date(a.Date).getTime();
                    const dateB = new Date(b.Date).getTime();
                    return dateA - dateB;

                });
                oHeaderModel.setData(OHeaderResults);
                this.getView().setModel(oHeaderModel, "AdminStatusList");
            },
            _onDetailedReportAMPS: function (oData, oHeaderModel) {
                let oResults = oData.results;
                let OHeaderResults = [];
                let that = this;
                
                oResults.map(function (item) {
                    let oHeader = {
                        "EmployeeID": "",
                        "EmployeeName": "",
                        "Date": "",
                        "ProjectCode": "",
                        "WorkType": "",
                        "TotalHours": "",
                        "OvertimeHours": "",
                        "OvertimeType": "",
                        "ProjectDesc": "",
                        "WbsCode": "",
                        "InternalOrder": "",
                        "CostCenter": "",

                        "LocationBonus": "",
                        "FieldBonus": "",
                        "MarineBonus": "",
                        "DPBonus": "",
                        "RigBonus": "",
                        "StandbyBonus": "",
                        "Transportation": "",
                        "WorkshopAllowanceDaily": "",
                        "RiskAllowanceDaily": "",
                        "FieldAllowanceRate": "",
                        "FieldBonusINRate": "",
                        "FieldBonusOUTRate": "",
                        "LocationBonusINRate": "",
                        "LocationBonusOUTRate": "",
                        "InternallowanceBonus": "",
                        "DesertAllowancePerDay": "",
                        "MarineOverstayBonusRate": "",
                        "LocationOverstayBonusrate": "",
                        "RiskAllowanceIQRate": "",
                        "RiskAllowanceSARate": "",
                        "FieldBonusCoefficientrate": "",
                        "FoodAllowance": "",

                        //new allowance for AMPS shared by Sudharshan 8-10-24
                        "HalfRigBonus": "",
                        "EIDBonusPublicHoliday": "",
                        "RestDayPay": "",
                        "3HrsOvertime": "",
                        "RestDayPay130": "",
                        "RestDayPay170": "",
                        "EidBonusPublicHolidayOMN": "",
                        "TripAllowance": "",
                        "GeographicalAllowOperat": "",
                        "GeographicalAllowWorkShop": "",
                        "GeographicalAllowStandBy": "",
                        "GeographicalAllowance": "",
                        "OtherVariable1": "",
                        "OtherVariable2": "",
                        "OtherVariable3": "",
                        "QarunBonus": "",
                        "FoodAllowanceQatar2": "",
                        "PerDiem": "",
                        "FieldAllowanceDOnshore": "",
                        "FieldAllowanceDOffshore": "",
                        "HardshipAllowance": "",
                        "MRP":"",
                        "MPLT":"",
                        "BottomHole":"",
                        "MemoryGauge/Echometer/Shut":"",
                        "SupervisingBonus":""

                    };
                    oHeader.EmployeeID = item.EmployeeID;
                    oHeader.EmployeeName = item.EmployeeName;
                    // oHeader.Date = that._convert_Date(item.Date);
                    oHeader.Date = that.onDateObject(item.Date);
                    oHeader.ProjectCode = item.WbsCode;
                    oHeader.WorkType = item.WorkType;
                    oHeader.TotalHours = item.TotalHours;
                    oHeader.OvertimeHours = item.OvertimeHours;
                    oHeader.InternalOrder = item.InternalOrder;
                    oHeader.CostCenter = item.CostCenter;
                    oHeader.WbsCode = item.WbsCode;
                    oHeader.ProjectDesc = item.ProjectDesc;
                    oHeader.OvertimeType = item.OvertimeType;
                    // if (item.RotationalLeaveBalance !== 'NaN') {
                    //     oHeader.LeaveAccrual = item.RotationalLeaveBalance;
                    // }
                    let oInnerAllowances = item.ItsAllowances.results;
                    oInnerAllowances.map(function (itAllowances) {
                        // if (itAllowances.Amount != undefined && itAllowances.Amount != undefined && itAllowances.AllowanceID === '9050') {//"Job Bonus"
                        //     oHeader['JobBonus'] = itAllowances.Amount
                        // }

                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4005') {
                            oHeader["LocationBonus"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4006') {
                            oHeader["FieldBonus"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4007') {
                            oHeader["MarineBonus"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4008') {
                            oHeader["DPBonus"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4009') {
                            oHeader["RigBonus"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4010') {
                            oHeader["StandbyBonus"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4077') {//4038
                            oHeader["Transportation"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4079') {
                            oHeader["WorkshopAllowanceDaily"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4081') {//4050
                            oHeader["RiskAllowanceDaily"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4078') { //4042
                            oHeader["FieldAllowanceRate"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4043') {
                            oHeader["FieldBonusINRate"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4049') {
                            oHeader["FieldBonusOUTRate"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4046') {
                            oHeader["LocationBonusINRate"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4047') {
                            oHeader["LocationBonusOUTRate"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4048') {
                            oHeader["InternallowanceBonus"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4059') {
                            oHeader["DesertAllowancePerDay"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4058') {
                            oHeader["MarineOverstayBonusRate"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4051') {
                            oHeader["LocationOverstayBonusrate"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4011') {
                            oHeader["RiskAllowanceIQRate"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4029') {
                            oHeader["RiskAllowanceSARate"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4036') {
                            oHeader["FieldBonusCoefficientrate"] = itAllowances.Amount
                        }
                        if ((itAllowances.Amount != undefined && itAllowances.AllowanceID === '4015') ||
                            (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4016') ||
                            (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4017') ||
                            (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4018') ||
                            (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4019') ||
                            (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4020') ||
                            (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4021') ||
                            (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4022') ||
                            (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4023') ||
                            (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4024') ||
                            (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4025') ||
                            (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4026') ||
                            (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4027') ||
                            (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4028')
                        ) {
                            oHeader["FoodAllowance"] = itAllowances.Amount
                        }

                        //new allowance for AMPS shared by Sudharshan 8-10-24
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4064') {
                            oHeader["HalfRigBonus"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4060') {
                            oHeader["EIDBonusPublicHoliday"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4061') {
                            oHeader["RestDayPay"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4069') {
                            oHeader["3HrsOvertime"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4071') {
                            oHeader["RestDayPay130"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4072') {
                            oHeader["RestDayPay170"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4073') {
                            oHeader["EidBonusPublicHolidayOMN"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4068') {
                            oHeader["TripAllowance"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4033') {
                            oHeader["GeographicalAllowOperat"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4044') {
                            oHeader["GeographicalAllowWorkShop"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4045') {
                            oHeader["GeographicalAllowStandBy"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4050') {
                            oHeader["GeographicalAllowance"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4053') {
                            oHeader["OtherVariable1"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4054') {
                            oHeader["OtherVariable2"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4055') {
                            oHeader["OtherVariable3"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4056') {
                            oHeader["QarunBonus"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4073') { //4037
                            oHeader["FoodAllowanceQatar2"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4080') {
                            oHeader["PerDiem"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4067') {
                            oHeader["FieldAllowanceDOnshore"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4063') {
                            oHeader["FieldAllowanceDOffshore"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4074') {
                            oHeader["HardshipAllowance"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4012') {
                            oHeader["MPLT"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '5002') {
                            oHeader["MRP"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4013') {
                            oHeader["BottomHole"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4014') {
                            oHeader["MemoryGauge/Echometer/Shut"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4066') {
                            oHeader["SupervisingBonus"] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '4070') {
                            oHeader["Rig+Coefficient"] = itAllowances.Amount
                        }
                    


                    });
                    OHeaderResults.push(oHeader);
                });
                OHeaderResults.sort(function (a, b) {
                    // return parseFloat(a.EmployeeID) - parseFloat(b.EmployeeID);

                    const employeeIdComparison = a.EmployeeID.localeCompare(b.EmployeeID);
                    if (employeeIdComparison !== 0) {
                        return employeeIdComparison;
                    }
                    // return a.Date.localeCompare(b.Date);
                    const dateA = new Date(a.Date).getTime();
                    const dateB = new Date(b.Date).getTime();
                    return dateA - dateB;

                });
                oHeaderModel.setData(OHeaderResults);
                console.log(oHeaderModel);
                this.getView().setModel(oHeaderModel, "AdminStatusList");

            },
            // onGetData: function () {
            //     var StartDate = this.getView().byId("StartDate").getProperty("dateValue");
            //     var EndDate = this.getView().byId("EndDate").getProperty("dateValue");


            //     const obj = StartDate;

            //     //let obj = new Date(); 
            //     let day = obj.getDate();
            //     let month = obj.getMonth() + 1;
            //     let year = obj.getFullYear();
            //     console.log(`Day: ${day}, Month: ${month}, Year: ${year}`);

            //     const newDate = year + "/" + month + "/" + day;
            //     alert(newDate);
            // },
            onExportPress: function () {
                let that = this;
                const binding = this.byId("table").getBinding("rows");
                let MyDataModel = this.getView().getModel("oSummaryModel");
                //var myResultArray = MyDataModel.getProperty("/results");
                let oColumns = MyDataModel.getData().rows;
                console.log(oColumns);
                let oSummaryResults = [];
                for (let iSummary = 0; iSummary <= oColumns.length - 1; iSummary++) {
                    let oColumname = oColumns[iSummary].columnName;
                    delete oColumns[iSummary]['Total Amount']; 

                    // if (oColumnameoColumns[iSummary] !== 'Total Amount') {
                        console.log(oColumname);
                    let oSummaryColumn = {};
                    oSummaryColumn[oColumname] = "";
                    //oSummaryColumn[iSummary].columnName = ""
                    oSummaryResults.push(oSummaryColumn);
                    // }

                }
                // console.log(oColumns);
                let worksheet = XLSX.utils.json_to_sheet(oColumns);
             

                let oResults = [];
                let MyDataModel1 = this.getView().byId("table").getBinding("rows").getModel("AdminStatusList").getProperty(binding.getPath());

                for (let i = 0; i <= MyDataModel1.length - 1; i++) {
                    let object1 = {
                        "Employee ID": MyDataModel1[i].EmployeeID,
                        "Employee Name": MyDataModel1[i].EmployeeName,
                        "Date": that._convert_Date(MyDataModel1[i].Date),
                        "Project Code": `${MyDataModel1[i].WbsCode} ${MyDataModel1[i].CostCenter} ${MyDataModel1[i].InternalOrder}`,
                        "Project Desc": MyDataModel1[i].ProjectDesc,
                        "Working Type": MyDataModel1[i].WorkType,
                        "Total Hours": MyDataModel1[i].TotalHours,
                        "Overtime Hours": MyDataModel1[i].OvertimeHours,
                        "Overtime Type": MyDataModel1[i].OvertimeType,
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
                        "Standby Bonus": MyDataModel1[i].StandbyBonus,
                        "Leave Accrual": MyDataModel1[i].LeaveAccrual


                    };
                    oResults.push(object1);
                }
                console.log(oResults);
                let worksheet1 = XLSX.utils.json_to_sheet(oResults);

                let workBook = XLSX.utils.book_new();
                // var workBook1 = XLSX.utils.book_new();

                XLSX.utils.book_append_sheet(workBook, worksheet, "Summary Report");
                XLSX.utils.book_append_sheet(workBook, worksheet1, "Detailed Report");
                let sFilename = "Timesheet Report.xlsx";
                XLSX.writeFile(workBook, sFilename);
            },
            onSearch: function () {
                let oDateRang = this.getView().byId("idDatePicker").getDateValue();
                if (oDateRang !== null) {
                    let oFilterBar = this.getView().byId("filterbar"),
                        that = this,
                        aFilters = [],
                        oModel = this.getOwnerComponent().getModel(),
                        oBusydailog = new sap.m.BusyDialog(),
                        aTableFilters = oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                            let oControl = oFilterGroupItem.getControl();
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
                            if (oControl instanceof sap.m.DateRangeSelection) {
                                let sInputValue = oControl.getValue();
                                let vS = that._convert_Date2(oControl.getFrom());
                                let vE = that._convert_Date2(oControl.getTo());
                                if (sInputValue) {
                                    aFilters.push(new Filter({
                                        path: oFilterGroupItem.getName(),
                                        operator: FilterOperator.BT,
                                        value1: vS,
                                        value2: vE
                                    }));
                                }
                            }
                            if (oControl instanceof sap.m.MultiInput) {
                                let aTokens = oControl.getTokens();
                                if (aTokens.length > 0) {
                                    aTokens.forEach(function (oToken) {
                                        let sTokenValue = oToken.getText();
                                        if (sTokenValue) {
                                            aFilters.push(new Filter({
                                                path: oFilterGroupItem.getName(),
                                                operator: FilterOperator.EQ,
                                                value1: sTokenValue,
                                                and: true
                                            }));
                                        }
                                    });
                                }
                            }
                            return aFilters;
                        }, []);
                    let oTokensDep = that.getView().byId("idInputDepartment").getTokens().length;
                    let oTableModel = this.getView().getModel("tableModel").getData().emp;
                    if (oTokensDep === 0) {
                        oTableModel.forEach(element => {
                            aTableFilters.push(new Filter({
                                path: "Department",
                                operator: FilterOperator.EQ,
                                value1: element.department,
                                caseSensitive: false
                            }));
                        });
                    }

                    // for company code

                    oTableModel = this.getView().getModel("tableModel").getData().company;
                    if (oTableModel) {
                        oTableModel.forEach(element => {
                            aTableFilters.push(new Filter({
                                path: "CompanyCode",
                                operator: FilterOperator.EQ,
                                value1: element.company,
                                caseSensitive: false
                            }));
                        });
                    }

                    if (this.isAMPSAdmin) {

                        // location
                        oTableModel = this.getView().getModel("tableModel").getData().location;
                        if (oTableModel) {
                            oTableModel.forEach(element => {
                                aTableFilters.push(new Filter({
                                    path: "Location",
                                    operator: FilterOperator.EQ,
                                    value1: element.location,
                                    caseSensitive: false
                                }));
                            });
                        }
                    } else {
                        //division
                        oTableModel = this.getView().getModel("tableModel").getData().division;
                        if (oTableModel) {
                            oTableModel.forEach(element => {
                                aTableFilters.push(new Filter({
                                    path: "Division",
                                    operator: FilterOperator.EQ,
                                    value1: element.division,
                                    caseSensitive: false
                                }));
                            });
                        }

                    }
                    aTableFilters = aTableFilters.filter(item => item.oValue1 !== null)
                    this._onSummaryPress(aTableFilters)
                } else {
                    MessageBox.error("Date is Mandatory")
                }

            },
            onFilterBarClear: function () {
                this.getView().byId("idInputDepartment").setValue("");
                // this.getView().byId("idInputDivision").setValue("");
                // this.getView().byId("idInputLocation").setValue("");
                // this.getView().byId("idInputLegal").setValue("");
                // this.getView().byId("idInputJob").setValue("");
                // this.getView().byId("idInputEmployeeName").setValue("");
                this.getView().byId("idInput").setTokens([]);
                this.getView().byId("idDatePicker").setValue("");
            },

            // ajay
            getEmpDetailsEmail: function (userEmail, dataRecieved) {
                return new Promise((resolve, reject) => {
                    let oDataModelSF = this.getOwnerComponent().getModel("v2");

                    let combiMail = this.getEmailVariations(userEmail);
                    console.log("Emails: ", combiMail);

                    let oFilter1 = new Filter("userNav/email", sap.ui.model.FilterOperator.EQ, combiMail[0]);  //"22647"  39321
                    let oFilter2 = new Filter("userNav/email", sap.ui.model.FilterOperator.EQ, combiMail[1]);  //"22647"  39321


                    oDataModelSF.read("/EmpJob", {
                        filters: [oFilter1, oFilter2],
                        urlParameters: {
                            $expand: "userNav,departmentNav,companyNav"
                        },
                        success: (response1) => {

                            if (response1.results.length === 0) {
                                console.log("Empty record from this Email");
                                sap.ui.core.BusyIndicator.hide();
                            } else {
                                // let tempID = Number(response1.results[0].userId);
                                let tempID = response1.results[0].userId;
                                let oFilter4 = new Filter("person", sap.ui.model.FilterOperator.EQ, tempID);
                                // let oFilter5 = new Filter("externalCode", sap.ui.model.FilterOperator.EQ, "Z001");
                                oDataModelSF.read("/FODynamicRole", {
                                    filters: [oFilter4],
                                    urlParameters: {
                                        // $select: "externalCode,department,departmentNav,location,locationNav",
                                        $expand: "departmentNav,locationNav,divisionNav,companyNav"
                                    },
                                    success: async (response2) => {
                                        let filterData = {
                                            "emp": [],
                                            "location": [],
                                            "company": [],
                                            "division": []
                                        }
                                        this.isAMPSAdmin = false;
                                        let ifCon = await dataRecieved;
                                        if (ifCon) {
                                            this.isAMPSAdmin = false;
                                            this.isAMPSAdmin = AMPSData.includes(response1.results[0].company);
                                            if (this.isAMPSAdmin) {  // for AMPS user AMPSData.includes(response1.results[0].company)
                                                let adminFilter = response2.results.filter(oItem => oItem.externalCode === "Z003");
                                                let adminDeptLoc = response2.results.filter(oItem => oItem.externalCode === "Z004");

                                                //for department
                                                const model = new sap.ui.model.json.JSONModel();
                                                let uniqueDepartment = this.removeDuplicates(adminDeptLoc, 'department');
                                                filterData.emp = uniqueDepartment;
                                                // for location
                                                uniqueDepartment = this.removeDuplicates(adminDeptLoc, 'location');
                                                filterData.location = uniqueDepartment;
                                                // company code
                                                uniqueDepartment = this.removeDuplicates(adminDeptLoc, 'company');
                                                filterData.company = uniqueDepartment;

                                                model.setData(filterData);
                                                this.getView().setModel(model, 'tableModel');

                                                if (adminFilter.length === 0) {
                                                    resolve({
                                                        "admin": "no",
                                                        "userId": response1.results[0].userId,
                                                        "empDetails": response1.results,
                                                        "department": []
                                                    });
                                                } else {
                                                    resolve({
                                                        "admin": "yes",
                                                        "userId": response1.results[0].userId,
                                                        "empDetails": response1.results,
                                                        "department": adminDeptLoc
                                                    });
                                                }
                                            } else {  /// for non AMPS user
                                                let adminFilter = response2.results.filter(oItem => oItem.externalCode === "Z001");
                                                let adminDeptLoc = response2.results.filter(oItem => oItem.externalCode === "Z002");


                                                //for department
                                                const model = new sap.ui.model.json.JSONModel();
                                                let uniqueDepartment = this.removeDuplicates(adminDeptLoc, 'department');
                                                filterData.emp = uniqueDepartment;
                                                // for division
                                                uniqueDepartment = this.removeDuplicates(adminDeptLoc, 'division');
                                                filterData.division = uniqueDepartment;
                                                // company code
                                                uniqueDepartment = this.removeDuplicates(adminDeptLoc, 'company');
                                                filterData.company = uniqueDepartment;

                                                model.setData(filterData);
                                                this.getView().setModel(model, 'tableModel');

                                                if (adminFilter.length === 0) {
                                                    resolve({
                                                        "admin": "no",
                                                        "userId": response1.results[0].userId,
                                                        "empDetails": response1.results,
                                                        "department": []
                                                    });
                                                } else {
                                                    resolve({
                                                        "admin": "yes",
                                                        "userId": response1.results[0].userId,
                                                        "empDetails": response1.results,
                                                        "department": adminDeptLoc
                                                    });
                                                }
                                            }
                                        }

                                        console.log("email Admin:", response2);

                                    },
                                    error: (eRR) => {
                                        reject(eRR);
                                        // console.log("Error  :", eRR);
                                        sap.ui.core.BusyIndicator.hide();
                                    }
                                });
                                console.log("email :", response1);
                            }


                        },
                        error: (eRR) => {
                            reject(eRR);
                            // console.log("Error  :", eRR);
                            sap.ui.core.BusyIndicator.hide();
                        }
                    });
                });
            },


            getEmpDetailsEmailOld: function (userEmail) {
                return new Promise((resolve, reject) => {
                    let oDataModelSF = this.getOwnerComponent().getModel("v2");
                    let that = this;
                    let oFilter1 = new Filter("userNav/email", sap.ui.model.FilterOperator.EQ, userEmail);  //"22647"  39321
                    let oBusydailog = new sap.m.BusyDialog();
                    oBusydailog.open();
                    oDataModelSF.read("/EmpJob", {
                        filters: [oFilter1],
                        urlParameters: {
                            $expand: "userNav"
                        },
                        success: (response1) => {
                            // this.getView().getModel("EmpJob").setData(response1.results[0]);
                            if (response1.results.length !== 0) {

                                // that.getView().byId("idInputDepartment").setValue(response1.results[0].department);
                                debugger;
                                // that.tempID = Number(response1.results[0].userId);
                                that.tempID = response1.results[0].userId;
                                let oFilter4 = new Filter("person", sap.ui.model.FilterOperator.EQ, that.tempID);
                                // let oFilter5 = new Filter("externalCode", sap.ui.model.FilterOperator.EQ, "Z002");
                                let oFilter5 = new sap.ui.model.Filter({
                                    filters: [
                                        new Filter({
                                            path: 'externalCode',
                                            operator: FilterOperator.EQ,
                                            value1: 'Z002'
                                        }),
                                        new Filter({
                                            path: 'externalCode',
                                            operator: FilterOperator.EQ,
                                            value1: 'Z004'
                                        })
                                    ],
                                    and: false
                                });

                                oDataModelSF.read("/FODynamicRole", {
                                    filters: [oFilter4, oFilter5],
                                    urlParameters: { "$expand": "departmentNav,divisionNav,locationNav" },
                                    // filters: [oFilter4],
                                    success: (response2) => {
                                        const filteredEmployees = response2.results.filter(employee => employee.department !== null);
                                        if (filteredEmployees) {
                                            const model = new sap.ui.model.json.JSONModel();
                                            debugger;
                                            const uniqueDepartment = that.removeDuplicates(filteredEmployees, 'department');
                                            model.setData({ "emp": uniqueDepartment });
                                            // this.hideBusyIndicator();
                                            this.getView().setModel(model, 'tableModel');
                                        }
                                        if (response2.results.length === 0) {
                                            resolve({
                                                "admin": "no",
                                                "userId": response1.results[0].userId
                                            });
                                        } else {
                                            resolve({
                                                "admin": "yes",
                                                "userId": response1.results[0].userId
                                            });
                                        }
                                        oBusydailog.close();

                                    },
                                    error: (error) => {
                                        reject(error);
                                        oBusydailog.close();
                                    }
                                });
                                // console.log("email :", response1);

                            }
                            oBusydailog.close()
                        },
                        error: (error) => {
                            reject(error);
                            oBusydailog.close();
                        }
                    });
                });
            },
            onMultiInputValueHelpRequest: async function (oEvent) {  // get all departments

                this.openDialog("Department Select", "taqasummaryreporttimesheet.view.department")
                // let oDataModelSF = this.getOwnerComponent().getModel("v2");
                // let oFilter4 = new Filter("person", sap.ui.model.FilterOperator.EQ, this.tempID);
                // await oDataModelSF.read("/FODynamicRole", {
                //     context: null,
                //     async: true,
                //     filters: [oFilter4],
                //     urlParameters: { "$expand": "departmentNav,divisionNav,locationNav" },
                //     success: (oData, oResponse) => {

                //         let data = oData.results;

                //         // const model = new sap.ui.model.json.JSONModel();
                //         // model.setData({ "emp": data });
                //         // this.getView().setModel(model, 'tableModel');

                //         const filteredEmployees = data.filter(employee => employee.department !== null);
                //         if (filteredEmployees) {
                //             const model = new sap.ui.model.json.JSONModel();
                //             model.setData({ "emp": filteredEmployees });
                //             // this.hideBusyIndicator();
                //             this.getView().setModel(model, 'tableModel');
                //         }
                //     }
                // });
                // },
                //     error: () => {

                //         sap.m.MessageBox.error("Service Failure", {
                //             title: "Error"
                //         });

                //     }
                // });

            },
            onFODepartmentTableSelectDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter({
                    path: "departmentNav/results/0/name",
                    operator: FilterOperator.Contains,
                    value1: sValue,
                    caseSensitive: false
                });
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },
            onFODepartmentTableSelectDialogConfirm: function (oEvent) {
                var oMultiInput = this.byId("idInputDepartment");
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

                var aContexts = oEvent.getParameter("selectedContexts");
                if (aContexts && aContexts.length) {
                    aContexts.forEach(oContexts => {
                        oMultiInput.addToken(new Token({
                            text: oContexts.getObject().department
                        }));

                    });

                }
            },
            openDialog: function (name, path) {
                let sname = name;
                this.mDialogs = this.mDialogs || {};
                var oDialog = this.mDialogs[sname];
                if (!oDialog) {
                    oDialog = this.loadFragment({
                        name: path,
                        type: "XML",
                        controller: this

                    });
                    this.mDialogs[sname] = oDialog;
                }
                oDialog.then(function (pDialog) {
                    pDialog.setTitle(name)
                    pDialog.open();
                });
            },

            removeDuplicates: function (data, field) {
                const seen = new Set();
                return data.filter(item => {
                    const value = item[field];
                    if (seen.has(value)) {
                        return false;
                    } else {
                        seen.add(value);
                        return true;
                    }
                });
            },

        });
    });
