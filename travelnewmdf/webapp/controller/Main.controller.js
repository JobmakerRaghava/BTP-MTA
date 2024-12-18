sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function (BaseController,
	JSONModel,
	Filter,
	FilterOperator,
	MessageBox) {
	"use strict";


	return BaseController.extend("taqa.travelnewmdf.controller.Main", {



		onInit: function () {
			this.declareModel("taqasrv");
			this.declareModel("visible");
			this.test = new JSONModel([{
				TravelId: "12334",
				TravelType: "Business Travel",
				TravelCountry: "1000",
				Deparment: "12-08-2024",
				Division: "20-08-2024",
				HomeCountry: "USA",
				Status: "Approved",
				type: "BU"
			},
			{
				TravelId: "2456",
				TravelType: "Training",
				TravelCountry: "1000",
				Deparment: "12-08-2024",
				Division: "20-08-2024",
				HomeCountry: "USA",
				Status: "Approved",
				type: "TR"
			},
			// {
			// 	TravelId: "984345",
			// 	TravelType: "Separation Travel",
			// 	TravelCountry: "1000",
			// 	Deparment: "AZR",
			// 	Division: "403043",
			// 	HomeCountry: "USA",
			// 	Status: "Approved",
			// 	type:"BU"
			// },
			{
				TravelId: "78532",
				TravelType: "Annual Leave",
				TravelCountry: "1000",
				Deparment: "12-08-2024",
				Division: "20-08-2024",
				HomeCountry: "USA",
				Status: "Approved",
				type: "AL"
			},
			{
				TravelId: "1234",
				TravelType: "Rotational Leave",
				TravelCountry: "1000",
				Deparment: "12-08-2024",
				Division: "20-08-2024",
				HomeCountry: "USA",
				Status: "Approved",
				type: "RL"
			}

			]
			);
		},

		onGoButtonPress: function () {
			let vTravelType = this.byId("idRadioButtonGroup").getSelectedButton().getText();
			let vEmpid;
			let oJsonVisible = this.getOwnerComponent().getModel("visible").getData();
			oJsonVisible.title = vTravelType;

			if (vTravelType === "Joining Travel") {
				vEmpid = this.byId("idInputnation").getValue();
				oJsonVisible.addbutton = true;
			} else {
				vEmpid = this.byId("idInputEmpid").getValue();
				// this.getOwnerComponent().getModel("visible").setData({"addbutton":false});
				oJsonVisible.addbutton = false;
			}
			if (vTravelType === "Separation Travel") {
				// this.getOwnerComponent().getModel("visible").setData({"addbutton":true});
				oJsonVisible.addbutton = true;
			}

			// let oModel = this.getOwnerComponent().getModel(),
			// 	// vEmpid = this.byId("idInputEmpid").getValue(),

			let vTravCat = this.byId("idRadioButtonGroup").getSelectedButton().getId().slice(-2);
			// 	sPath = "/cust_businessTravelReqParent",
			// 	sExpand = "cust_businessTravelRequestChild",
			// 	oFilters = new Array(),
			// 	filterById = new Filter("cust_EmployeeID", FilterOperator.EQ, vEmpid),
			// 	filterByCat = new Filter("cust_businessTravelRequestChild/cust_travelcategory", FilterOperator.EQ, vTravCat);
			// oFilters.push(filterById);
			// oFilters.push(filterByCat);


			// this.ReadOdata(oModel, sPath, oFilters, sExpand).then((odata) => {
			// 	this.getView().getModel("travel").destroy();
			// 	this.getView().getModel("travel").setData(odata.results);
			// 	this.getOwnerComponent().getRouter().navTo("Master", {
			// 		// empno: vEmpid,
			// 		empno: "54",
			// 		travelcategory: vTravCat
			// 	});
			// }).catch((oError) => {
			// 	debugger;
			// });
			let oFinalData = this.test.getData().filter(element => { return element.type === vTravCat });
			this.getOwnerComponent().getModel("taqasrv").setData(oFinalData);

			try {
				this.getOwnerComponent().getRouter().navTo("Master", {
					empno: vEmpid,
					// empno: "54",
					travelcategory: vTravCat
				});
			} catch (error) {
				MessageBox.error("Enter Employee No/External Code")
			}


			this.getOwnerComponent().getModel("visible").refresh();
		},

		onRadioButtonGroupSelect: function (oEvent) {
			let vTravelType = this.byId("idRadioButtonGroup").getSelectedButton().getText();
			if (vTravelType === "Joining Travel") {
				this.byId("idInputEmpid").setEditable(false);
				this.byId("idInputnation").setEditable(true);
			} else {
				this.byId("idInputnation").setEditable(false);
				this.byId("idInputEmpid").setEditable(true);
			}
		},

		onInputValueHelpRequest: function (oEvent) {
			this.openDialog("Employee No Select", "taqa.travelnewmdf.fragments.valueHelps.empNo")
		},
		onPerPersonSelectDialogConfirm: async function (oEvent) {
			try {

				var oSelectedItem = oEvent.getParameter("selectedItem"),
					oInput = this.byId("idInputEmpid");

				if (!oSelectedItem) {
					oInput.resetProperty("value");
					return;
				}

				oInput.setValue(oSelectedItem.getCells()[0].getNumber());
			} catch (error) {

			}
		},

		onPerPersonSelectDialogSearch: function (oEvent) {
			let sValue = oEvent.getParameter("value");
			let oFilter = new Filter("personIdExternal", FilterOperator.Contains, sValue);
			let oBinding = oEvent.getParameter("itemsBinding");
			oBinding.filter([oFilter]);
		},


	});
});