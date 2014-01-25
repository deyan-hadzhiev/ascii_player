/*globals window, document, console, $, setInterval, Matrix */

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
            element = null;

        scroller = $(".jTscroller")[0];

        //Clear the scroller
        scroller.innerHTML = '';

        //Add the frames list to the scroller
        for (i = 0; i < frames.length; i += 1) {
            element = document.createElement('a');
            element.setAttribute('href', '#');
            element.innerText = i;
            scroller.appendChild(element);
        }

        $("a").click(function (e) {
            e.preventDefault();
            drawFrame(parseInt(e.target.text));
        });
    }

    function addFrameAt(position) {
        var frame = ASCIIMatrix();
        frame.init(44, 75, 0);
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
            //console.log(frames);
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
            console.log("playing");
            if (currentFrameIndex + 1 >= frames.length){
                status = 0;
            } else {
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
