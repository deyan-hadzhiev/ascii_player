/*globals window, document, console, $, setInterval, ASCIIMatrix */

var ASCIICanvas = (function () {
    "use strict";

    function getCharRenderedSize() {
        var canvasCharFontSize = $("#ascii").css("font-size"),
            canvasLineHeight = $("#ascii").css("line-height"),
            doc = document.body,
            tmpDiv = document.createElement('div'),
            attr = { fontSize: canvasCharFontSize, padding: '0', position: 'absolute',
                lineHeight: canvasLineHeight, visibility: 'hidden', fontFamily: 'monospace' },
            p,
            size;

        for (p in attr) {
            tmpDiv.style[p] = attr[p];
        }

        tmpDiv.appendChild(document.createTextNode("M"));
        doc.appendChild(tmpDiv);
        size = [tmpDiv.offsetWidth, tmpDiv.offsetHeight];
        doc.removeChild(tmpDiv);
        return size;
    }

    function mapColorToChar(colorValue) {
        var //charSet = '@0` ',
            charSet = '@MBHENR#KWXDFPQASUZbdehx*8Gm&04LOVYkpq5Tagns69owz$CIu23Jcfry%1v7l+it[]{}?j|()=~!-/<>"^_;,:`. ',
            //charSet = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
            colorInterval = 256 / charSet.length,
            i = 0;

        if (typeof colorValue === "number") {
            for (i = 1; i <= charSet.length; i += 1) {
                if (colorValue >= colorInterval * (i - 1) && colorValue < colorInterval * i) {
                    return charSet[i - 1];
                }
            }
        }

        return colorValue;
    }

    return {
        drawFrame: function (frame) {
            var frameContent = '',
                i = 0,
                j = 0;

            //Clear previous frame
            $("#ascii")[0].cols = frame.getWidth();
            $("#ascii")[0].rows = frame.getHeight();

            //Draw new frame
            for (i = 0; i < frame.getHeight(); i += 1) {
                for (j = 0; j < frame.getWidth(); j += 1) {
                    frameContent += mapColorToChar(frame.getElement(i, j));
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
