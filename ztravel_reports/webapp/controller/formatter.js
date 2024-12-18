sap.ui.define([
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (DateFormat,
    Filter,
    FilterOperator) {
    'use strict';
    return {
        getTCLabel: function (value) {
            switch (value) {
                case 'BU':
                    return 'Business Travel';

                case 'RL':
                    return 'Rotation';

                case 'AL':
                    return 'Annual Leave';

                case 'TR':
                    return 'Training';

                case 'JN':
                    return 'Joining Travel';

                case 'SP':
                    return 'Separation Travel';

                case 'MS':
                    return 'Miscellaneous Travel';

                case 'JT':
                    return 'Job Travel';

                default:
                    return value;

            }
        },

        fromatterfortravelwithfamily: function (sValue) {
            if (sValue === "Y") {
                return "Yes";
            } else if (sValue === "3") {
                return "Family-Only Travel";
            } else if (!sValue || sValue === "N") {
                return "No";
            }
            return sValue;
        },

        getTCCode: function (value) {
            switch (value) {
                case 'Business Travel':
                    return 'BU';

                case 'Rotation':
                    return 'RL';

                case 'Annual Leave':
                    return 'AL';

                case 'Training':
                    return 'TR';

                case 'Joining Travel':
                    return 'JN';

                case 'Separation Travel':
                    return 'SP';

                case 'Miscellaneous Travel':
                    return 'MS';

                case 'Job Travel':
                    return 'JT';

                default:
                    return value;

            }
        },



        formatDateforcreationdatealone: function (sDate) {
            if (!sDate) {
                return "";
            }
            let oDate = new Date(sDate);
            let day = String(oDate.getDate()).padStart(2, '0');
            let month = String(oDate.getMonth() + 1).padStart(2, '0');
            let year = oDate.getFullYear();
            let hours = String(oDate.getHours()).padStart(2, '0');
            let minutes = String(oDate.getMinutes()).padStart(2, '0');
            let seconds = String(oDate.getSeconds()).padStart(2, '0');
            return `${day}-${month}-${year}  (${hours}:${minutes}:${seconds})`;
        },
        formatDateStandard: function (sDate) {
            if (!sDate) {
                return '-';
            }
            let aDateParts = sDate.split('-');
            let sYear = aDateParts[0];
            let sMonth = aDateParts[1];
            let sDay = aDateParts[2];
            return sDay + '-' + sMonth + '-' + sYear;
        },
        formatProjectCode: function (sProjectCode) {
            return sProjectCode ? sProjectCode : "-";
        },
        CompanyNameFormatter: function (companyCode) {
            let companyMap = {
                "2010": { name: "AlMansoori Petroleum Services LLC, UAE", location: "UAE" },
                "2020": { name: "AlMansoori Petroleum Services Holdings, UAE", location: "UAE" },
                "2100": { name: "AlMansoori Production Service LLC, UAE", location: "UAE" },
                "2200": { name: "AlMansoori Wireline Services Company LLC, UAE", location: "UAE" },
                "2300": { name: "AlMansoori Directional Drilling Services LLC, UAE", location: "UAE" },
                "2400": { name: "AlMansoori Logging Services LLC, UAE", location: "UAE" },
                "2500": { name: "AlMansoori Safety Services LLC, UAE", location: "UAE" },
                "2600": { name: "AlMansoori Inspection Services Company LLC, UAE", location: "UAE" },
                "3010": { name: "Almansoori Petroleum Services Co. Ltd., KSA", location: "KSA" },
                "3160": { name: "Hilal Mubarak AlMansoori Trading Company, KSA", location: "KSA" },
                "3140": { name: "AlMansoori Petroleum Services, Bahrain", location: "Bahrain" },
                "3080": { name: "Al Mansoori Petroleum Services Kuwait", location: "Kuwait" },
                "3210": { name: "AlMansoori Production Services Company LLC, Oman", location: "Oman" },
                "3220": { name: "AlMansoori Wireline Services Company LLC, Oman", location: "Oman" },
                "3250": { name: "AlMansoori Safety Services LLC, Oman", location: "Oman" },
                "3070": { name: "AlMansoori Petroleum Services, Kurdistan", location: "Kurdistan" },
                "3020": { name: "AlMansoori Petroleum Services, Qatar", location: "Qatar" },
                "3360": { name: "AlMansoori Petroleum Services, Libya", location: "Libya" },
                "3120": { name: "AlMansoori Petroleum Services for Free Zone, Egypt", location: "Egypt" },
                "3150": { name: "AlMansoori Petroleum Services LLC (Project Office), India", location: "India" },
                "3170": { name: "AlMansoori Production Services India Private Limited, India", location: "India" },
                "1000": { name: "TAQA Corporate", location: "KSA" },
                "2000": { name: "TAQA Well Solutions", location: "KSA" },
                "4000": { name: "AZR", location: "KSA" },
                "4010": { name: "TAQA Geothermal for Energy Company", location: "KSA" },
                "6000": { name: "TAQA FRAC", location: "KSA" }
            };
            return companyMap[companyCode] ? companyMap[companyCode].name : "";
        },
        CompanyLocationFormatter: function (companyCode) {
            let companyMap = {
                "2010": { name: "AlMansoori Petroleum Services LLC, UAE", location: "UAE" },
                "2020": { name: "AlMansoori Petroleum Services Holdings, UAE", location: "UAE" },
                "2100": { name: "AlMansoori Production Service LLC, UAE", location: "UAE" },
                "2200": { name: "AlMansoori Wireline Services Company LLC, UAE", location: "UAE" },
                "2300": { name: "AlMansoori Directional Drilling Services LLC, UAE", location: "UAE" },
                "2400": { name: "AlMansoori Logging Services LLC, UAE", location: "UAE" },
                "2500": { name: "AlMansoori Safety Services LLC, UAE", location: "UAE" },
                "2600": { name: "AlMansoori Inspection Services Company LLC, UAE", location: "UAE" },
                "3010": { name: "Almansoori Petroleum Services Co. Ltd., KSA", location: "KSA" },
                "3160": { name: "Hilal Mubarak AlMansoori Trading Company, KSA", location: "KSA" },
                "3140": { name: "AlMansoori Petroleum Services, Bahrain", location: "Bahrain" },
                "3080": { name: "Al Mansoori Petroleum Services Kuwait", location: "Kuwait" },
                "3210": { name: "AlMansoori Production Services Company LLC, Oman", location: "Oman" },
                "3220": { name: "AlMansoori Wireline Services Company LLC, Oman", location: "Oman" },
                "3250": { name: "AlMansoori Safety Services LLC, Oman", location: "Oman" },
                "3070": { name: "AlMansoori Petroleum Services, Kurdistan", location: "Kurdistan" },
                "3020": { name: "AlMansoori Petroleum Services, Qatar", location: "Qatar" },
                "3360": { name: "AlMansoori Petroleum Services, Libya", location: "Libya" },
                "3120": { name: "AlMansoori Petroleum Services for Free Zone, Egypt", location: "Egypt" },
                "3150": { name: "AlMansoori Petroleum Services LLC (Project Office), India", location: "India" },
                "3170": { name: "AlMansoori Production Services India Private Limited, India", location: "India" },
                "1000": { name: "TAQA Corporate", location: "KSA" },
                "2000": { name: "TAQA Well Solutions", location: "KSA" },
                "4000": { name: "AZR", location: "KSA" },
                "4010": { name: "TAQA Geothermal for Energy Company", location: "KSA" },
                "6000": { name: "TAQA FRAC", location: "KSA" }
            };
            return companyMap[companyCode] ? companyMap[companyCode].location : "";
        }
    }
});
