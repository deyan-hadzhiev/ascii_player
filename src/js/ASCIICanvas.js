/*globals window, document, console, $, setInterval, ASCIIMatrix */

var ASCIICanvas = (function () {
    "use strict";

    function getCharRenderedSize () {
            var canvasCharFontSize = $("#ascii").css("font-size");
            var canvasLineHeight = $("#ascii").css("line-height");

            var doc = document.body;
            var tmpDiv = document.createElement('div');
            var atts = {fontSize: canvasCharFontSize, padding:'0', position:'absolute', lineHeight: canvasLineHeight, visibility:'hidden', fontFamily:'monospace'};
            for(var p in atts){
                tmpDiv.style[p]= atts[p];
            }
            tmpDiv.appendChild(document.createTextNode("M"));
            doc.appendChild(tmpDiv);
            var size = [tmpDiv.offsetWidth, tmpDiv.offsetHeight];
            doc.removeChild(tmpDiv);
            return size;
    }

    function mapColorToChar(colorValue) {
        var charSet = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
            colorInterval = 256 / charSet.length,
            i = 0;

        for (i = 1; i <= charSet.length; i += 1) {
            if (colorValue >= colorInterval * (i - 1) && colorValue < colorInterval * i) {
                return charSet[i - 1];
            }
        }

        return charSet[charSet.length - 1];
    }

    return {
        drawFrame: function (frame) {
            var ascii = document.getElementById("ascii"),
                frameContent = '',
                i = 0,
                j = 0;

            //Clear previous frame
            $("#ascii")[0].cols = frame.getWidth();
            $("#ascii")[0].rows = frame.getHeight();

            //Draw new frame
            for (i = 0; i < frame.getHeight(); i += 1) {
                for (j = 0; j < frame.getWidth(); j += 1) {
                    frameContent += frame.getElement(i, j);
                }
                frameContent += '\n';
            }
            $("#ascii")[0].value = frameContent;
        },

        getWidth: function () {
            return $("#current-frame").width();
        },

        getHeight: function () {
            return $("#current-frame").height();
        },

        getFontWidth: function () {
            return getCharRenderedSize()[0];
        },

        getFontHeight: function () {
            return getCharRenderedSize()[1];
        }
    };
}());
