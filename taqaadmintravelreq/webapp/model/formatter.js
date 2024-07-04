sap.ui.define([
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "taqaadmintravelreq/controller/BaseController"
    
], function (DateFormat,
	Filter,
	FilterOperator,
	BaseController) {
    'use strict';
    return {
        dateChange: function (sValue) {
            var oDateFormat = DateFormat.getDateTimeInstance({ pattern: "dd-MM-yyyy" });
            return oDateFormat.format(sValue);
        },
        relationLabel: async function (sValue) {

            var oModel = this.getOwnerComponent().getModel(),
                filterByLoc,
                label,
                ofilters = new Array(),
                sPath = "/PicklistLabel";

            filterByLoc = new Filter("locale", FilterOperator.EQ, 'en_US');
            label = new Filter("optionId", FilterOperator.EQ, sValue);

            ofilters.push(filterByLoc);
            ofilters.push(label);

            // BaseController.ReadOdata(oModel, sPath, ofilters).then(async (odata) => {
            //     // await this.getView().getModel("FLD").setData(odata.results);
            //     // await oBusyDialog.close();
            //     return await odata.results[0].label;
            // }).catch(async (oError) => {
            //     // await oBusyDialog.close();
            //     await MessageBox.error(JSON.parse(oError.responseText).error.message.value);
            // });


           await oModel.read (sPath, {
                filters: ofilters,
                success: async function (odata) {
                    return await odata.results[0].label;
                   debugger
                },
                error: async function (oError) {
                   debugger
                }
            })
        },

    }
}
);