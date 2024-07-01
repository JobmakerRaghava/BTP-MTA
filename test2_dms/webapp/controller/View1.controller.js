sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"


],
  function (Controller,
    MessageToast) {
    "use strict";

    return Controller.extend("taqa.test.test2dms.controller.View1", {
      onInit: function () {
       
        var form = new FormData();
        var filename = 'Claim Type.xlsx';
        var objectId = 'TyNEUlcjMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA4MiMwMDAjMDAjRDNEODdCMTBCMjA4MUVFRjhDRjIyQzI5NDI0OUNBNUQjIyM=';

        // var filename = 'Annual Leave.pdf';
        // var objectId = 'TyNEUlcjMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA4NiMwMDAjMDAjRDNEODdCMTBCMjA4MUVERjhDRjU1NEUwQzQyNTA3RjMjIyM=';

        // var filename = 'KT-Background-04 1.jpg';
        // var objectId = 'TyNEUlcjMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA4NCMwMDAjMDAjRDNEODdCMTBCMjA4MUVFRjhDRjI2NUNDMThDMkVDRjIjIyM=';
        var settings = {
          "url": "TAQA_DMS/browser/Z_TSD_DMS/root?cmisselector=content&download=attachment&filename=" + filename + "&objectId=" + objectId + "/",
          "method": "GET",
          "timeout": 0,
          "processData": false,
          "mimeType": "multipart/form-data",
          "contentType": false,
          "data": form,
          "xhrFields": {
            "responseType": 'arraybuffer' // Ensure response type is set correctly
        },
          "success": function (data, status, xhr) {
            // Process the file data or trigger download
            debugger;
            var blob = new Blob([data],{ type: xhr.getResponseHeader('Content-Type') }); // Assuming 'data' is the file content
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename; // Replace with actual filename
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
            // link.click();
            window.URL.revokeObjectURL(link.href);
          },
          "error": function (xhr, status, error) {
            // Handle error
            console.error('Failed to download file:', error);
          }
        };
        $.ajax(settings);

        // $.ajax(settings).done(function (response, preview) {
        //   console.log(response);

        //   function base64ToBlob(base64, mime) {
        //     // const byteString = atob(base64);
        //     // const ab = new ArrayBuffer(byteString.length);
        //     const ia = new Uint8Array(base64);
        //     for (let i = 0; i < ia.length; i++) {
        //       ia[i] = byteString.charCodeAt(i);
        //     }
        //     return new Blob([ia], { type: mime });
        //   }

        //   // If your binaryData is in a different encoding (like Latin-1), convert it to base64 first
        //   // const base64Data = btoa(response);

        //   // Create a Blob from the base64 string
        //   const blob = base64ToBlob(response, 'image/jpeg');

        //   // Create a link element
        //   const link = document.createElement('a');
        //   link.href = window.URL.createObjectURL(blob);
        //   link.download = 'output_image.jpg';


        //   link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        //   //     // Clean up by revoking the object URL
        //   window.URL.revokeObjectURL(link.href);

        //   // // Append the link to the body
        //   // document.body.appendChild(link);

        //   // // Simulate a click on the link to trigger the download
        //   // link.click();

        //   // // Clean up by removing the link
        //   // document.body.removeChild(link);





        //   // let tab = window.open('about:blank', 'blank');
        //   // tab.document.write(response);
        //   // tab.document.close();

        //   // const arrayBuffer = response;
        //   // const byteArray = new Uint8Array(arrayBuffer);
        //   // let binaryString = '';
        //   // for (let i = 0; i < byteArray.byteLength; i++) {
        //   //         binaryString += String.fromCharCode(byteArray[i]);
        //   //     }
        //   // // Display the binary string in the output paragraph (for demonstration)
        //   //     // output.textContent = binaryString;
        //   //     tab.document.write(binaryString);

        //   // var file = new Blob([new Uint8Array(response)], { type: 'image/jpg' });
        //   // // window.open(response);
        //   // console.log(preview);
        //   //////////////////////////////////
        //   //   const blob = binaryStringToBlob(response);

        //   //   // Detect file type
        //   //   const fileType = detectFileType(response);

        //   //   function binaryStringToBlob(binaryStr) {
        //   //     const byteArray = new Uint8Array(binaryStr.length);
        //   //     for (let i = 0; i < binaryStr.length; i++) {
        //   //       byteArray[i] = binaryStr.charCodeAt(i);
        //   //     }
        //   //     return new Blob([byteArray]);
        //   //   };

        //   //   function detectFileType(binaryStr) {
        //   //     const signatures = {
        //   //       jpg: "\xFF\xD8\xFF",
        //   //       png: "\x89\x50\x4E\x47\x0D\x0A\x1A\x0A",
        //   //       pdf: "\x25\x50\x44\x46\x2D",
        //   //       doc: "\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1",  // Old Word format
        //   //       docx: "\x50\x4B\x03\x04",  // ZIP-based format for DOCX, XLSX, PPTX
        //   //       xls: "\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1",  // Old Excel format
        //   //       xlsx: "\x50\x4B\x03\x04",  // ZIP-based format for XLSX
        //   //       ppt: "\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1",  // Old PowerPoint format
        //   //       pptx: "\x50\x4B\x03\x04",  // ZIP-based format for PPTX
        //   //       json: "{",
        //   //       txt: ""
        //   //     };

        //   //     for (const [format, signature] of Object.entries(signatures)) {
        //   //       if (binaryStr.startsWith(signature)) {
        //   //         return format;
        //   //       }
        //   //     }
        //   //     return null;
        //   //   };
        //   //   if (fileType) {
        //   //     // Determine the correct file extension for ZIP-based formats
        //   //     let extension = fileType;
        //   //     if (fileType === 'docx' || fileType === 'xlsx' || fileType === 'pptx') {
        //   //       const zipFormats = {
        //   //         '[Content_Types].xml': 'docx',
        //   //         'word/': 'docx',
        //   //         'xl/': 'xlsx',
        //   //         'ppt/': 'pptx'
        //   //       };
        //   //       const textDecoder = new TextDecoder();
        //   //       const text = textDecoder.decode(blob.slice(0, 100));
        //   //       for (const [signature, ext] of Object.entries(zipFormats)) {
        //   //         if (text.includes(signature)) {
        //   //           extension = ext;
        //   //           break;
        //   //         }
        //   //       }
        //   //     }

        //   //     const link = document.createElement('a');
        //   //     link.href = window.URL.createObjectURL(blob);
        //   //     link.download = `output_file.${extension}`;

        //   //     // Dispatch a click event on the link to trigger the download
        //   //     link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        //   //     // Clean up by revoking the object URL
        //   //     window.URL.revokeObjectURL(link.href);

        //   //   } else {
        //   //     console.error("Unknown file type");
        //   //   }

        // });



      },


      // Function to detect file type from the binary data


      onGetCallButtonPress: function (oEvent) {
        var url = 'TAQA_DMS/browser/Z_TSD_DMS/root/Public root folder/Timesheet';
        var settings3 = {
          "url": url,
          "method": "GET",
          "timeout": 0,

        };

        $.ajax(settings3).done(function (response1) {
          console.log(response1);
          MessageToast.show(response1);
        });
      },

      onPostCallButtonPress: function (oEvent) {
        var form = new FormData();
        form.append("cmisaction", "createFolder");
        form.append("propertyId[0]", "cmis:name");
        form.append("propertyValue[0]", "Timesheet-TEST");
        form.append("propertyId[1]", "cmis:objectTypeId");
        form.append("propertyValue[1]", "cmis:folder");
        form.append("succinct", "true");

        // var vURI =   "TAQA_DMS/Public root folder/Timesheet";
        var vURI = "TAQA_DMS/browser/Z_TSD_DMS/root/Public root folder/Timesheet";
        var settings = {
          "url": vURI,
          "method": "POST",
          "timeout": 0,
          "processData": false,
          "mimeType": "multipart/form-data",
          "contentType": false,
          "data": form
        };

        $.ajax(settings).done(function (response) {
          console.log(response);
          MessageToast.show(response);
        });
      },

      onGETbrowserCallButtonPress: function (oEvent) {
        var url = 'TAQA_DMS';
        var settings3 = {
          "url": url,
          "method": "GET",
          "timeout": 0,

        };

        $.ajax(settings3).done(function (response1) {
          console.log(response1);
          MessageToast.show(response1);
        });
      },

      handleUploadPress: function (oEvent) {
        var oFile = this.getView().byId("fileUploader").oFileUpload.files[0];

        // var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];

        var form = new FormData();
        form.append("cmisaction", "createDocument");
        form.append("propertyId[0]", "cmis:name");
        form.append("propertyValue[0]", oFile.name);
        form.append("propertyId[1]", "cmis:objectTypeId");
        form.append("propertyValue[1]", "cmis:document");
        form.append("succinct", "true");
        form.append("filename", oFile.name);
        form.append("_charset_", "UTF-8");
        form.append("includeAllowableActions", "true");
        form.append("media", oFile, "");

        var settings = {
          "url": "TAQA_DMS/browser/395e84fc-d97f-4197-adaa-10aca70a7cca/root/Public root folder/Timesheet",
          "method": "POST",
          "timeout": 0,
          "processData": false,
          "mimeType": "multipart/form-data",
          "contentType": false,
          "data": form
        };

        $.ajax(settings).done(function (response) {
          console.log(response);
        });
      },

      onFileUploaderChange: function (oEvent) {

        var file = oEvent.getParameter("files")[0];


      },


    });
  });
