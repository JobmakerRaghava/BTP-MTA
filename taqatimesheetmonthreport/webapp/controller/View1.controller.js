sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/export/Spreadsheet',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
    "sap/m/MessageBox",
    "sap/m/IllustratedMessage"

], function (Controller,
    JSONModel,
    Spreadsheet,
    Filter,
    FilterOperator,
    Token,
    MessageBox,
    IllustratedMessage
) {

    let AMPSData = [];

    const allowanceDataKSA = {
        "Allowances": [
            { "key": "UnpaidDays", "text": "Unpaid Days" },
            { "key": "UnauthorizedAbsence", "text": "Unauthorized Absence" },
            { "key": "AnnualLeave", "text": "Annual Leave" },
            { "key": "RotationLeave", "text": "Accrued day Off Leave" },
            { "key": "SickLeave", "text": "Sick Leave" },
            { "key": "OtherLeaves", "text": "Other Leaves" },
            { "key": "JobBonusDays", "text": "Job Bonus Days" },
            { "key": "JobBonusAmount", "text": "Job Bonus Amount" },
            { "key": "JobBonusper", "text": "Job Bonus %" },
            { "key": "MealAllowances", "text": "Meal Allowances Days" },
            { "key": "MealAllowancesAmount", "text": "Meal Allowances Amount" },
            { "key": "LeaveAccrual", "text": "Leave Accrual Days" },
            { "key": "OvertimeHours", "text": "Overtime Hours" },
            { "key": "OvertimeAmount", "text": "Overtime Amount" },
            { "key": "Tier1", "text": "Tier 1 Days" },
            { "key": "Tier1Amount", "text": "Tier 1 Amount" },
            { "key": "Tier2", "text": "Tier 2 Days" },
            { "key": "Tier2Amount", "text": "Tier 2 Amount" },
            { "key": "Tier3", "text": "Tier 3 Days" },
            { "key": "Tier3Amount", "text": "Tier 3 Amount" },
            { "key": "leaveBalance", "text": "Leave Balance" },
            { "key": "StandbyBonustaqa", "text": "Stand by Bonus" },
            { "key": "StandbyBonusdaystaqa", "text": "Stand by Bonus Days" },
            { "key": "CriticalBonus", "text": "Critical Bonus" },
            { "key": "CriticalBonusDays", "text": "Critical Bonus Days" },
            { "key": "TripBonus", "text": "Trip Bonus" },
            { "key": "TripBonusDays", "text": "Trip Bonus Days" },
            { "key": "TravelBonus", "text": "Travel Bonus" },
            { "key": "TravelBonusDays", "text": "Travel Bonus Days" },
            { "key": "ZERONPTBonus", "text": "Zero NPT Bonus" },
            { "key": "ZERONPTBonusDays", "text": "Zero NPT Bonus Days" },
            { "key": "FTABonus", "text": "FTA Bonus" },
            { "key": "FTABonusDays", "text": "FTA Bonus Days" },

        ]
    };

    const allowanceDataAMPS = {
        "Allowances": [
            { key: "UnpaidDays", "text": "Unpaid Days" },
            { key: "UnauthorizedAbsence", "text": "Unauthorized Absence" },
            { key: "AnnualLeave", "text": "Annual Leave" },
            { key: "RotationLeave", "text": "Accrued day Off Leave" },
            { key: "SickLeave", "text": "Sick Leave" },
            { key: "OtherLeaves", "text": "Other Leaves" },
            { key: "LocationBonus", text: "Location Bonus" },
            { key: "FieldBonus", text: "Field Bonus" },
            { key: "MarineBonus", text: "Marine Bonus" },
            { key: "DPBonus", text: "DP Bonus" },
            { key: "RigBonus", text: "Rig Bonus" },
            { key: "StandbyBonus", text: "Stand by Bonus" },
            { key: "Transportation", text: "Transportation" },
            { key: "WorkshopAllowanceDaily", text: "Workshop Allowance Daily" },
            { key: "RiskAllowanceDaily", text: "Risk Allowance Daily" },
            { key: "FieldAllowanceRate", text: "Field Allowance Rate" },
            { key: "FieldBonusINRate", text: "Field Bonus IN Rate" },
            { key: "FieldBonusOUTRate", text: "Field Bonus OUT Rate" },

            { key: "LocationBonusINRate", text: "Location Bonus IN Rate" },
            { key: "LocationBonusOUTRate", text: "Location Bonus OUT Rate" },

            { key: "InternallowanceBonus", text: "Internallowance Bonus" },
            { key: "DesertAllowancePerDay", text: "Desert Allowance Per Day" },
            { key: "MarineOverstayBonusRate", text: "Marine Overstay Bonus Rate" },
            { key: "LocationOverstayBonusrate", text: "Location Overstay Bonus Rate" },
            { key: "RiskAllowanceIQRate", text: "Risk Allowance (IQ) Rate" },
            { key: "RiskAllowanceSARate", text: "Risk Allowance (SA) Rate" },
            { key: "FieldBonusCoefficientrate", text: "Field Bonus + Coefficient Rate" },
            { key: "FoodAllowance", text: "Food Allowance" },
            //new allowance for AMPS shared by Sudharshan 8-10-24
            { key: "HalfRigBonus", text: "Half Rig Bonus" },
            { key: "EIDBonusPublicHoliday", text: "EID Bonus /Public Holiday" },
            { key: "RestDayPay", text: "Rest Day Pay" },
            { key: "3HrsOvertime", text: "3 Hours Overtime" },
            { key: "RestDayPay130", text: "Rest Day Pay (130%)" },
            { key: "RestDayPay170", text: "Rest Day Pay (170%)" },
            { key: "EidBonusPublicHolidayOMN", text: "Eid Bonus /Public Holiday OMN" },
            { key: "TripAllowance", text: "Trip Allowance" },
            { key: "GeographicalAllowOperat", text: "Geographical Allow Operation" },
            { key: "GeographicalAllowWorkShop", text: "Geographical Allow WorkShop" },
            { key: "GeographicalAllowStandBy", text: "Geographical Allow StandB" },
            { key: "GeographicalAllowance", text: "Geographical Allowance" },
            { key: "OtherVariable1", text: "Other Variable 1" },
            { key: "OtherVariable2", text: "Other Variable 2" },
            { key: "OtherVariable3", text: "Other Variable 3" },
            { key: "QarunBonus", text: "Qarun Bonus" },
            { key: "FoodAllowanceQatar2", text: "Food Allowance(Qatar)2" },
            { key: "PerDiem", text: "Per Diem" },
            { key: "FieldAllowanceDOnshore", text: "Field Allowance(D-Onshore)" },
            { key: "FieldAllowanceDOffshore", text: "Field Allowance(D-Offshore)" },
            { key: "HardshipAllowance", text: "Hardship Allowance" }


        ]
    };


    "use strict";
    return Controller.extend("taqa.taqatimesheetmonthreport.controller.View1", {
        onInit: async function () {

            if (sap.ushell.Container) {
                let user = sap.ushell.Container.getService("UserInfo").getUser();
                console.log(user)
                let userEmail = user.getEmail();
                // userEmail = 'vsreenivasulu@kaartech.com';
                // userEmail = 'pantothomasraja@kaartech.com';
                console.log(userEmail);
                if (userEmail !== undefined) {

                    //Load AMPS Data
                    await this.AMPSDataLoad(); // parallel call



                    let userD = await this.getEmpDetailsEmail(userEmail, true);


                    // Amps condition
                    if (this.isAMPSAdmin) {
                        var oModel = new sap.ui.model.json.JSONModel(allowanceDataAMPS);
                        this.getView().setModel(oModel, "allowanceModel");
                    } else {
                        var oModel = new sap.ui.model.json.JSONModel(allowanceDataKSA);
                        this.getView().setModel(oModel, "allowanceModel");
                    }


                    // let userD = 'yes'; //userD.admin
                    if (userD.admin === "yes") {
                        let fnValidator = function (args) {
                            let text = args.text;
                            return new Token({ key: text, text: text });
                        };
                        let oMultiInput1 = this.getView().byId("idInput");
                        oMultiInput1.addValidator(fnValidator);
                        let oModel = this.getOwnerComponent().getModel("taqa"),
                            sPath = "/RowInfo",
                            filters = new Array(),
                            filterByName,
                            filterByStartDate,
                            filterByEndDate,
                            that = this,
                            oBusydailog = new sap.m.BusyDialog();
                        oBusydailog.open();
                        filterByName = new Filter("TableName", FilterOperator.EQ, "CutOffCycles");
                        filterByStartDate = new Filter("Column1", FilterOperator.LE, this._convert_Date(new Date()));
                        filterByEndDate = new Filter("Column2", FilterOperator.GE, this._convert_Date(new Date()));
                        filters.push(filterByName);
                        filters.push(filterByStartDate);
                        filters.push(filterByEndDate);
                        oModel.read(sPath, {
                            filters: filters,
                            success: function (odata) {
                                that.getView().byId("idDatePicker").setDateValue(new Date(odata.results[0].Column1));
                                that.getView().byId("idDatePicker").setSecondDateValue(new Date(odata.results[0].Column2));
                                that.onSearch();
                                oBusydailog.close();
                            },
                            error: function (error) {
                                oBusydailog.close();
                                MessageBox.error(error);
                            }
                        });
                    } else {
                        let oPage = this.getView().byId("idPage");
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
                    let oPage = this.getView().byId("idPage");
                    oPage.removeAllContent();
                    let oIllustratedMessage = new IllustratedMessage({
                        illustrationType: "sapIllus-ErrorScreen",
                        title: "Undefined"
                    });
                    oPage.addContent(oIllustratedMessage);
                }
            }
        },
        displayAccessDenied: function () {
            let oPage = this.getView().byId("idPage");
            oPage.removeAllContent();
            let oIllustratedMessage = new IllustratedMessage({
                illustrationType: "sapIllus-ErrorScreen",
                title: "Access Denied",
                description: "You need permission to access this page. Request access from your administrator."
            });
            oPage.addContent(oIllustratedMessage);
        },
        onAllowanceChange: function (oEvent) {
            const oSelectedItems = oEvent.getSource().getSelectedItems();
            const oUnselectedItems = oEvent.getSource()._getUnselectedItems();
            // Handle Selected Items
            oSelectedItems.forEach(item => {
                let sId = item.getKey();
                // Skip if the key is 'SelectAll' or the element does not exist
                if (sId !== "SelectAll" && this.getView().byId(sId)) {
                    this.getView().byId(sId).setVisible(true);
                }
            });
            // Handle Unselected Items
            oUnselectedItems.forEach(item => {
                let sId = item.getKey();
                // Skip if the key is 'SelectAll' or the element does not exist
                if (sId !== "SelectAll" && this.getView().byId(sId)) {
                    this.getView().byId(sId).setVisible(false);
                }
            });
        },
        AMPSDataLoad: function () {
            return new Promise((resolve, reject) => {
                let oDataModel = this.getOwnerComponent().getModel("taqa");
                let oFilter1 = new sap.ui.model.Filter("TableName", sap.ui.model.FilterOperator.EQ, "AMPS");
                oBusydailog = new sap.m.BusyDialog();
                oBusydailog.open();
                oDataModel.read("/RowInfo", {
                    filters: [oFilter1],
                    success: (response) => {
                        response.results.forEach(oItem => {
                            AMPSData.push(oItem.Column1);

                        });
                        resolve(true);
                        oBusydailog.close();
                    },
                    error: function (oError) {
                        // MessageToast.show("Error loading data: ", oError);
                        oBusydailog.close();
                        console.log("Error loading data:", oError);
                        reject(false);
                    }
                });

            });
        },
        onExcelButtonPress: function (oEvent) {
            let oRowBinding = this.getView().byId("employeeTable").getBinding().getModel().getProperty('/'),
                oColumns = this.getView().byId("employeeTable")._getVisibleColumns(),
                ColumnsLabels = [];
            oColumns.forEach(function (column) {
                ColumnsLabels.push({
                    property: column.getTemplate().getBindingPath("text"),
                    label: column.getLabel().getText()
                });
            });
            if (oRowBinding.length !== 0) {
                let oSettings = {
                    workbook: {
                        columns: ColumnsLabels,
                        context: {
                            sheetName: 'Timesheet'
                        }
                    },
                    dataSource: oRowBinding,
                    fileName: 'Timesheet Report.xlsx',
                    worker: false
                };
                let oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            } else {
                MessageBox.warning("No Data Found for download")
            }
        },

        onCalculateData: async function (oAllRecords) {
            const oBusydailog = new sap.m.BusyDialog();
            oBusydailog.open();
            this.getView().byId("idDownloadExcelButton").setEnabled(true);
            const that = this;
            const oJsonData = oAllRecords;
            oJsonData.sort((a, b) => a.EmployeeID.localeCompare(b.EmployeeID));
            const processedData = {};
            // let oUnpaidModel = this.getView().getModel("oUnpaidModel").getData();
            // Process records sequentially
            for (const record of oJsonData) {
                const employeeID = record["EmployeeID"];

                if (!processedData[employeeID]) {
                    processedData[employeeID] = {
                        "EmployeeID": employeeID,
                        "EmployeeName": record["EmployeeName"],
                        "JobTitle": record["JobTitle"],
                        "LegalEntity": record["CompanyCode"],
                        "LegalEntityDescription": record["CompanyCodeDesc"],
                        "Location": record["Location"],
                        "Division": record["Division"],
                        "DivisionDesc": record["DivisionDesc"],
                        "Department": record["Department"],
                        "DepartmentDesc": record["DepartmentDesc"],
                        "LocationDesc": record["LocationDesc"],
                        "OvertimeAmount": 0,
                        "WorkedDays": 0,
                        "UnpaidDays": 0,
                        "UnauthorizedAbsence": 0,
                        "AnnualLeave": 0,
                        "RotationLeave": 0,
                        "SickLeave": 0,
                        "OtherLeaves": 0,

                        "JobBonusDays": 0,
                        "JobBonusAmount": 0,
                        "MealAllowances": 0,
                        "MealAllowancesAmount": 0,
                        "Tier1": 0,
                        "Tier1Amount": 0,
                        "Tier2": 0,
                        "Tier2Amount": 0,
                        "Tier3": 0,
                        "Tier3Amount": 0,
                        "LeaveAccrual": 0,
                        "OvertimeHours": 0,
                        //new allowances shared by Ajay
                        "JobBonusper": 0,
                        "CriticalBonus": 0,
                        "TripBonus": 0,
                        "TravelBonus": 0,
                        "ZERONPTBonus": 0,
                        "StandbyBonustaqa": 0,
                        "FTABonus": 0,
                        "StandbyBonusdaystaqa": 0,
                        "CriticalBonusDays": 0,
                        "TripBonusDays": 0,
                        "TravelBonusDays": 0,
                        "ZERONPTBonusDays": 0,
                        "FTABonusDays": 0,

                        "LocationBonus": 0,
                        "FieldBonus": 0,
                        "MarineBonus": 0,
                        "DPBonus": 0,
                        "RigBonus": 0,
                        "StandbyBonus": 0,
                        "Transportation": 0,
                        "WorkshopAllowanceDaily": 0,
                        "RiskAllowanceDaily": 0,
                        "FieldAllowanceRate": 0,
                        "FieldBonusINRate": 0,
                        "FieldBonusOUTRate": 0,
                        "LocationBonusINRate": 0,
                        "LocationBonusOUTRate": 0,
                        "InternallowanceBonus": 0,
                        "DesertAllowancePerDay": 0,
                        "MarineOverstayBonusRate": 0,
                        "LocationOverstayBonusrate": 0,
                        "RiskAllowanceIQRate": 0,
                        "RiskAllowanceSARate": 0,
                        "FieldBonusCoefficientrate": 0,
                        "FoodAllowance": 0,

                        //new allowance for AMPS shared by Sudharshan 8-10-24
                        "HalfRigBonus": 0,
                        "EIDBonusPublicHoliday": 0,
                        "RestDayPay": 0,
                        "3HrsOvertime": 0,
                        "RestDayPay130": 0,
                        "RestDayPay170": 0,
                        "EidBonusPublicHolidayOMN": 0,
                        "TripAllowance": 0,
                        "GeographicalAllowOperat": 0,
                        "GeographicalAllowWorkShop": 0,
                        "GeographicalAllowStandBy": 0,
                        "GeographicalAllowance": 0,
                        "OtherVariable1": 0,
                        "OtherVariable2": 0,
                        "OtherVariable3": 0,
                        "QarunBonus": 0,
                        "FoodAllowanceQatar2": 0,
                        "PerDiem": 0,
                        "FieldAllowanceDOnshore": 0,
                        "FieldAllowanceDOffshore": 0,
                        "HardshipAllowance": 0



                    };
                }
                // Update counts based on current record
                if (record["WorkType"] !== "" && record["WorkType"] !== undefined && record["WorkType"] !== 'Absent') {
                    processedData[employeeID]["WorkedDays"] += 1;
                }
                let oVerTimeanount = record.ItsAllowances;
                if (oVerTimeanount !== undefined) {
                    let oInnerAllowances = record.ItsAllowances.results;
                    if (oInnerAllowances != "") {
                        oInnerAllowances.map(function (itAllowances) {
                            if (itAllowances.HistoryRecord === '') {
                                if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Overtime") {

                                    processedData[employeeID]["OvertimeAmount"] += Number(itAllowances.Amount);

                                }
                            }
                        })
                    }
                }
                // try {
                //     // Await the ReadOdata function call
                //     const odata = await that.ReadOdata(oModel, sPath, aFilter);
                //     let vtimetype = odata.results;
                //     if (vtimetype.length !== 0) {
                //         if (vtimetype[0].timeType === "SA_AUTU5" ||
                //             vtimetype[0].timeType === "SA_AUTU15" ||
                //             vtimetype[0].timeType === "SA_AUTUM15" ||
                //             vtimetype[0].timeType === "SA_UNAUTH") {
                //             processedData[employeeID]["UnpaidDays"] += 1;
                //         }
                //     }
                // } catch (error) {
                //     console.error("Error reading OData:", error);
                // }
                // if (vLeaveRecord.timeType === "SA_AUTU5" ||
                //     vLeaveRecord.timeType === "SA_AUTU15" ||
                //     vLeaveRecord.timeType === "SA_AUTUM15" ||
                //     vLeaveRecord.timeType === "SA_UNAUTH") {
                //     processedData[employeeID]["UnpaidDays"] += 1;
                // }
                if (record["LeaveCode"] === "SA_AUTU5" ||
                    record["LeaveCode"] === "SA_AUTU15" ||
                    record["LeaveCode"] === "SA_AUTUM15" ||
                    record["LeaveCode"] === "SA_UNAUTH") {
                    if (record["approvalStatus"] === "APPROVED" || record["approvalStatus"] === "PENDING") {
                        processedData[employeeID]["UnpaidDays"] += 1;
                    }

                }
                if (record["Absence"] === "Un-Authorised Absence") {// added by Raghavendra for Un-Authorised Absence need to fetch from timesheet only,given by Sudharshan

                    processedData[employeeID]["UnauthorizedAbsence"] += 1;

                }
                // if (record["LeaveCode"] === "SA_UNAUTH") {
                // if (record["approvalStatus"] === "APPROVED" || record["approvalStatus"] === "PENDING") {
                //         processedData[employeeID]["UnauthorizedAbsence"] += 1;
                // }
                // }
                // Update leave and allowance counts
                if (record["LeaveCode"] === "SA_ANNL10D") {
                    processedData[employeeID]["AnnualLeave"] += 1;
                }
                if ((record["LeaveCode"] === "RL_KSA" && record["approvalStatus"] === "APPROVED") ||
                    (record["LeaveCode"] === "SA_ADOFFLV" && record["approvalStatus"] === "APPROVED")) { //SA_ADOFFLV
                    processedData[employeeID]["RotationLeave"] += 1;
                }
                if ((record["LeaveCode"] === "SA_SICK30" && record["approvalStatus"] === "APPROVED") ||
                    (record["LeaveCode"] === "SA_SICKGE5" && record["approvalStatus"] === "APPROVED")) {
                    processedData[employeeID]["SickLeave"] += 1;
                }
                if (record["LeaveCode"] === "SA_PAT" ||
                    record["LeaveCode"] === "SA_HAJJ" ||
                    record["LeaveCode"] === "SA_MARR" ||
                    record["LeaveCode"] === "SA_GOAU" ||
                    record["LeaveCode"] === "SA_ATCUSO" ||
                    record["LeaveCode"] === "SA_MAT" ||
                    record["LeaveCode"] === "SA_EDDAH" ||
                    record["LeaveCode"] === "SA_EMER" ||
                    record["LeaveCode"] === "SA_EXAM" ||
                    record["LeaveCode"] === "SA_MED_DIS" ||
                    record["LeaveCode"] === "SA_CHILD"
                    // record["LeaveCode"] === "SA_ADOFFLV" //Accrued day Off Leave
                ) {
                    processedData[employeeID]["OtherLeaves"] += 1;
                }
                if (record["ItsAllowances"] && record["ItsAllowances"].results.length !== 0) {
                    record["ItsAllowances"].results.forEach(Allowances => {
                        //  if (Allowances.HistoryRecord === '') {
                        if (Allowances.AllowanceID === '9050') {
                            processedData[employeeID]["JobBonusDays"] += 1;
                            processedData[employeeID]["JobBonusAmount"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '9100') {
                            processedData[employeeID]["MealAllowances"] += 1;
                            processedData[employeeID]["MealAllowancesAmount"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '9225') {
                            processedData[employeeID]["Tier1"] += 1;
                            processedData[employeeID]["Tier1Amount"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '9235') {
                            processedData[employeeID]["Tier2"] += 1;
                            processedData[employeeID]["Tier2Amount"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '9245') {
                            processedData[employeeID]["Tier3"] += 1;
                            processedData[employeeID]["Tier3Amount"] += Number(Allowances.Amount);
                        }
                        // }
                        //new allowances shared by Ajay
                        if (Allowances.AllowanceID === '9040') {

                            processedData[employeeID]["JobBonusper"] += Number(Allowances.Number);
                        }
                        if (Allowances.AllowanceID === '9070') {
                            processedData[employeeID]["CriticalBonusDays"] += 1;
                            processedData[employeeID]["CriticalBonus"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '9080') {
                            processedData[employeeID]["TripBonusDays"] += 1;
                            processedData[employeeID]["TripBonus"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '9090') {
                            processedData[employeeID]["TravelBonusDays"] += 1;
                            processedData[employeeID]["TravelBonus"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '9265') {
                            processedData[employeeID]["ZERONPTBonusDays"] += 1;
                            processedData[employeeID]["ZERONPTBonus"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '9060') {
                            processedData[employeeID]["StandbyBonusdaystaqa"] += 1;
                            processedData[employeeID]["StandbyBonustaqa"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '9246') {
                            processedData[employeeID]["FTABonusDays"] += 1;
                            processedData[employeeID]["FTABonus"] += Number(Allowances.Amount);
                        }
                        ///AMPS allowances
                        if (Allowances.AllowanceID === '4005') {
                            processedData[employeeID]["LocationBonus"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4006') {
                            processedData[employeeID]["FieldBonus"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4007') {
                            processedData[employeeID]["MarineBonus"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4008') {
                            processedData[employeeID]["DPBonus"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4009') {
                            processedData[employeeID]["RigBonus"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4010') {
                            processedData[employeeID]["StandbyBonus"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4077') {//4038
                            processedData[employeeID]["Transportation"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4079') {
                            processedData[employeeID]["WorkshopAllowanceDaily"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4081') {//4050
                            processedData[employeeID]["RiskAllowanceDaily"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4078') { //4042
                            processedData[employeeID]["FieldAllowanceRate"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4043') {
                            processedData[employeeID]["FieldBonusINRate"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4049') {
                            processedData[employeeID]["FieldBonusOUTRate"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4046') {
                            processedData[employeeID]["LocationBonusINRate"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4047') {
                            processedData[employeeID]["LocationBonusOUTRate"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4048') {
                            processedData[employeeID]["InternallowanceBonus"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4059') {
                            processedData[employeeID]["DesertAllowancePerDay"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4058') {
                            processedData[employeeID]["MarineOverstayBonusRate"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4051') {
                            processedData[employeeID]["LocationOverstayBonusrate"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4011') {
                            processedData[employeeID]["RiskAllowanceIQRate"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4029') {
                            processedData[employeeID]["RiskAllowanceSARate"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4036') {
                            processedData[employeeID]["FieldBonusCoefficientrate"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4015' ||
                            Allowances.AllowanceID === '4016' ||
                            Allowances.AllowanceID === '4017' ||
                            Allowances.AllowanceID === '4018' ||
                            Allowances.AllowanceID === '4019' ||
                            Allowances.AllowanceID === '4020' ||
                            Allowances.AllowanceID === '4021' ||
                            Allowances.AllowanceID === '4022' ||
                            Allowances.AllowanceID === '4023' ||
                            Allowances.AllowanceID === '4024' ||
                            Allowances.AllowanceID === '4025' ||
                            Allowances.AllowanceID === '4026' ||
                            Allowances.AllowanceID === '4027' ||
                            Allowances.AllowanceID === '4028'
                        ) {
                            processedData[employeeID]["FoodAllowance"] += Number(Allowances.Amount);
                        }

                        //new allowance for AMPS shared by Sudharshan 8-10-24
                        if (Allowances.AllowanceID === '4064') {
                            processedData[employeeID]["HalfRigBonus"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4060') {
                            processedData[employeeID]["EIDBonusPublicHoliday"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4061') {
                            processedData[employeeID]["RestDayPay"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4069') {
                            processedData[employeeID]["3HrsOvertime"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4071') {
                            processedData[employeeID]["RestDayPay130"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4072') {
                            processedData[employeeID]["RestDayPay170"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4073') {
                            processedData[employeeID]["EidBonusPublicHolidayOMN"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4068') {
                            processedData[employeeID]["TripAllowance"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4033') {
                            processedData[employeeID]["GeographicalAllowOperat"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4044') {
                            processedData[employeeID]["GeographicalAllowWorkShop"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4045') {
                            processedData[employeeID]["GeographicalAllowStandBy"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4050') {
                            processedData[employeeID]["GeographicalAllowance"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4053') {
                            processedData[employeeID]["OtherVariable1"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4054') {
                            processedData[employeeID]["OtherVariable2"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4055') {
                            processedData[employeeID]["OtherVariable3"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4056') {
                            processedData[employeeID]["QarunBonus"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4073') { //4037
                            processedData[employeeID]["FoodAllowanceQatar2"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4080') {
                            processedData[employeeID]["PerDiem"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4067') {
                            processedData[employeeID]["FieldAllowanceDOnshore"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4063') {
                            processedData[employeeID]["FieldAllowanceDOffshore"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '4074') {
                            processedData[employeeID]["HardshipAllowance"] += Number(Allowances.Amount);
                        }


                    });
                }
                if (record["RotationalLeaveBalance"] !== '' && record["RotationalLeaveBalance"] !== undefined && record["RotationalLeaveBalance"] !== NaN) {
                    processedData[employeeID]["LeaveAccrual"] += Number(record["RotationalLeaveBalance"]);
                }
                if (record["OvertimeHours"] !== '' && record["OvertimeHours"] !== undefined && record["OvertimeHours"] !== NaN) {
                    processedData[employeeID]["OvertimeHours"] += Number(record["OvertimeHours"]);
                }
            }
            // Convert processedData to array after all records are processed
            const finalData = Object.values(processedData);
            // Format numerical values
            finalData.forEach(element => {
                element.LeaveAccrual = parseFloat(element.LeaveAccrual).toFixed(2);
                element.OvertimeHours = parseFloat(element.OvertimeHours).toFixed(2);
                element.OvertimeAmount = parseFloat(element.OvertimeAmount).toFixed(2);
            });
            if (!this.isAMPSAdmin) {


                const employeeIds = [...new Set(finalData.map(record => record.EmployeeID))];
                try {
                    const leveablanceData = await that.getLeaveBal(employeeIds);
                    debugger;
                    // const leveablanceData = await that.GetLeaveBalance(employeeIds);
                    if (leveablanceData.length > 0) {
                        finalData.forEach(record => {
                            const empInformation = leveablanceData.filter(element => element.userId === record.EmployeeID);
                            const empInfo = empInformation[0];
                            if (empInfo !== undefined) {
                                record.leaveBalance = parseFloat(empInfo.balance).toFixed(2);
                            }
                        })
                    }

                }
                catch (error) {
                    console.log(error);
                }
            }
            // for (const item of finalData) {
            //     try {
            //         let leaveBalance = await that.GetLeaveBalance(item.EmployeeID)
            //         item.leaveBalance = parseFloat(leaveBalance.results[0].balance).toFixed(2); //leaveBalance.results[0].balance;
            //     } catch (error) {
            //         console.log(error)
            //     }


            // };
            const oModel = new JSONModel(finalData);
            const oTableTitle = this.getView().byId("idTitle");
            this.getView().setModel(oModel);
            oTableTitle.setText(`Timesheet(${finalData.length})`);
            oBusydailog.close();
        },

        ReadOdata: async function (oModel, sPath, oFilters1, oFilters2, oFilters3, oFilter4) {
            return await new Promise(function (resolve, reject) {
                oModel.read(sPath, {
                    filters: [oFilters1, oFilters2, oFilters3, oFilter4],
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(new Error(oError));
                    }
                })
            })
        },
        fetchEmployeeInfo: async function (empid) {
            let oDataModel = this.getOwnerComponent().getModel("taqa");
            if (empid.length > 0) {


                var aFilters2 = empid.map(function (id) {
                    return new Filter("EmployeeID", FilterOperator.EQ, id);
                });
                // var oFilter = new Filter({
                //     filters: aFilters2,
                //     and: false
                // });
                return new Promise((resolve, reject) => {
                    //     let batchid = 'readBatch';
                    //     oDataModel.setUseBatch(true);
                    //     oDataModel.setDeferredGroups(["Group"]);

                    // empid.forEach(id => {
                    //         //     allFilters.aFilters.push(new sap.ui.model.Filter("EmployeeID", sap.ui.model.FilterOperator.EQ, id))
                    oDataModel.read('/TimeSheetDetails', {
                        // groupId: batchid,
                        filters: aFilters2,

                        success: function (odata) {
                            resolve(odata);
                            // return odata.results;
                            debugger
                        },
                        error: function (error) {
                            reject(error);
                            debugger
                        }
                    })
                });
            } else {
                return []
            }


            ////////////////////////////////////////////////////////////////
            // let oModel = this.getOwnerComponent().getModel("taqa");
            // const aFilters2 = [
            //     // new sap.ui.model.Filter("userId", sap.ui.model.FilterOperator.EQ, empid)
            //     new sap.ui.model.Filter("EmployeeID", sap.ui.model.FilterOperator.EQ, empid)
            // ];
            // return await new Promise(function (resolve, reject) {
            //     // oModel.read('/EmpJob', {
            //     oModel.read('/TimeSheetDetails', {
            //         filters: aFilters,
            //         // urlParameters: {
            //         //     $expand: "departmentNav,companyNav,divisionNav,userNav,locationNav"
            //         // },
            //         success: function (odata) {
            //             resolve(odata);
            //         },
            //         error: function (oError) {
            //             reject(new Error(oError));
            //         }
            //     })
            // })
        },
        GetLeaveBalance: async function (empid) {
            let oDataModel = this.getOwnerComponent().getModel("v2");
            if (empid.length > 0) {
                let sBatchGroupId = 'readBatch';
                let oLeaveData = [];

                // var aFilters2 = empid.map(function (id) {
                return new Promise((resolve, reject) => {
                    empid.forEach((id) => {
                        let oFilter1 = new Filter("userId", sap.ui.model.FilterOperator.EQ, id);
                        let oFilter2 = new Filter("timeAccountType", sap.ui.model.FilterOperator.EQ, "ROT_TA_KSA");
                        oDataModel.read("/EmpTimeAccountBalance", {
                            groupId: sBatchGroupId,
                            filters: [oFilter1, oFilter2],
                            success: (odata) => {
                                if (odata.results.length > 0) {
                                    oLeaveData.push(odata.results[0])
                                    resolve(oLeaveData)
                                }

                            },
                            error: (odata) => { reject(error) }
                        });
                    })
                    oDataModel.submitChanges({
                        groupId: sBatchGroupId,
                        success: (oResponse) => { debugger },
                        error: (oError) => { reject(error) }
                    });

                });
                //     return new Filter({
                //         filters: [
                //             new Filter("userId", FilterOperator.EQ, id),
                //             new Filter("timeAccountType", FilterOperator.EQ, "ROT_TA_KSA")
                //         ],
                //         and: true
                //     });
                // });
                // let combinedFilter = new Filter({
                //     filters: aFilters2,
                //     and: false
                // });
                // // aFilters2.push(new sap.ui.model.Filter("timeAccountType", sap.ui.model.FilterOperator.EQ, "ROT_TA_KSA"));
                // return new Promise((resolve, reject) => {
                //     oDataModel.read('/EmpTimeAccountBalance', {
                //         // groupId: batchid,
                //         filters: [combinedFilter],

                //         success: function (odata) {
                //             resolve(odata);
                //             // return odata.results;
                //             debugger
                //         },
                //         error: function (error) {
                //             reject(error);
                //             debugger
                //         }
                //     })
                // });
            }
            else {
                return []
            }
            // let oModel = this.getOwnerComponent().getModel("v2");
            // const aFilters = [
            //     new sap.ui.model.Filter("timeAccountType", sap.ui.model.FilterOperator.EQ, "ROT_TA_KSA"),
            //     new sap.ui.model.Filter("userId", sap.ui.model.FilterOperator.EQ, empid)
            // ];
            // return await new Promise(function (resolve, reject) {
            //     // oModel.read('/EmpJob', {
            //     oModel.read('/EmpTimeAccountBalance', {
            //         filters: aFilters,
            //         // urlParameters: {
            //         //     $expand: "departmentNav,companyNav,divisionNav,userNav,locationNav"
            //         // },
            //         success: function (odata) {
            //             resolve(odata);
            //         },
            //         error: function (oError) {
            //             reject(new Error(oError));
            //         }
            //     })
            // })
        },
        onSearch: async function () {
            const oDateRang = this.getView().byId("idDatePicker").getDateValue();
            let that = this;
            this.aFiltersEmp = [];
            this.oAllDept = false;
            if (oDateRang !== null) {
                const oFilterBar = this.getView().byId("filterbar");
                const aFilters = [];
                const oModel = this.getOwnerComponent().getModel("taqa");
                const oBusydailog = new sap.m.BusyDialog();
                oBusydailog.open();
                // aFilters.push(new Filter({
                //     path: "Status",
                //     operator: FilterOperator.EQ,
                //     value1: "Approved"
                // }));
                let aTableFilters = oFilterBar.getFilterGroupItems().reduce((aResult, oFilterGroupItem) => {
                    const oControl = oFilterGroupItem.getControl();
                    if (oControl instanceof sap.m.Input) {
                        const sInputValue = oControl.getValue();
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
                        const sInputValue = oControl.getValue();
                        const vS = this._convert_Date(oControl.getFrom());
                        const vE = this._convert_Date(oControl.getTo());
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
                        const aTokens = oControl.getTokens();
                        if (aTokens.length > 0) {
                            aTokens.forEach(oToken => {
                                const sTokenValue = oToken.getText();
                                if (sTokenValue) {
                                    aFilters.push(new Filter({
                                        path: oFilterGroupItem.getName(),
                                        operator: FilterOperator.EQ,
                                        value1: sTokenValue,
                                        and: true
                                    }));
                                }
                            });
                            if (oFilterGroupItem.getName() === 'EmployeeID') {
                                aTokens.forEach(oToken => {
                                    const sTokenValue = oToken.getText();
                                    if (sTokenValue) {
                                        that.aFiltersEmp.push(new Filter({
                                            path: 'userId',
                                            operator: FilterOperator.EQ,
                                            value1: sTokenValue,
                                            and: true
                                        }));
                                    }
                                });
                            }

                        }
                    }
                    return aFilters;
                }, []);
                let oTokensDep = that.getView().byId("idInputDepartment").getTokens().length;
                let oTableModel = this.getView().getModel("tableModel").getData().emp;
                if (oTokensDep === 0) {
                    that.oAllDept = true;
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
                // oModel.read("/TimeSheetDetails", {
                //     filters: aTableFilters,
                //     urlParameters: { "$expand": "ItsAllowances" },
                //     success: (oData) => {
                //         this.onCalculateData(oData.results);
                //         oBusydailog.close();
                //     },
                //     error: () => oBusydailog.close()
                // });
                //unpaid days getting from EC
                let oSFModel = this.getView().getModel("v2");
                let dateLeaveCheckST = new Date(this.getView().byId("idDatePicker").getFrom()); //new Date(2022,12, 10, 0, 0, 0);
                let dateLeaveCheckED = new Date(this.getView().byId("idDatePicker").getTo());
                dateLeaveCheckST.setHours(0, 0, 0);
                dateLeaveCheckED.setHours(23, 59, 59);
                let d1 = dateLeaveCheckST;
                let d2 = dateLeaveCheckED;
                // let oFilter1 = new Filter("userId", sap.ui.model.FilterOperator.EQ, rowData.EmployeeID);
                let oFilter5 = new Filter("approvalStatus", sap.ui.model.FilterOperator.EQ, "APPROVED");
                let oFilter6 = new Filter("approvalStatus", sap.ui.model.FilterOperator.EQ, "PENDING");
                let oMainFilter = new sap.ui.model.Filter({
                    filters: [
                        // Condition 1: (startDate >= ostartDate && startDate <= oEndDate)
                        new sap.ui.model.Filter({
                            path: 'startDate',
                            operator: sap.ui.model.FilterOperator.BT,
                            value1: d1,
                            value2: d2
                        }),
                        // Condition 2: (endDate >= d1 && endDate <= d2)
                        new sap.ui.model.Filter({
                            path: 'endDate',
                            operator: sap.ui.model.FilterOperator.BT,
                            value1: d1,
                            value2: d2
                        }),
                        // Condition 3: (startDate <= d1 && endDate >= d2)
                        new sap.ui.model.Filter({
                            filters: [
                                new sap.ui.model.Filter({
                                    path: 'startDate',
                                    operator: sap.ui.model.FilterOperator.LE,
                                    value1: d1
                                }),
                                new sap.ui.model.Filter({
                                    path: 'endDate',
                                    operator: sap.ui.model.FilterOperator.GE,
                                    value1: d2
                                })
                            ],
                            and: true
                        })


                    ],
                    and: false // Use OR operator between conditions
                });
                let otype = new sap.ui.model.Filter({
                    filters: [
                        new Filter({
                            path: 'timeType',
                            operator: FilterOperator.EQ,
                            value1: 'SA_AUTU5'
                        }),
                        new Filter({
                            path: 'timeType',
                            operator: FilterOperator.EQ,
                            value1: 'SA_AUTU15'
                        }),
                        new Filter({
                            path: 'timeType',
                            operator: FilterOperator.EQ,
                            value1: 'SA_AUTUM15'
                        }),
                        new Filter({
                            path: 'timeType',
                            operator: FilterOperator.EQ,
                            value1: 'SA_UNAUTH'
                        }),
                        //sick leaves fetching from EC
                        new Filter({
                            path: 'timeType',
                            operator: FilterOperator.EQ,
                            value1: 'SA_SICKGE5'
                        }),
                        new Filter({
                            path: 'timeType',
                            operator: FilterOperator.EQ,
                            value1: 'SA_SICK30'
                        }),
                        //Rotational and accured leves
                        new Filter({
                            path: 'timeType',
                            operator: FilterOperator.EQ,
                            value1: 'SA_ADOFFLV'
                        }),
                        new Filter({
                            path: 'timeType',
                            operator: FilterOperator.EQ,
                            value1: 'RL_KSA'
                        })

                    ],
                    and: false  // Use OR for approvalStatus
                })


                const statusFilter1 = new Filter({
                    path: "Status",
                    operator: FilterOperator.EQ,
                    value1: "Approved"
                });

                const statusFilter2 = new Filter({
                    path: "EditRecordIndicator",
                    operator: FilterOperator.EQ,
                    value1: "X"
                });
                const statusFilter = new Filter({
                    filters: [statusFilter1, statusFilter2],
                    and: false
                });
                aTableFilters.push(statusFilter);

                oModel.read("/TimeSheetDetails", {
                    filters: aTableFilters,
                    urlParameters: { "$expand": "ItsAllowances" },
                    success: async (oData) => {
                        // let oTimesheetData = new JSONModel();
                        // oTimesheetData.setData(oData.results);
                        let oTimesheetData = oData.results;
                        that.ReadOdata(oSFModel, '/EmployeeTime', oFilter5, oFilter6, oMainFilter, otype).then(async (odata) => {

                            let aTransformedUnpaidData = [];
                            odata.results.forEach(item => {
                                // Convert strings to Date objects
                                let startDate = new Date(item.startDate);
                                let endDate = new Date(item.endDate);
                                // Handle single day or multiple days
                                if (startDate.getTime() === endDate.getTime()) {
                                    // If start and end dates are the same, add one record
                                    aTransformedUnpaidData.push({
                                        EmployeeID: item.userId,
                                        Date: that._convert_Date(startDate), // Format date as needed
                                        endDate: that._convert_Date(endDate),
                                        LeaveCode: item.timeType,
                                        approvalStatus: item.approvalStatus
                                    });
                                } else {
                                    // If start and end dates are different, generate records for each day
                                    let currentDate = new Date(startDate);
                                    while (currentDate <= endDate) {
                                        aTransformedUnpaidData.push({
                                            EmployeeID: item.userId,
                                            Date: that._convert_Date(currentDate), // Format date as needed
                                            endDate: that._convert_Date(endDate),
                                            LeaveCode: item.timeType,
                                            approvalStatus: item.approvalStatus
                                        });
                                        // Move to the next day
                                        currentDate.setDate(currentDate.getDate() + 1);
                                    }
                                }
                            });
                            let filteredData = aTransformedUnpaidData.filter(record => {
                                let recordDate = new Date(record.Date);
                                return recordDate >= dateLeaveCheckST && recordDate <= dateLeaveCheckED;
                            });
                            // if (that.aFiltersEmp.length > 0) {
                            //     filteredData = filteredData.filter(
                            //         element => that.aFiltersEmp.map(item =>
                            //             item.oValue1).includes(element.EmployeeID));
                            // }
                            if (that.aFiltersEmp.length > 0) {
                                filteredData = filteredData.filter(element =>
                                    that.aFiltersEmp.some(item => item.oValue1 === element.EmployeeID)
                                );
                            }
                            filteredData.sort((a, b) => a.EmployeeID.localeCompare(b.EmployeeID));
                            //////////////////////////////////////////////////////////////////////////////////////////////
                            // const employeeIds = filteredData.map(record => record.EmployeeID);
                            const employeeIds = [...new Set(filteredData.map(record => record.EmployeeID))];

                            try {
                                const employeeData = await that.fetchEmployeeInfo(employeeIds);

                                filteredData.forEach(record => {
                                    const empInformation = employeeData.results.filter(element => element.EmployeeID === record.EmployeeID);
                                    const empInfo = empInformation[0];
                                    if (empInfo !== undefined) {
                                        record.EmployeeName = empInfo.EmployeeName;
                                        record.JobTitle = empInfo.JobTitle;
                                        record.LegalEntity = empInfo.CompanyCode;
                                        record.LegalEntityDescription = empInfo.CompanyCodeDesc;
                                        record.Location = empInfo.Location;
                                        record.Division = empInfo.Division;
                                        record.DivisionDesc = empInfo.DivisionDesc;
                                        record.Department = empInfo.Department;
                                        record.DepartmentDesc = empInfo.DepartmentDesc;
                                        record.LocationDesc = empInfo.LocationDesc;
                                    }
                                });

                                // Optionally, refresh the UI or trigger further processing
                                // e.g., yourModel.refresh();

                            } catch (error) {
                                console.error("Error fetching employee data:", error);
                            }
                            /////////////////////////////////////////////////////////////////////////////////
                            // let empCache = {};
                            // for (const record of filteredData) {
                            //     try {
                            //         let empInfo;

                            //         if (empCache[record.EmployeeID]) {
                            //             // Use cached employee info
                            //             empInfo = empCache[record.EmployeeID];
                            //             // console.log(`Using cached data for empId: ${record.EmployeeID}`);
                            //         } else {
                            //             // Fetch employee info if not in cache
                            //             let oData = await that.fetchEmployeeInfo(record.EmployeeID);
                            //             empInfo = oData.results[0];
                            //             empCache[record.EmployeeID] = empInfo; // Store info in cache
                            //         }

                            //         if (empInfo !== undefined) {

                            //             // record.EmployeeName = empInfo.userNav.custom04;;
                            //             // record.JobTitle = empInfo.jobTitle;
                            //             // record.LegalEntity = empInfo.company;
                            //             // record.LegalEntityDescription = empInfo.companyNav.description;
                            //             // record.Location = empInfo.location;
                            //             // record.Division = empInfo.division;
                            //             // record.DivisionDesc = empInfo.divisionNav.description;
                            //             // record.Department = empInfo.department;
                            //             // record.DepartmentDesc = empInfo.departmentNav.description;
                            //             // record.LocationDesc = empInfo.locationNav.description;
                            //             record.EmployeeName = empInfo.EmployeeName;;
                            //             record.JobTitle = empInfo.JobTitle;
                            //             record.LegalEntity = empInfo.CompanyCode;
                            //             record.LegalEntityDescription = empInfo.CompanyCodeDesc;
                            //             record.Location = empInfo.Location;
                            //             record.Division = empInfo.Division;
                            //             record.DivisionDesc = empInfo.DivisionDesc;
                            //             record.Department = empInfo.Department;
                            //             record.DepartmentDesc = empInfo.DepartmentDesc;
                            //             record.LocationDesc = empInfo.LocationDesc;
                            //         }

                            //         // console.log(`Updated empId: ${record.empId} with empName: ${record.empName}`);
                            //     } catch (error) {
                            //         // console.error(error);
                            //     }
                            // }

                            let OFinalFilterData = that.onFilterdata(aTableFilters, filteredData);

                            let oFinalData = oTimesheetData.concat(OFinalFilterData);
                            that.onCalculateData(oFinalData);
                            oBusydailog.close();

                        }).catch((error) => { console.log(error) });
                    },
                    error: () => oBusydailog.close()
                });
            } else {
                MessageBox.error("Date is Mandatory");
            }
        },
        onFilterdata: function (aFilters, originalData) {
            // aFilters = aFilters.filter(filter => filter.sPath !== 'Status');
            // aFilters = aFilters.filter(filter => filter.sPath !== 'Date');
            let aFiltersDep = aFilters.filter(filter => filter.sPath === 'Department');
            let aFiltersLoc = aFilters.filter(filter => filter.sPath === 'LocationDesc');

            let aFiltersDiv = aFilters.filter(filter => filter.sPath === 'DivisionDesc');

            let aFilterscom = aFilters.filter(filter => filter.sPath === 'CompanyCodeDesc');
            let aFiltersjob = aFilters.filter(filter => filter.sPath === 'JobTitle');

            let aFiltersname = aFilters.filter(filter => filter.sPath === 'EmployeeName');


            let filteredData = [];

            if (aFiltersDep.length > 0) {
                filteredData = originalData.filter(item => {
                    return aFiltersDep.some(filter => {
                        const itemValue = item[filter.sPath];
                        const filterValue = filter.oValue1;
                        return itemValue === filterValue;
                    });
                });
            }
            if (aFiltersLoc.length > 0) {
                filteredData = filteredData.filter(item => {
                    return aFiltersLoc.every(filter => {
                        const itemValue = item[filter.sPath];
                        const filterValue = filter.oValue1;
                        if (typeof itemValue === 'string' && typeof filterValue === 'string') {
                            return itemValue.toLowerCase().includes(filterValue.toLowerCase());
                        }
                        return false
                    });
                });
            }
            if (aFiltersDiv.length > 0) {
                filteredData = filteredData.filter(item => {
                    return aFiltersDiv.every(filter => {
                        const itemValue = item[filter.sPath];
                        const filterValue = filter.oValue1;
                        if (typeof itemValue === 'string' && typeof filterValue === 'string') {
                            return itemValue.toLowerCase().includes(filterValue.toLowerCase());
                        }
                        return false
                    });
                });
            }
            if (aFiltersname.length > 0) {
                filteredData = filteredData.filter(item => {
                    return aFiltersname.every(filter => {
                        const itemValue = item[filter.sPath];
                        const filterValue = filter.oValue1;
                        if (typeof itemValue === 'string' && typeof filterValue === 'string') {
                            return itemValue.toLowerCase().includes(filterValue.toLowerCase());
                        }
                        return false
                    });
                });
            }
            if (aFiltersjob.length > 0) {
                filteredData = filteredData.filter(item => {
                    return aFiltersjob.every(filter => {
                        const itemValue = item[filter.sPath];
                        const filterValue = filter.oValue1;
                        if (typeof itemValue === 'string' && typeof filterValue === 'string') {
                            return itemValue.toLowerCase().includes(filterValue.toLowerCase());
                        }
                        return false
                    });
                });
            }
            if (aFilterscom.length > 0) {
                filteredData = filteredData.filter(item => {
                    return aFilterscom.every(filter => {
                        const itemValue = item[filter.sPath];
                        const filterValue = filter.oValue1;
                        if (typeof itemValue === 'string' && typeof filterValue === 'string') {
                            return itemValue.toLowerCase().includes(filterValue.toLowerCase());
                        }
                        return false
                    });
                });
            }


            return filteredData;

        },
        _convert_Date: function (value) {
            let date = new Date(value);
            let year = date.getFullYear(); // Get the year, month, and day
            let month = ("0" + (date.getMonth() + 1)).slice(-2);
            let day = ("0" + date.getDate()).slice(-2);
            let isoDateString = year + "-" + month + "-" + day; // Form the ISO date format string
            return isoDateString;
        },
        onFilterBarClear: function () {
            this.getView().byId("idInputDepartment").setValue("");
            this.getView().byId("idInputDivision").setValue("");
            this.getView().byId("idInputLocation").setValue("");
            this.getView().byId("idInputLegal").setValue("");
            this.getView().byId("idInputJob").setValue("");
            this.getView().byId("idInputEmployeeName").setValue("");
            this.getView().byId("idInput").setTokens([]);
            this.getView().byId("idDatePicker").setValue("");
        },

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


        // ajay
        getEmpDetailsEmail: function (userEmail, dataRecieved) {
            return new Promise((resolve, reject) => {
                let oDataModelSF = this.getOwnerComponent().getModel("v2");
                let oBusydailog = new sap.m.BusyDialog();
                oBusydailog.open();
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
                            // sap.ui.core.BusyIndicator.hide();
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
                                            oBusydailog.close();
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
                                            oBusydailog.close();
                                        }
                                    }

                                    console.log("email Admin:", response2);

                                },
                                error: (eRR) => {
                                    reject(eRR);
                                    oBusydailog.close();
                                    // console.log("Error  :", eRR);
                                    // sap.ui.core.BusyIndicator.hide();
                                }
                            });
                            console.log("email :", response1);
                        }


                    },
                    error: (eRR) => {
                        reject(eRR);
                        oBusydailog.close();
                        // console.log("Error  :", eRR);
                        //   sap.ui.core.BusyIndicator.hide();
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
                            // let tempID = Number(response1.results[0].userId);
                            let tempID = response1.results[0].userId;
                            let oFilter4 = new Filter("person", sap.ui.model.FilterOperator.EQ, tempID);
                            // let oFilter5 = new Filter("externalCode", sap.ui.model.FilterOperator.EQ, "Z001");
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
                                success: (response2) => {
                                    const filteredEmployees = response2.results.filter(employee => employee.department !== null);
                                    if (filteredEmployees) {
                                        const model = new sap.ui.model.json.JSONModel();
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
        onMultiInputValueHelpRequest: function (oEvent) {
            this.openDialog("Department Select", "taqa.taqatimesheetmonthreport.view.department")
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
        getLeaveBal: async function (empList) {
            let oDataModelSF = this.getOwnerComponent().getModel("v2");
            const BATCH_SIZE = 150;

            // Function to create and send a batch request for a given chunk of employees
            const sendBatchRequest = (chunk) => {
                return new Promise((resolve, reject) => {
                    let sBatchGroupId = "myBatchGroup";
                    oDataModelSF.setDeferredGroups([sBatchGroupId]);

                    chunk.forEach((oItem) => {
                        // if (oItem.EmployeeIs === "Rotational") {
                        let oFilter1 = new Filter("userId", sap.ui.model.FilterOperator.EQ, oItem);
                        let oFilter2 = new Filter("timeAccountType", sap.ui.model.FilterOperator.EQ, "ROT_TA_KSA");
                        oDataModelSF.read("/EmpTimeAccountBalance", {
                            groupId: sBatchGroupId,
                            filters: [oFilter1, oFilter2]
                        });
                        // }
                    });

                    oDataModelSF.submitChanges({
                        groupId: sBatchGroupId,
                        success: (oResponse) => resolve(oResponse),
                        error: (oError) => reject(oError)
                    });
                });
            };

            // Split the empList into chunks of BATCH_SIZE
            const chunks = [];
            for (let i = 0; i < empList.length; i += BATCH_SIZE) {
                chunks.push(empList.slice(i, i + BATCH_SIZE));
            }

            try {
                // Send all batch requests in parallel
                const batchResponses = await Promise.all(chunks.map(sendBatchRequest));

                let leaveBalLis = [];
                batchResponses.forEach((oResponse) => {
                    oResponse.__batchResponses.forEach((oItem) => {
                        if (oItem.data.results.length > 0) {
                            // if (oItem.data.results.length === 0) {
                            //     leaveBalLis.push("");
                            // } else {
                            // leaveBalLis[oItem.data.results[0].userId] = oItem.data.results[0].balance;
                            leaveBalLis.push(oItem.data.results[0]);
                        }
                    });
                });

                return leaveBalLis;
                // let oModel = this.getView().getModel("testModel");
                // let mainData = oModel.getData();

                // const updatedMainData = mainData.map(item => ({
                //     ...item,
                //     RoLeaveBal: leaveBalLis[item.EmployeeID] || ""
                // }));

                // let oModel11 = new JSONModel(updatedMainData);
                // this.getView().setModel(oModel11, "testModel");

            } catch (error) {
                console.log("Batch request failed Leave Balance. Error: ", error);
            }
        },
    });
});

