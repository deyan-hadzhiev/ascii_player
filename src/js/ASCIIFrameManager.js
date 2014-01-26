/*globals window, document, console, $, setInterval, ASCIIMatrix, ASCIICanvas */

var ASCIIFrameManager = function () {
    "use strict";

    var status = 0,
        currentFrameIndex = 0,
        frames = [];

    function drawFrame(frameIndex) {
        if (frameIndex < frames.length) {
            currentFrameIndex = frameIndex;
            ASCIICanvas.drawFrame(frames[frameIndex]);
        } else {
            console.log("Incorrect frame index: ", frameIndex);
        }
    }

    function fillFrameList() {
        var i = 0,
            scroller = null,
            element = null,
            plugin = null;

        scroller = $("#scroller")[0];

        //Clear the scroller
        scroller.innerHTML = '';

        //Add the frames list to the scroller
        for (i = 0; i < frames.length; i += 1) {
            element = document.createElement('a');
            element.setAttribute('href', '#');
            element.innerText = i;
            scroller.appendChild(element);
        }

        $("#scroller a").click(function (e) {
            e.preventDefault();
            drawFrame(parseInt(e.target.text));
        });
    }

    function addFrameAt(position) {
        var frame = new ASCIIMatrix(),
            frameWidth = 0,
            frameHeight = 0;
        frameWidth = Math.floor((ASCIICanvas.getWidth() - 2) / ASCIICanvas.getFontWidth());
        frameHeight = Math.floor((ASCIICanvas.getHeight() - 2) / ASCIICanvas.getFontHeight());
        frame.init(frameHeight, frameWidth, 0);
        currentFrameIndex = position;
        frames.splice(position, 0, frame);
        drawFrame(currentFrameIndex);
    }

    function removeFrameAt(position) {
        if (position > 0) {
            currentFrameIndex = position - 1;
            frames.splice(position, 1);
        }
    }

    function initEventHandlers() {
        $("#addFrame").click(function (e) {
            e.preventDefault();
            addFrameAt(currentFrameIndex + 1);
            fillFrameList();
        });

        $("#removeFrame").click(function (e) {
            e.preventDefault();
            removeFrameAt(currentFrameIndex);
            fillFrameList();
            //console.log(frames);
        });

        $("#playPause").click(function (e) {
            e.preventDefault();
            status === 1 ? status = 0 : status = 1;
        });
    }

    function render() {
        //TODO: Check statuses and eveything
        if (status) {
            if (currentFrameIndex + 1 >= frames.length){
                status = 0;
            } else {
                console.log("playing");
                drawFrame(currentFrameIndex + 1);
            }
        }
    }

    return {
        init: function () {
            initEventHandlers();
            addFrameAt(0);
            fillFrameList();
            setInterval(render, 1000 / 30);
        }
    };
};
