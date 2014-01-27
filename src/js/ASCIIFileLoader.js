////////////////////////////////////////////////////////////////////////////////
// Load an image from local machine
////////////////////////////////////////////////////////////////////////////////
/*globals FileReader, window, alert, document, console */
var ASCIIFileLoader = function () {
    "use strict";
    var onLoadCallback = null;

    function onFileLoad(evt) {
        if (null !== onLoadCallback) {
            onLoadCallback(evt.currentTarget.result);
        } else {
            console.log("No onLoadCallback");
        }
    }

    function loadFile(evt) {
        var fr = null,
            i = 0,
            fileList = evt.target.files;

        for (i = 0; i < fileList.length; i += 1) {
            if (fileList[i].type.match('image.*')) {
                fr = new FileReader();
                fr.onload = onFileLoad;
                fr.readAsDataURL(fileList[i]);
            }
        }
    }

    return {
        setOnLoadCallback: function (callback) {
            onLoadCallback = callback;
        },

        attachToInput: function (input) {
            // Check for the various File API support.
            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                alert('The File APIs are not fully supported in this browser.');
            }

            document.getElementById(input).addEventListener('change', loadFile, false);
        }
    };
};
