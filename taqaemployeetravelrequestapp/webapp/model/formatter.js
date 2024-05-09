sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat
   ) {
    'use strict';
    return {
        dateChange: function (sValue) {
            var oDateFormat = DateFormat.getDateTimeInstance({ pattern: "dd-MM-yyyy" });
            return oDateFormat.format(sValue);

        },

    }
}
);