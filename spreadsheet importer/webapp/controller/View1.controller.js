sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("spreadsheet.controller.View1", {
        onInit: function () {

            var settings = {
                "url": "https://api-sdm-di.cfapps.eu10.hana.ondemand.com/browser/395e84fc-d97f-4197-adaa-10aca70a7cca/root/Public root folder/Timesheet",
                "method": "GET",
                "timeout": 0,
                "headers": {
                  "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vdGFxYS1kZXYtZmlvcmkuYXV0aGVudGljYXRpb24uZXUxMC5oYW5hLm9uZGVtYW5kLmNvbS90b2tlbl9rZXlzIiwia2lkIjoiZGVmYXVsdC1qd3Qta2V5LTRmNGUwYjA0YzYiLCJ0eXAiOiJKV1QiLCJqaWQiOiAiUlowSjcycnZaRWlNU0VTWmVmcDR4cTRuTUFGUjZjbUVkVW9mT3Y5NTNpOD0ifQ.eyJqdGkiOiIxNjRmODA0ODY4NGQ0NzJhODRmNjBiNWQyMjMxZmI2NyIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI1OThkZjA3ZS01NjM0LTQ4ZmEtOTRmZC03NzQ5Mzg5NjhiNjAiLCJ6ZG4iOiJ0YXFhLWRldi1maW9yaSIsInNlcnZpY2VpbnN0YW5jZWlkIjoiOGI5MGI4NjgtOGRlZi00NmZjLTljOTItMWE2MWI4MGI1M2NmIn0sInN1YiI6InNiLThiOTBiODY4LThkZWYtNDZmYy05YzkyLTFhNjFiODBiNTNjZiFiNDI0MTE2fHNkbS1kaS1TRE1fRElfUFJPRC1wcm9kIWI0MTA2NCIsImF1dGhvcml0aWVzIjpbInVhYS5yZXNvdXJjZSIsInNkbS1kaS1TRE1fRElfUFJPRC1wcm9kIWI0MTA2NC5zZG1idXNpbmVzc2FkbWluIiwic2RtLWRpLVNETV9ESV9QUk9ELXByb2QhYjQxMDY0LnNkbWFkbWluIiwic2RtLWRpLVNETV9ESV9QUk9ELXByb2QhYjQxMDY0LnNkbXVzZXIiLCJzZG0tZGktU0RNX0RJX1BST0QtcHJvZCFiNDEwNjQuc2RtbWlncmF0aW9uYWRtaW4iXSwic2NvcGUiOlsidWFhLnJlc291cmNlIiwic2RtLWRpLVNETV9ESV9QUk9ELXByb2QhYjQxMDY0LnNkbWJ1c2luZXNzYWRtaW4iLCJzZG0tZGktU0RNX0RJX1BST0QtcHJvZCFiNDEwNjQuc2RtdXNlciIsInNkbS1kaS1TRE1fRElfUFJPRC1wcm9kIWI0MTA2NC5zZG1taWdyYXRpb25hZG1pbiIsInNkbS1kaS1TRE1fRElfUFJPRC1wcm9kIWI0MTA2NC5zZG1hZG1pbiJdLCJjbGllbnRfaWQiOiJzYi04YjkwYjg2OC04ZGVmLTQ2ZmMtOWM5Mi0xYTYxYjgwYjUzY2YhYjQyNDExNnxzZG0tZGktU0RNX0RJX1BST0QtcHJvZCFiNDEwNjQiLCJjaWQiOiJzYi04YjkwYjg2OC04ZGVmLTQ2ZmMtOWM5Mi0xYTYxYjgwYjUzY2YhYjQyNDExNnxzZG0tZGktU0RNX0RJX1BST0QtcHJvZCFiNDEwNjQiLCJhenAiOiJzYi04YjkwYjg2OC04ZGVmLTQ2ZmMtOWM5Mi0xYTYxYjgwYjUzY2YhYjQyNDExNnxzZG0tZGktU0RNX0RJX1BST0QtcHJvZCFiNDEwNjQiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6ImNiYjZlZGJmIiwiaWF0IjoxNzE4MTc4Nzc1LCJleHAiOjE3MTgyMjE5NzUsImlzcyI6Imh0dHBzOi8vdGFxYS1kZXYtZmlvcmkuYXV0aGVudGljYXRpb24uZXUxMC5oYW5hLm9uZGVtYW5kLmNvbS9vYXV0aC90b2tlbiIsInppZCI6IjU5OGRmMDdlLTU2MzQtNDhmYS05NGZkLTc3NDkzODk2OGI2MCIsImF1ZCI6WyJ1YWEiLCJzZG0tZGktU0RNX0RJX1BST0QtcHJvZCFiNDEwNjQiLCJzYi04YjkwYjg2OC04ZGVmLTQ2ZmMtOWM5Mi0xYTYxYjgwYjUzY2YhYjQyNDExNnxzZG0tZGktU0RNX0RJX1BST0QtcHJvZCFiNDEwNjQiXX0.KeEMP_dRyO50oKhoHJo6VgphbzvHfPIoYR82SZAjK5uybKvIG9rvANfd_5TlnZsqdTaBFcEXSacI_KMDwGoLZKYYtEOYTYpnMhbzwHKQUCU5RwaOmJdU7HyD9iYnNWujV0JSwkN1J3_Omb_t6Bq29oQvm6haWaCFVXBE7Vm74kDI1uuX3GpJKDx3uc6Zp2aO-mKXy-EYXJvwyRistAVthw1nO1eqvC819lJ8DQN2DokW_aJd9E_UERu-CNYgcvTAQ0UpHw2aHwBdaaaUhjqBGMnkri9vBSRZ5ngdLXNRESIw7Popl5Ho86IiLk1UinwMOF_IRq7SRkZQxBN_Ik43tw",
                  "Cookie": "JSESSIONID=86F6C95726D08D2829EADF71EF1CB65A; __VCAP_ID__=e49f4105-8ac1-40fb-5ddc-912a"
                },
              };
              
              $.ajax(settings).done(function (response) {
                console.log(response);
              });
        },
        testupload: async function () {
            // var oColumns = this.getView().byId("dynamicTable").getColumns(),
            //     ColumnsLabels = [];
            // oColumns.forEach(function (column) {
            //     ColumnsLabels.push(column.getHeader().getText());
            // });
            // ColumnsLabels.splice(0,1);

           
            // this.spreadsheetUpload = await this.getOwnerComponent().createComponent({
            //     usage: "spreadsheetImporter",
            //     async: true,
            //     propagateModel:true,
            //     componentData: {
            //         columns: ['Id','Name','College'],
            //         standalone: true,
            //         // readAllSheets: true,
            //         spreadsheetFileName:"Test.xlsx"  
            //     }
                
            // });
            // this.spreadsheetUpload.openSpreadsheetUploadDialog();

            // this.spreadsheetUpload.attachUploadButtonPress(function (event) {
            //     debugger;
            //     // Prevent data from being sent to the backend
            //     event.preventDefault();
            //     // Get payload
            //     const payload = event.getParameter("payload");
            // }, this);


        },
    });
});
