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
        getTCCode: function (value) {
            switch (value) {
                case 'Business Travel':
                    return 'BU';

                case 'Rotational Leave':
                    return 'RL';

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

        getFamiltyTable: function (value) {
            if (value === 'Y' || value === '3') {
                return true;
            } else {
                return false;
            }
        },
        convert_Dateformat: function (value) {
            if (value !== "" && value !== undefined) {
                let date = new Date(value);
                let year = date.getFullYear();
                let month = ("0" + (date.getMonth() + 1)).slice(-2);
                let day = ("0" + date.getDate()).slice(-2);
                let isoDateString = day + "-" + month + "-" + year;
                return isoDateString;
            }
            else {
                return '';
            }
        },
        convert_DateTime: function (value) {
            if (value !== "" && value !== undefined) {
                let date = new Date(value);
                let year = date.getFullYear();
                let month = ("0" + (date.getMonth() + 1)).slice(-2);
                let day = ("0" + date.getDate()).slice(-2);
                let hours = ("0" + date.getHours()).slice(-2);
                let minutes = ("0" + date.getMinutes()).slice(-2);
                let seconds = ("0" + date.getSeconds()).slice(-2);
                let isoDateString = day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
                return isoDateString;
            }
        },
        convert_Dateformat2: function (value) {
            if (value !== "" && value !== undefined) {
                let date = new Date();
                let year = date.getFullYear();
                let month = ("0" + (date.getMonth() + 1)).slice(-2);
                let day = ("0" + date.getDate()).slice(-2);
                let isoDateString = year + "-" + month + "-" + day;
                return isoDateString;
            }
            else {
                return '';
            }
        },
        getLabelForVisa: function (value) {
            if (value !== "" && value !== undefined) {
                switch (value) {
                    case "Y":
                        return "Yes";

                    case "N":
                        return "No";

                    default:
                        return "";
                }
            }
            else {
                return "";
            }
        },
        getLabelForClass: function (value) {
            if (value !== "" && value !== undefined) {
                switch (value) {
                    case "EC":
                        return "Economy Class";

                    case "FC":
                        return "First Class";

                    case "BC":
                        return "Business Class";

                    default:
                        return "";

                }
            }
            else {
                return "";
            }
        },
        getCountryLabel: function (value) {
            if (value !== "" && value !== undefined) {
                let oJson = [
                    {
                        "country": "Afghanistan",
                        "code": "AFG"
                    },
                    {
                        "country": "Albania",
                        "code": "ALB"
                    },
                    {
                        "country": "Algeria",
                        "code": "DZA"
                    },
                    {
                        "country": "Andorra",
                        "code": "AND"
                    },
                    {
                        "country": "Angola",
                        "code": "AGO"
                    },
                    {
                        "country": "Antigua and Barbuda",
                        "code": "ATG"
                    },
                    {
                        "country": "Argentina",
                        "code": "ARG"
                    },
                    {
                        "country": "Armenia",
                        "code": "ARM"
                    },
                    {
                        "country": "Australia",
                        "code": "AUS"
                    },
                    {
                        "country": "Austria",
                        "code": "AUT"
                    },
                    {
                        "country": "Åland Islands",
                        "code": "ALA"
                    },
                    {
                        "country": "Azerbaijan",
                        "code": "AZE"
                    },
                    {
                        "country": "Bahamas",
                        "code": "BHS"
                    },
                    {
                        "country": "Bahrain",
                        "code": "BHR"
                    },
                    {
                        "country": "Bangladesh",
                        "code": "BGD"
                    },
                    {
                        "country": "Barbados",
                        "code": "BRD"
                    },
                    {
                        "country": "Belarus",
                        "code": "BLR"
                    },
                    {
                        "country": "Belgium",
                        "code": "BEL"
                    },
                    {
                        "country": "Belize",
                        "code": "BLZ"
                    },
                    {
                        "country": "Benin",
                        "code": "BEN"
                    },
                    {
                        "country": "Bhutan",
                        "code": "BTN"
                    },
                    {
                        "country": "Bolivia",
                        "code": "BOL"
                    },
                    {
                        "country": "Bosnia and Herzegovina",
                        "code": "BIH"
                    },
                    {
                        "country": "Botswana",
                        "code": "BWA"
                    },
                    {
                        "country": "Brazil",
                        "code": "BRA"
                    },
                    {
                        "country": "Bermuda",
                        "code": "BMU"
                    },
                    {
                        "country": "Brunei",
                        "code": "BRN"
                    },
                    {
                        "country": "Bulgaria",
                        "code": "BGR"
                    },
                    {
                        "country": "Burkina Faso",
                        "code": "BFA"
                    },
                    {
                        "country": "Burundi",
                        "code": "BDI"
                    },
                    {
                        "country": "Cabo Verde",
                        "code": "CPV"
                    },
                    {
                        "country": "Cambodia",
                        "code": "KHM"
                    },
                    {
                        "country": "Cameroon",
                        "code": "CMR"
                    },
                    {
                        "country": "Canada",
                        "code": "CAN"
                    },
                    {
                        "country": "Central African Republic",
                        "code": "CAF"
                    },
                    {
                        "country": "Chad",
                        "code": "TCD"
                    },
                    {
                        "country": "Chile",
                        "code": "CHL"
                    },
                    {
                        "country": "China",
                        "code": "CHN"
                    },
                    {
                        "country": "Colombia",
                        "code": "COL"
                    },
                    {
                        "country": "Comoros",
                        "code": "COM"
                    },
                    {
                        "country": "Congo (Congo-Brazzaville)",
                        "code": "COG"
                    },
                    {
                        "country": "Congo (Democratic Republic of the)",
                        "code": "COD"
                    },
                    {
                        "country": "Costa Rica",
                        "code": "CRI"
                    },
                    {
                        "country": "Croatia",
                        "code": "HRV"
                    },
                    {
                        "country": "Cuba",
                        "code": "CUB"
                    },
                    {
                        "country": "Cyprus",
                        "code": "CYP"
                    },
                    {
                        "country": "Czech Republic",
                        "code": "CZE"
                    },
                    {
                        "country": "Denmark",
                        "code": "DNK"
                    },
                    {
                        "country": "Djibouti",
                        "code": "DJI"
                    },
                    {
                        "country": "Dominica",
                        "code": "DMA"
                    },
                    {
                        "country": "Dominican Republic",
                        "code": "DOM"
                    },
                    {
                        "country": "Ecuador",
                        "code": "ECU"
                    },
                    {
                        "country": "Egypt",
                        "code": "EGY"
                    },
                    {
                        "country": "El Salvador",
                        "code": "SLV"
                    },
                    {
                        "country": "Equatorial Guinea",
                        "code": "GNQ"
                    },
                    {
                        "country": "Eritrea",
                        "code": "ERI"
                    },
                    {
                        "country": "Estonia",
                        "code": "EST"
                    },
                    {
                        "country": "Eswatini",
                        "code": "SWZ"
                    },
                    {
                        "country": "Ethiopia",
                        "code": "ETH"
                    },
                    {
                        "country": "Fiji",
                        "code": "FJI"
                    },
                    {
                        "country": "Finland",
                        "code": "FIN"
                    },
                    {
                        "country": "France",
                        "code": "FRA"
                    },
                    {
                        "country": "Gabon",
                        "code": "GAB"
                    },
                    {
                        "country": "Gambia",
                        "code": "GMB"
                    },
                    {
                        "country": "Georgia",
                        "code": "GEO"
                    },
                    {
                        "country": "Germany",
                        "code": "DEU"
                    },
                    {
                        "country": "Ghana",
                        "code": "GHA"
                    },
                    {
                        "country": "Greece",
                        "code": "GRC"
                    },
                    {
                        "country": "Grenada",
                        "code": "GRD"
                    },
                    {
                        "country": "Guatemala",
                        "code": "GTM"
                    },
                    {
                        "country": "Guinea",
                        "code": "GIN"
                    },
                    {
                        "country": "Guinea-Bissau",
                        "code": "GNB"
                    },
                    {
                        "country": "Guyana",
                        "code": "GUY"
                    },
                    {
                        "country": "Haiti",
                        "code": "HTI"
                    },
                    {
                        "country": "Honduras",
                        "code": "HND"
                    },
                    {
                        "country": "Hungary",
                        "code": "HUN"
                    },
                    {
                        "country": "Iceland",
                        "code": "ISL"
                    },
                    {
                        "country": "India",
                        "code": "IND"
                    },
                    {
                        "country": "Indonesia",
                        "code": "IDN"
                    },
                    {
                        "country": "Iran",
                        "code": "IRN"
                    },
                    {
                        "country": "Iraq",
                        "code": "IRQ"
                    },
                    {
                        "country": "Ireland",
                        "code": "IRL"
                    },
                    {
                        "country": "Israel",
                        "code": "ISR"
                    },
                    {
                        "country": "Italy",
                        "code": "ITA"
                    },
                    {
                        "country": "Jamaica",
                        "code": "JAM"
                    },
                    {
                        "country": "Japan",
                        "code": "JPN"
                    },
                    {
                        "country": "Jordan",
                        "code": "JOR"
                    },
                    {
                        "country": "Kazakhstan",
                        "code": "KAZ"
                    },
                    {
                        "country": "Kenya",
                        "code": "KEN"
                    },
                    {
                        "country": "Kiribati",
                        "code": "KIR"
                    },
                    {
                        "country": "Korea (North)",
                        "code": "PRK"
                    },
                    {
                        "country": "Korea (South)",
                        "code": "KOR"
                    },
                    {
                        "country": "Kuwait",
                        "code": "KWT"
                    },
                    {
                        "country": "Kyrgyzstan",
                        "code": "KGZ"
                    },
                    {
                        "country": "Laos",
                        "code": "LAO"
                    },
                    {
                        "country": "Latvia",
                        "code": "LVA"
                    },
                    {
                        "country": "Lebanon",
                        "code": "LBN"
                    },
                    {
                        "country": "Lesotho",
                        "code": "LSO"
                    },
                    {
                        "country": "Liberia",
                        "code": "LBR"
                    },
                    {
                        "country": "Libya",
                        "code": "LBY"
                    },
                    {
                        "country": "Liechtenstein",
                        "code": "LIE"
                    },
                    {
                        "country": "Lithuania",
                        "code": "LTU"
                    },
                    {
                        "country": "Luxembourg",
                        "code": "LUX"
                    },
                    {
                        "country": "Madagascar",
                        "code": "MDG"
                    },
                    {
                        "country": "Malawi",
                        "code": "MWI"
                    },
                    {
                        "country": "Malaysia",
                        "code": "MYS"
                    },
                    {
                        "country": "Maldives",
                        "code": "MDV"
                    },
                    {
                        "country": "Mali",
                        "code": "MLI"
                    },
                    {
                        "country": "Malta",
                        "code": "MLT"
                    },
                    {
                        "country": "Marshall Islands",
                        "code": "MHL"
                    },
                    {
                        "country": "Mauritania",
                        "code": "MRT"
                    },
                    {
                        "country": "Mauritius",
                        "code": "MUS"
                    },
                    {
                        "country": "Mexico",
                        "code": "MEX"
                    },
                    {
                        "country": "Micronesia",
                        "code": "FSM"
                    },
                    {
                        "country": "Moldova",
                        "code": "MDA"
                    },
                    {
                        "country": "Monaco",
                        "code": "MCO"
                    },
                    {
                        "country": "Mongolia",
                        "code": "MNG"
                    },
                    {
                        "country": "Montenegro",
                        "code": "MNE"
                    },
                    {
                        "country": "Morocco",
                        "code": "MAR"
                    },
                    {
                        "country": "Mozambique",
                        "code": "MOZ"
                    },
                    {
                        "country": "Myanmar",
                        "code": "MMR"
                    },
                    {
                        "country": "Namibia",
                        "code": "NAM"
                    },
                    {
                        "country": "Nauru",
                        "code": "NRU"
                    },
                    {
                        "country": "Nepal",
                        "code": "NPL"
                    },
                    {
                        "country": "Netherlands",
                        "code": "NLD"
                    },
                    {
                        "country": "New Zealand",
                        "code": "NZL"
                    },
                    {
                        "country": "Nicaragua",
                        "code": "NIC"
                    },
                    {
                        "country": "Niger",
                        "code": "NER"
                    },
                    {
                        "country": "Nigeria",
                        "code": "NGA"
                    },
                    {
                        "country": "North Macedonia",
                        "code": "MKD"
                    },
                    {
                        "country": "Norway",
                        "code": "NOR"
                    },
                    {
                        "country": "Oman",
                        "code": "OMN"
                    },
                    {
                        "country": "Pakistan",
                        "code": "PAK"
                    },
                    {
                        "country": "Palau",
                        "code": "PLW"
                    },
                    {
                        "country": "Palestine",
                        "code": "PSE"
                    },
                    {
                        "country": "Panama",
                        "code": "PAN"
                    },
                    {
                        "country": "Papua New Guinea",
                        "code": "PNG"
                    },
                    {
                        "country": "Paraguay",
                        "code": "PRY"
                    },
                    {
                        "country": "Peru",
                        "code": "PER"
                    },
                    {
                        "country": "Philippines",
                        "code": "PHL"
                    },
                    {
                        "country": "Poland",
                        "code": "POL"
                    },
                    {
                        "country": "Portugal",
                        "code": "PRT"
                    },
                    {
                        "country": "Qatar",
                        "code": "QAT"
                    },
                    {
                        "country": "Romania",
                        "code": "RMN"
                    },
                    {
                        "country": "Russia",
                        "code": "RUS"
                    },
                    {
                        "country": "Rwanda",
                        "code": "RWA"
                    },
                    {
                        "country": "Saint Kitts and Nevis",
                        "code": "KNA"
                    },
                    {
                        "country": "Saint Lucia",
                        "code": "LCA"
                    },
                    {
                        "country": "Saint Vincent and the Grenadines",
                        "code": "VCT"
                    },
                    {
                        "country": "Samoa",
                        "code": "WSM"
                    },
                    {
                        "country": "San Marino",
                        "code": "SMR"
                    },
                    {
                        "country": "Sao Tome and Principe",
                        "code": "STP"
                    },
                    {
                        "country": "Saudi Arabia",
                        "code": "SAU"
                    },
                    {
                        "country": "Senegal",
                        "code": "SEN"
                    },
                    {
                        "country": "Serbia",
                        "code": "SRB"
                    },
                    {
                        "country": "Seychelles",
                        "code": "SYC"
                    },
                    {
                        "country": "Sierra Leone",
                        "code": "SLE"
                    },
                    {
                        "country": "Singapore",
                        "code": "SGP"
                    },
                    {
                        "country": "Slovakia",
                        "code": "SVK"
                    },
                    {
                        "country": "Slovenia",
                        "code": "SVN"
                    },
                    {
                        "country": "Solomon Islands",
                        "code": "SLB"
                    },
                    {
                        "country": "Somalia",
                        "code": "SOM"
                    },
                    {
                        "country": "South Africa",
                        "code": "ZAF"
                    },
                    {
                        "country": "South Sudan",
                        "code": "SSD"
                    },
                    {
                        "country": "Spain",
                        "code": "ESP"
                    },
                    {
                        "country": "Sri Lanka",
                        "code": "LKA"
                    },
                    {
                        "country": "Sudan",
                        "code": "SDN"
                    },
                    {
                        "country": "Suriname",
                        "code": "SUR"
                    },
                    {
                        "country": "Sweden",
                        "code": "SWE"
                    },
                    {
                        "country": "Switzerland",
                        "code": "CHE"
                    },
                    {
                        "country": "Syria",
                        "code": "SYR"
                    },
                    {
                        "country": "Tajikistan",
                        "code": "TJK"
                    },
                    {
                        "country": "Tanzania",
                        "code": "TZA"
                    },
                    {
                        "country": "Thailand",
                        "code": "THA"
                    },
                    {
                        "country": "Timor-Leste",
                        "code": "TLS"
                    },
                    {
                        "country": "Togo",
                        "code": "TGO"
                    },
                    {
                        "country": "Tonga",
                        "code": "TON"
                    },
                    {
                        "country": "Trinidad and Tobago",
                        "code": "TTO"
                    },
                    {
                        "country": "Tunisia",
                        "code": "TUN"
                    },
                    {
                        "country": "Turkey",
                        "code": "TUR"
                    },
                    {
                        "country": "Turkmenistan",
                        "code": "TKM"
                    },
                    {
                        "country": "Tuvalu",
                        "code": "TUV"
                    },
                    {
                        "country": "Uganda",
                        "code": "UGN"
                    },
                    {
                        "country": "Ukraine",
                        "code": "UKR"
                    },
                    {
                        "country": "United Arab Emirates",
                        "code": "ARE"
                    },
                    {
                        "country": "United Kingdom",
                        "code": "GBR"
                    },
                    {
                        "country": "United States of America",
                        "code": "USA"
                    },
                    {
                        "country": "Uruguay",
                        "code": "URY"
                    },
                    {
                        "country": "Uzbekistan",
                        "code": "UZB"
                    },
                    {
                        "country": "Vanuatu",
                        "code": "VUT"
                    },
                    {
                        "country": "Vatican City",
                        "code": "VAT"
                    },
                    {
                        "country": "Venezuela",
                        "code": "VEN"
                    },
                    {
                        "country": "Vietnam",
                        "code": "VNM"
                    },
                    {
                        "country": "Yemen",
                        "code": "YEM"
                    },
                    {
                        "country": "Zambia",
                        "code": "ZMB"
                    },
                    {
                        "country": "Zimbabwe",
                        "code": "ZWE"
                    },
                    {
                        "code": "FRO",
                        "country": "Faroe Islands"
                    },
                    {
                        "code": "GRL",
                        "country": "Greenland"
                    },
                    {
                        "code": "JEY",
                        "country": "Jersey"
                    },
                    {
                        "code": "XKX",
                        "country": "Kosovo"
                    },
                    {
                        "code": "CYM",
                        "country": "Cayman Islands"
                    },
                    {
                        "code": "TCA",
                        "country": "Turks & Caicos Islands"
                    },
                    {
                        "code": "SCT",
                        "country": "Scotland"
                    }

                ];


                const country = oJson.find(c => c.code === value);
                if (country === undefined) {
                    return value;
                } else {
                    return country.country;
                }
            }
            else {
                return value;
            }
        },
        getCompanyDescription: function (value) {
            if (value !== "" && value !== undefined) {
                let legalEntityDescriptions = [
                    { "description": "AlMansoori Petroleum Services LLC, UAE", "code": "2010" },
                    { "description": "AlMansoori Petroleum Services Holdings, UAE", "code": "2020" },
                    { "description": "AlMansoori Production Service LLC, UAE", "code": "2100" },
                    { "description": "AlMansoori Wireline Services Company LLC, UAE", "code": "2200" },
                    { "description": "AlMansoori Directional Drilling Services LLC, UAE", "code": "2300" },
                    { "description": "AlMansoori Logging Services LLC, UAE", "code": "2400" },
                    { "description": "AlMansoori Safety Services LLC", "code": "2500" },
                    { "description": "AlMansoori Inspection Services Company LLC", "code": "2600" },
                    { "description": "Almansoori Petroleum Services Co. Ltd., KSA", "code": "3010" },
                    { "description": "Hilal Mubarak AlMansoori Trading Company, KSA", "code": "3160" },
                    { "description": "TAQA Geothermal for Energy Company", "code": "4010" },
                    { "description": "AlMansoori Petroleum Services, Bahrain", "code": "3140" },
                    { "description": "Al Mansoori Petroleum Services Kuwait", "code": "3080" },
                    { "description": "AlMansoori Production Services Company LLC, Oman", "code": "3210" },
                    { "description": "AlMansoori Wireline Services Company LLC, Oman", "code": "3220" },
                    { "description": "AlMansoori Safety Services LLC, Oman", "code": "3250" },
                    { "description": "AlMansoori Petroleum Services, Kurdistan", "code": "3070" },
                    { "description": "AlMansoori Petroleum Services, Qatar", "code": "3020" },
                    { "description": "AlMansoori Petroleum Services, Libya", "code": "3360" },
                    { "description": "AlMansoori Petroleum Services for Free Zone Egypt", "code": "3120" },
                    { "description": "AlMansoori Petroleum Services LLC (Project Office), India", "code": "3150" },
                    { "description": "Almansoori Production Services India Private Limited, India", "code": "3170" },
                    { "description": "TAQA Corporate", "code": "1000" },
                    { "description": "TAQA Well Solutions", "code": "2000" },
                    { "description": "AZR", "code": "4000" },
                    { "description": "TAQA Geothermal for Energy Company", "code": "4010" },
                    { "description": "TAQA FRAC", "code": "6000" }
                ];
                const company = legalEntityDescriptions.find(c => c.code === value);
                return company.description;
            }
            else {
                return value;
            }
        },
        getLeaveSchedule: function (value) {
            if (value !== "" && value !== undefined && value.includes("x") === false) {
                let leave_cycles = [
                    { "type": "1", "days": "365/42" },
                    { "type": "2", "days": "365/36" },
                    { "type": "3", "days": "365/30" },
                    { "type": "4", "days": "365/20" },
                    { "type": "5", "days": "182/30" },
                    { "type": "6", "days": "180/30" },
                    { "type": "7", "days": "150/30" },
                    { "type": "8", "days": "120/30" },
                    { "type": "9", "days": "90/30" },
                    { "type": "10", "days": "90/21" },
                    { "type": "11", "days": "63/30" },
                    { "type": "12", "days": "60/30" },
                    { "type": "13", "days": "60/21" },
                    { "type": "14", "days": "45/30" },
                    { "type": "15", "days": "42/21" },
                    { "type": "16", "days": "36/34" },
                    { "type": "17", "days": "35/35" },
                    { "type": "18", "days": "29/27" },
                    { "type": "19", "days": "28/14" },
                    { "type": "20", "days": "20/10" },
                    { "type": "21", "days": "28/10" },
                    { "type": "22", "days": "20/10" },
                    { "type": "23", "days": "28/28" },
                    { "type": "24", "days": "155/30" },
                    { "type": "25", "days": "60/20" },
                    { "type": "26", "days": "42/28" },
                    { "type": "27", "days": "30/30" },
                    { "type": "28", "days": "30/10" },
                    { "type": "29", "days": "180/15" },
                    { "type": "30", "days": "14/14" },
                    { "type": "31", "days": "37/15" },
                    { "type": "32", "days": "365/21" },
                    { "type": "33", "days": "45/15" },
                    { "type": "34", "days": "21/21" },
                    { "type": "35", "days": "21/10" },
                    { "type": "36", "days": "21/14" },
                    { "type": "37", "days": "63/28" },
                    { "type": "38", "days": "152/30" },
                    { "type": "39", "days": "15/15" },
                    { "type": "40", "days": "56/28" },
                    { "type": "41", "days": "30/14" },
                    { "type": "42", "days": "30/15" },
                    { "type": "43", "days": "30/20" },
                    { "type": "44", "days": "21/7" },
                    { "type": "45", "days": "NA" },
                    { "type": "46", "days": "14/14" },
                    { "type": "47", "days": "150/30" },
                    { "type": "48", "days": "152/30" },
                    { "type": "49", "days": "21/10" },
                    { "type": "50", "days": "21/14" },
                    { "type": "51", "days": "21/21" },
                    { "type": "52", "days": "21/7" },
                    { "type": "53", "days": "36/34" },
                    { "type": "54", "days": "365/21" },
                    { "type": "55", "days": "42/21" },
                    { "type": "56", "days": "45/30" },
                    { "type": "57", "days": "60/30" },
                    { "type": "58", "days": "63/30" },
                    { "type": "59", "days": "365/21" },
                    { "days": "NA", "type": "630570" },
                    { "days": "21/7", "type": "630569" },
                    { "days": "30/20", "type": "630568" },
                    { "days": "30/15", "type": "630567" },
                    { "days": "30/14", "type": "630566" },
                    { "days": "56/28", "type": "630565" },
                    { "days": "15/15", "type": "630564" },
                    { "days": "152/30", "type": "630563" },
                    { "days": "63/28", "type": "630562" },
                    { "days": "21/14", "type": "630561" },
                    { "days": "21/10", "type": "630560" },
                    { "days": "21/21", "type": "630559" },
                    { "days": "45/15", "type": "630558" },
                    { "days": "365/21", "type": "630557" },
                    { "days": "37/15", "type": "630556" },
                    { "days": "14/14", "type": "630555" },
                    { "days": "180/15", "type": "630554" },
                    { "days": "30/10", "type": "630553" },
                    { "days": "30/30", "type": "630552" },
                    { "days": "42/28", "type": "630551" },
                    { "days": "60/20", "type": "630550" },
                    { "days": "155/30", "type": "630549" },
                    { "days": "28/28", "type": "630548" },
                    { "days": "20/10", "type": "630547" },
                    { "days": "28/10", "type": "630546" },
                    { "days": "20/10", "type": "630545" },
                    { "days": "28/14", "type": "630544" },
                    { "days": "29/27", "type": "630543" },
                    { "days": "35/35", "type": "630542" },
                    { "days": "36/34", "type": "630541" },
                    { "days": "42/21", "type": "630540" },
                    { "days": "45/30", "type": "630539" },
                    { "days": "60/21", "type": "630538" },
                    { "days": "60/30", "type": "630537" },
                    { "days": "63/30", "type": "630536" },
                    { "days": "90/21", "type": "630535" },
                    { "days": "90/30", "type": "630534" },
                    { "days": "120/30", "type": "630533" },
                    { "days": "150/30", "type": "630532" },
                    { "days": "180/30", "type": "630531" },
                    { "days": "182/30", "type": "630530" },
                    { "days": "365/20", "type": "630529" },
                    { "days": "365/30", "type": "630528" },
                    { "days": "365/36", "type": "630527" },
                    { "days": "365/42", "type": "630526" },
                    { "days": "14/14", "type": "632689" },
                    { "days": "150/30", "type": "632690" },
                    { "days": "152/30", "type": "632692" },
                    { "days": "21/10", "type": "632693" },
                    { "days": "21/14", "type": "632695" },
                    { "days": "21/21", "type": "632696" },
                    { "days": "21/7", "type": "632697" },
                    { "days": "36/34", "type": "632698" },
                    { "days": "365/21", "type": "632699" },
                    { "days": "42/21", "type": "632701" },
                    { "days": "45/30", "type": "632702" },
                    { "days": "60/30", "type": "632703" },
                    { "days": "63/30", "type": "632704" },
                    { "days": "365/21", "type": "632705" }
                ];
                const Leavecycles = leave_cycles.find(c => c.type === value);
                if (Leavecycles === undefined) {
                    return value;
                } else {
                    return Leavecycles.days;
                }
            }
            else {
                return value;
            }
        },
        getEmpName: function (value) {
            if (value !== "" && value !== undefined) {
                let str = value;
                let result = str.replace(/null/g, ''); // Removes all occurrences of "null"
                result = result.trim();
                return result;
            }
            else {
                return value;
            }
        },
        HotelVisible: function (value) {
            switch (value) {
                case 'BU':
                    return true;

                case 'TR':
                    return true;
                case 'JT':
                    return true;


                default:
                    return false;

            }
        },
        getTime: function (value) {
            if (value !== "" && value !== undefined) {
                switch (value) {
                    case '1':
                        return 'Morning';

                    case '2':
                        return 'AfterNoon';

                    case '3':
                        return 'Evening';

                    case '4':
                        return 'Night';

                    default:
                        return '';

                }
            }
            else {
                return '';
            }
        },
        getStatusColor: function (status) {
            switch (status) {
                case "Open":
                    return "Indication08";
                case "Reviewed":
                    return "Warning";
                case "LPO processed by Focal Person":
                    return "Success";
                case "Initiated to Travel Team":
                    return "Information";
                default:
                    return "None";
            }
        }
    }
});