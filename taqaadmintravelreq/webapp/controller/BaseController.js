sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Input",
    "sap/m/DatePicker",
    "sap/m/TextArea",
    "sap/m/TimePicker",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "../model/formatter",
    "sap/m/Token",
    "sap/m/ComboBox",
    "sap/m/Select",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/m/BusyDialog"
], function (
    Controller,
    JSONModel,
    Input,
    DatePicker,
    TextArea,
    TimePicker,
    Filter,
    FilterOperator,
    MessageBox,
    formatter,
    Token,
    ComboBox,
    Select,
    ColumnListItem,
    Text,
    BusyDialog
) {
    "use strict";
    return Controller.extend("taqaadmintravelreq.controller.BaseController", {
        formatter: formatter,
        openDialog: function (name, path, width, height) {
            if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    name: path
                });
            }
            this.pDialog.then(function (oDialog) {
                oDialog.setTitle(name);
                oDialog.setContentHeight(height);
                oDialog.setContentWidth(width);
                oDialog.open();
            });
        },
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
        declareModel: function (modelName) {
            this.getView().setModel(new JSONModel({}), modelName);
        },
        ReadOdata: function (oModel, sPath, oFilters) {
            return new Promise(function (resolve, reject) {
                oModel.read(sPath, {
                    filters: oFilters,
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(new Error(oError));
                    }
                })
            })
        },
        fetchOdata: function (oModel, sPath, oFilters, expand) {
            return new Promise(function (resolve, reject) {
                oModel.read(sPath, {
                    filters: oFilters,
                    urlParameters: {
                        $expand: expand
                    },
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(new Error(oError));
                    }
                })
            })
        },
        
        fetchOdata2: function (oModel, sPath, oFilters) {
            return new Promise(function (resolve, reject) {
                oModel.read(sPath, {
                    filters: oFilters,
                    urlParameters: {
                        $top: 5000
                    },
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(new Error(oError));
                    }
                })
            })
        },
        FieldsHide: function (oJson, value1, value2, value3, value4, value5, value6, value7) {
            oJson.BusinessDates = value1;
            oJson.AnualDate = value2;
            oJson.RotationDate = value3;
            oJson.TrainingDate = value4;
            oJson.NationalID = value5;
            oJson.ext = value6;
            oJson.JobDates = value7;
            this.getView().getModel("visible").updateBindings(true);
        },
        mappingModels: function () {
            let oFinalModel = this.getView().getModel("form").getData(),
                oPerPersonModel = this.getView().getModel("PerPerson").getData(),
                oPerPersonalModel = this.getView().getModel("PerPersonal").getData(),
                oEmpjobModel = this.getView().getModel("EmpJob").getData();
            oFinalModel.EmployeeID = oPerPersonModel.personIdExternal;
            oFinalModel.EmployeeName = `${oPerPersonalModel.firstName} ${oPerPersonalModel.lastName}`;//${oPerPersonalModel.middleName}
            oFinalModel.EmpFirstName = oPerPersonalModel.firstName;
            oFinalModel.EmpLastName = oPerPersonalModel.lastName;
            oFinalModel.EmpMiddleName = oPerPersonalModel.middleName || "";
            oFinalModel.EmailId = oEmpjobModel.userNav?.email || "";
            oFinalModel.EmpTitle = 'Mr';
            oFinalModel.DateOfBirth = this.formatter.convert_Dateformat2(oPerPersonModel.dateOfBirth);
            oFinalModel.Nationality = oPerPersonalModel.nationality;
            oFinalModel.LeaveSchedule = oEmpjobModel.customString13;
            oFinalModel.CompanyCode = oEmpjobModel.company;
            oFinalModel.HomeCountry = oPerPersonModel.countryOfBirth;
            oFinalModel.Department = oEmpjobModel.departmentNav.name;
            oFinalModel.Division = oEmpjobModel.divisionNav.name;
            oFinalModel.Function = oEmpjobModel.businessUnitNav.name;
            oFinalModel.CostCentre = oEmpjobModel.costCenterNav.name
            oFinalModel.Location = oEmpjobModel.locationNav.description;
            oFinalModel.LocationGroup = oEmpjobModel.locationNav.locationGroup;
            oFinalModel.Designation = oEmpjobModel.jobTitle;
            let Age = this.calculateAge(oPerPersonModel.dateOfBirth);
            oFinalModel.Age = Age.toString();
            this.getView().getModel("form").refresh();
            return oFinalModel;
        },
        _convert_Date: function () {
            let date = new Date();
            let year = date.getFullYear();
            let month = ("0" + (date.getMonth() + 1)).slice(-2);
            let day = ("0" + date.getDate()).slice(-2);
            let isoDateString = year + "-" + month + "-" + day;
            return isoDateString;
        },
        calculateAge: function (dateOfBirth) {
            if (dateOfBirth) {
                const birthDate = new Date(dateOfBirth);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            }
            else {
                return '';
            }
        },
        CRDoData: function (oModel, sPath, oPayload) {
            return new Promise(function (resolve, reject) {
                oModel.create(sPath, oPayload, {
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(new Error(oError));
                    }
                })
            })
        },
        CheckRequired: function () {
            let aFields = this.getView().findAggregatedObjects(true, function (oControl) {
                return oControl instanceof Input || oControl instanceof DatePicker || oControl instanceof TextArea || oControl instanceof TimePicker || oControl instanceof ComboBox || oControl instanceof Select;
            });
            let sCheck = 0;
           
            for (let oField of aFields) {
                if (oField.getRequired() === true && oField.getVisible() === true && oField.getEditable() === true) {
                    let sValue;
                    if (oField instanceof Input || oField instanceof TextArea) {
                        sValue = oField.getValue().trim();
                    } else if (oField instanceof DatePicker || oField instanceof TimePicker) {
                        sValue = oField.getDateValue();
                    } else if (oField instanceof ComboBox || oField instanceof Select) {
                        sValue = oField.getSelectedKey();
                    }
                    if (!sValue) {
                        oField.setValueState("Error");
                        oField.setValueStateText("Please enter the data");
                        sCheck += 1;
                    } else {
                        oField.setValueState("None");
                    }
                }
            }
            if (this.getView().byId("idEmailIdInput").getVisible() === true && this.getView().byId("idEmailIdInput").getEditable() === true) {
                let email = this.getView().byId("idEmailIdInput").getValue();
                /*  let mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/; */
                let mailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!mailregex.test(email)) {
                    sCheck += 1;
                    this.getView().byId("idEmailIdInput").setValueState("Error");
                    this.getView().byId("idEmailIdInput").setValueStateText(email + " is not a valid email address");
                }
            }
            let oFormData = this.getView().getModel("form").getData();
            if (new Date(oFormData.DepartureDate) <= new Date(oFormData.ReturnDate) === false && this.getView().byId("idReturnDateDatePicker").getVisible() === true) {
                this.getView().byId("idReturnDateDatePicker").setValueState("Error");
                this.getView().byId("idReturnDateDatePicker").setValueStateText("Return Date must be greater than or equal to Departure Date");
                sCheck += 1;
            }
            if (new Date(oFormData.TrainingStartDate) <= new Date(oFormData.TrainingEndDate) === false && this.getView().byId("idTrainingEndDateDatePicker").getVisible() === true) {
                this.getView().byId("idTrainingEndDateDatePicker").setValueState("Error");
                this.getView().byId("idTrainingEndDateDatePicker").setValueStateText("Training End Date must be greater than or equal to Training Start Date");
                sCheck += 1;
            }
            if (new Date(oFormData.BusinessStartDate) <= new Date(oFormData.BusinessEndDate) === false && this.getView().byId("idBusinessEndDateDatePicker").getVisible() === true) {
                this.getView().byId("idBusinessEndDateDatePicker").setValueState("Error");
                this.getView().byId("idBusinessEndDateDatePicker").setValueStateText("Business End Date must be greater than or equal to Business Start Date");
                sCheck += 1;
            }
            if (new Date(oFormData.JobStartDate) <= new Date(oFormData.JobEndDate) === false && this.getView().byId("idJobEndDateDatePicker").getVisible() === true) {
                this.getView().byId("idJobEndDateDatePicker").setValueState("Error");
                this.getView().byId("idJobEndDateDatePicker").setValueStateText("Job End Date must be greater than or equal to Job Start Date");
                sCheck += 1;
            }
            if (oFormData.TypeofTravel === '2') {
                if ((new Date(oFormData.BusinessStartDate) >= new Date(oFormData.DepartureDate) === false ||
                    new Date(oFormData.BusinessStartDate) <= new Date(oFormData.ReturnDate) === false) &&
                    this.getView().byId("idBusinessStartDateDatePicker").getVisible() === true) {
                    this.getView().byId("idBusinessStartDateDatePicker").setValueState("Error");
                    this.getView().byId("idBusinessStartDateDatePicker").setValueStateText("Business Start Date must be between Departure Date and Return Date");
                    sCheck += 1;
                }
                if ((new Date(oFormData.TrainingStartDate) >= new Date(oFormData.DepartureDate) === false ||
                    new Date(oFormData.TrainingStartDate) <= new Date(oFormData.ReturnDate) === false) &&
                    this.getView().byId("idTrainingStartDateDatePicker").getVisible() === true) {
                    this.getView().byId("idTrainingStartDateDatePicker").setValueState("Error");
                    this.getView().byId("idTrainingStartDateDatePicker").setValueStateText("Training start date must be between Departure Date and Return Date");
                    sCheck += 1;
                }
                    if ((new Date(oFormData.JobStartDate) >= new Date(oFormData.DepartureDate) === false ||
                    new Date(oFormData.JobStartDate) <= new Date(oFormData.ReturnDate) === false) &&
                    this.getView().byId("idJobStartDateDatePicker").getVisible() === true) {
                    this.getView().byId("idJobStartDateDatePicker").setValueState("Error");
                    this.getView().byId("idJobStartDateDatePicker").setValueStateText("Job start date must be between Departure Date and Return Date");
                    sCheck += 1;
                }
                if ((new Date(oFormData.BusinessEndDate) >= new Date(oFormData.DepartureDate) === false ||
                    new Date(oFormData.BusinessEndDate) <= new Date(oFormData.ReturnDate) === false) &&
                    this.getView().byId("idBusinessEndDateDatePicker").getVisible() === true) {
                    this.getView().byId("idBusinessEndDateDatePicker").setValueState("Error");
                    this.getView().byId("idBusinessEndDateDatePicker").setValueStateText("Business end date must be between Departure Date and Return Date");
                    sCheck += 1;
                }
                if ((new Date(oFormData.TrainingEndDate) >= new Date(oFormData.DepartureDate) === false ||
                    new Date(oFormData.TrainingEndDate) <= new Date(oFormData.ReturnDate) === false) &&
                    this.getView().byId("idTrainingEndDateDatePicker").getVisible() === true) {
                    this.getView().byId("idTrainingEndDateDatePicker").setValueState("Error");
                    this.getView().byId("idTrainingEndDateDatePicker").setValueStateText("Training end date must be between Departure Date and Return Date");
                    sCheck += 1;
                }
                    if ((new Date(oFormData.JobEndDate) >= new Date(oFormData.DepartureDate) === false ||
                    new Date(oFormData.JobEndDate) <= new Date(oFormData.ReturnDate) === false) &&
                    this.getView().byId("idJobEndDateDatePicker").getVisible() === true) {
                    this.getView().byId("idJobEndDateDatePicker").setValueState("Error");
                    this.getView().byId("idJobEndDateDatePicker").setValueStateText("Job end date must be between Departure Date and Return Date");
                    sCheck += 1;
                }
            }
            if (oFormData.TypeofTravel === '1') {
                if (new Date(oFormData.BusinessStartDate) >= new Date(oFormData.DepartureDate) === false &&
                    this.getView().byId("idBusinessStartDateDatePicker").getVisible() === true) {
                    this.getView().byId("idBusinessStartDateDatePicker").setValueState("Error");
                    this.getView().byId("idBusinessStartDateDatePicker").setValueStateText("Business start date must be greater than or equal to Departure Date");
                    sCheck += 1;
                }
                if (new Date(oFormData.TrainingStartDate) >= new Date(oFormData.DepartureDate) === false &&
                    this.getView().byId("idTrainingStartDateDatePicker").getVisible() === true) {
                    this.getView().byId("idTrainingStartDateDatePicker").setValueState("Error");
                    this.getView().byId("idTrainingStartDateDatePicker").setValueStateText("Training start date must be greater than or equal to Departure Date");
                    sCheck += 1;
                }
                    if (new Date(oFormData.JobStartDate) >= new Date(oFormData.DepartureDate) === false &&
                    this.getView().byId("idJobStartDateDatePicker").getVisible() === true) {
                    this.getView().byId("idJobStartDateDatePicker").setValueState("Error");
                    this.getView().byId("idJobStartDateDatePicker").setValueStateText("Job start date must be greater than or equal to Departure Date");
                    sCheck += 1;
                }
                if (new Date(oFormData.BusinessEndDate) >= new Date(oFormData.DepartureDate) === false &&
                    this.getView().byId("idBusinessEndDateDatePicker").getVisible() === true) {
                    this.getView().byId("idBusinessEndDateDatePicker").setValueState("Error");
                    this.getView().byId("idBusinessEndDateDatePicker").setValueStateText("Business end date must be greater than or equal to Departure Date");
                    sCheck += 1;
                }
                if (new Date(oFormData.TrainingEndDate) >= new Date(oFormData.DepartureDate) === false &&
                    this.getView().byId("idTrainingEndDateDatePicker").getVisible() === true) {
                    this.getView().byId("idTrainingEndDateDatePicker").setValueState("Error");
                    this.getView().byId("idTrainingEndDateDatePicker").setValueStateText("Training end date must be greater than or equal to Departure Date");
                    sCheck += 1;
                }
                if (new Date(oFormData.JobEndDate) >= new Date(oFormData.DepartureDate) === false &&
                    this.getView().byId("idJobEndDateDatePicker").getVisible() === true) {
                    this.getView().byId("idJobEndDateDatePicker").setValueState("Error");
                    this.getView().byId("idJobEndDateDatePicker").setValueStateText("Job end date must be greater than or equal to Departure Date");
                    sCheck += 1;
                }
            }
            return sCheck;
        },
        UpdateRecord: function (oModel, sPath, oPayload) {
            return new Promise(function (resolve, reject) {
                oModel.update(sPath, oPayload, {
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(new Error(oError));
                    }
                })
            })
        },
        UpdateBatch: function (oModel, sPath, oPayload) {
            let sBatchGroupId = "myBatchGroup";
            oModel.setDeferredGroups([sBatchGroupId]);
            return new Promise(function (resolve, reject) {
                oModel.update(sPath, oPayload, {
                    groupId: sBatchGroupId,
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oerror) {
                        reject(new Error(oerror));
                    }
                })
            })
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
        TableSelectDialogConfirm: function (oEvent, ID, path) {
            let oMultiInput = this.byId(ID);
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);
            let aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts) {
                aContexts.forEach(oContexts => {
                    oMultiInput.addToken(new Token({
                        text: oContexts.getObject()[path]
                    }));
                });
            }
        },
        DeleteRecord: function (oModel, sPath) {
            return new Promise(function (resolve, reject) {
                oModel.remove(sPath, {
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(new Error(oError));
                    }
                })
            })
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
                let oDataModelSF = this.getOwnerComponent().getModel();
                let that = this;
                let oBusydailog = new BusyDialog();
                oBusydailog.open();
                let combiMail = this.getEmailletiations(userEmail);
                console.log("Emails: ", combiMail);
                let oFilter1 = new Filter("userNav/email", FilterOperator.EQ, combiMail[0]);  //"22647"  39321
                let oFilter2 = new Filter("userNav/email", FilterOperator.EQ, combiMail[1]);  //"22647"  39321
                oDataModelSF.read("/EmpJob", {
                    filters: [oFilter1, oFilter2],
                    urlParameters: {
                        $expand: "userNav"
                    },
                    success: (response1) => {
                        if (response1.results.length !== 0) {
                            that.tempID = response1.results[0].userId;
                            let oFilter4 = new Filter("person", FilterOperator.EQ, that.tempID);
                            let oFilter5 = new Filter("externalCode", FilterOperator.EQ, "FocalPerson_Travel");
                            oDataModelSF.read("/FODynamicRole", {
                                filters: [oFilter4, oFilter5],
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
                                    if (oResultsData.length === 0) {
                                        resolve({
                                            "admin": "no",
                                            "userId": response1.results[0].userId,
                                            "empDetails": response1.results

                                        });
                                    } else {
                                        resolve({
                                            "admin": "yes",
                                            "userId": response1.results[0].userId,
                                            "empDetails": response1.results,
                                            "role": oResultsData[0].externalCode
                                        });
                                    }
                                    if (filterData.emp.length === 0) {
                                        await this.onFetchBusinessUnits(filterData.company);
                                    }
                                    oBusydailog.close();
                                    console.log("email Admin:", response2);
                                },
                                error: (eRR) => {
                                    reject(new Error(eRR));
                                    oBusydailog.close();
                                }
                            });
                        }
                        else {
                            resolve({
                                "admin": "no"
                            });
                        }
                        oBusydailog.close()
                    },
                    error: (error) => {
                        reject(new Error(error));
                        oBusydailog.close();
                    },
                });
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
                let oDataModelSF = this.getOwnerComponent().getModel();

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
            let oDataModelSF = this.getOwnerComponent().getModel();
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
                            let final_Dep = this.removeDuplicates(final_structure, 'department')
                            this.getView().getModel("tableModel").getData().emp = final_Dep;
                        }
                    },
                    error: (error) => {
                        oBusydailog.close();
                        console.error("Error fetching departments:", error);
                    }
                });
            });
        },




        convertNumberToWords: function (number) {
            number = Math.round(number);
            const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
            const teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
            const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
            if (number === 0) {
                return ' ';
            }
            if (number < 0) {
                return '-' + convertNumberToWords(Math.abs(number));
            }
            if (number < 10) {
                return ones[number];
            }
            if (number < 20) {
                return teens[number - 10];
            }
            if (number < 100) {
                return tens[Math.floor(number / 10)] + (number % 10 !== 0 ? ' ' + ones[number % 10] : '');
            }
            if (number < 1000) {
                return ones[Math.floor(number / 100)] + ' HUNDRED' + (number % 100 !== 0 ? ' AND ' + this.convertNumberToWords(number % 100) : '');
            }
            if (number < 1000000) {
                return this.convertNumberToWords(parseInt(number / 1000)).trim() + ' THOUSAND ' + this.convertNumberToWords(number % 1000);
            }
            if (number < 1000000000) {
                return this.convertNumberToWords(parseInt(number / 1000000)).trim() + ' MILLION ' + this.convertNumberToWords(number % 1000000);
            }
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
        mapFamilyDetails: function (data) {
            const filteredArray = data.map(item => ({
                DateOfBirth: item.DateOfBirth,
                ExternalCode: item.ExternalCode,
                FirstName: item.FirstName,
                LastName: item.LastName,
                MiddleName: item.MiddleName,
                Relationship: item.Relationship,
                Title: item.Title
            }));
            return filteredArray;
        },
        generateTRFNo: async function () {
            let oModel = this.getView().getModel("taqa-srv");
            let sPath = "/TravelDetails";
            let oFilter = new Array();
            let vExtCode;
            let start_number = 1000000000;
            oFilter.push(new Filter(
                "TrfNumber",
                FilterOperator.NE,
                ""
            ));
            await this.ReadOdata(oModel, sPath, oFilter).then((odata) => {
                debugger;
                const uniqueArray = Array.from(new Map(odata.results.map(item => [item.TrfNumber, item])).values());
                vExtCode = Number(uniqueArray.length);
            }).catch((error) => {
                MessageBox.error(JSON.parse(error.responseText).error.message.value)
            });
            start_number = start_number + vExtCode + 1;
            return start_number.toString();
        },
        checkDateDublicate: async function () {
            let oForm = this.getView().getModel("form").getData();
            let oFilters = [];
            let oModel = this.getView().getModel("taqa-srv");
            let sPath = "/TravelDetails";
            let vDublicates = "";
            let sID = oForm.ID;
            if (oForm.EmployeeID) {
                oFilters.push(new Filter("EmployeeID", FilterOperator.EQ, oForm.EmployeeID));
            }
            if (oForm.EmailId) {
                oFilters.push(new Filter("EmailId", FilterOperator.EQ, oForm.EmailId));
            }
            if (oForm.DepartureDate) {
                oFilters.push(new Filter("DepartureDate", FilterOperator.EQ, oForm.DepartureDate));
            }
            if (oForm.ReturnDate) {
                oFilters.push(new Filter("ReturnDate", FilterOperator.EQ, oForm.ReturnDate));
            }
            await this.ReadOdata(oModel, sPath, oFilters).then((odata) => {
                const filteredData = odata.results.filter(record => record.ID !== sID);
                vDublicates = filteredData.length;
            }).catch((error) => {
                MessageBox.error(JSON.parse(error.responseText).error.message.value)
            });
            return vDublicates;
        },
        checkDateDublicateReissue: async function () {
            let oForm = this.getView().getModel("form").getData();
            let oFilters = [];
            let oModel = this.getView().getModel("taqa-srv");
            let sPath = "/TravelDetails";
            let vDublicates = "";

            if (oForm.EmployeeID) {
                oFilters.push(new Filter("EmployeeID", FilterOperator.EQ, oForm.EmployeeID));
            }
            if (oForm.EmailId) {
                oFilters.push(new Filter("EmailId", FilterOperator.EQ, oForm.EmailId));
            }
            if (oForm.DepartureDate) {
                oFilters.push(new Filter("DepartureDate", FilterOperator.EQ, oForm.DepartureDate));
            }
            if (oForm.ReturnDate) {
                oFilters.push(new Filter("ReturnDate", FilterOperator.EQ, oForm.ReturnDate));
            }
            oFilters.push(new Filter("DestinationCountry", FilterOperator.EQ, oForm.DestinationCountry));
            oFilters.push(new Filter("DepartureSector", FilterOperator.EQ, oForm.DepartureSector));
            oFilters.push(new Filter("DestinationCountry", FilterOperator.EQ, oForm.DestinationCountry));
            oFilters.push(new Filter("DepartureAirportCity", FilterOperator.EQ, oForm.DepartureAirportCity));
            oFilters.push(new Filter("AirportCity", FilterOperator.EQ, oForm.AirportCity));
            await this.ReadOdata(oModel, sPath, oFilters).then((odata) => {
                vDublicates = odata.results.length;
            }).catch((error) => {
                MessageBox.error(JSON.parse(error.responseText).error.message.value)
            });
            return vDublicates;
        },
        getTravelTeam: async function () {
            let oDataModelSF = this.getOwnerComponent().getModel();
            let oForm = this.getView().getModel("form").getData();
            let that = this;
            let oBusydailog = new BusyDialog();
            oBusydailog.open();
            let oFilter1 = new Filter("externalCode", FilterOperator.EQ, "Z010");
            await oDataModelSF.read("/FODynamicRole", {
                filters: [oFilter1],
                urlParameters: {
                    $expand: "locationNav,personNav"
                },
                success: async (response2) => {
                    const filteredData = response2.results.filter(record => record.location !== null)
                    let travelteam = filteredData.filter(oItem =>
                        oItem.locationNav.results[0].locationGroup === oForm.LocationGroup
                    );
                    let uniqueDepartment = this.removeDuplicates(travelteam, 'person');
                    that.getView().getModel("TravelTeam").setData(uniqueDepartment);
                    oBusydailog.close();
                    this.openDialog2("Travel Team", "taqaadmintravelreq.fragments.valueHelps.travelTeam");
                    console.log("travelteam", response2);
                },
                error: (error) => {
                    oBusydailog.close();
                    MessageBox.error(JSON.parse(error.responseText).error.message.value);
                }
            });
        },
        emailTriggering: async function (pdffile, filename, travelteamname, focalperson, tomail, flag) {
            let oModel = this.getOwnerComponent().getModel("taqa-srv");
            let sPath = "/sendTravelEmail";
            let oPayload = {
                base64pdf: pdffile,
                receiverMail: tomail,
                fileName: filename,
                name: travelteamname,// travel team name
                focalPerson: focalperson,//focal name
                ticketbook: flag, //flase = ticket info ,true = booking info
            };
            await this.FuncImport(oModel, sPath, oPayload).then((odata) => {
                debugger;
            }).catch((error) => {
                debugger;
                MessageBox.error(error)
            });
        },
        FuncImport: function (oModel, sPath, oPayload) {
            return new Promise(function (resolve, reject) {
                oModel.create(sPath, oPayload, {
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(new Error(oError));
                    }
                })
            })
        },



    });
});