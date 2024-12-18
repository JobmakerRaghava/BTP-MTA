sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/f/library",
    "sap/m/MessageBox",
    "taqa/travelnewmdf/util/jspdf.umd.min",
    "taqa/travelnewmdf/util/html2canvas.min",
    "taqa/travelnewmdf/util/purify.min",
    "taqa/travelnewmdf/util/html2pdf.bundle.min",
],
    function (BaseController,
        JSONModel,
        Filter,
        FilterOperator,
        library,
        MessageBox,
        JspdfUmdmin,
        HtmlcanvasMin,
        PurifyMin,
        HtmlpdfBundlemin
    ) {
        "use strict";
        var LayoutType = library.LayoutType;
        return BaseController.extend("taqa.travelnewmdf.controller.Master", {
            onInit: function () {

                this.declareModel("form");
                this.oFilterBar = this.getView().byId("filterbar");
                this.oTable = this.getView().byId("idTravelDetailsTable");
                let test = new JSONModel([{
                    TravelId: "12334",
                    TravelType: "Business Travel",
                    TravelCountry: "1000",
                    Deparment: "AZR",
                    Division: "403043",
                    HomeCountry: "USA",
                    Status: "Draft"
                },
                {
                    TravelId: "2456",
                    TravelType: "Training",
                    TravelCountry: "1000",
                    Deparment: "AZR",
                    Division: "403043",
                    HomeCountry: "USA",
                    Status: "Draft"
                },
                {
                    TravelId: "984345",
                    TravelType: "Separation Travel",
                    TravelCountry: "1000",
                    Deparment: "AZR",
                    Division: "403043",
                    HomeCountry: "USA",
                    Status: "Draft"
                },
                {
                    TravelId: "78532",
                    TravelType: "Annual Leave",
                    TravelCountry: "1000",
                    Deparment: "AZR",
                    Division: "403043",
                    HomeCountry: "USA",
                    Status: "Draft"
                },
                {
                    TravelId: "1234",
                    TravelType: "Rotational Leave",
                    TravelCountry: "1000",
                    Deparment: "AZR",
                    Division: "403043",
                    HomeCountry: "USA",
                    Status: "Draft"
                }

                ]
                );
                // this.getView().setModel(test, "taqasrv");
                // let vtypes = this.getOwnerComponent().getModel("taqasrv").getData();
                // if (vtypes[0].type !== "NJ") {
                //     this.byId("idCreateRequestButton").setVisible(true)
                // } 
                this.getOwnerComponent().getRouter().getRoute("Master").attachPatternMatched(this._onObjectMatched, this);

            },
            _onObjectMatched: function (oEvent) {
                let oArguments = oEvent.getParameter("arguments");

                this._empno = oArguments.empno;
                this._travelcategory = oArguments.travelcategory;

            },

            onColumnListItemPress: function (oEvent) {
                let oSelectedItem = oEvent.getSource().getBindingContext("taqasrv").getObject();
                let oJsonVisible = this.getView().getModel("visible").getData();
                oJsonVisible.agent = false;
                oJsonVisible.agentresponse = false;
                // this.getView().getModel("visible").setData({
                //     "agent": false, "agentresponse": false
                // });
                this.openDialog(oSelectedItem.TravelType, "taqa.travelnewmdf.fragments.requestForm");

                switch (oSelectedItem.TravelType) {
                    case "Business Travel":
                        this.FieldsHide(oJsonVisible, true, false, false, false, false, true);
                        break;
                    // case "Joining Travel":
                    //     this.FieldsHide(oJsonVisible, false, false, false, false, false, false, false, false);
                    //     break;
                    case "Training":
                        this.FieldsHide(oJsonVisible, false, false, false, true, false, true);
                        break;
                    case "Job Travel":
                        this.FieldsHide(oJsonVisible, false, false, false, false, false, true);
                        break;
                    case "Separation Travel":
                        this.FieldsHide(oJsonVisible, false, false, false, false, false, true);
                        break;
                    case "Annual Leave":
                        this.FieldsHide(oJsonVisible, false, true, false, false, false, true);
                        break;
                    case "Rotational Leave":
                        this.FieldsHide(oJsonVisible, false, false, true, false, false, true);
                        break;
                }
            },
            onCloseButtonPress: function (oEvent) {
                oEvent.getSource().getParent().close();

            },
            onAgentSelectDialogConfirm: function (oEvent) {
                let aSelectedItem = oEvent.getParameter("selectedItem");
                let oFormModel = this.getOwnerComponent().getModel("form").getData();
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                oFormModel.AgentCode = aSelectedItem.getTitle();
                oFormModel.AgentDescription = aSelectedItem.getDescription();
                this.getOwnerComponent().getModel("form").refresh();
                // this.getView().byId("idAgent").setValue(aSelectedItem);
            },
            onAgentSelectDialogSearch: function (oEvent) {
                let sValue = oEvent.getParameter("value");
                let oFilter = new Filter("Column1", FilterOperator.Contains, sValue);
                let oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
            onAgentValueHelpRequest: function () {
                // this.openDialog("Agent Select", "taqa.travelnewmdf.fragments.valueHelps.agentdetails")
                this.openDialog("Agent Select", "taqa.travelnewmdf.fragments.valueHelps.agentdetails");
            },

            onPdfButtonPress: function (oEvent) {
                var oSelectedHeader = this.getView().getModel("form").getData();
                var oSelectedItem = this.getView().getModel("form").getData();
                //var oItem = this.getView().getModel("item").getData();
                var oSelectedTicket = this.getView().getModel("form").getData();
                var difftime = Math.abs(new Date(oSelectedItem.ReturnDate) - new Date(oSelectedItem.DepartureDate));
                var NoOfDays = Math.ceil(difftime / (1000 * 60 * 60 * 24));
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
                var yyyy = today.getFullYear();
                var date = yyyy + '-' + mm + '-' + dd;
                if (oSelectedHeader.ReissuranceRefNo) {
                    var RefNo = oSelectedHeader.ReissuranceRefNo + "_01";
                }
                else {
                    var RefNo = oSelectedItem.TravelCountry + "/" + yyyy;
                }
                var logo = "../util/taqalogo.webp";
                // let vtype = oEvent.getSource().getParent().getTitle();
                let oFormPdf = `<html>

<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>${oSelectedItem.TravelType}</title>
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
        <div style='display: flex; flex-direction: row;border-bottom: 1px solid #000033;'>
            <div style='display: flex; flex-direction: row; align-items: left; width: 50%;' class='vertical_line'>
                <img src="${logo}" class='left_margin' style='margin-top: 10px;' height='80px' width='100px'>
                <h3>TRAVEL REQUEST/LPO FORM (TRF)</h3>
            </div>
            <div class='left_margin vertical_line' style='width: 25%;'>
                <h6>(Div-Country/initial/S.No/Year)</h6>
                <h4>${RefNo}</h4>
            </div>
            <div class='left_margin' style='width: 25%;'>
                <h5>Date : ${date}</h5>
            </div>
        </div>
        

        <div class='section'>
            <input type='checkbox'><label>New Booking</label>
            <input type='checkbox'><label>Others</label>
            <input type='checkbox'><label>For Office Staff</label>
            <input type='checkbox'><label>For Field Staff</label>
        </div>

        <div style='display: flex; flex-direction: row; border-bottom: 1px solid #000033;'>
            <div class='vertical_line' style='width: 33%; padding: 5px;'>
                <b>Focal Person :</b>
                <label>${oSelectedHeader.FocalPerson}</label>
            </div>
            <div class='left_margin vertical_line' style='width: 33%; padding: 5px;'>
                <b>Department :</b>
                <label>${oSelectedHeader.Deparment}</label>
            </div>
            <div class='left_margin' style='width: 33%; padding: 5px;'>
                <b>Contact No :</b>
                <label>${oSelectedHeader.ContactNo}</label>
            </div>
        </div>

        <div class='center section'> 
            <caption class='caption-style'><b>TRAVELLER INFORMATION (As it appears on passport)</b></caption>
        </div>

        <div class='section'>
           
    
            <table  border='1' class='full-width' >
                <tr>
                    <th style='width: 8%;'>Title</th>
                    <th style='width: 8%;'>First Name</th>
                    <th style='width: 9%;'>Last Name</th>
                    <th style='width: 11%;'>Middle Name</th>
                    <th style='width: 10%;'>Date of Birth</th>
                    <th style='width: 10%;'>Emp.No</th>
                    <th style='width: 12%;'>Travel Purpose</th>
                    <th style='width: 9%;'>Designation</th>
                </tr>
                <tr>
                    <td align='center'>${oSelectedHeader.title}</td>
                    <td align='center'>${oSelectedHeader.EmployeeFirstName}</td>
                    <td align='center'>${oSelectedHeader.EmployeeLastName}</td>
                    <td align='center'>${oSelectedHeader.EmployeeMiddleName}</td>
                    <td align='center'>${oSelectedHeader.DateOfBirth}</td>
                    <td align='center'>${oSelectedHeader.EmployeeID}</td>
                    <td align='center'>${oSelectedHeader.TravelType}</td>
                    <td align='center'>${oSelectedHeader.Designation}</td>
                </tr>
            </table>
        </div>

        <div class='section'>
            <b>Type of Travel :</b>
            <input type='checkbox'><label>One Way</label>
            <input type='checkbox'><label>Return</label>
            <b>Class :</b>
            <input type='checkbox'><label>Business</label>
            <input type='checkbox'><label>Economy</label>
        </div>

        <div class='center section'>
            <caption><b>TRAVEL ITINERARY REQUIRED</b></caption>
        </div>

        <div class='section'>
         
            <table border='1' class='full-width'>
                <tr>
                    <th>Departure Date</th>
                    <th>Sector</th>
                    <th>Time</th>
                    <th>Return Date</th>
                    <th>Sector</th>
                    <th>Time</th>
                </tr>
                <tr>
                    <td align='center'>${oSelectedItem.DepartureDate}</td>
                    <td align='center'>${oSelectedItem.DepartureSector}</td>
                    <td align='center'>${oSelectedItem.DepartureTime}</td>
                    <td align='center'>${oSelectedItem.ReturnDate}</td>
                    <td align='center'>${oSelectedItem.ReturnSector}</td>
                    <td align='center'>${oSelectedItem.ReturnTime}</td>
                </tr>
            </table>
        </div>


        <div class='section'>
            <b>Local Mob No:</b>
            <label>${oSelectedItem.LocalModbileNumber}</label>
        </div>

        <div style='display: flex; flex-direction: row; border-bottom: 1px solid #000033;'>
            <div style='width:50%; padding: 5px;'>
                <b>Do You Have Travel Visa</b>
                <input type='checkbox'>
                <label>Yes</label>
                <input type='checkbox'>
                <label>No</label>
            </div>
            <div style='padding: 5px;'>
                <b>Frequently Flyer No. If any:</b>
                <label>${oSelectedItem.FrequentFlyerNumber}</label>
            </div>
        </div>

        <div class='center section'>
            <caption><b>LPO - TO BE FILLED BY FOCAL POINT</b></caption>
        </div>

        <div style='display: flex; flex-direction: row; border-bottom: 1px solid #000033;'>
            <div class='vertical_line' style='width: 40%; padding: 5px;'>
                <b>LPO No. (Travel Agent abbreviation/TRF No): </b>
            </div>
            <div class='left_margin vertical_line' style='width: 40%; padding: 5px;'>
                <label></label>
            </div>
            <div class='left_margin vertical_line' style='width: 10%; padding: 5px;'>
                <b>Currency</b>
            </div>
            <div class='left_margin' style='width: 10%; padding: 5px;'>
                <label></label>
            </div>
        </div>

        <div class='section'>
            <table border='1' class='full-width'>
                <tr>
                    <th style='width: 8%;'>Airline</th>
                    <th style='width: 8%;'>Sector</th>
                    <th style='width: 11%;'>Travel Date</th>
                    <th style='width: 10%;'>Ticket No</th>
                    <th style='width: 10%;'>Base Fare</th>
                    <th style='width: 8%;'>Taxes</th>
                    <th style='width: 13%;'>Curency Total</th>
                    <th>Remarks: To be filled by MSE Travel Focal Point, if any</th>
                </tr>
                <tr>
                    <td align='center'>${oSelectedTicket.Airline}</td>
                    <td align='center'>${oSelectedTicket.Sector}</td>
                    <td align='center'>${oSelectedTicket.TravelDate}</td>
                    <td align='center'>${oSelectedTicket.TicketNo}</td>
                    <td align='center'>${oSelectedTicket.BaseFare}</td>
                    <td align='center'>${oSelectedTicket.Taxes}</td>
                    <td align='center'>${oSelectedTicket.CurrencyTotal}</td>
                    <td align='center'>${oSelectedTicket.Remarks}</td>
                </tr>
            </table>
        </div>

      

        <div style='display: flex; flex-direction: row;'>
            <div class='vertical_line' style='width: 50%; padding: 5px;'>
                <b>Total Amount: </b>
            </div>

            <div class='left_margin ' style='width: 10%; padding: 5px;'>
                <b>Total in Words:</b>
            </div>
        </div>

    </div>
</body>

</html>
`;
                var oFilename = `Travel.pdf`;
                const oOptions3 = {
                    margin: [0.3, 0.3, 0.3, 0.3],
                    filename: oFilename,
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'A4', orientation: 'p' },
                    // pagebreak: {avoid: 'tr' }
                };

                html2pdf().set(oOptions3).from(oFormPdf).save();





            },



            onCreateRequestButtonPress: function (oEvent) {

                let oJsonVisible = this.getOwnerComponent().getModel("visible").getData();
                oJsonVisible.agent = false;
                oJsonVisible.agentresponse = false;
                if (oJsonVisible.title === "Joining Travel") {
                    this.FieldsHide(oJsonVisible, false, false, false, false, true, true);
                } else {
                    this.FieldsHide(oJsonVisible, false, false, false, false, false, true);
                }
                this.openDialog(oJsonVisible.title, "taqa.travelnewmdf.fragments.requestForm");
                this.getOwnerComponent().getModel("visible").refresh();
            },

            onSaveAsDraftButtonPress: function (oEvent) {
                MessageBox.success("Form is Reviwed");
                let oJsonVisible = this.getView().getModel("visible").getData();
                oJsonVisible.agent = true;
                this.getView().getModel("visible").refresh();
            },
            onAgentInitiateProcess: function (oEvent) {
                MessageBox.success("Request Initiated to Travel Agent");
                let oJsonVisible = this.getView().getModel("visible").getData();
                oJsonVisible.agentresponse = true;
                this.getView().getModel("visible").refresh();

                // const appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
                // const appPath = appId.replaceAll(".", "/");
                // const appModulePath = jQuery.sap.getModulePath(appPath);

                // const settings = {
                //     "url": appModulePath + "/TAQA_BPA/workflow-instances",
                //     // "url": "TAQA_BPA/workflow-instances",
                //     "method": "POST",
                //     "timeout": 0,
                //     contentType: "application/json",
                //     data: JSON.stringify({
                //         "definitionId": "eu10.taqa-dev-fiori.taqatravelemailnotification.emailForTravel",
                //         "context": {
                //             "employeeid": that.getView().getModel("form").getData().EmployeeID,
                //             "employeename": that.getView().getModel("form").getData().EmployeeFirstName,
                //             "ticketnumber": oData.TicketNo,
                //             "airline": oData.Airline,
                //             "traveldate": oData.TravelDate,
                //             "sector": oData.Sector,
                //             "basefare": oData.BaseFare,
                //             "taxes": oData.Taxes,
                //             "currency": oData.Currency,
                //             "comments": oData.Comments,
                //             "employeeemailid": "ksanjaygiri@kaartech.com",
                //             "travelagentemailid": that.userEmail,
                //             "focalpersonemailid": "ksanjaygiri@kaartech.com"
                //         }
                //     }),
                // };


                // $.ajax(settings).done(function (response) {

                // });
            },



        });
    });
