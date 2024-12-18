sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/export/Spreadsheet',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
    "sap/m/MessageBox",
    "sap/m/IllustratedMessage",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/format/DateFormat",
    "sap/m/PDFViewer",
    "./libs/jspdf.umd.min",
    "./libs/html2canvas.min",
    "./libs/purify.min",
    "./libs/html2pdf.bundle.min",
    "./formatter",
    "sap/m/BusyDialog",
    "sap/m/Input",
    "sap/m/MultiInput",
    "sap/m/DateRangeSelection",
    "sap/m/Dialog",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/m/ProgressIndicator",
    "sap/m/Button"
], function (Controller,
    JSONModel,
    Spreadsheet,
    Filter,
    FilterOperator,
    Token,
    MessageBox,
    IllustratedMessage,
    BusyIndicator,
    DateFormat,
    PDFViewer,
    JspdfUmdmin,
    HtmlcanvasMin,
    PurifyMin,
    HtmlpdfBundlemin,
    formatter,
    BusyDialog,
    Input,
    MultiInput,
    DateRangeSelection,
    Dialog,
    VBox,
    Text,
    ProgressIndicator,
    Button) {
    "use strict";
    return Controller.extend("taqa.taqatimesheetblankdaysreport.controller.View1", {
        formatter: formatter,
        onInit: async function () {
            if (sap.ushell.Container) {
                let user = sap.ushell.Container.getService("UserInfo").getUser();
                this.vUserName = user.getFullName();
                this.userEmail = user.getEmail();
                if (this.userEmail !== undefined) {
                    let userD = await this.getEmpDetailsEmail(this.userEmail);
                    if (userD.admin === "yes") {
                        let fnValidator = function (args) {
                            let text = args.text;
                            return new Token({ key: text, text: text });
                        };
                        let oMultiInput2 = this.getView().byId("idEmployeeIDInput");
                        oMultiInput2.addValidator(fnValidator);
                        let oMultiInput3 = this.getView().byId("TravelCategoryInput");
                        oMultiInput3.addValidator(fnValidator);
                        /*  // let oMultiInput4 = this.getView().byId("DivisionInput");
                         // oMultiInput4.addValidator(fnValidator); */
                        let oMultiInput5 = this.getView().byId("CompanyCodeInput");
                        oMultiInput5.addValidator(fnValidator);
                        let oMultiInput6 = this.getView().byId("LocationInput");
                        oMultiInput6.addValidator(fnValidator);
                        let oMultiInput7 = this.getView().byId("idDepartmentIDInput");
                        oMultiInput7.addValidator(fnValidator);
                        let oMultiInput8 = this.getView().byId("idLocationIDInput");
                        oMultiInput8.addValidator(fnValidator);
                        let oMultiInput9 = this.getView().byId("StatusInput");
                        oMultiInput9.addValidator(fnValidator);
                        /*   // let oMultiInput9 = this.getView().byId("StatusInput");
                          // oMultiInput9.addValidator(fnValidator); */

                        let today = new Date();
                        let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                        let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                        console.log(startDate);

                        console.log(endDate);
                        let oDatePicker = this.getView().byId("idDatePicker");
                        oDatePicker.setDateValue(startDate);
                        oDatePicker.setSecondDateValue(endDate);

                        let travelCategoryModel = new sap.ui.model.json.JSONModel({
                            TravelCategories: [
                                { name: "Annual Leave", id: "AL" },
                                { name: "Business Travel", id: "BU" },
                                { name: "Job Travel", id: "JT" },
                                { name: "Joining Travel", id: "JN" },
                                { name: "Miscellaneous Travel", id: "MS" },
                                { name: "Rotation", id: "RL" },
                                { name: "Separation Travel", id: "SP" },
                                { name: "Training", id: "TR" }
                            ]
                        });
                        this.getView().setModel(travelCategoryModel, "travelCategoryModel");

                        let statusModel = new sap.ui.model.json.JSONModel({
                            Statuses: [
                                { name: "LPO processed by Focal Person", id: "LPO-PFP" },
                                { name: "Reissued", id: "RI" }
                            ]
                        });
                        this.getView().setModel(statusModel, "statusModel");
                        this.onSearch();
                        this._pdfViewer = new PDFViewer({
                            isTrustedSource: true
                        });
                    } else {
                        this.showErrorMessage("Access Denied", "You need permission to access this page. Request access from your administrator.");
                        console.log("Error1");
                    }
                } else {
                    this.showErrorMessage("User Email Missing", "Unable to access your email. Please log in again or contact support.");
                    console.log("Error2");
                }
            } else {
                this.showErrorMessage("Access Denied", "You need permission to access this page. Request access from your administrator.");
                console.log("Error3");
            }
        },
        showErrorMessage: function (title, description) {
            let oPage = this.getView().byId("page");
            oPage.removeAllContent();
            let oIllustratedMessage = new IllustratedMessage({
                illustrationType: "sapIllus-ErrorScreen",
                title: title,
                description: description
            });
            oPage.addContent(oIllustratedMessage);
        },
        showErrorMessage1: function (title, description) {
            let oPage = this.getView().byId("page");
            oPage.removeAllContent();
            let oIllustratedMessage = new IllustratedMessage({
                illustrationType: "sapIllus-NoData",
                title: title,
                description: description
            });
            oPage.addContent(oIllustratedMessage);
        },
        getEmailletiations: function (email) {
            let emailParts = email.split("@");
            let localPart = emailParts[0]; // Part before '@'
            let domainPart = emailParts[1]; // Part after '@'
            let domainUpperCase = domainPart.toUpperCase(); // All caps
            let domainLowerCase = domainPart.toLowerCase(); // All lowercase
            let emailUpperCase = localPart + "@" + domainUpperCase;
            let emailLowerCase = localPart + "@" + domainLowerCase;
            return [emailUpperCase, emailLowerCase];
        },
        getEmpDetailsEmail: function (userEmail) {
            return new Promise((resolve, reject) => {
                let oDataModelSF = this.getOwnerComponent().getModel("v2");
                let that = this;
                let oBusydailog = new BusyDialog();
                oBusydailog.open();
                let combiMail = this.getEmailletiations(userEmail);
                console.log("Emails: ", combiMail);
                let oFilter1 = new Filter("userNav/email", FilterOperator.EQ, combiMail[0]);
                let oFilter2 = new Filter("userNav/email", FilterOperator.EQ, combiMail[1]);
                oDataModelSF.read("/EmpJob", {
                    filters: [oFilter1, oFilter2],
                    urlParameters: {
                        $expand: "userNav"
                    },
                    success: (response1) => {
                        if (response1.results.length !== 0) {
                            that.tempID = response1.results[0].userId;
                            let oFilter4 = new Filter("person", FilterOperator.EQ, that.tempID);
                            let oFilter6 = new Filter("externalCode", FilterOperator.EQ, "FocalPerson_Travel");
                            oDataModelSF.read("/FODynamicRole", {
                                filters: [oFilter4, oFilter6],
                                urlParameters: {
                                    $expand: "departmentNav,locationNav,divisionNav,companyNav"
                                },
                                success: async (response2) => {
                                    let filterData = {
                                        "emp": [],
                                        "location": [],
                                        "company": [],
                                        "division": []
                                    };
                                    let oResultsData = response2.results;
                                    const model = new JSONModel();
                                    let uniqueDepartment = this.removeDuplicates(oResultsData, 'department');
                                    filterData.emp = uniqueDepartment.filter(record => record.department !== null);
                                    uniqueDepartment = this.removeDuplicates(oResultsData, 'location');
                                    filterData.location = uniqueDepartment.filter(record => record.location !== null);
                                    uniqueDepartment = this.removeDuplicates(oResultsData, 'company');
                                    filterData.company = uniqueDepartment.filter(record => record.company !== null);
                                    uniqueDepartment = this.removeDuplicates(oResultsData, 'division');
                                    filterData.division = uniqueDepartment.filter(record => record.division !== null);
                                    model.setData(filterData);
                                    this.getView().setModel(model, 'tableModel');
                                    console.log("tableModel data:", model.getData());
                                    try {
                                        const role = oResultsData[0].externalCode;
                                        resolve({
                                            "admin": oResultsData.length > 0 ? "yes" : "no",
                                            "userId": response1.results[0].userId,
                                            "empDetails": response1.results,
                                            "role": role
                                        });
                                    } catch (error) {
                                        this.showErrorMessage("Role information is not maintained.", "Dynamic Role is not maintained for you. Contact your Administrator.");
                                        resolve({
                                            "admin": "no",
                                            "userId": response1.results[0].userId,
                                            "empDetails": response1.results,
                                            "role": null
                                        });
                                    }
                                    console.log("Unique Departments:", filterData.emp);
                                    console.log("Unique Locations:", filterData.location);
                                    console.log("Unique Companies:", filterData.company);
                                    console.log("Unique Divisions:", filterData.division);
                                    if (filterData.emp.length === 0) {
                                        await this.onFetchBusinessUnits(filterData.company);
                                    }
                                    oBusydailog.close();
                                },
                                error: (eRR) => {
                                    reject(new Error(eRR));
                                    oBusydailog.close();
                                }
                            });
                        } else {
                            resolve({
                                "admin": "no"
                            });
                        }
                        oBusydailog.close();
                    },
                    error: (error) => {
                        reject(new Error(error));
                        oBusydailog.close();
                    },
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

        onFetchBusinessUnits: async function (company) {
            let oFilters = [];
            company.forEach(element => {
                oFilters.push(new Filter("cust_toLegalEntity/externalCode", FilterOperator.EQ, element.company));
            });

            await this.getBusinessUnits(oFilters).then(businessUnits => {
                console.log("Business Units fetched successfully:", businessUnits);

                this.getDepartmentsForBusinessUnits(businessUnits);
            }).catch(error => {
                console.error("Failed to fetch business units:", error);
            });
        },
        getBusinessUnits: async function (externalCode) {
            return new Promise(async (resolve, reject) => {
                let oDataModelSF = this.getOwnerComponent().getModel("v2");

                // Create a BusyDialog for loading indication
                let oBusydailog = new BusyDialog();
                oBusydailog.open();

                // let oFilter = new Filter("cust_toLegalEntity/externalCode", FilterOperator.EQ, externalCode);

                // Read FO Business Unit data with applied filter
                await oDataModelSF.read("/FOBusinessUnit", {
                    filters: [externalCode],
                    urlParameters: {
                        $format: "json"
                    },
                    success: (response) => {
                        oBusydailog.close();

                        // Map the external codes, sort them in ascending order, and put them into an array
                        let externalCodesArray = response.results
                            .map(item => item.externalCode)
                            .sort((a, b) => a.localeCompare(b));

                        console.log("Sorted External Codes: ", externalCodesArray);
                        resolve(externalCodesArray); // Return sorted business unit codes
                    },
                    error: (error) => {
                        oBusydailog.close();
                        console.error("Error fetching business units:", error);
                        reject(error);
                    }
                });
            });
        },
        getDepartmentsForBusinessUnits: async function (businessUnits) {
            let oDataModelSF = this.getOwnerComponent().getModel("v2");
            let departmentData = []; // Initialize the array to hold department data
            let final_structure = []; // Initialize the final structure array

            // Iterate through each business unit external code
            businessUnits.forEach(async (businessUnitCode, index) => {
                // Create a BusyDialog for loading indication
                let oBusydailog = new BusyDialog();
                oBusydailog.open();

                // Define the filter to get the department details for the current business unit
                let oFilter = new Filter("cust_toBusinessUnit/externalCode", FilterOperator.EQ, businessUnitCode);

                // Read FODepartment data with applied filter
                await oDataModelSF.read("/FODepartment", {
                    filters: [oFilter],
                    urlParameters: {
                        $format: "json",
                        $expand: "cust_toBusinessUnit"
                    },
                    success: (response) => {
                        oBusydailog.close();

                        // Process the department data and create the structure in the required format
                        response.results.forEach(department => {
                            final_structure.push({
                                department: department.externalCode,
                                departmentNav: {
                                    results: [
                                        {
                                            name: department.name
                                        }
                                    ]
                                }
                            });
                        });

                        // After processing all business units, set the data in the model and bind it to the table
                        if (index === businessUnits.length - 1) {  // Check if it's the last iteration
                            // Log the final_structure to the console
                            console.log("Final Structure: ", final_structure);

                            this.getView().getModel("tableModel").getData().emp = final_structure;
                        }
                    },
                    error: (error) => {
                        oBusydailog.close();
                        console.error("Error fetching departments:", error);
                    }
                });
            });
        },

        onSearch: function () {
            let oDateRang = this.getView().byId("idDatePicker").getDateValue();
            if (oDateRang !== null) {
                let oSummaryModel = new JSONModel();
                let oModelDetail = this.getOwnerComponent().getModel();
                let oBusydailog = new BusyDialog();
                let that = this;
                oBusydailog.open();
                let oFilterBar = this.getView().byId("filterbar");
                let aTableFilters = oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    let oControl = oFilterGroupItem.getControl();
                    let sFilterName = oFilterGroupItem.getName();
                    let aFilters = [];
                    if (oControl instanceof Input) {
                        let sInputValue = oControl.getValue();
                        if (sInputValue) {
                            aFilters.push(new Filter({
                                path: sFilterName,
                                operator: FilterOperator.Contains,
                                value1: sInputValue,
                                caseSensitive: false
                            }));
                        }
                    }
                    if (oControl instanceof MultiInput) {
                        let aTokens = oControl.getTokens();
                        if (aTokens.length > 0) {
                            if (sFilterName === "EmployeeID") {
                                aTokens.forEach(function (oToken) {
                                    let sTokenValue = oToken.getText();
                                    if (sTokenValue) {
                                        if (sTokenValue.substring(0, 3) === "EXT") {
                                            aFilters.push(new Filter({
                                                path: "EXTCode",
                                                operator: FilterOperator.EQ,
                                                value1: sTokenValue
                                            }));
                                        } else {
                                            aFilters.push(new Filter({
                                                path: "EmployeeID",
                                                operator: FilterOperator.EQ,
                                                value1: sTokenValue
                                            }));
                                        }
                                    }
                                });
                            } else if (sFilterName === 'TravelCategory') {
                                aTokens.forEach(function (oToken) {
                                    let sTokenValue = oToken.getText();
                                    if (sTokenValue) {
                                        aFilters.push(new Filter({
                                            path: sFilterName,
                                            operator: FilterOperator.EQ,
                                            value1: that.formatter.getTCCode(sTokenValue)
                                        }));
                                        aFilters.push(new Filter({
                                            path: 'TravelCategoryTQ',
                                            operator: FilterOperator.EQ,
                                            value1: that.formatter.getTCCode(sTokenValue)
                                        }));
                                    }
                                });
                            } else {
                                aTokens.forEach(function (oToken) {
                                    let sTokenValue = oToken.getText();
                                    if (sTokenValue) {
                                        aFilters.push(new Filter({
                                            path: sFilterName,
                                            operator: FilterOperator.EQ,
                                            value1: sTokenValue
                                        }));
                                    }
                                });
                            }
                        }
                    }
                    if (oControl instanceof DateRangeSelection) {
                        let vS = that._convert_Date(oControl.getFrom());
                        let vE = that._convert_Date(oControl.getTo());
                        if (vS && vE) {
                            aFilters.push(new Filter({
                                path: sFilterName,
                                operator: FilterOperator.BT,
                                value1: vS + 'T00:00:00',
                                value2: vE + 'T23:59:59'
                            }));
                        }
                    }
                    if (aFilters.length > 0) {
                        aResult.push(new Filter({
                            filters: aFilters,
                            and: false
                        }));
                    }
                    return aResult;
                }, []);

                let oTokensDep = that.getView().byId("idDepartmentIDInput").getTokens().length;
                let oTableModel = that.getView().getModel("tableModel").getData().emp;
                if (oTokensDep === 0 && oTableModel.length > 0) {
                    oTableModel.forEach(element => {
                        aTableFilters.push(new Filter({
                            path: "Department",
                            operator: FilterOperator.Contains,
                            value1: element.departmentNav.results[0].name,
                        }));
                    });
                };
                let oTokensCompany = that.getView().byId("CompanyCodeInput").getTokens().length;
                let oTableModelCompany = that.getView().getModel("tableModel").getData().company;
                if (oTokensCompany === 0) {
                    oTableModelCompany.forEach(element => {
                        aTableFilters.push(new Filter({
                            path: "CompanyCode",
                            operator: FilterOperator.EQ,
                            value1: element.company
                        }));
                    });
                };

                let oTokenLocation = that.getView().byId("idLocationIDInput").getTokens().length;
                let oTableModelLocation = that.getView().getModel("tableModel").getData().location;
                if (oTokenLocation === 0 && oTableModelLocation.length > 0) {
                    oTableModelLocation.forEach(element => {
                        aTableFilters.push(new Filter({
                            path: "Location",
                            operator: FilterOperator.EQ,
                            value1: element.locationNav.results[0].name,
                        }));
                    });
                }


                // let oTokensLoc = that.getView().byId("LocationInput").getTokens().length;
                // let oTableModel = that.getView().getModel("tableModel").getData().location;
                // if (oTokensLoc === 0) {
                //     if (oTableModel.length > 0) {
                //         oTableModel.forEach(element => {
                //             aTableFilters.push(new Filter({
                //                 path: "LocationGroup",
                //                 operator: FilterOperator.Contains,
                //                 value1: element.locationNav.results[0].locationGroup,
                //                 caseSensitive: false
                //             }));
                //         });
                //     } else {
                //         this.showErrorMessage1("Action Required", "Please ensure that Location and Location Group have been allocated to you. If not, please contact your Administrator.");
                //         oBusydailog.close();
                //         return;
                //     }
                // }


                aTableFilters.push(new Filter({
                    filters: [
                        new Filter({
                            path: 'Status',
                            operator: FilterOperator.EQ,
                            value1: 'LPO processed by Focal Person',
                            caseSensitive: false
                        }),
                        new Filter({
                            path: 'Status',
                            operator: FilterOperator.EQ,
                            value1: 'Reissued',
                            caseSensitive: false
                        })
                    ],
                    and: false
                }));
                oBusydailog.open();
                oModelDetail.read("/TravelDetails", {
                    filters: aTableFilters,
                    urlParameters: {
                        "$expand": "ItsFamilyDetails,ItsTicketDetails"
                    },
                    success: function (oData, oResponse) {
                        if (oData.results.length === 0) {
                            MessageBox.information("Sorry, we couldn't find any data for the given dates.");
                            oSummaryModel.setData(oData);
                            that.getView().setModel(oSummaryModel, "oHeaderModel");
                            console.log("Data retrieved:", oData);
                            that.onCalculateData();
                            oBusydailog.close();
                        } else {
                            oSummaryModel.setData(oData);
                            that.getView().setModel(oSummaryModel, "oHeaderModel");
                            console.log("Data retrieved:", oData);
                            that.onCalculateData();
                        }
                        oBusydailog.close();
                    },
                    error: function (oError) {
                        BusyIndicator.hide();
                        console.error("Error retrieving data:", oError);
                        oBusydailog.close();
                    },
                    async: false
                });
            } else {
                MessageBox.error("Date is mandatory! Please enter a valid date.");
            }
        },
        onCalculateData: function () {

            let oHeaderModel = this.getView().getModel("oHeaderModel");
            let aTravelDetails = oHeaderModel.getData().results;
            let oProcessedData = [];
            aTravelDetails.forEach((travel) => {
                let employeeID = travel.EmployeeID ? travel.EmployeeID : travel.EXTCode;
                // let travelWithFamily = travel.ItsFamilyDetails.results.length > 0 ? 'Yes' : 'No';

                travel.ItsTicketDetails.results.forEach((ticket) => {
                    let travelData = {
                        EmployeeID: employeeID,
                        EmployeeName: travel.EmployeeName,
                        TrfNumber: travel.TrfNumber,
                        ReferenceNumber: travel.ReferenceNumber,
                        EXTCode: travel.EXTCode,
                        CompanyCode: travel.CompanyCode,
                        CompanyName: travel.CompanyName,
                        Designation: travel.Designation,
                        Function: travel.Function,
                        Department: travel.Department,
                        Division: travel.Division,
                        Location: travel.Location,
                        LocationGroup: travel.LocationGroup,
                        ProjectCode: travel.ProjectCode,
                        ExpenseCode: travel.ExpenseCode,
                        TravelCategory: travel.TravelCategory,
                        TravelCategoryTQ: travel.TravelCategoryTQ,
                        BookingType: travel.BookingType,
                        CreationDate: travel.CreationDate,
                        createdAt: travel.createdAt,
                        DepartureDate: travel.DepartureDate,
                        ReturnDate: travel.ReturnDate,
                        FocalPersonName: travel.FocalPersonName,
                        Class: travel.Class,
                        TypeofTravel: travel.TypeofTravel,
                        AgentCode: travel.AgentCode,
                        AgentDescription: travel.AgentDescription,
                        TravelAgentName: travel.TravelAgentName,
                        TravelwithFamily: travel.TravelwithFamily,
                        MobileNo: travel.MobileNo,
                        Remarks: travel.Remarks,
                        FileName: travel.FileName,
                        Attachment: travel.Attachment,
                        DateOfBirth: travel.DateOfBirth,
                        PurposeofTravel: travel.PurposeofTravel,
                        DepartureSector: travel.DepartureSector,
                        DepartureTime: travel.DepartureTime,
                        ReturnSector: travel.ReturnSector,
                        ReturnTime: travel.ReturnTime,
                        FrequentFlyerNo: travel.FrequentFlyerNo,
                        HomeCountry: travel.HomeCountry,
                        VisaRequirement: travel.VisaRequirement,
                        Status: travel.Status,
                        Airline: ticket.Airline,
                        BaseAmount: ticket.BaseAmount,
                        TaxAmount: ticket.TaxAmount,
                        Gst: ticket.Gst,
                        Amount: ticket.Amount,
                        Currency: ticket.Currency,
                        SectorTicket: ticket.SectorTicket,
                        TicketNumber: ticket.TicketNumber,
                        Sector: ticket.Sector
                    };
                    oProcessedData.push(travelData);
                });
            });
            oProcessedData.sort((a, b) => {
                if (a.TrfNumber !== b.TrfNumber) {
                    return a.TrfNumber.localeCompare(b.TrfNumber);
                }
                if (!a.ReferenceNumber) return -1;
                if (!b.ReferenceNumber) return 1;
                return a.ReferenceNumber.localeCompare(b.ReferenceNumber);
            });
            let oNewModel = new JSONModel({ results: oProcessedData });
            this.getView().setModel(oNewModel, "oProcessedModel");
            console.log("Calculated data: ", oNewModel.getData());
            let totalSum = oProcessedData.length;
            let oTableTitle = this.getView().byId("idTitle");
            oTableTitle.setText(`Employee Travel Report (${totalSum})`);
            console.log(`Total entries: ${totalSum}`);
            /////////////////////////////FOR VALUEHELP DATA BELOW////////////////////////////////////
            const aResults = oNewModel.getProperty("/results");
            const uniqueDepartments = {};
            const uniqueArray = [];
            aResults.forEach(function (item) {
                const departmentTitle = item.Department;
                if (!uniqueDepartments[departmentTitle]) {
                    uniqueDepartments[departmentTitle] = true;
                    uniqueArray.push(item);
                }
            });
            let oUniqueDepartmentModel = new JSONModel({ results: uniqueArray });
            this.getView().setModel(oUniqueDepartmentModel, "uniqueDepartmentModel");
            const uniqueLocations = {};
            const uniqueLocationArray = [];
            aResults.forEach(function (item) {
                const locationTitle = item.Location;
                if (!uniqueLocations[locationTitle]) {
                    uniqueLocations[locationTitle] = true;
                    uniqueLocationArray.push(item);
                }
            });
            let oUniqueLocationModel = new JSONModel({ results: uniqueLocationArray });
            this.getView().setModel(oUniqueLocationModel, "uniqueLocationModel");
        },
        //////////////////////////////////////////////VALUE HELP FOR TRAVEL CATEGORY///////////////////////////////////////////////////////////////
        onMultiInputValueHelpRequest_TravelCategory: async function (oEvent) {
            this.openDialog("Choose your Travel Category", "com.taqa.travelreports.ztravelreports.fragments.valueHelps.traveltype");
        },
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
            oDialog.then((pDialog) => {
                pDialog.setTitle(name);
                this.setSelectedItems(pDialog);
                pDialog.open();
            });
        },
        setSelectedItems: function (pDialog) {
            let oMultiInput = this.byId("TravelCategoryInput");
            let aSelectedTokens = oMultiInput.getTokens().map(token => token.getKey());
            let aItems = pDialog.getItems();
            aItems.forEach((oItem) => {
                if (aSelectedTokens.includes(oItem.getTitle())) {
                    oItem.setSelected(true);
                }
            });
        },
        onFOTravelTypeDialogSearch: function (oEvent) {
            let sValue = oEvent.getParameter("value");
            let oFilter = new Filter({
                path: "name",
                operator: FilterOperator.Contains,
                value1: sValue,
                caseSensitive: false
            });
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        onFOTravelTypeDialogConfirm: function (oEvent) {
            let aSelectedItems = oEvent.getParameter("selectedItems");
            let oMultiInput = this.byId("TravelCategoryInput");
            let aExistingTokens = oMultiInput.getTokens().map(function (oToken) {
                return oToken.getKey();
            });
            let aNewSelectedKeys = aSelectedItems.map(function (oItem) {
                return oItem.getTitle();
            });
            aExistingTokens.forEach(function (sKey) {
                if (!aNewSelectedKeys.includes(sKey)) {
                    oMultiInput.getTokens().forEach(function (oToken) {
                        if (oToken.getKey() === sKey) {
                            oMultiInput.removeToken(oToken);
                        }
                    });
                }
            });
            aSelectedItems.forEach(function (oItem) {
                let sTravelTypeID = oItem.getTitle();

                if (!aExistingTokens.includes(sTravelTypeID)) {
                    oMultiInput.addToken(new Token({
                        key: sTravelTypeID,
                        text: sTravelTypeID
                    }));
                }
            });
        },
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////VALUEHELP FOR STATUS /////////////////////////////////////////////////////////////
        onMultiInputValueHelpRequest_Status: async function (oEvent) {
            this.openDialog1("Choose your StatusCategory", "com.taqa.travelreports.ztravelreports.fragments.valueHelps.status");
        },
        onFOStatusDialogSearch: function (oEvent) {
            let sValue = oEvent.getParameter("value");
            let oFilter = new Filter({
                path: "name",
                operator: FilterOperator.Contains,
                value1: sValue,
                caseSensitive: false
            });
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        onFOStatusDialogConfirm: function (oEvent) {
            let aSelectedItems = oEvent.getParameter("selectedItems");
            let oMultiInput = this.byId("StatusInput");
            let aExistingTokens = oMultiInput.getTokens().map(function (oToken) {
                return oToken.getKey();
            });
            let aNewSelectedKeys = aSelectedItems.map(function (oItem) {
                return oItem.getTitle();
            });
            aExistingTokens.forEach(function (sKey) {
                if (!aNewSelectedKeys.includes(sKey)) {
                    oMultiInput.getTokens().forEach(function (oToken) {
                        if (oToken.getKey() === sKey) {
                            oMultiInput.removeToken(oToken);
                        }
                    });
                }
            });
            aSelectedItems.forEach(function (oItem) {
                let sStatusID = oItem.getTitle();

                if (!aExistingTokens.includes(sStatusID)) {
                    oMultiInput.addToken(new Token({
                        key: sStatusID,
                        text: sStatusID
                    }));
                }
            });
        },
        setSelectedItemsStatus: function (pDialog) {
            let oMultiInput = this.byId("StatusInput");
            let aSelectedTokens = oMultiInput.getTokens().map(token => token.getKey());
            let aItems = pDialog.getItems();
            aItems.forEach((oItem) => {
                if (aSelectedTokens.includes(oItem.getTitle())) {
                    oItem.setSelected(true);
                }
            });
        },
        openDialog1: function (name, path) {
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
            oDialog.then((pDialog) => {
                pDialog.setTitle(name);
                this.setSelectedItemsStatus(pDialog);
                pDialog.open();
            });
        },
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////VALUEHELP FOR DEPARTMENT NEW//////////////////////////////////////////////
        openDialog3: function (name, path) {
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
                pDialog.setTitle(name);
                pDialog.open();
            });
        },
        onMultiInputValueHelpRequest_department: async function (oEvent) {
            this.openDialog3("Department Select", "com.taqa.travelreports.ztravelreports.fragments.valueHelps.department");
        },
        onFODepartmentDialogSearch: function (oEvent) {
            let sValue = oEvent.getParameter("value");
            let oFilter = new Filter({
                path: "Department",
                operator: FilterOperator.Contains,
                value1: sValue,
                caseSensitive: false
            });
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        onFODepartmentDialogConfirm: function (oEvent) {
            let aSelectedItems = oEvent.getParameter("selectedItems");
            let oMultiInput = this.byId("idDepartmentIDInput");
            if (aSelectedItems) {
                aSelectedItems.forEach(function (oItem) {
                    let sDepartment = oItem.getTitle();
                    oMultiInput.addToken(new Token({
                        key: sDepartment,
                        text: sDepartment
                    }));
                });
            }
        },
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////VALUEHELP FOR LOCATION NEW//////////////////////////////////////
        openDialog4: function (name, path) {
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
                pDialog.setTitle(name);
                pDialog.open();
            });
        },
        onMultiInputValueHelpRequest_location: async function (oEvent) {
            this.openDialog4("Location Select", "com.taqa.travelreports.ztravelreports.fragments.valueHelps.locationnew");
        },
        onFOLocationDialogSearch: function (oEvent) {
            this.TableSelectDialogSearch(oEvent, 'locationNav/results/0/name');
        },
        onFOLocationDialogConfirm: function (oEvent) {
            let oMultiInput = this.byId("idLocationIDInput");
            let aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts) {
                aContexts.forEach(oContexts => {
                    oMultiInput.addToken(new Token({
                        text: oContexts.getObject().locationNav.results[0].name
                    }));
                });
            }
        },
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////
        _convert_Date: function (value) {
            let date = new Date(value);
            let year = date.getFullYear();
            let month = (date.getMonth() + 1).toString().padStart(2, '0');
            let day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        formatTrfNumber: function (sTrfNumber) {
            if (sTrfNumber === "TOTAL") {
                return "<strong>Total Count</strong>";
            }
            return `<span>${sTrfNumber}</span>`;
        },
        formatEmployeeID: function (sTrfNumber, sEmployeeID) {
            if (sTrfNumber === "TOTAL") {
                return `<strong>${sEmployeeID}</strong>`;
            }
            return `<span>${sEmployeeID}</span>`;
        },
        onFilterBarClear: function () {
            let oFilterBar = this.getView().byId("filterbar");
            let aFilterGroupItems = oFilterBar.getFilterGroupItems();
            aFilterGroupItems.forEach(function (oFilterGroupItem) {
                let oControl = oFilterGroupItem.getControl();
                if (oControl instanceof MultiInput) {
                    oControl.removeAllTokens();
                } else if (oControl instanceof Input) {
                    oControl.setValue("");
                }
            });
        },
        onExcelButtonPress: function (oEvent) {
            let oModel = this.getView().getModel("oProcessedModel");
            let oData = oModel.getProperty("/results");
            if (oData && oData.length > 0) {
                let selectedData = oData.map(function (item) {
                    let companyname = formatter.CompanyNameFormatter(item.CompanyCode);
                    let location = formatter.CompanyLocationFormatter(item.CompanyCode);
                    let travelCategory1 = formatter.getTCLabel(item.TravelCategoryTQ);
                    let travelCategory2 = formatter.getTCLabel(item.TravelCategory);
                    let createdAt = formatter.formatDateforcreationdatealone(item.createdAt);
                    let typeOfTravel = this.getTypeofTravel(item.TypeofTravel);
                    let travelStartDate = formatter.formatDateStandard(item.DepartureDate);
                    let returnDate = formatter.formatDateStandard(item.ReturnDate);
                    let travelClass = this.getClass(item.Class);
                    let travelCategory = travelCategory1 || travelCategory2 || travelCategory1;
                    let TravelwithFamily = formatter.fromatterfortravelwithfamily(item.TravelwithFamily);
                    return {
                        "TRF Number": item.TrfNumber,
                        "Reissuance Number": item.ReferenceNumber || "",
                        "Employee ID": item.EmployeeID,
                        "Status": item.Status,
                        "Employee Name": item.EmployeeName,
                        "Company Code": item.CompanyCode,
                        "Company Name": companyname,
                        "Designation": item.Designation,
                        "Function": item.Function,
                        "Department": item.Department,
                        "Division": item.Division,
                        "Location": location,
                        "Location Group": item.LocationGroup,
                        "Expense Code": item.ExpenseCode,
                        "Code": item.ProjectCode,
                        "Travel Category": travelCategory,
                        "Created At": createdAt,
                        "Type of Travel": typeOfTravel,
                        "Travel Start Date": travelStartDate,
                        "Return Date": returnDate,
                        "Travel with Family": TravelwithFamily,
                        "Travel Focal Person": item.FocalPersonName,
                        "Class": travelClass,
                        "Travel Team Name": item.AgentDescription,
                        "Travel Agent Name": item.TravelAgentName,
                        "Contact Number": item.MobileNo,
                        "Sector Ticket": item.SectorTicket,
                        "Airlines": item.Airline,
                        "Ticket Number": item.TicketNumber,
                        "Base Amount": item.BaseAmount,
                        "Tax Amount": item.TaxAmount,
                        "GST": item.Gst,
                        "Total Amount": item.Amount,
                        "Currency": item.Currency,
                        "Comments": item.Sector || "",
                    };
                }.bind(this));
                let ColumnsLabels = [
                    { label: "TRF Number", property: "TRF Number" },
                    { label: "Reissuance Number", property: "Reissuance Number" },
                    { label: "Employee ID", property: "Employee ID" },
                    { label: "Status", property: "Status" },
                    { label: "Employee Name", property: "Employee Name" },
                    { label: "Company Code", property: "Company Code" },
                    { label: "Company Name", property: "Company Name" },
                    { label: "Designation", property: "Designation" },
                    { label: "Function", property: "Function" },
                    { label: "Department", property: "Department" },
                    { label: "Division", property: "Division" },
                    { label: "Location", property: "Location" },
                    { label: "Location Group", property: "Location Group" },
                    { label: "Expense Code", property: "Expense Code" },
                    { label: "Code", property: "Code" },
                    { label: "Travel Category", property: "Travel Category" },
                    { label: "Created At", property: "Created At" },
                    { label: "Type of Travel", property: "Type of Travel" },
                    { label: "Travel Start Date", property: "Travel Start Date" },
                    { label: "Return Date", property: "Return Date" },
                    { label: "Travel with Family", property: "Travel with Family" },
                    { label: "Class", property: "Class" },
                    { label: "Local Mobile Number", property: "Contact Number" },
                    { label: "Travel Focal Person", property: "Travel Focal Person" },
                    { label: "Travel Team Name", property: "Travel Team Name" },
                    { label: "Travel Agent Name", property: "Travel Agent Name" },
                    { label: "Sector Ticket", property: "Sector Ticket" },
                    { label: "Airlines", property: "Airlines" },
                    { label: "Ticket Number", property: "Ticket Number" },
                    { label: "Base Amount", property: "Base Amount" },
                    { label: "Tax Amount", property: "Tax Amount" },
                    { label: "GST", property: "GST" },
                    { label: "Total Amount", property: "Total Amount" },
                    { label: "Currency", property: "Currency" },
                    { label: "Comments", property: "Comments" }
                ];
                let oSettings = {
                    workbook: {
                        columns: ColumnsLabels,
                        context: {
                            sheetName: 'Employee Travel Data'
                        }
                    },
                    dataSource: selectedData,
                    fileName: 'Employee Travel Report.xlsx',
                    worker: false
                };
                let oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            } else {
                MessageBox.warning("No Data Found for download");
            }
        },

        getClass: function (value) {
            switch (value) {
                case 'FC':
                    return 'First Class'
                case 'BC':
                    return 'Business Class'
                case 'EC':
                    return 'Economy Class'
                default:
                    return value
            }
        },
        getTypeofTravel: function (value) {
            switch (value) {
                case '1':
                    return 'One Way Trip'
                case '2':
                    return 'Round Trip'
                default:
                    return value
            }
        },
        /////////////////////////////////////F4 VALUE HELP//////////////
        openDialog2: function (name, path) {
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
                pDialog.setTitle(name)
                pDialog.open();
            });
        },
        TableSelectDialogConfirm: function (oEvent, ID, path) {
            debugger;
            let oMultiInput = this.byId(ID);
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);
            let aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts) {
                aContexts.forEach(oContexts => {
                    // let oObject = oContexts.getObject();
                    oMultiInput.addToken(new Token({
                        text: oContexts.getObject()[path]
                    }));
                });
            }
        },
        ////////////////////////////////////////////COMPANYCODE////////////////////////////////
        onFOcompanyTableSelectDialogSearch: function (oEvent) {
            // this.TableSelectDialogSearch(oEvent);
            let sValue = oEvent.getParameter("value");
            let oFilter = new Filter({
                path: "companyNav/results/0/name",
                operator: FilterOperator.Contains,
                value1: sValue,
                caseSensitive: false
            });
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        onFOcompanyTableSelectDialogConfirm: function (oEvent) {
            this.TableSelectDialogConfirm(oEvent, "CompanyCodeInput", "company");
        },
        onMultiInputValueHelpRequestCompanyCode: function (oEvent) {
            this.openDialog2("Company Select", "com.taqa.travelreports.ztravelreports.fragments.valueHelps.company")
        },
        /////////////////////////////////////////////COMPANYCODE//////////////////////////////////////////
        ////////////////////////////////////////////DEPARTMENT////////////////////////////////
        onFODepartmentTableSelectDialogSearch: function (oEvent) {
            // this.TableSelectDialogSearch(oEvent);
            let sValue = oEvent.getParameter("value");
            let oFilter = new Filter({
                path: "departmentNav/results/0/name",
                operator: FilterOperator.Contains,
                value1: sValue,
                caseSensitive: false
            });
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        onFODepartmentTableSelectDialogConfirm: function (oEvent) {
            let oMultiInput = this.byId("idDepartmentIDInput");
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);
            let aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts) {
                aContexts.forEach(oContexts => {
                    oMultiInput.addToken(new Token({
                        text: oContexts.getObject().departmentNav.results[0].name
                    }));
                });
            }
        },
        onMultiInputValueHelpRequest: function (oEvent) {
            this.openDialog2("Department Select", "com.taqa.travelreports.ztravelreports.fragments.valueHelps.department")
        },
        ////////////////////////////////////////////DIVISON////////////////////////////////
        onMultiInputValueHelpRequestDivision: function (oEvent) {
            this.openDialog2("Division Select", "com.taqa.travelreports.ztravelreports.fragments.valueHelps.division")
        },
        onFODivisionTableSelectDialogSearch: function (oEvent) {
            this.TableSelectDialogSearch(oEvent, "divisionNav/results/0/name");
        },
        onFODivisionTableSelectDialogConfirm: function (oEvent) {
            let oMultiInput = this.byId("DivisionInput");
            let aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts) {
                aContexts.forEach(oContexts => {
                    oMultiInput.addToken(new Token({
                        text: oContexts.getObject().divisionNav.results[0].name
                    }));
                });
            }
        },
        onMultiInputValueHelpRequestLocation: function (oEvent) {
            this.openDialog2("Location Group Select", "com.taqa.travelreports.ztravelreports.fragments.valueHelps.location")
        },
        onFOLocationTableSelectDialogSearch: function (oEvent) {
            this.TableSelectDialogSearch(oEvent, 'locationNav/results/0/locationGroup');
        },
        onFOLocationTableSelectDialogConfirm: function (oEvent) {
            let oMultiInput = this.byId("LocationInput");
            let aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts) {
                aContexts.forEach(oContexts => {
                    oMultiInput.addToken(new Token({
                        text: oContexts.getObject().locationNav.results[0].locationGroup
                    }));
                });
            }
        },
        TableSelectDialogSearch: function (oEvent, path) {
            let sValue = oEvent.getParameter("value");
            let oFilter = new Filter({
                path: path,
                operator: FilterOperator.Contains,
                value1: sValue,
                caseSensitive: false
            });
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        onPDFDownload: function (oEvent) {
            let oSelectedItem = oEvent.getSource().getParent().getBindingContext("oProcessedModel").getObject();
            let that = this;
            if (!this._oDialog) {
                this._oDialog = new Dialog({
                    title: "Download PDF",
                    contentWidth: "500px",
                    contentHeight: "170px",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    content: [
                        new VBox({
                            alignItems: "Center",
                            justifyContent: "Center",
                            width: "100%",
                            height: "100%",
                            items: [
                                new Text({
                                    text: "Downloading Travel Request Form...",
                                    width: "420px"
                                }),
                                new Text({
                                    text: "",
                                    width: "420px",
                                    height: "10px"
                                }),
                                new ProgressIndicator({
                                    id: "progressIndicator",
                                    percentValue: 0,
                                    displayValue: "0%",
                                    width: "420px",
                                    height: "40px",
                                    state: "Success"
                                })
                            ]
                        })
                    ],
                    beginButton: new Button({
                        text: "Cancel",
                        press: function () {
                            that._oDialog.close();
                        }
                    })
                });
                this.getView().addDependent(this._oDialog);
            }
            this._oDialog.attachBeforeOpen(function () {
                sap.ui.getCore().byId("progressIndicator").setPercentValue(0).setDisplayValue("0%");
            });
            this._oDialog.open();
            let appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            let appPath = appId.replaceAll(".", "/");
            let appModulePath = jQuery.sap.getModulePath(appPath);
            let form = new FormData();
            let filename = oSelectedItem.FileName;
            let objectId = oSelectedItem.Attachment;
            let sUrl = window.location.href.slice(0, 50);
            let vEnvi;
            if (sUrl.includes('qas') === true) {
                vEnvi = appModulePath + "/TAQA_DMS/browser/053e9267-0f4c-4c8c-9a7f-6eb9c496b64b/root?cmisselector=content&download=attachment&filename=" + filename + "&objectId=" + objectId + "/";
            }
            else if (sUrl.includes('prd') === true) {
                vEnvi = appModulePath + "/TAQA_DMS/browser/9db8f74a-14de-474e-b899-14886a195dc7/root?cmisselector=content&download=attachment&filename=" + filename + "&objectId=" + objectId + "/";
            } else {
                vEnvi = appModulePath + "/TAQA_DMS/browser/Z_TSD_DMS/root?cmisselector=content&download=attachment&filename=" + filename + "&objectId=" + objectId + "/";
            }
            let settings = {
                "url": vEnvi,
                "method": "GET",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form,
                "xhrFields": {
                    "responseType": 'arraybuffer'
                },
                "success": function (data, status, xhr) {
                    sap.ui.getCore().byId("progressIndicator").setPercentValue(100).setDisplayValue("100%");
                    let blob = new Blob([data], { type: xhr.getResponseHeader('Content-Type') });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;
                    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                    window.URL.revokeObjectURL(link.href);
                    setTimeout(function () {
                        that._oDialog.close();
                    }, 1000);
                },
                "error": function (xhr, status, error) {
                    console.error('Failed to download file:', error);
                    MessageBox.error("Couldn't download the Travel Request Form. Please contact your administrator.", {
                        title: "Download Error"
                    });
                    that._oDialog.close();
                }
            };
            setTimeout(function () {
                sap.ui.getCore().byId("progressIndicator").setPercentValue(100).setDisplayValue("100%");
            }, 1000);
            $.ajax(settings);
        }
    });
});
