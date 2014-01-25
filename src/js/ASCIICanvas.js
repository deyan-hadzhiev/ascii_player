/*globals window, document, console, $, setInterval, ASCIIMatrix */

var ASCIICanvas = (function () {
    "use strict";

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
                line = '',
                i = 0,
                j = 0;
            //Clear previous frame
            ascii.innerHTML = '';

            //Draw new frame
            for (i = 0; i < frame.getHeight(); i += 1) {
                line = '';
                for (j = 0; j < frame.getWidth(); j += 1) {
                    line += mapColorToChar(frame.getElement(i, j));
                }
                ascii.appendChild(document.createTextNode(line));
                ascii.appendChild(document.createElement("br"));
            }
        }
    };
}());
