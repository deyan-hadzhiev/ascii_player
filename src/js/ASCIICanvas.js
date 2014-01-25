/*globals window, document, console, $, setInterval, ASCIIMatrix */

var ASCIICanvas = function () {
    "use strict";

    var frame = ASCIIMatrix(),
        mouseX = 0,
        mouseY = 0,
        canvasHeight = window.innerHeight,
        canvasWidth = window.innerWidth,
        frameHeight = Math.ceil(canvasHeight / 14),
        frameWidth = Math.ceil(canvasWidth / 14),
        frameNumber = 0;

    function calculateNewFrame() {
        var i = 0,
            j = 0;

        //Clear old frame
        frame.clear(255);

        frame.setElement(mouseY, mouseX, frameNumber % 255);
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

    function drawFrame() {
        var ascii = document.getElementById("ascii"),
            line = '',
            i = 0,
            j = 0;
        //Clear previous frame
        ascii.innerHTML = '';

        //Draw new frame
        for (i = 0; i < frameHeight; i += 1) {
            line = '';
            for (j = 0; j < frameWidth; j += 1) {
                line += mapColorToChar(frame.getElement(i, j));
            }
            ascii.appendChild(document.createTextNode(line));
            ascii.appendChild(document.createElement("br"));
        }
    }

    function step() {
        calculateNewFrame();
        drawFrame();
        frameNumber += 1;
    }

    function mapToCanvasCoordinates(clientX, clientY) {
        mouseX = Math.round(clientX / 14); //14px is font width (hopefully)
        mouseY = Math.round(clientY / 14); //14px is font height (hopefully)
    }

    function initEventHandlers() {
        $(document).ready(function () {
            $(document).mousemove(function (event) {
                mapToCanvasCoordinates(event.clientX, event.clientY);
            });
        });
    }

    function initFrame() {
        frame.init(frameWidth, frameHeight, 255);
        console.log(frame);
    }

    return {
        init: function () {
            initEventHandlers();
            initFrame();
            step();
            $("a").click(function(e){
               e.preventDefault();
               console.log(e);
               console.log(e.target.text);
               $("#ascii")[0].innerHTML = "asdasdasd";
               console.log($("#ascii")[0].innerHTML);
            });
        }
    };
};
