sap.ui.define([
    "taqaadmintravelreq/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter",
    "sap/m/Input",
    "sap/m/DatePicker",
    "sap/m/TextArea",
    "sap/m/TimePicker",
    "sap/m/Token",
    "taqaadmintravelreq/util/jspdf.umd.min",
    "taqaadmintravelreq/util/html2canvas.min",
    "taqaadmintravelreq/util/purify.min",
    "taqaadmintravelreq/util/html2pdf.bundle.min",
    "sap/m/BusyDialog",
    "sap/m/Page",
    "sap/m/IllustratedMessage",
    "sap/m/Text",
    "sap/m/ColumnListItem",
    "sap/m/ComboBox",
    "sap/ui/core/ListItem",
    "sap/m/MessageToast",
    "sap/m/MultiInput"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,
        MessageBox,
        Filter,
        FilterOperator,
        formatter,
        Input,
        DatePicker,
        TextArea,
        TimePicker,
        Token,
        JspdfUmdmin,
        HtmlcanvasMin,
        PurifyMin,
        HtmlpdfBundlemin,
        BusyDialog,
        Page,
        IllustratedMessage,
        Text,
        ColumnListItem,
        ComboBox,
        ListItem,
        MessageToast,
        MultiInput
    ) {
        "use strict";
        return BaseController.extend("taqaadmintravelreq.controller.View1", {
            formatter: formatter,
            onInit: async function () {
                if (sap.ushell.Container) {
                    let user = sap.ushell.Container.getService("UserInfo").getUser();
                    this.vUserName = user.getFullName();
                    this.userEmail = user.getEmail();
                    console.log(this.userEmail);

                    // this.userEmail = 'kraghava';
                    if (this.userEmail !== undefined) {
                        let userD = await this.getEmpDetailsEmail(this.userEmail);
                        // let userD = { admin: 'yes' };
                        if (userD.admin === "yes") {
                            this.declareModel("PerPersonal");
                            this.declareModel("EmpJob");
                            this.declareModel("PerPerson");
                            this.declareModel("visible");
                            this.declareModel("form");
                            this.declareModel("Family");
                            this.declareModel("Family2");
                            this.declareModel("Ticket");
                            this.declareModel("Ticket2");
                            this.declareModel("OJSON");
                            this.declareModel("WBS");
                            this.declareModel("CC");
                            this.declareModel("IO");
                            this.declareModel("TravelTeam");
                            this.declareModel("AMPSEMP");

                            this.declareModel("DepAirportCity");
                            this.declareModel("AirportCity");

                            this.oFilterBar = this.getView().byId("filterbar");
                            this.oTable = this.getView().byId("idTravelDetailsTable");
                            let fnValidator = function (args) {
                                let text = args.text;
                                return new Token({ key: text, text: text });
                            };
                            let oMultiInput1 = this.getView().byId("idInputEmpID");
                            // let oMultiInput2 = this.getView().byId("idExtcode");
                            let oMultiInput3 = this.getView().byId("idMultiInputDepartment");
                            /*  // let oMultiInput4 = this.getView().byId("idMultiInputDivision"); */
                            let oMultiInput5 = this.getView().byId("travelcatSelect");
                            let oMultiInput6 = this.getView().byId("idMultiInputCompanyCode");
                            let oMultiInput7 = this.getView().byId("idMultiInputLocation");
                            oMultiInput1.addValidator(fnValidator);
                            // oMultiInput2.addValidator(fnValidator);
                            oMultiInput3.addValidator(fnValidator);
                            /*  // oMultiInput4.addValidator(fnValidator); */
                            oMultiInput5.addValidator(fnValidator);
                            oMultiInput6.addValidator(fnValidator);
                            oMultiInput7.addValidator(fnValidator);
                            this.onSearch();

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
                else {
                    let oPage = this.getView().byId("page");
                    oPage.removeAllContent();
                    let oIllustratedMessage = new IllustratedMessage({
                        illustrationType: "sapIllus-ErrorScreen",
                        title: "Access Denied",
                        description: "You need permission to access this page. Request access from your administrator."
                    });
                    oPage.addContent(oIllustratedMessage);
                }
            },
            onCreateRequestButtonPress: function (oEvent) {
                let oJsonVisible = this.getView().getModel("visible").getData();
                let oFormData = this.getView().getModel("form").getData();
                oJsonVisible.agent = false;
                oJsonVisible.agentresponse = false;
                oJsonVisible.emp = false;
                oJsonVisible.type = false;
                oJsonVisible.TrainingDate = false;
                oJsonVisible.BusinessDates = false;
                oJsonVisible.AnualDate = false;
                oJsonVisible.RotationDate = false;
                oJsonVisible.NationalID = false;
                oJsonVisible.reviewbutton = false;
                oJsonVisible.complete = false;
                oJsonVisible.create = false;
                oJsonVisible.ReferenceNumber = false;
                oJsonVisible.update = false;
                oJsonVisible.edit = false;
                oJsonVisible.edittraveller = false;
                oJsonVisible.attachment = false;
                oFormData.FocalPersonName = this.vUserName;
                this.getView().getModel("form").refresh();
                this.getView().getModel("visible").refresh();
                this.openDialog("Travel Request Form", "taqaadmintravelreq.fragments.requestForm", 'auto', 'auto');
            },
            onCompleteButtonPress: function (oEvent) {
                let oDynamicTable = oEvent.getSource().getParent().getContent()[5],
                    oSelectedItems = oDynamicTable.getItems();
                let sCheck = this.CheckRequired();
                if (sCheck === 0) {
                    let oBusyDialog = new BusyDialog();
                    let that = this;
                    let oJsonVisible = this.getView().getModel("visible").getData();
                    let oPayload = this.getView().getModel("form").getData();
                    let oModel = this.getView().getModel("taqa-srv");
                    let sPath = "/TravelDetails(guid'" + oPayload.ID + "')",
                        sPath2 = "/TravelDetails(guid'" + oPayload.ID + "')/ItsTicketDetails",
                        sID = oPayload.ID;
                    oPayload.Status = 'LPO processed by Focal Person';
                    oPayload.AgentStatus = 'Completed';
                    delete oPayload.ItsTicketDetails;
                    delete oPayload.ItsFamilyDetails;
                    let aBatchOperations = [];
                    if (oSelectedItems.length !== 0) {
                        oBusyDialog.open();
                        oSelectedItems.forEach(function (oSelectedItem) {
                            let aCells = oSelectedItem.getCells();
                            let oPayload2 = {};
                            oPayload2["TravelDate"] = aCells[1].getValue();
                            aCells[1].setEditable(false);
                            oPayload2["TicketNumber"] = aCells[2].getValue();
                            aCells[2].setEditable(false);
                            oPayload2["SectorTicket"] = aCells[3].getValue();
                            aCells[3].setEditable(false);
                            oPayload2["Airline"] = aCells[4].getValue();
                            aCells[4].setEditable(false);
                            let BaseAmount = parseFloat(aCells[5].getValue());
                            oPayload2["BaseAmount"] = BaseAmount.toFixed(2);
                            aCells[5].setEditable(false);
                            let TaxAmount = parseFloat(aCells[6].getValue());
                            oPayload2["TaxAmount"] = TaxAmount.toFixed(2);
                            aCells[6].setEditable(false);
                            let Gst = parseFloat(aCells[7].getValue());
                            oPayload2["Gst"] = Gst.toFixed(2);
                            aCells[7].setEditable(false);
                            oPayload2["Currency"] = aCells[8].getValue();
                            aCells[8].setEditable(false);
                            // let Amount;
                            // if (isNaN(Gst)) {
                            //     Amount = BaseAmount + TaxAmount;
                            // } else {
                            //     Amount = BaseAmount + TaxAmount + Gst;
                            // }
                            // oPayload2["Amount"] = Amount.toFixed(2);
                            // aCells[9].setValue(Amount.toFixed(2));
                            oPayload2["Amount"] = aCells[9].getValue();
                            aCells[9].setEditable(false);
                            oPayload2["Sector"] = aCells[10].getValue();
                            aCells[10].setEditable(false);
                            oPayload2["parent_ID"] = sID;
                            aBatchOperations.push(oPayload2);
                        });
                        aBatchOperations.forEach(function (oRecord) {
                            oModel.createEntry(sPath2, {
                                properties: oRecord,
                                success: function (oData, oResponse) {
                                },
                                error: function (oError) {
                                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                }
                            });
                        });
                        oModel.submitChanges({
                            success: async function (oData, oResponse) {
                                that.UpdateRecord(oModel, sPath, oPayload).then(async (odata) => {
                                    let expand = 'ItsTicketDetails';
                                    let oFilter = new Array();
                                    await that.fetchOdata(oModel, sPath, oFilter, expand).then((odata) => {
                                        that.getView().getModel("Ticket2").setData({});
                                        that.getView().getModel("Ticket2").setData(odata.ItsTicketDetails.results);
                                    }).catch((error) => {
                                        MessageBox.error(JSON.parse(error.responseText).error.message.value);
                                    });
                                    let vStep = 'Complete';
                                    that.onPdfButtonPress(vStep);
                                    oBusyDialog.close();
                                    oJsonVisible.complete = false;
                                    that.getView().getModel("visible").refresh();
                                    that.getView().getModel("form").refresh();
                                    that.getView().getModel("taqa-srv").refresh();
                                }).catch((error) => {
                                    oBusyDialog.close();
                                    MessageBox.error(JSON.parse(error.responseText).error.message.value);
                                });
                            },
                            error: function (oError) {
                                oBusyDialog.close();
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            }
                        });
                    }
                    else {
                        MessageBox.error("Kindly Add Ticket details")
                    }
                }
            },
            onCreatePress: async function (oEvent) {
                let sCheck = this.CheckRequired();
                let oDailog = oEvent.getSource().getParent();
                if (sCheck === 0) {
                    /*   // let sDublicates = await this.checkDateDublicate();
                      // if (sDublicates === false) { */
                    let oBusyDialog = new BusyDialog();
                    oBusyDialog.open();
                    let that = this;
                    let oJsonVisible = this.getView().getModel("visible").getData();
                    let oPayload = this.getView().getModel("form").getData();
                    let oFamilyDetails = oEvent.getSource().getParent().getContent()[3].getItems();
                    let aItsFamily = [];
                    let oLocationData = this.getView().getModel("tableModel").getData().location;
                    let oModel = this.getView().getModel("taqa-srv");
                    let sPath = "/TravelDetails";
                    oPayload.Status = 'Open';
                    oPayload.CreationDate = that._convert_DateTime();
                    if (oPayload.TravelCategory === 'JN' || oPayload.TravelCategory === 'MS') {
                        oPayload.LocationGroup = oLocationData[0].locationNav.results[0].locationGroup;
                        oPayload.Location = oLocationData[0].locationNav.results[0].name;
                        oPayload.EmployeeName = oPayload.EmpFirstName + " " + oPayload.EmpMiddleName + " " + oPayload.EmpLastName;
                    }
                    oPayload.TravelwithFamily = 'N';
                    if (oFamilyDetails.length > 0) {
                        oPayload.TravelwithFamily = 'Y';
                        oFamilyDetails.forEach(function (oSelectedItem) {
                            let aCells = oSelectedItem.getCells();
                            let oPayload2 = {};
                            oPayload2["Title"] = aCells[0].getValue();
                            aCells[0].setEditable(false);
                            oPayload2["FirstName"] = aCells[1].getValue();
                            aCells[1].setEditable(false);
                            oPayload2["MiddleName"] = aCells[2].getValue();
                            aCells[2].setEditable(false);
                            oPayload2["LastName"] = aCells[3].getValue();
                            aCells[3].setEditable(false);
                            oPayload2["DateOfBirth"] = aCells[4].getValue();
                            aCells[4].setEditable(false);
                            oPayload2["Relationship"] = aCells[5].getValue();
                            aCells[5].setEditable(false);
                            aItsFamily.push(oPayload2);
                        });
                    };
                    oPayload.ItsFamilyDetails = aItsFamily;
                    this.CRDoData(oModel, sPath, oPayload).then(async (odata) => {
                        oBusyDialog.close();
                        oDailog.setContentHeight("80%");
                        oDailog.setContentWidth("100%");
                        oJsonVisible.reviewbutton = true;
                        oJsonVisible.create = false;
                        oJsonVisible.complete = false;
                        oJsonVisible.add = false;
                        oJsonVisible.delete = false;
                        oJsonVisible.empedit = false;
                        oJsonVisible.update = false;
                        oJsonVisible.edit = false;
                        oJsonVisible.createcat = false;
                        oJsonVisible.attachment = false;
                        that.getView().getModel("visible").refresh();
                        that.getView().getModel("form").getData().ID = odata.ID;
                        that.getView().getModel("form").refresh();
                        that.getView().getModel("taqa-srv").refresh();
                        let expand = 'ItsFamilyDetails';
                        let oFilter = new Array();
                        let vPath = "/TravelDetails(guid'" + odata.ID + "')";
                        await that.fetchOdata(oModel, vPath, oFilter, expand).then((odata) => {
                            that.getView().getModel("Family2").setData({});
                            that.getView().getModel("Family2").setData(odata.ItsFamilyDetails.results);
                        }).catch((error) => {
                            MessageBox.error(JSON.parse(error.responseText).error.message.value);
                        });
                        MessageBox.success("Travel Request is Created.");
                    }).catch((error) => { MessageBox.error(error) });
                }
            },
            onRivewButtonPress: async function (oEvent) {
                let sCheck = this.CheckRequired();
                if (sCheck === 0) {
                    /*  // let sDublicates = await this.checkDateDublicate();
                     // if (sDublicates === 0) { */
                    let oBusyDialog = new BusyDialog();
                    oBusyDialog.open();
                    let that = this;
                    let oJsonVisible = this.getView().getModel("visible").getData();
                    let oPayload = this.getView().getModel("form").getData();
                    this.getView().getModel("visible").refresh();
                    let oModel = this.getView().getModel("taqa-srv");
                    let sPath = "/TravelDetails(guid'" + oPayload.ID + "')";
                    let sPath2 = "/TravelDetails";
                    oPayload.Status = 'Reviewed';
                    oPayload.TravelAgentCode = '';
                    oPayload.TravelAgentName = '';
                    oPayload.FocalPersonName = this.vUserName;
                    if (oPayload.TypeofTravel === '1') {
                        oPayload.ReturnDate = "";
                        oPayload.ReturnTime = "";
                    }
                    if (!oPayload.ID) {
                        /*  // let vDublicates = await that.checkDateDublicateReissue();
                         //if (vDublicates === 0) {  */
                        let oFamilyDetails = this.getView().getModel("Family").getData();
                        oPayload.ItsFamilyDetails = that.mapFamilyDetails(oFamilyDetails);
                        oPayload.CreationDate = that._convert_DateTime();
                        delete oPayload.ItsTicketDetails;
                        that.getView().getModel("form").refresh();
                        this.CRDoData(oModel, sPath2, oPayload).then(async (odata) => {
                            that.getView().getModel("form").getData().ID = odata.ID;
                            that.getView().getModel("form").refresh();
                            oBusyDialog.close();
                            oJsonVisible.review = false;
                            oJsonVisible.ReasonforTravel = false;
                            oJsonVisible.LocalMobileNumber = false;
                            oJsonVisible.reviewbutton = false;
                            oJsonVisible.agent = true;
                            oJsonVisible.typeoftravel = false;
                            oJsonVisible.empedit = false;
                            oJsonVisible.greyoutfield = false;
                            oJsonVisible.VisaRequirement = false;
                            oJsonVisible.update = false;
                            oJsonVisible.edit = false;
                            oJsonVisible.edittraveller = false;
                            that.getView().getModel("visible").refresh();
                            that.getView().getModel("taqa-srv").refresh();
                            oBusyDialog.open();
                            let sPathReissue = "/TravelDetails(guid'" + that.ReissuedID + "')";
                            let oPayloadReissue = {
                                "Status": 'Reissued'
                            };
                            await that.UpdateRecord(oModel, sPathReissue, oPayloadReissue).then((odata) => {
                                oBusyDialog.close();
                                that.ReissuedID = '';
                            }).catch((error) => {
                                oBusyDialog.close();
                                MessageBox.error(JSON.parse(error.responseText).error.message.value);
                            });
                            MessageBox.success("Form is Reviewed");
                        }).catch((error) => {
                            oBusyDialog.close();
                            MessageBox.error(JSON.parse(error.responseText).error.message.value);
                        })
                    } else {
                        /*   // let sDublicates = await that.checkDateDublicate();
                          // if (sDublicates === 0) { */
                        oPayload.TrfNumber = await that.generateTRFNo();
                        delete oPayload.ItsTicketDetails;
                        delete oPayload.ItsFamilyDetails;
                        that.getView().getModel("form").refresh();
                        this.UpdateRecord(oModel, sPath, oPayload).then((odata) => {
                            oBusyDialog.close();
                            oJsonVisible.review = false;
                            oJsonVisible.ReasonforTravel = false;
                            oJsonVisible.LocalMobileNumber = false;
                            oJsonVisible.reviewbutton = false;
                            oJsonVisible.agent = true;
                            oJsonVisible.typeoftravel = false;
                            oJsonVisible.empedit = false;
                            oJsonVisible.greyoutfield = false;
                            oJsonVisible.VisaRequirement = false;
                            oJsonVisible.update = false;
                            oJsonVisible.edit = false;
                            oJsonVisible.edittraveller = false;
                            that.getView().getModel("visible").refresh();
                            that.getView().getModel("taqa-srv").refresh();
                            MessageBox.success("Form is Reviewed");
                        }).catch((error) => {
                            oBusyDialog.close();
                            MessageBox.error(JSON.parse(error.responseText).error.message.value);
                        });
                        /*  // }
                         // else {
                         //     MessageBox.error("Request already exist with same Travel Dates")
                         // } */
                    }
                    /*  // }
                     // else {
                     //     MessageBox.error("Request already exist with same Travel Dates")
                     // } */
                }
            },
            onAddButtonPress: async function (oEvent) {
                let oTable = oEvent.getSource().getParent().getParent();
                let oEdit = this.getView().getModel("visible").getData();
                oEdit.table = true;
                this.getView().getModel("visible").refresh();
                let oItem = new ColumnListItem({
                    cells: [
                        new Input(),
                        new DatePicker({ required: true, valueFormat: 'yyyy-MM-dd' }),
                        new Input({ required: true }),
                        new Input({ required: true }),
                        new Input({ required: true }),
                        new Input({ required: true, type: 'Number', liveChange: [this.onlivechangeAmount, this] }),
                        new Input({ required: true, type: 'Number', liveChange: [this.onlivechangeAmount, this] }),
                        new Input({ type: 'Number', value: 0.00, liveChange: [this.onlivechangeAmount, this] }),
                        new ComboBox({
                            showSecondaryValues: true,
                            required: true,
                            items: {
                                path: '/Currency',
                                length: 500,
                                required: true,
                                template: new ListItem({ key: '{code}', text: '{code}', additionalText: "{externalName_en_US}" })
                            }
                        }),
                        new Input({ type: 'Number', editable: false }),
                        // new Input({ type: 'Number'}),
                        new Input(),]
                });
                oTable.insertItem(oItem, 0);
            },
            onlivechangeAmount: function (oEvent) {
                debugger;
                let vbasefare = oEvent.getSource().getParent().getCells()[5].getValue();
                let vtax = oEvent.getSource().getParent().getCells()[6].getValue();
                let vgst = oEvent.getSource().getParent().getCells()[7].getValue();
                let basefareNum = parseFloat(vbasefare) || 0;  // Use 0 if the conversion fails
                let taxNum = parseFloat(vtax) || 0;
                let gstNum = parseFloat(vgst) || 0;

                // Summing the values
                let totalAmount = basefareNum + taxNum + gstNum;
                totalAmount = totalAmount.toFixed(2);
                oEvent.getSource().getParent().getCells()[9].setValue(totalAmount);

            },
            onAgentInitiateProcess: function (oEvent) {
                let sCheck = this.CheckRequired();
                let that = this;
                if (sCheck === 0) {
                    let oBusyDialog = new BusyDialog();
                    oBusyDialog.open();
                    let oJsonVisible = this.getView().getModel("visible").getData();
                    let oPayload = this.getView().getModel("form").getData();
                    oJsonVisible.agentresponse = true;
                    this.getView().getModel("visible").refresh();
                    let oModel = this.getView().getModel("taqa-srv");
                    let sPath = "/TravelDetails(guid'" + oPayload.ID + "')";
                    oPayload.Status = 'Initiated to Travel Team';
                    oPayload.AgentStatus = 'Open';
                    this.UpdateRecord(oModel, sPath, oPayload).then((odata) => {
                        oBusyDialog.close();
                        oJsonVisible.initiate = false;
                        oJsonVisible.complete = true;
                        oJsonVisible.edittraveller = true;
                        that.getView().getModel("visible").refresh();
                        that.getView().getModel("form").refresh();
                        that.getView().getModel("taqa-srv").refresh();
                        MessageBox.success("Request Initiated to Travel Agent.");
                    }).catch((error) => {
                        MessageBox.error(JSON.parse(error.responseText).error.message.value)
                    });
                }
            },
            onColumnListItemPress: async function (oEvent) {
                let oSelectedHeader = oEvent.getSource().getBindingContext("OJSON").getObject();
                let oJsonVisible = this.getView().getModel("visible").getData();
                let that = this;
                that.getView().getModel("Family").setData({});
                that.getView().getModel("Family").refresh();

                if (!oSelectedHeader.Class) {
                    oSelectedHeader.Class = 'EC';
                }
                if (!oSelectedHeader.ReferenceNumber) {
                    oJsonVisible.ReferenceNumber = false;
                }
                else {
                    oJsonVisible.ReferenceNumber = true;
                }
                this.getView().getModel("form").setData(oSelectedHeader);
                oJsonVisible.agent = false;
                oJsonVisible.agentresponse = false;
                oJsonVisible.empedit = false;
                oJsonVisible.createcat = false;
                oJsonVisible.complete = false;
                oJsonVisible.create = false;
                oJsonVisible.add = false;
                oJsonVisible.delete = false;
                oJsonVisible.TravelType = false;
                oJsonVisible.taqa = true;
                oJsonVisible.amps = false;
                oJsonVisible.table = false;
                oJsonVisible.update = false;
                oJsonVisible.edit = false;
                oJsonVisible.edittraveller = false;
                oJsonVisible.attachment = true;
                oJsonVisible.travelwithfamily = false;
                if (oSelectedHeader.Status === 'Open') {
                    oJsonVisible.reviewbutton = true;
                };
                if (oSelectedHeader.Status === 'Cancelled') {
                    oJsonVisible.review = false;
                    oJsonVisible.ReasonforTravel = false;
                    oJsonVisible.LocalMobileNumber = false;
                    oJsonVisible.typeoftravel = false;
                    oJsonVisible.reviewbutton = false;
                    oJsonVisible.greyoutfield = false;
                    oJsonVisible.VisaRequirement = false;
                };
                if (oSelectedHeader.Status === 'Reviewed') {
                    oJsonVisible.review = false;
                    oJsonVisible.ReasonforTravel = false;
                    oJsonVisible.LocalMobileNumber = false;
                    oJsonVisible.typeoftravel = false;
                    oJsonVisible.reviewbutton = false;
                    oJsonVisible.agent = true;
                    oJsonVisible.greyoutfield = false;
                    oJsonVisible.VisaRequirement = false;
                };
                if (oSelectedHeader.Status === 'Initiated to Travel Team') {
                    oJsonVisible.review = false;
                    oJsonVisible.ReasonforTravel = false;
                    oJsonVisible.LocalMobileNumber = false;
                    oJsonVisible.typeoftravel = false;
                    oJsonVisible.reviewbutton = false;
                    oJsonVisible.initiate = false;
                    oJsonVisible.agent = true;
                    oJsonVisible.agentresponse = true;
                    oJsonVisible.complete = true;
                    oJsonVisible.greyoutfield = false;
                    oJsonVisible.VisaRequirement = false;
                    oJsonVisible.edittraveller = true;
                };
                if (oSelectedHeader.Status === 'LPO processed by Focal Person') {
                    oJsonVisible.review = false;
                    oJsonVisible.ReasonforTravel = false;
                    oJsonVisible.LocalMobileNumber = false;
                    oJsonVisible.Exit = false;
                    oJsonVisible.VisaRequirement = false;
                    oJsonVisible.reviewbutton = false;
                    oJsonVisible.typeoftravel = false;
                    oJsonVisible.initiate = false;
                    oJsonVisible.agent = true;
                    oJsonVisible.agentresponse = true;
                    oJsonVisible.complete = false;
                    oJsonVisible.greyoutfield = false;
                    oJsonVisible.edit = true;
                    oJsonVisible.edittraveller = false;
                };
                if (oSelectedHeader.Status === 'Reissued') {
                    oJsonVisible.review = false;
                    oJsonVisible.ReasonforTravel = false;
                    oJsonVisible.LocalMobileNumber = false;
                    oJsonVisible.Exit = false;
                    oJsonVisible.VisaRequirement = false;
                    oJsonVisible.reviewbutton = false;
                    oJsonVisible.typeoftravel = false;
                    oJsonVisible.initiate = false;
                    oJsonVisible.agent = true;
                    oJsonVisible.agentresponse = true;
                    oJsonVisible.complete = false;
                    oJsonVisible.greyoutfield = false;
                    oJsonVisible.edit = false;
                    oJsonVisible.edittraveller = false;
                };
                let oModel = this.getView().getModel("taqa-srv");
                let sPath = "/TravelDetails(guid'" + oSelectedHeader.ID + "')";
                let oFilters = new Array();
                let expand = 'ItsFamilyDetails,ItsTicketDetails';
                await this.fetchOdata(oModel, sPath, oFilters, expand).then((odata) => {
                    that.getView().getModel("Family").setData(odata.ItsFamilyDetails.results);
                    that.getView().getModel("Family2").setData(odata.ItsFamilyDetails.results);
                    that.getView().getModel("Ticket").setData(odata.ItsTicketDetails.results);
                }).catch((error) => { MessageBox.error(JSON.parse(error.responseText).error.message.value) });
                await this.onDepartureSectorComboBoxChange(true);
                await this.onDestinationSectorComboBoxChange(true);

                switch (oSelectedHeader.TravelCategory) {
                    case "BU":
                        if (oSelectedHeader.CompanyCode === '1000' ||
                            oSelectedHeader.CompanyCode === '2000' ||
                            oSelectedHeader.CompanyCode === '4000' ||
                            oSelectedHeader.CompanyCode === '4010' ||
                            oSelectedHeader.CompanyCode === '6000'
                        ) {
                            /*  // oSelectedHeader.TypeofTravel = '2';
                             // this.getView().getModel("form").refresh(); */
                            oJsonVisible.amps = true;
                            oJsonVisible.TravelType = true;
                            oJsonVisible.taqa = false;
                            /*  // oJsonVisible.typeoftravel = false; */
                        }
                        else {
                            /*  // oSelectedHeader.TypeofTravel = '2';
                             // this.getView().getModel("form").refresh(); */
                            oJsonVisible.amps = false;
                            oJsonVisible.TravelType = false;
                            oJsonVisible.taqa = true;
                            /*  // oJsonVisible.typeoftravel = false; */
                        }
                        oJsonVisible.attachment = false;
                        this.FieldsHide(oJsonVisible, true, false, false, false, false, true, false);
                        break;
                    case "JN":
                        // oJsonVisible.typeoftravel = false;
                        oJsonVisible.attachment = false;
                        this.FieldsHide(oJsonVisible, false, false, false, false, true, false, false);
                        break;
                    case "MS":
                        // oJsonVisible.typeoftravel = false;
                        oJsonVisible.attachment = false;
                        this.FieldsHide(oJsonVisible, false, false, false, false, true, false, false);
                        break;
                    case "TR":
                        if (oSelectedHeader.CompanyCode === '1000' ||
                            oSelectedHeader.CompanyCode === '2000' ||
                            oSelectedHeader.CompanyCode === '4000' ||
                            oSelectedHeader.CompanyCode === '4010' ||
                            oSelectedHeader.CompanyCode === '6000'
                        ) {
                            /* // oSelectedHeader.TypeofTravel = '2';
                            // this.getView().getModel("form").refresh(); */
                            oJsonVisible.amps = true;
                            oJsonVisible.TravelType = true;
                            oJsonVisible.taqa = false;
                            /*   // oJsonVisible.typeoftravel = false; */
                        }
                        else {
                            /* // oSelectedHeader.TypeofTravel = '2';
                            // this.getView().getModel("form").refresh(); */
                            oJsonVisible.amps = false;
                            oJsonVisible.TravelType = false;
                            oJsonVisible.taqa = true;
                            /*  // oJsonVisible.typeoftravel = false; */
                        }
                        oJsonVisible.attachment = false;
                        this.FieldsHide(oJsonVisible, false, false, false, true, false, true, false);
                        break;
                    case "JT":
                        oJsonVisible.attachment = false;
                        this.FieldsHide(oJsonVisible, false, false, false, false, false, true, true);
                        break;
                    case "SP":
                        oJsonVisible.typeoftravel = false;
                        oJsonVisible.attachment = false;
                        this.FieldsHide(oJsonVisible, false, false, false, false, false, true, false);
                        break;
                    case "AL":
                        oJsonVisible.greyoutfield = false;
                        oJsonVisible.travelwithfamily = true;
                        /*  // oJsonVisible.ReasonforTravel = false; */
                        // oJsonVisible.LocalMobileNumber = true;
                        oJsonVisible.VisaRequirement = false;
                        this.FieldsHide(oJsonVisible, false, true, false, false, false, true, false);
                        break;
                    case "RL":
                        oJsonVisible.greyoutfield = false;
                        // oJsonVisible.LocalMobileNumber = true;
                        oJsonVisible.VisaRequirement = false;
                        this.FieldsHide(oJsonVisible, false, false, true, false, false, true, false);
                        break;
                }
                let vTitle = that.formatter.getTCLabel(oSelectedHeader.TravelCategory);
                this.openDialog(vTitle, "taqaadmintravelreq.fragments.requestForm", '100%', '80%');
            },
            onCloseButtonPress: function (oEvent) {
                oEvent.getSource().getParent().close();
                this.getView().byId("idFamilyTable").removeAllItems();
                this.getView().getModel("visible").setData({});
                this.getView().getModel("form").setData({});
                this.getView().getModel("Family").setData({});
                this.getView().getModel("Family2").setData({});
                this.getView().getModel("Ticket").setData({});
                this.getView().getModel("Ticket2").setData({});
                this.getView().getModel("WBS").setData({});
                this.getView().getModel("CC").setData({});
                this.getView().getModel("IO").setData({});
                this.getView().getModel("PerPersonal").setData({});
                this.getView().getModel("EmpJob").setData({});
                this.getView().getModel("PerPerson").setData({});
                this.getView().getModel("AMPSEMP").setData({});
                this.getView().getModel("TravelTeam").setData({});
                this.getView().getModel("form").refresh();
                this.onSearch();
            },
            onAgentSelectDialogConfirm: function (oEvent) {
                let aSelectedItem = oEvent.getParameter("selectedItem");
                let oFormModel = this.getView().getModel("form").getData();
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                oFormModel.AgentCode = aSelectedItem.getDescription();
                oFormModel.AgentDescription = aSelectedItem.getTitle();
                this.getView().getModel("form").refresh();
            },
            onSelectDialogConfirm: function (oEvent) {

                let oMultiInput = this.byId("travelcatSelect");
                const oDialog = oEvent.getSource(); // Get the SelectDialog
                const aItems = oDialog.getItems();
                // let oBinding = oEvent.getSource().getBinding("items");
                // oBinding.filter([]);
                let aContexts = oEvent.getParameter("selectedItems");
                if (aContexts) {
                    aContexts.forEach(oContexts => {
                        oMultiInput.addToken(new Token({
                            text: oContexts.getTitle()
                        }));
                    });
                }
                aItems.forEach(function (oItem) {
                    oItem.setVisible(true);
                });
            },
            onStatusSelectDialogConfirm: function (oEvent) {

                let oMultiInput = this.byId("idInputStatus");
                const oDialog = oEvent.getSource(); // Get the SelectDialog
                const aItems = oDialog.getItems();
                // let oBinding = oEvent.getSource().getBinding("items");
                // oBinding.filter([]);
                let aContexts = oEvent.getParameter("selectedItems");
                if (aContexts) {
                    aContexts.forEach(oContexts => {
                        oMultiInput.addToken(new Token({
                            text: oContexts.getTitle()
                        }));
                    });
                }
                aItems.forEach(function (oItem) {
                    oItem.setVisible(true);
                });
            },
            onAgentSelectDialogSearch: function (oEvent) {
                let sValue = oEvent.getParameter("value");
                let oFilter = new Filter({
                    path: "personNav/displayName",
                    operator: FilterOperator.Contains,
                    value1: sValue,
                    caseSensitive: false
                });
                let oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
            onAgentValueHelpRequest: async function () {
                await this.getTravelTeam();

            },
            onInputCatValueHelpRequest: function () {
                this.openDialog2("Travel Category", "taqaadmintravelreq.fragments.valueHelps.traveltypes");
            },
            onMultiInputValueHelpRequestStatus: function () {
                this.openDialog2("Status", "taqaadmintravelreq.fragments.valueHelps.status");
            },
            onComboBoxSelectionChange: async function (oEvent) {
                this.getView().getModel("visible").setData({});
                this.getView().getModel("Family").setData({});
                this.getView().getModel("Family").refresh();
                let oJsonVisible = this.getView().getModel("visible").getData();
                let oForm = this.getView().getModel("form").getData();
                oForm = {
                    FocalPersonName: oForm.FocalPersonName,
                    TravelCategory: oForm.TravelCategory,
                    ExpenseCode: "",
                    ProjectCode: "",
                    EmployeeID: "",
                    PurposeofTravel: "",
                    Designation: "",
                    MobileNo: "",
                    FrequentFlyerNo: "",
                    EmployeeName: "",
                    EmailId: "",
                    EmpFirstName: "",
                    EmpLastName: "",
                    EmpMiddleName: "",
                    EmpTitle: "",
                    Age: "",
                    DateOfBirth: "",
                    MealPreference: "",
                    SeatPreference: "",
                    OverseasMobNo: "",
                    PassportNumber: "",
                    NationalID: "",
                    Class: "EC"
                };
                oJsonVisible.agent = false;
                oJsonVisible.agentresponse = false;
                oJsonVisible.reviewbutton = false;
                oJsonVisible.createcat = true;
                oJsonVisible.emp = true;
                oJsonVisible.type = true;
                oJsonVisible.create = true;
                oJsonVisible.complete = false;
                oJsonVisible.TravelType = false;
                oJsonVisible.ReferenceNumber = false;
                oJsonVisible.update = false;
                oJsonVisible.edit = false;
                oJsonVisible.edittraveller = false;
                oJsonVisible.attachment = false;
                oJsonVisible.travelwithfamily = false;
                this.getView().getModel("visible").refresh();
                oForm.TravelwithFamily = 'Y';
                switch (oForm.TravelCategory) {
                    case "JN": {
                        oJsonVisible.typeoftravel = true;
                        this.FieldsHide(oJsonVisible, false, false, false, false, true, false, false);
                        let oModel = this.getView().getModel("taqa-srv");
                        let sPath = "/TravelDetails";
                        let oFilter = new Array();
                        let expand = '';
                        let vExtCode;
                        oFilter.push(new Filter(
                            "TravelCategory",
                            FilterOperator.EQ,
                            'JN'
                        ));
                        await this.fetchOdata(oModel, sPath, oFilter, expand).then((odata) => {
                            vExtCode = Number(odata.results.length)
                        }).catch((error) => { MessageBox.error(JSON.parse(error.responseText).error.message.value) });
                        vExtCode += 1;
                        vExtCode = vExtCode.toString().padStart(6, '0');
                        oForm.EXTCode = 'EXT-' + vExtCode;
                        oForm.TypeofTravel = '1';
                        this.getView().getModel("form").setData(oForm);
                        this.getView().getModel("form").refresh();
                        break;
                    }
                    case "SP": {
                        oForm.TypeofTravel = '1';
                        this.getView().getModel("form").setData(oForm);
                        this.getView().getModel("form").refresh();
                        oJsonVisible.typeoftravel = false;
                        this.FieldsHide(oJsonVisible, false, false, false, false, false, true, false);
                        break;
                    }
                    case "MS": {
                        oJsonVisible.typeoftravel = true;
                        this.FieldsHide(oJsonVisible, false, false, false, false, true, false, false);
                        let oModel2 = this.getView().getModel("taqa-srv");
                        let sPath2 = "/TravelDetails";
                        let oFilter2 = new Array();
                        let expand2 = '';
                        let vExtCode2;
                        oFilter2.push(new Filter(
                            "TravelCategory",
                            FilterOperator.EQ,
                            'MS'
                        ));
                        await this.fetchOdata(oModel2, sPath2, oFilter2, expand2).then((odata) => {
                            vExtCode2 = Number(odata.results.length)
                        }).catch((error) => { MessageBox.error(JSON.parse(error.responseText).error.message.value) });
                        vExtCode2 += 1;
                        vExtCode2 = vExtCode2.toString().padStart(6, '0');
                        oForm.EXTCode = 'EXTMISC-' + vExtCode2;
                        oForm.TypeofTravel = '1';
                        this.getView().getModel("form").setData(oForm);
                        this.getView().getModel("form").refresh();
                        break;
                    }
                }
            },

            _convert_DateTime: function () {
                // let date = new Date();
                // let year = date.getFullYear();
                // let month = ("0" + (date.getMonth() + 1)).slice(-2);
                // let day = ("0" + date.getDate()).slice(-2);
                // let hours = ("0" + date.getHours()).slice(-2);
                // let minutes = ("0" + date.getMinutes()).slice(-2);
                // let seconds = ("0" + date.getSeconds()).slice(-2);
                // let isoDateString = year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
                // return isoDateString;

                const currentDate = new Date();

                // Get individual components
                const year = currentDate.getUTCFullYear();
                const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
                const day = String(currentDate.getUTCDate()).padStart(2, '0');
                const hours = String(currentDate.getUTCHours()).padStart(2, '0');
                const minutes = String(currentDate.getUTCMinutes()).padStart(2, '0');
                const seconds = String(currentDate.getUTCSeconds()).padStart(2, '0');

                // Format as YYYY-MM-DDTHH:mm:ss
                const formattedUtcDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
                return formattedUtcDate;
            },
            onPdfButtonPress: function (vStep) {
                //  #158 RE: TRF - DOB is not required in PDF for employee
                let sCheck = this.CheckRequired();
                if (sCheck === 0) {
                    let oBusyDialog = new BusyDialog();
                    oBusyDialog.open();
                    let oSelectedHeader = this.getView().getModel("form").getData();
                    let oSelectedTickets = this.getView().getModel("Ticket2").getData();
                    let oSelectedFamily = this.getView().getModel("Family2").getData();
                    let oDepartureAirports = this.getView().getModel("DepAirportCity").getData();
                    let oDestiAirports = this.getView().getModel("AirportCity").getData();
                    let vDepartureAirportCity = oDepartureAirports.results.filter(item => item.externalCode === oSelectedHeader.DepartureAirportCity);
                    let vDestinationAirportCity = oDestiAirports.results.filter(item => item.externalCode === oSelectedHeader.AirportCity);
                    vDepartureAirportCity = vDepartureAirportCity[0].label_localized;
                    vDestinationAirportCity = vDestinationAirportCity[0].label_localized;
                    let oVisaRequirement = this.formatter.getLabelForVisa(oSelectedHeader.VisaRequirement);
                    let oClass = this.formatter.getLabelForClass(oSelectedHeader.Class);
                    let vCreationDate = this.formatter.convert_Dateformat(oSelectedHeader.CreationDate);
                    let vReturnDate = '';
                    let vReturnTime = this.formatter.getTime(oSelectedHeader.ReturnTime);
                    let vDepartureTime = this.formatter.getTime(oSelectedHeader.DepartureTime);
                    let vTravelCatogry = this.formatter.getTCLabel(oSelectedHeader.TravelCategory);


                    let vTRFNo = '';
                    if (oSelectedHeader.ReturnDate) {
                        vReturnDate = this.formatter.convert_Dateformat(oSelectedHeader.ReturnDate);
                    }
                    if (oSelectedHeader.ReferenceNumber) {
                        vTRFNo = oSelectedHeader.TrfNumber + "_" + oSelectedHeader.ReferenceNumber;
                    } else {
                        vTRFNo = oSelectedHeader.TrfNumber;
                    }
                    let vDepartureDate = this.formatter.convert_Dateformat(oSelectedHeader.DepartureDate);
                    let vEmpDOB = this.formatter.convert_Dateformat(oSelectedHeader.DateOfBirth);
                    const appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                    const appPath = appId.replaceAll(".", "/");
                    const appModulePath = jQuery.sap.getModulePath(appPath);
                    let that = this;
                    let month = (oSelectedHeader.CreationDate).slice(5, 7);
                    let day = (oSelectedHeader.CreationDate).slice(8, 10);
                    let RefNo = '';
                    let vEmpName = '';
                    let vMobileNo = '';
                    let vOverseaNo = '';
                    let vCapture = `<b></b>`;
                    if (oSelectedHeader.TravelCategory === 'JN' || oSelectedHeader.TravelCategory === 'MS') {
                        RefNo = "Ref No:" + oSelectedHeader.EXTCode + "/" + oSelectedHeader.TravelCategory + "/" + month + day;
                        // vEmpName = oSelectedHeader.EmployeeName;
                    } else {
                        RefNo = "Ref No:" + oSelectedHeader.Division + "/" + oSelectedHeader.HomeCountry + "/" + oSelectedHeader.EmployeeID + "/" + oSelectedHeader.TravelCategory + "/" + month + day;
                        // vEmpName = oSelectedHeader.EmpFirstName;
                    }
                    if (oSelectedHeader.MobileNo) {
                        vMobileNo = `+${oSelectedHeader.MobileNo}`;
                    }
                    if (oSelectedHeader.OverseasMobNo) {
                        vOverseaNo = `+${oSelectedHeader.OverseasMobNo}`;
                    }

                    let logo = appModulePath + "/util/taqalogo.webp";
                    let oFormTicketDetails = ``;
                    let vTotal = 0;
                    let vCurrency = '';
                    if (oSelectedTickets.length > 0) {
                        oSelectedTickets.forEach((element) => {
                            let vTravelDate;
                            vCurrency = element.Currency;
                            vTravelDate = that.formatter.convert_Dateformat(element.TravelDate);
                            oFormTicketDetails += `<tr>
            <td align='center'>${element.Airline}</td>
            <td align='center'>${element.SectorTicket}</td>
            <td align='center'>${vTravelDate}</td>
            <td align='center'>${element.TicketNumber}</td>
            <td align='center'>${element.BaseAmount}</td>
            <td align='center'>${element.TaxAmount}</td>
            <td align='center'>${element.Currency}</td>
             <td align='center'>${element.Amount}</td>
            <td align='center'>${element.Sector}</td>
        </tr>`
                            vTotal += Number(element.Amount);
                        });
                    } else {
                        oFormTicketDetails += `<tr style="height:18px ;">
            <td align='center'> </td>
            <td align='center'> </td>
            <td align='center'> </td>
            <td align='center'> </td>
            <td align='center'> </td>
            <td align='center'> </td>
            <td align='center'> </td>
            <td align='center'> </td>
            <td align='center'> </td>
        </tr>`
                        vTotal = 0;
                    }
                    let vAmountInWords = this.convertNumberToWords(vTotal);
                    let oFormFamily = '';
                    if (oSelectedHeader.TravelwithFamily !== '3') {
                        oFormFamily = `<tr>
                    <td align='center'>${oSelectedHeader.EmpTitle}</td>
                    <td align='center'>${oSelectedHeader.EmpLastName}</td>
                    <td align='center'>${oSelectedHeader.EmpFirstName}</td>
                    <td align='center'>${oSelectedHeader.EmpMiddleName}</td>
                    <td align='center'> </td>
                    <td align='center'>${oSelectedHeader.EmployeeID}</td>
                    <td align='center'>${oSelectedHeader.PurposeofTravel}</td>
                    <td align='center'>${oSelectedHeader.Designation}</td>
                    
                </tr>`;
                    }
                    if (oSelectedFamily.length > 0) {
                        oSelectedFamily.forEach((element) => {
                            // let Age = this.calculateAge(element.DateOfBirth);
                            let vDOB = this.formatter.convert_Dateformat(element.DateOfBirth)
                            oFormFamily += `<tr>
                    <td align='center'>${element.Title}</td>
                    <td align='center'>${element.LastName}</td>
                    <td align='center'>${element.FirstName}</td>
                    <td align='center'>${element.MiddleName}</td>
                    <td align='center'>${vDOB}</td>
                    <td align='center'>${oSelectedHeader.EmployeeID}</td>
                    <td align='center'>Family</td>
                    <td align='center'>${element.Relationship}</td>
                   
                </tr>`;
                        });
                    }

                    if (vStep === 'Complete') {
                        vCapture = `<div style='margin-left: 30px; margin-top: 40px;'><b>*This is computer-generated Travel Purchase Order and does not require a signature in order to be considered valid.</b> </div>`;
                    }
                    let oFormPdf = `<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>${oSelectedHeader.TravelCategory}</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <style type='text/css'>
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: powderblue;
        }
        .container {
            margin: 10px;
            width: calc(100% - 20px);
            height: auto;
            border: 1px solid #000033;
            box-sizing: border-box; /* Ensures padding and border are included in width/height */
        }
        .vertical_line {
            border-right: 1px solid #000033;
        }
        .left_margin {
            margin-left: 10px;
        }
        table {
            border-collapse: collapse;
            padding: 3px;
            width: 100%;
            font-size: 12px;
        }
        th, td {
        }
        h1 {
            font-size: 22px;
        }
        p, b, label, th, td {
            font-size: 12px;
        }
        h3 {
            font-size: 18px;
        }
        h2 {
            font-size: 24px;
        }
        h4, h5, h6 {
            font-size: 14px;
        }
        .section {
            border-bottom: 1px solid #000033;
            padding: 5px;
        }
        .section img {
            height: 80px;
            width: 100px;
        }
        .flex-row {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap; /* Allows items to wrap if they overflow */
        }
        .center {
            text-align: center;
        }
        .padding {
            padding: 5px;
        }
        .full-width {
            width: 100%;
        }
        .table-bordered {
            border: 1px solid #000033;
        }
        .no-wrap {
            white-space: nowrap;
        }
        .caption-style {
            color: rebeccapurple;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div style='display: flex; flex-direction: row;border-bottom: 1px solid #000033;height:100px'>
            <div style='display: flex; flex-direction: row; align-items: left; width: 50%;' class='vertical_line'>
                <img src="${logo}" class='left_margin' style='margin-top: 5px;' height='80px' width='100px'>
                <h3 style='margin-top: 40px;'>TRAVEL REQUEST/LPO FORM (TRF)</h3>
            </div>
            <div class='left_margin vertical_line' style='width: 25%;'>
                <h5>${vTRFNo}</h5>
                <h5>${RefNo}</h5>
            </div>
            <div class='left_margin' style='width: 25%;'>
                <h5>Date: ${vCreationDate}</h5>
            </div>
        </div>
        <div style='display: flex; flex-direction: row; border-bottom: 1px solid #000033;'>
            <div class='vertical_line' style='width: 33%; padding: 5px;'>
                <b>Focal Person:</b>
                <label>${oSelectedHeader.FocalPersonName}</label>
            </div>
            <div class='left_margin ' style='width: 33%; padding: 5px;'>
                <b>Department:</b>
                <label>${oSelectedHeader.Department}</label>
            </div>
        </div>
         <div style='display: flex; flex-direction: row; border-bottom: 1px solid #000033;'>
            <div class='vertical_line' style='width: 33%; padding: 5px;'>
                <b>Expense Code:</b>
                <label>${oSelectedHeader.ExpenseCode}</label>
            </div>
            <div class='left_margin ' style='width: 33%; padding: 5px;'>
                <b>Code:</b>
                <label>${oSelectedHeader.ProjectCode}</label>
            </div>
        </div>
        <div class='center section'> 
            <caption class='caption-style'><b>TRAVELLER INFORMATION (As it appears on passport)</b></caption>
        </div>
        <div class='section'>
            <table  border='1' class='full-width' >
                <tr>
                    <th style='width: 8%;'>Title</th>
                      <th style='width: 8%;'>Last Name</th>
                    <th style='width: 10%;'>First Name</th>
                    <th style='width: 8%;'>Middle Name</th>
                     <th style='width: 8%;'>Date of Birth</th>
                    <th style='width: 8%;'>Emp.No</th>
                    <th style='width: 12%;'>Travel Purpose</th>
                    <th style='width: 12%;'>Designation</th>
                   

                </tr>`;
                    let oForm2 = oFormFamily;
                    let oForm3 = `  </table>
                
            </table>
        </div>
       <div class='section' style='display: flex; flex-direction: row; border-bottom: 1px solid #000033;'>
            <div style='width:25%; padding: 5px;'>
                <b>Type of Travel:</b>
                 <label>${oSelectedHeader.TypeofTravel === '1' ? 'One Way Trip' : 'Round Trip'}</label>
            </div>
            <div style='padding: 5px;width:25%;'>
                <b>Class:</b>
                <label>${oClass}</label>
            </div>
             <div style='padding: 5px;width:25%;'>
                <b>Passport No:</b>
                <label>${oSelectedHeader.PassportNumber}</label>
            </div>
             <div style='padding: 5px;width:25%;'>
                <b>Email:</b>
                <label>${oSelectedHeader.EmailId}</label>
            </div>
        </div>
        <div class='center section'>
            <caption><b>TRAVEL ITINERARY REQUIRED</b></caption>
        </div>
        <div class='section'>
            <table border='1' class='full-width'>
                <tr>
                    <th>Departure Date</th>
                    <th>Time</th>
                    <th>Departure Sector</th>
                    <th>Return Date</th>
                    <th>Time</th>
                     <th>Return Destination Sector</th>
                     
                </tr>
                <tr>
                    <td align='center'>${vDepartureDate}</td>
                    <td align='center'>${vDepartureTime}</td>
                     <td align='center'>${vDepartureAirportCity}</td>
                      <td align='center'>${vReturnDate}</td>
                       <td align='center'>${vReturnTime}</td>
                      <td align='center'>${vDestinationAirportCity}</td>
                </tr>
            </table>
        </div>
        <div class='section' style='display: flex; flex-direction: row;border-bottom: 1px solid #000033;'>
             <div style='width:25%;padding: 5px;'>
                        <b>Local Mob No:</b>
                        <label>${vMobileNo}</label>
                    </div>
                    <div class='left_margin' style='width: 25%;padding: 5px;'>
                        <b>Overseas Mob No:</b>
                        <label>${vOverseaNo}</label>
                    </div>
                    <div class='left_margin' style='width: 25%;padding: 5px;'>
                        <b>Seat Preference:</b>
                        <label>${oSelectedHeader.SeatPreference}</label>
                    </div>
                    <div class='left_margin' style='width: 25%;padding: 5px;'>
                        <b>Meal Preference:</b>
                        <label>${oSelectedHeader.MealPreference}</label>
                    </div>
        </div>
        <div style='display: flex; flex-direction: row; border-bottom: 1px solid #000033;'>
            <div style='width:50%; padding: 5px;'>
                <b>Is Travel Visa Required:</b>
                 <label>${oVisaRequirement}</label>
            </div>
            <div style='padding: 5px;'>
                <b>Frequently Flyer No. If any:</b>
                <label>${oSelectedHeader.FrequentFlyerNo}</label>
            </div>
        </div>
        <div class='center section'>
            <caption><b>LPO - TO BE FILLED BY FOCAL POINT</b></caption>
        </div>
        <div style='display: flex; flex-direction: row; border-bottom: 1px solid #000033;'>
            <div class='vertical_line' style='width: 40%; padding: 5px;'>
                <b>LPO No. (Travel Agent abbreviation/TRF No): </b>
            </div>
            <div class='left_margin' style='width: 40%; padding: 5px;'>
                <label>${vTRFNo}</label>
            </div>
        </div>
         <div style='display: flex; flex-direction: row; border-bottom: 1px solid #000033;'>
            <div class='vertical_line' style='width: 40%; padding: 5px;'>
                <b>Travel Agent Name: </b>
                <label>${oSelectedHeader.TravelAgentName}</label>
            </div>
            <div class='left_margin' style='width: 40%; padding: 5px;'>
                <b>Travel Agent Code: </b>
                <label>${oSelectedHeader.TravelAgentCode}</label>
            </div>
        </div>
        <div class='section'>
            <table border='1' class='full-width'>
                <tr>
                    <th style='width: 7%;'>Airline</th>
                    <th style='width: 7%;'>Sector</th>
                    <th style='width: 10%;'>Travel Date</th>
                    <th style='width: 9%;'>Ticket No</th>
                    <th style='width: 9%;'>Base Fare</th>
                    <th style='width: 7%;'>Taxes</th>
                    <th style='width: 7%;'>Currency</th>
                     <th style='width: 9%;'>Total</th>
                    <th>Remarks:To be filled by Focal Person, if any</th>
                </tr>`;
                    let oForm4 = oFormTicketDetails;
                    let oForm5 = `  </table>
        </div>
        <div style='display: flex; flex-direction: row;'>
            <div class='vertical_line' style='width: 50%; padding: 5px;'>
                <b>Total Amount: ${vCurrency} ${vTotal}</b>
            </div>
            <div class='left_margin ' style='width: 50%; padding: 5px;'>
                <b>Total in Words: ${vCurrency} ${vAmountInWords}</b>
            </div>
        </div>
    </div>
    ${vCapture}
</body>
</html>
`;
                    let oFilename = `${vTRFNo}_${oSelectedHeader.TravelCategory}.pdf`;
                    oFilename = oFilename.replace("undefined", "");
                    const oOptions3 = {
                        margin: [0.3, 0.3, 0.3, 0.3],
                        filename: oFilename,
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: 'in', format: 'A4', orientation: 'l' }
                    };
                    let oPDFFILE = oFormPdf + oForm2 + oForm3 + oForm4 + oForm5;
                    html2pdf().set(oOptions3).from(oPDFFILE).output('blob').then((pdfBlob) => {
                        html2pdf().set(oOptions3).from(oPDFFILE).save();
                        oBusyDialog.close();
                        that.handleUploadPress(pdfBlob, oFilename, vStep, oPDFFILE);
                    }).catch((err) => {
                        console.error("Error generating the PDF: ", err);
                        MessageBox.error("Failed to generate PDF.");
                        oBusyDialog.close();
                    });
                }
            },
            onEmpNoValuehelpOpen: function (oEvent) {
                this.openDialog2("Employee No Select", "taqaadmintravelreq.fragments.valueHelps.empNo")
            },
            onEmpIDValuehelpOpen: async function (oEvent) {
                let sPathEmpJob = "/EmpJob",
                    oSFModel = this.getOwnerComponent().getModel(),
                    expand = 'userNav';
                let aFilters = [];
                let aResult = new Array();
                let oBusydailog = new BusyDialog();
                let that = this;
                oBusydailog.open();
                let oTableModel = that.getView().getModel("tableModel").getData().emp;
                oTableModel.forEach(element => {
                    aResult.push(new Filter({
                        path: "department",
                        operator: FilterOperator.EQ,
                        value1: element.department
                    }));
                });
                let oTableModelCompany = that.getView().getModel("tableModel").getData().company;
                oTableModelCompany.forEach(element => {
                    aFilters.push(new Filter({
                        path: "company",
                        operator: FilterOperator.EQ,
                        value1: element.company
                    }));
                });
                aResult.push(new Filter({
                    filters: aFilters,
                    and: true // Combine filters with OR
                }));
                // await this.fetchOdata(oSFModel, sPathEmpJob, aResult, expand).then(async (odata) => {
                await this.fetchOdata2(oSFModel, sPathEmpJob, aResult).then(async (odata) => {
                    oBusydailog.close();
                    await this.getView().getModel("AMPSEMP").setData(odata);
                }).catch(async (oError) => {
                    oBusydailog.close();
                    await MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                });
                this.openDialog2("Employee No", "taqaadmintravelreq.fragments.valueHelps.empNo")
            },
            onPerPersonSelectDialogConfirm: async function (oEvent) {
                let aSelectedItem = oEvent.getParameter("selectedItem").getTitle();
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                this.ID = aSelectedItem;
                if (oEvent.getSource().getTitle() === 'Employee No') {
                    if (aSelectedItem && aSelectedItem.length > 0) {
                        let oJsonModel = this.getView().getModel("form").getData();
                        oJsonModel.EmployeeID = this.ID;
                        this.getView().getModel("form").refresh();
                        let oModel = this.getView().getModel("PerPersonal");
                        let oBusyDialog = new BusyDialog();
                        oBusyDialog.open();
                        let oSFModel = this.getView().getModel(),
                            sPathPerPerson = "/PerPersonal",
                            sPathEmpJob = "/EmpJob",
                            sPathPerson = "/PerPerson",
                            sPathPhone = "/PerPhone",
                            filtersPerPersonal = new Array(),
                            filtersEmpJob = new Array(),
                            filterByName,
                            filterByUserId,
                            expand = 'businessUnitNav,divisionNav,departmentNav,costCenterNav,locationNav,userNav';
                        filterByName = new Filter("personIdExternal", FilterOperator.EQ, this.ID);
                        filtersPerPersonal.push(filterByName);
                        filterByUserId = new Filter("userId", FilterOperator.EQ, this.ID);
                        filtersEmpJob.push(filterByUserId);
                        await this.ReadOdata(oSFModel, sPathPerPerson, filtersPerPersonal).then(async (odata) => {
                            await oModel.setData(odata.results[0]);
                        }).catch(async (oError) => {
                            await oBusyDialog.close();
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                        await this.fetchOdata(oSFModel, sPathEmpJob, filtersEmpJob, expand).then(async (odata) => {
                            await this.getView().getModel("EmpJob").setData(odata.results[0]);
                        }).catch(async (oError) => {
                            await oBusyDialog.close();
                            await MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                        await this.ReadOdata(oSFModel, sPathPerson, filtersPerPersonal).then(async (odata) => {
                            await this.getView().getModel("PerPerson").setData(odata.results[0]);
                            await this.mappingModels();
                            oBusyDialog.close();
                        }).catch((oError) => {
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                        await this.ReadOdata(oSFModel, sPathPhone, filtersPerPersonal).then(async (odata) => {
                            if (odata.results.length === 0) {
                                this.getView().getModel("form").getData().MobileNo = "";
                            } else {
                                this.getView().getModel("form").getData().MobileNo = odata.results[0].phoneNumber;
                                this.getView().getModel("form").refresh();
                            }
                            oBusyDialog.close();
                        }).catch(async (oError) => {
                            await oBusyDialog.close();
                            await MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                    }
                }
                else {
                    this.getView().byId("idInputEmpID").setValue(this.ID);
                }
            },
            onPerPersonSelectDialogSearch: function (oEvent) {
                let sValue = oEvent.getParameter("value");
                // let oFilter = new Filter("userNav/defaultFullName", FilterOperator.Contains, sValue);
                let oFilter = new Filter("userId", FilterOperator.Contains, sValue);
                let oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
            onMultiInputValueHelpRequest: function (oEvent) {
                this.openDialog2("Department Select", "taqaadmintravelreq.fragments.valueHelps.department")
            },
            onFODepartmentTableSelectDialogSearch: function (oEvent) {
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
            onFOcompanyTableSelectDialogSearch: function (oEvent) {
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
            onJNcompanyTableSelectDialogSearch: function (oEvent) {
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
            onFODepartmentTableSelectDialogConfirm: function (oEvent) {
                let oMultiInput = this.byId("idMultiInputDepartment");
                let oBinding = oEvent.getSource().getBinding("items");
                let aContexts = oEvent.getParameter("selectedContexts");
                oBinding.filter([]);
                if (aContexts) {
                    aContexts.forEach(oContexts => {
                        oMultiInput.addToken(new Token({
                            text: oContexts.getObject().departmentNav.results[0].name
                        }));
                    });
                }
            },
            onFOcompanyTableSelectDialogConfirm: function (oEvent) {
                this.TableSelectDialogConfirm(oEvent, "idMultiInputCompanyCode", "company");
            },
            onJNcompanyTableSelectDialogConfirm: function (oEvent) {
                let aSelectedItem = oEvent.getParameter("selectedItem");
                let oFormModel = this.getView().getModel("form").getData();
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                oFormModel.CompanyCode = aSelectedItem.getTitle();
                this.getView().getModel("form").refresh();
            },
            onMultiInputValueHelpRequestDivision: function (oEvent) {
                this.openDialog2("Division Select", "taqaadmintravelreq.fragments.valueHelps.division")
            },
            onFODivisionTableSelectDialogSearch: function (oEvent) {
                this.TableSelectDialogSearch(oEvent, "divisionNav/results/0/name");
            },
            onFODivisionTableSelectDialogConfirm: function (oEvent) {
                let oMultiInput = this.byId("idMultiInputDivision");
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
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
                this.openDialog2("Location Select", "taqaadmintravelreq.fragments.valueHelps.location")
            },
            onFOLocationTableSelectDialogSearch: function (oEvent) {
                this.TableSelectDialogSearch(oEvent, 'locationNav/results/0/name');
            },
            onFOLocationTableSelectDialogConfirm: function (oEvent) {
                let oMultiInput = this.byId("idMultiInputLocation");
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                let aContexts = oEvent.getParameter("selectedContexts");
                if (aContexts) {
                    aContexts.forEach(oContexts => {
                        oMultiInput.addToken(new Token({
                            text: oContexts.getObject().locationNav.results[0].name
                        }));
                    });
                }
            },
            onMultiInputValueHelpRequestCompanyCode: function (oEvent) {
                this.openDialog2("Company Select", "taqaadmintravelreq.fragments.valueHelps.company")
            },
            onFilterBarClear: function (oEvent) {
                this.getView().byId("travelcatSelect").setTokens([]);
                this.getView().byId("idMultiInputLocation").setTokens([]);
                this.getView().byId("idInputEmpID").setTokens([]);
                // this.getView().byId("idExtcode").setTokens([]);
                this.getView().byId("idMultiInputCompanyCode").setTokens([]);
                this.getView().byId("idMultiInputDepartment").setTokens([]);
                this.getView().byId("idInputStatus").setTokens([]);
                this.getView().byId("idDatePicker").setValue('');
            },
            // onDeleteButtonPress: function (oEvent) {
            //     let oDynamicTable = this.getView().byId("idTravelDetailsTable");
            //     let oSelectedHeaders = oDynamicTable.getSelectedItems();
            //     let oCAPMModel = this.getView().getModel("taqa-srv"),
            //         that = this;
            //     if (oSelectedHeaders) {
            //         let oBusyDialog = new BusyDialog();
            //         oBusyDialog.open();
            //         oSelectedHeaders.forEach(function (oSelectedHeader) {
            //             let sID = oSelectedHeader.getBindingContext("taqa-srv").getProperty("ID");
            //             let sPathTravel = "/TravelDetails(guid'" + sID + "')";
            //             that.DeleteRecord(oCAPMModel, sPathTravel).then((odata) => {
            //             }).catch((oError) => {
            //                 MessageBox.error(JSON.parse(oError.responseText).error.message.value);
            //             });
            //         });
            //         oCAPMModel.submitChanges({
            //             success: function (oResponse) {
            //                 oBusyDialog.close();
            //                 that.getView().getModel("visible").setData({});
            //                 that.getView().getModel("form").setData({});
            //                 that.getView().byId("idTravelDetailsTable").getBinding("items").refresh();
            //             },
            //             error: function (oError) {
            //                 oBusyDialog.close();
            //                 MessageBox.error(JSON.parse(oError.responseText).error.message.value);
            //             }
            //         });
            //     }
            //     else {
            //         MessageBox.error("Please select a row to Delete");
            //     }
            // },
            onSearch: function () {
                let that = this;
                let aTableFilters = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    let oControl = oFilterGroupItem.getControl();
                    let aFilters = [];
                    if (oControl instanceof MultiInput) {
                        let aTokens = oControl.getTokens();
                        if (aTokens.length > 0) {
                            aTokens.forEach(function (oToken) {
                                let sTokenValue = oToken.getText();
                                if (sTokenValue) {
                                    aFilters.push(new Filter({
                                        path: oFilterGroupItem.getName(),
                                        operator: FilterOperator.EQ,
                                        value1: that.formatter.getTCCode(sTokenValue)
                                    }));
                                }
                            });
                        }
                    } else if (oControl instanceof Input) {
                        let sInputValue = oControl.getValue();
                        if (sInputValue) {
                            aFilters.push(new Filter({
                                path: oFilterGroupItem.getName(),
                                operator: FilterOperator.EQ,
                                value1: sInputValue
                            }));
                        }
                    } else if (oControl instanceof DatePicker) {
                        let sInputValue = oControl.getValue();
                        if (sInputValue) {
                            aFilters.push(new Filter({
                                path: oFilterGroupItem.getName(),
                                operator: FilterOperator.BT,
                                value1: sInputValue + 'T00:00:00',
                                value2: sInputValue + 'T23:59:59'
                            }));
                        }
                    }
                    if (aFilters.length > 0) {
                        aResult.push(new Filter({
                            filters: aFilters,
                            and: false // Combine filters with OR
                        }));
                    }
                    return aResult;
                }, []);
                let oTokensDep = that.getView().byId("idMultiInputDepartment").getTokens().length;
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
                let oTokensCompany = that.getView().byId("idMultiInputCompanyCode").getTokens().length;
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
                let oTokenLocation = that.getView().byId("idMultiInputLocation").getTokens().length;
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
                let oBusydailog = new BusyDialog();
                oBusydailog.open();
                if (oTableModelCompany.length > 0) {
                    let oModel = that.getOwnerComponent().getModel("taqa-srv");
                    oModel.read("/TravelDetails", {
                        filters: aTableFilters,
                        success: function (oData) {
                            that.getView().getModel("OJSON").setData(oData);
                            oBusydailog.close();
                        },
                        error: function (oError) {
                            oBusydailog.close();
                        }
                    });
                } else {
                    oBusydailog.close();
                    MessageBox.error("You do not own any Legal Entity");
                }
            },
            handleUploadPress: async function (pdf, pdffilename, vStep, oPDFFILE) {
                let that = this;
                let oFile = pdf;
                let filename = pdffilename.replace("undefined", "");
                let oPDFfiles = oPDFFILE;
                let vBase64;
                let sCheck = this.CheckRequired();
                if (sCheck === 0) {
                    const oOptions3 = {
                        margin: [0.3, 0.3, 0.3, 0.3],
                        filename: filename,
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: 'in', format: 'A4', orientation: 'l' },
                    };
                    const appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                    const appPath = appId.replaceAll(".", "/");
                    const appModulePath = jQuery.sap.getModulePath(appPath);
                    let oJsonVisible = this.getView().getModel("visible").getData();
                    this.getView().getModel("visible").refresh();
                    let parent_ID = that.getView().getModel("form").getData().ID,
                        oPayload = that.getView().getModel("form").getData();
                    let oModel = this.getView().getModel("taqa-srv");
                    /*   let vTravelTeamMail = 'khira@kaartech.com';  */
                    //  let vTravelTeamMail = 'kraghavendra@kaartech.com';
                    let vTravelTeamMail = 'ksanjaygiri@kaartech.com';
                    // let vTravelTeamMail =  'pallanjacob@kaartech.com';
                    // let vTravelTeamMail = oPayload.AgentCode;
                    let vTravelTeamName = oPayload.AgentDescription;
                    let oBusyDialog = new BusyDialog();
                    oBusyDialog.open();
                    await html2pdf().set(oOptions3).from(oPDFfiles).outputPdf().then(async (pdfBlob) => {
                        vBase64 = btoa(pdfBlob);
                        /*   // await that.emailTriggering(vBase64,filename,vTravelTeamName,that.vUserName, vTravelTeamMail,true); */
                    }).catch((err) => {
                        console.error("Error generating the PDF: ", err);
                    });
                    let form = new FormData();
                    form.append("cmisaction", "createDocument");
                    form.append("propertyId[0]", "cmis:name");
                    form.append("propertyValue[0]", filename);
                    form.append("propertyId[1]", "cmis:objectTypeId");
                    form.append("propertyValue[1]", "cmis:document");
                    form.append("succinct", "true");
                    form.append("filename", filename);
                    form.append("_charset_", "UTF-8");
                    form.append("includeAllowableActions", "true");
                    form.append("media", oFile, "");
                    let sUrl = window.location.href.slice(0, 50);
                    let vEnvi;
                    if (sUrl.includes('qas') === true) {
                        vEnvi = appModulePath + "/TAQA_DMS/browser/053e9267-0f4c-4c8c-9a7f-6eb9c496b64b/root/Public root folder/Travel";
                    }
                    else if (sUrl.includes('prd') === true) {
                        vEnvi = appModulePath + "/TAQA_DMS/browser/9db8f74a-14de-474e-b899-14886a195dc7/root/Public root folder/Travel";
                    }
                    else {
                        vEnvi = appModulePath + "/TAQA_DMS/browser/Z_TSD_DMS/root/Public root folder/Travel";
                    }
                    let settings = {
                        "url": vEnvi,
                        "method": "POST",
                        "timeout": 0,
                        "processData": false,
                        "mimeType": "multipart/form-data",
                        "contentType": false,
                        "data": form
                    };
                    $.ajax(settings).done(async function (response) {
                        that.obid = '';
                        that.name = '';
                        that.obid = JSON.parse(response).succinctProperties['cmis:objectId'];
                        that.name = JSON.parse(response).succinctProperties['cmis:name'];
                        oPayload.Attachment = that.obid;
                        oPayload.FileName = that.name;
                        delete oPayload.ItsTicketDetails;
                        delete oPayload.ItsFamilyDetails;
                        let sPath = "/TravelDetails(guid'" + parent_ID + "')";
                        if (vStep === 'Complete') {
                            await that.emailTriggering(vBase64, filename, vTravelTeamName, that.vUserName, vTravelTeamMail, true);
                            delete oPayload.ItsTicketDetails;
                            delete oPayload.ItsFamilyDetails;
                            that.UpdateRecord(oModel, sPath, oPayload).then(async (odata) => {
                                oBusyDialog.close();
                            }).catch((error) => {
                                oBusyDialog.close();
                                MessageBox.error(JSON.parse(error.responseText).error.message.value)
                            });
                        }
                        else {
                            await that.emailTriggering(vBase64, filename, vTravelTeamName, that.vUserName, vTravelTeamMail, false);
                            oJsonVisible.initiate = false;
                            oJsonVisible.complete = true;
                            oJsonVisible.agentresponse = true;
                            oJsonVisible.greyoutfield = false;
                            oJsonVisible.review = false;
                            oJsonVisible.typeoftravel = false;

                            oJsonVisible.VisaRequirement = false;
                            oJsonVisible.LocalMobileNumber = false;
                            that.getView().getModel("visible").refresh();
                            that.getView().getModel("taqa-srv").refresh();
                            oPayload.Status = 'Initiated to Travel Team';
                            oPayload.AgentStatus = 'Open';
                            delete oPayload.ItsTicketDetails;
                            delete oPayload.ItsFamilyDetails;
                            that.UpdateRecord(oModel, sPath, oPayload).then((odata) => {
                                oBusyDialog.close();
                                MessageBox.success("Request Initiated to Travel Team.");
                            }).catch((error) => {
                                oBusyDialog.close();
                                MessageBox.error(JSON.parse(error.responseText).error.message.value)
                            });
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        oBusyDialog.close();
                        /*  // let vError = JSON.parse(jqXHR.responseText).error.message; */
                        MessageBox.error("DMS Error: " + jqXHR.status + " - " + jqXHR.responseText);
                    });
                }
            },
            onReissurance: async function (oEvent) {
                let oSelectedItem = this.getView().byId("idTravelDetailsTable").getSelectedItem().getBindingContext("OJSON").getObject();
                if (oSelectedItem.Status === 'LPO processed by Focal Person') {
                    let oFormData = this.getView().getModel("form");
                    let oJsonVisible = this.getView().getModel("visible").getData();
                    let oModel = this.getView().getModel("taqa-srv");
                    let oParentID = oSelectedItem.ID;
                    let sPath = "/TravelDetails(guid'" + oParentID + "')";
                    let sPath2 = "/TravelDetails";
                    let oFilters = new Array();
                    let oFilter2 = new Array();
                    let expand = 'ItsFamilyDetails';
                    let that = this;
                    let RefNo = '';
                    oFilter2.push(new Filter(
                        "TrfNumber",
                        FilterOperator.EQ,
                        oSelectedItem.TrfNumber
                    ));
                    await this.fetchOdata(oModel, sPath2, oFilter2, expand).then((odata) => {
                        RefNo = Number(odata.results.length);
                        RefNo = RefNo.toString().padStart(3, '0');
                    }).catch((error) => { MessageBox.error(JSON.parse(error.responseText).error.message.value) });
                    this.ReissuedID = oSelectedItem.ID;
                    delete oSelectedItem.ID;
                    delete oSelectedItem.AgentCode;
                    delete oSelectedItem.AgentDescription;
                    delete oSelectedItem.AgentStatus;
                    delete oSelectedItem.Attachment;
                    delete oSelectedItem.CreationDate;
                    delete oSelectedItem.FileName;
                    delete oSelectedItem.FocalPersonName;
                    delete oSelectedItem.Status;
                    delete oSelectedItem.createdAt;
                    delete oSelectedItem.createdBy;
                    delete oSelectedItem.modifiedAt;
                    delete oSelectedItem.modifiedBy;
                    delete oSelectedItem.__metadata;
                    delete oSelectedItem.ItsTicketDetails;
                    delete oSelectedItem.TravelAgentCode;
                    delete oSelectedItem.TravelAgentName;
                    oSelectedItem.ReferenceNumber = RefNo;
                    oFormData.setData(oSelectedItem);
                    oFormData.refresh();
                    oJsonVisible.agent = false;
                    oJsonVisible.agentresponse = false;
                    oJsonVisible.empedit = false;
                    oJsonVisible.createcat = false;
                    oJsonVisible.complete = false;
                    oJsonVisible.create = false;
                    oJsonVisible.add = false;
                    oJsonVisible.delete = false;
                    oJsonVisible.TravelType = false;
                    oJsonVisible.taqa = true;
                    oJsonVisible.amps = false;
                    oJsonVisible.table = false;
                    oJsonVisible.update = false;
                    oJsonVisible.edit = false;
                    oJsonVisible.edittraveller = false;
                    oJsonVisible.attachment = true;
                    oJsonVisible.travelwithfamily = false;
                    this.getView().getModel("visible").refresh();
                    await this.fetchOdata(oModel, sPath, oFilters, expand).then((odata) => {
                        that.getView().getModel("Family").setData(odata.ItsFamilyDetails.results);
                        that.getView().getModel("Family2").setData(odata.ItsFamilyDetails.results);
                    }).catch((error) => {
                        MessageBox.error(JSON.parse(error.responseText).error.message.value)
                    });
                    switch (oSelectedItem.TravelCategory) {
                        case "BU":
                            if (oSelectedItem.CompanyCode === '1000' ||
                                oSelectedItem.CompanyCode === '2000' ||
                                oSelectedItem.CompanyCode === '4000' ||
                                oSelectedItem.CompanyCode === '4010' ||
                                oSelectedItem.CompanyCode === '6000'
                            ) {
                                /* // oSelectedHeader.TypeofTravel = '2';
                                // this.getView().getModel("form").refresh(); */
                                oJsonVisible.amps = true;
                                oJsonVisible.TravelType = true;
                                oJsonVisible.taqa = false;
                                /*  // oJsonVisible.typeoftravel = false; */
                            }
                            else {
                                /* // oSelectedHeader.TypeofTravel = '2';
                                // this.getView().getModel("form").refresh(); */
                                oJsonVisible.amps = false;
                                oJsonVisible.TravelType = false;
                                oJsonVisible.taqa = true;
                                /*  // oJsonVisible.typeoftravel = false; */
                            }
                            oJsonVisible.attachment = false;
                            this.FieldsHide(oJsonVisible, true, false, false, false, false, true, false);
                            break;
                        case "JN":
                            // oJsonVisible.typeoftravel = false;
                            oJsonVisible.attachment = false;
                            this.FieldsHide(oJsonVisible, false, false, false, false, true, false, false);
                            break;
                        case "MS":
                            // oJsonVisible.typeoftravel = false;
                            oJsonVisible.attachment = false;
                            this.FieldsHide(oJsonVisible, false, false, false, false, true, false, false);
                            break;
                        case "TR":
                            if (oSelectedItem.CompanyCode === '1000' ||
                                oSelectedItem.CompanyCode === '2000' ||
                                oSelectedItem.CompanyCode === '4000' ||
                                oSelectedItem.CompanyCode === '4010' ||
                                oSelectedItem.CompanyCode === '6000'
                            ) {
                                /*  // oSelectedHeader.TypeofTravel = '2';
                                 // this.getView().getModel("form").refresh(); */
                                oJsonVisible.amps = true;
                                oJsonVisible.TravelType = true;
                                oJsonVisible.taqa = false;
                                /* // oJsonVisible.typeoftravel = false; */
                            }
                            else {
                                /*  // oSelectedHeader.TypeofTravel = '2';
                                 // this.getView().getModel("form").refresh(); */
                                oJsonVisible.amps = false;
                                oJsonVisible.TravelType = false;
                                oJsonVisible.taqa = true;
                                /*  // oJsonVisible.typeoftravel = false; */
                            }
                            oJsonVisible.attachment = false;
                            this.FieldsHide(oJsonVisible, false, false, false, true, false, true, false);
                            break;
                        case "JT":
                            oJsonVisible.attachment = false;
                            this.FieldsHide(oJsonVisible, false, false, false, false, false, true, true);
                            break;
                        case "SP":
                            oJsonVisible.typeoftravel = false;
                            oJsonVisible.attachment = false;
                            this.FieldsHide(oJsonVisible, false, false, false, false, false, true, false);
                            break;
                        case "AL":
                            oJsonVisible.greyoutfield = false;
                            oJsonVisible.travelwithfamily = true;
                            // oJsonVisible.LocalMobileNumber = true;
                            oJsonVisible.VisaRequirement = false;
                            this.FieldsHide(oJsonVisible, false, true, false, false, false, true, false);
                            break;
                        case "RL":
                            oJsonVisible.greyoutfield = false;
                            // oJsonVisible.LocalMobileNumber = true;
                            oJsonVisible.VisaRequirement = false;
                            this.FieldsHide(oJsonVisible, false, false, true, false, false, true, false);
                            break;
                    }
                    this.openDialog(that.formatter.getTCLabel(oSelectedItem.TravelCategory), "taqaadmintravelreq.fragments.requestForm", '100%', '80%');
                }
                else {
                    MessageBox.warning("Please Select Processed Record Only");
                }
            },
            onDepConfirm: function (oEvent) {
                let aSelectedItem = oEvent.getParameter("selectedItem");
                let oFormModel = this.getView().getModel("form").getData();

                oFormModel.Department = aSelectedItem.getTitle();
                this.getView().getModel("form").refresh();
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

            },
            onDepSearch: function (oEvent) {
                let sValue = oEvent.getParameter("value");
                let oFilter = new Filter({
                    path: "departmentNav/results/0/name",
                    operator: FilterOperator.Contains,
                    value1: sValue,
                    caseSensitive: false
                });
                // let oBinding = oEvent.getSource().getBinding("items");
                let oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);


            },
            onDepartmentF4: function (oEvent) {
                if (!this.pDialogDep) {
                    this.pDialogDep = this.loadFragment({
                        name: 'taqaadmintravelreq.fragments.valueHelps.alldepartment'
                    });
                }
                this.pDialogDep.then(function (oDialog) {
                    oDialog.setTitle("Department Select");
                    oDialog.open();
                });
            },
            onCompanyF4: function (oEvent) {
                this.openDialog2("Company Code Select", "taqaadmintravelreq.fragments.valueHelps.jncompany")
            },
            onAddFamilyButtonPress: function (oEvent) {
                let oTable = oEvent.getSource().getParent().getParent()
                if (oTable.getItems().length <= 3) {
                    let oItem = new ColumnListItem({
                        cells: [
                            // 
                            new Input({ required: true }),//title
                            new Input({ required: true }),//first name
                            new Input({ required: false }),//middle name
                            new Input({ required: true }),//last name
                            new DatePicker({ valueFormat: 'yyyy-MM-dd' }),//dob
                            new Input({ required: true })//relationship
                        ]
                    });
                    oTable.insertItem(oItem, 0);
                } else {
                    MessageBox.warning("Cannot add morethan 4")
                }
            },
            onDeleteFamilyButtonPress: function (oEvent) {
                let oTable = oEvent.getSource().getParent().getParent();
                let oItem = oTable.getSelectedItem();
                if (oItem) {
                    oTable.removeItem(oTable.getSelectedItem());
                } else {
                    MessageBox.warning("Please select row")
                }
            },
            onProjectCodeInputValueHelpRequest: async function (oEvent) {
                let oForm = this.getView().getModel("form").getData();
                let expand = '';
                let expandcc = 'to_Text';
                // let expandwbs = 'to_WBSElement';
                let that = this;
                let oModelWBS = this.getOwnerComponent().getModel("API_PROJECT_V2");
                let sPathWbs = "/WBSElement";
                let oFilter1 = new Array();
                let oModelIO = this.getOwnerComponent().getModel("API_INTERNALORDER_SRV");
                let sPathIO = "/A_InternalOrder";
                let oFilter2 = new Array();
                let oModelCC = this.getOwnerComponent().getModel("API_COSTCENTER_SRV");
                let sPathCC = "/A_CostCenter";
                let oFilter3 = new Array();
                let oWbsData;
                let oIodata;
                let oCCdata;
                switch (oForm.ExpenseCode) {
                    case "WBS Code":
                        oFilter1.push(new Filter("CompanyCode", FilterOperator.EQ, oForm.CompanyCode));
                        oWbsData = await that.fetchOdata2(oModelWBS, sPathWbs, oFilter1);
                        that.getView().getModel("WBS").setData(oWbsData);
                        that.openDialog2("Wbs Code Select", "taqaadmintravelreq.fragments.valueHelps.wbs");
                        break;
                    case "Internal Order":
                        oFilter2.push(new Filter("CompanyCode", FilterOperator.EQ, oForm.CompanyCode));
                        oIodata = await that.fetchOdata(oModelIO, sPathIO, oFilter2, expand);
                        that.getView().getModel("IO").setData(oIodata);
                        that.openDialog2("Internal Order Select", "taqaadmintravelreq.fragments.valueHelps.io");
                        break;
                    case "Alternative CostCentre":
                        oFilter3.push(new Filter("CompanyCode", FilterOperator.EQ, oForm.CompanyCode));
                        oCCdata = await that.fetchOdata(oModelCC, sPathCC, oFilter3, expandcc);
                        that.getView().getModel("CC").setData(oCCdata);
                        that.openDialog2("CostCenter Select", "taqaadmintravelreq.fragments.valueHelps.cc");
                        break;
                    default:
                        break;
                }
            },
            onSelectChange: function () {
                let oForm = this.getView().getModel("form").getData();
                oForm.ProjectCode = '';
                this.getView().getModel("form").refresh();
            },
            onWbsSelectDialogSearch: function (oEvent) {
                let sValue = oEvent.getParameter("value");
                let oFilter = new Filter("WBSElementExternalID", FilterOperator.Contains, sValue);
                let oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
            onIoSelectDialogSearch: function (oEvent) {
                let sValue = oEvent.getParameter("value");
                let oFilter = new Filter("InternalOrder", FilterOperator.Contains, sValue);
                let oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
            onCCSelectDialogSearch: function (oEvent) {
                let sValue = oEvent.getParameter("value");
                let oFilter = new Filter("to_Text/results/0/CostCenter", FilterOperator.Contains, sValue);
                let oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
            SelectDialogConfirm: function (oEvent) {
                let aSelectedItem = oEvent.getParameter("selectedItem");
                let oFormModel = this.getView().getModel("form").getData();
                oFormModel.ProjectCode = aSelectedItem.getTitle();
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                this.getView().getModel("form").refresh();
                this.getView().getModel("WBS").setData({});
                this.getView().getModel("IO").setData({});
                this.getView().getModel("CC").setData({});
            },
            onTravelTypeSelectChange: function (oEvent) {
                let oKey = oEvent.getSource().getSelectedKey();
                let oJsonVisible = this.getView().getModel("visible").getData();
                if (oKey === '1') {
                    oJsonVisible.Exit = false;
                    oJsonVisible.VisaRequirement = false;
                } else {
                    oJsonVisible.Exit = true;
                    oJsonVisible.VisaRequirement = true;
                }
                this.getView().getModel("visible").refresh();
            },
            onUpdateButtonPress: function (oEvent) {
                let oDynamicTable = oEvent.getSource().getParent().getContent()[5],
                    oSelectedItems = oDynamicTable.getItems();
                let sCheck = this.CheckRequired();
                if (sCheck === 0) {
                    let oBusyDialog = new BusyDialog();
                    let that = this;
                    let oJsonVisible = this.getView().getModel("visible").getData();
                    let oPayload = this.getView().getModel("form").getData();
                    let oModel = this.getView().getModel("taqa-srv");
                    let sPath = "/TravelDetails(guid'" + oPayload.ID + "')",
                        sID = oPayload.ID;
                    delete oPayload.ItsFamilyDetails;
                    let aBatchOperations = [];
                    if (oSelectedItems.length !== 0) {
                        oBusyDialog.open();
                        oSelectedItems.forEach(function (oSelectedItem) {
                            let aCells = oSelectedItem.getCells();
                            let oPayload2 = {};
                            oPayload2["ID"] = aCells[0].getText();
                            oPayload2["TravelDate"] = aCells[1].getValue();
                            oPayload2["TicketNumber"] = aCells[2].getValue();
                            oPayload2["SectorTicket"] = aCells[3].getValue();
                            oPayload2["Airline"] = aCells[4].getValue();
                            let BaseAmount = parseFloat(aCells[5].getValue());
                            oPayload2["BaseAmount"] = BaseAmount.toFixed(2);
                            let TaxAmount = parseFloat(aCells[6].getValue());
                            oPayload2["TaxAmount"] = TaxAmount.toFixed(2);
                            let Gst = parseFloat(aCells[7].getValue());
                            oPayload2["Gst"] = Gst.toFixed(2);
                            oPayload2["Currency"] = aCells[8].getValue();
                            let Amount;
                            if (isNaN(Gst)) {
                                Amount = BaseAmount + TaxAmount;
                            } else {
                                Amount = BaseAmount + TaxAmount + Gst;
                            }
                            oPayload2["Amount"] = Amount.toFixed(2);
                            aCells[9].setValue(Amount.toFixed(2));
                            oPayload2["Sector"] = aCells[10].getValue();
                            oPayload2["parent_ID"] = sID;
                            aBatchOperations.push(oPayload2);
                        });
                        oPayload.ItsTicketDetails = aBatchOperations;
                        that.UpdateBatch(oModel, sPath, oPayload).then((odata) => {
                        }).catch((oError) => {
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                        });
                        oModel.submitChanges({
                            groupId: 'myBatchGroup',
                            success: async function (oData, oResponse) {
                                let expand = 'ItsTicketDetails';
                                let oFilter = new Array();
                                await that.fetchOdata(oModel, sPath, oFilter, expand).then((odata) => {
                                    that.getView().getModel("Ticket2").setData({});
                                    that.getView().getModel("Ticket2").setData(odata.ItsTicketDetails.results);
                                }).catch((error) => {
                                    MessageBox.error(JSON.parse(error.responseText).error.message.value);
                                });
                                let vStep = 'Complete';
                                that.onPdfButtonPress(vStep);
                                oBusyDialog.close();
                                oJsonVisible.complete = false;
                                oJsonVisible.update = false;
                                oJsonVisible.table = false;
                                that.getView().getModel("visible").refresh();
                                that.getView().getModel("form").refresh();
                                that.getView().getModel("taqa-srv").refresh();
                            },
                            error: function (oError) {
                                oBusyDialog.close();
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                            }
                        });
                    }
                    else {
                        MessageBox.error("Kindly Add Ticket details")
                    }
                }
            },
            onEditButtonPress: function (oEvent) {
                let oJsonVisible = this.getView().getModel("visible").getData();
                oJsonVisible.update = true;
                oJsonVisible.table = true;
                oJsonVisible.edit = false;
                this.getView().getModel("visible").refresh();
            },
            onSelectDialogSearchTC: function (oEvent) {
                const sValue = oEvent.getParameter("value").toLowerCase(); // Get the search value
                const oDialog = oEvent.getSource(); // Get the SelectDialog
                const aItems = oDialog.getItems(); // Get all items in the dialog
                aItems.forEach(function (oItem) {
                    const sTitle = oItem.getTitle().toLowerCase(); // Get the title of the item
                    oItem.setVisible(sTitle.includes(sValue)); // Show or hide based on the search value
                });
            },
            onStatusSelectDialogSearchTC: function (oEvent) {
                const sValue = oEvent.getParameter("value").toLowerCase(); // Get the search value
                const oDialog = oEvent.getSource(); // Get the SelectDialog
                const aItems = oDialog.getItems(); // Get all items in the dialog
                aItems.forEach(function (oItem) {
                    const sTitle = oItem.getTitle().toLowerCase(); // Get the title of the item
                    oItem.setVisible(sTitle.includes(sValue)); // Show or hide based on the search value
                });
            },

            onDepartureSectorComboBoxChange: async function (flag) {

                let oForm = this.getView().getModel("form").getData();
                if (flag !== true) {
                    oForm.DepartureAirportCity = '';
                    this.getView().getModel("form").refresh();
                }


                let oModel = this.getOwnerComponent().getModel();
                let sPath = "/PickListValueV2";
                let oFilter = new Array();
                let oAirCity;

                oFilter.push(new Filter("PickListV2_id", FilterOperator.EQ, 'TravelDeptAiportCities'));
                oFilter.push(new Filter("parentPickListValue", FilterOperator.EQ, oForm.DepartureSector));
                oAirCity = await this.ReadOdata(oModel, sPath, oFilter);
                this.getView().getModel("DepAirportCity").setData({});
                this.getView().getModel("DepAirportCity").setData(oAirCity);
            },

            onDestinationSectorComboBoxChange: async function (flag) {

                let oForm = this.getView().getModel("form").getData();
                if (flag !== true) {
                    oForm.AirportCity = '';
                    this.getView().getModel("form").refresh();
                }

                let oModel = this.getOwnerComponent().getModel();
                let sPath = "/PickListValueV2";
                let oFilter = new Array();
                let oAirCity;

                oFilter.push(new Filter("PickListV2_id", FilterOperator.EQ, 'TravelDeptAiportCities'));
                oFilter.push(new Filter("parentPickListValue", FilterOperator.EQ, oForm.DestinationCountry));
                oAirCity = await this.ReadOdata(oModel, sPath, oFilter);

                this.getView().getModel("AirportCity").setData({});
                this.getView().getModel("AirportCity").setData(oAirCity);
            },

            onDateOfBirthDatePickerChange: function (oEvent) {
                let dob = oEvent.getParameter("value");
                let Age = this.calculateAge(dob);
                this.getView().byId("idAgeInput").setValue(Age.toString());

            },

            onCancel: function (oEvent) {

                let oSelectedItem = this.getView().byId("idTravelDetailsTable").getSelectedItem().getBindingContext("OJSON").getObject();

                if (oSelectedItem) {
                    if (oSelectedItem.Status === 'Open') {
                        let oItemData = oSelectedItem;
                        MessageBox.confirm("Are you sure you want to cancel this record?", {
                            title: "Confirm Cancellation",
                            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                            onClose: async (oAction) => {
                                if (oAction === MessageBox.Action.OK) {
                                    let oModel = this.getView().getModel("taqa-srv");
                                    let sPath = "/TravelDetails(guid'" + oItemData.ID + "')";
                                    let that = this;
                                    let oBusyDialog = new BusyDialog();
                                    oBusyDialog.open();
                                    let oPayload = {
                                        "Status": 'Cancelled'
                                    };
                                    await that.UpdateRecord(oModel, sPath, oPayload).then((odata) => {
                                        // oBusyDialog.close();
                                        const appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
                                        const appPath = appId.replaceAll(".", "/");
                                        const appModulePath = jQuery.sap.getModulePath(appPath);
                                        let vTravelCatogry = that.formatter.getTCLabel(oSelectedItem.TravelCategory);
                                        let vCreationDate = (oSelectedItem.CreationDate).slice(0, 10);
                                        const settings1 = {
                                            "url": appModulePath + "/TAQA_BPA/workflow-instances",
                                            "method": "POST",
                                            "timeout": 0,
                                            contentType: "application/json",
                                            data: JSON.stringify({

                                                "definitionId": "taqatravelnotify.taqatravelemailnotification",
                                                "context": {
                                                    // "employeeemailid": oSelectedItem.EmailId,
                                                    "employeeemailid": 'ksanjaygiri@kaartech.com',
                                                    "employeename": oSelectedItem.EmployeeName,
                                                    "submitteddate": vCreationDate,
                                                    "reason": vTravelCatogry,
                                                    "focalperson": that.vUserName


                                                }

                                            }),
                                        };
                                        $.ajax(settings1).done(async function (response) {

                                            oBusyDialog.close();

                                        }).fail(function (jqXHR, textStatus, errorThrown) {

                                            oBusyDialog.close();
                                            let vError = JSON.parse(jqXHR.responseText).error.message;
                                            MessageBox.error("Email Service Error: " + jqXHR.status + " - " + vError);
                                        });


                                        that.onSearch();

                                    }).catch((error) => {
                                        oBusyDialog.close();
                                        MessageBox.error(JSON.parse(error.responseText).error.message.value);
                                    });


                                } else {

                                    // MessageBox.information("Cancellation action was cancelled.");
                                }
                            }
                        });
                    } else {
                        MessageBox.information("Please Select only Open Record.");
                    }
                } else {
                    MessageBox.warning("Please select a record to Cancel.");
                }
            },

            onEditTravellerinfo: function (oEvent) {
                let oJsonVisible = this.getView().getModel("visible").getData();
                let oSelectedHeader = this.getView().getModel("form").getData();
                oJsonVisible.edittraveller = false;
                oJsonVisible.review = true;
                oJsonVisible.agent = true;
                oJsonVisible.initiate = true;
                oJsonVisible.agentresponse = false;
                oJsonVisible.complete = false;
                oJsonVisible.typeoftravel = true;
                oJsonVisible.greyoutfield = true;
                oJsonVisible.VisaRequirement = true;
                oJsonVisible.LocalMobileNumber = true;
                switch (oSelectedHeader.TravelCategory) {
                    case "JN":
                        oJsonVisible.typeoftravel = false;
                    case "AL":
                        oJsonVisible.greyoutfield = false;
                        oJsonVisible.VisaRequirement = false;
                    case "RL":
                        oJsonVisible.greyoutfield = false;
                        oJsonVisible.VisaRequirement = false;
                }
                this.getView().getModel("visible").refresh();
            },

            onDownloadButtonPress: async function (oEvent) {
                let oForm = this.getView().getModel("form").getData();
                let oModel = this.getOwnerComponent().getModel();
                let sPath = '/Attachment';
                let oFilters = new Array();
                oFilters.push(new Filter("attachmentId", FilterOperator.EQ, oForm.FileID));
                if (oForm.DocName) {
                    let oData = await this.ReadOdata(oModel, sPath, oFilters);
                    let fileContent = oData.results[0].fileContent;
                    let filename1 = oData.results[0].fileName;
                    let type = oData.results[0].mimeType;



                    var byteCharacters = atob(fileContent); // Decoding base64 string
                    var byteArrays = [];

                    // Convert base64 to binary data
                    for (var offset = 0; offset < byteCharacters.length; offset++) {
                        var byteValue = byteCharacters.charCodeAt(offset);
                        byteArrays.push(byteValue);
                    }
                    var byteArray = new Uint8Array(byteArrays); // assuming fileContent is an array of bytes
                    var blob = new Blob([byteArray], { type: type });

                    // Create a temporary download link
                    var link = document.createElement('a');
                    var fileName = filename1 || "downloadedFile"; // Use the file name from the OData response

                    // Create a URL for the Blob object
                    var url = URL.createObjectURL(blob);

                    // Set the download attributes
                    link.href = url;
                    link.download = fileName;

                    // Trigger the download by clicking the link
                    link.click();

                    // Clean up the URL object after download
                    URL.revokeObjectURL(url);
                } else {
                    MessageBox.information("No Attachment is uploaded by Employee.")
                }
            },

            onPickListValueComboBoxChange(oEvent) {
                debugger;
                let vName = oEvent.getSource().getValue();
                let vCode = oEvent.getSource().getSelectedKey();
                let oForm = this.getView().getModel("form").getData();
                oForm.TravelAgentName = vName;
                oForm.TravelAgentCode = vCode;
                this.getView().getModel("form").refresh();
            },

        });
    });
