/*globals window, document, console, $, setInterval, Matrix */

var ASCIIFrameManager = function () {
    "use strict";

    var status = 0,
        currentFrameIndex = 0,
        frames = [];
        //canvas = ASCIICanvas();

    function drawFrame(frameIndex) {
        if (frameIndex < frames.length) {
            currentFrameIndex = frameIndex;
            ASCIICanvas.drawFrame(frames[frameIndex]);
        } else {
            console.log("Incorrect frame index: ", frameIndex);
        }
        
        //TODO: Update GUI
    }

    function fillFrameList() {
        var i = 0,
            scroller = null;

        //Clear the scroller
        $(".jTscroller").empty();

        //scroller = document.get
        //Add the frames list to the scroller
        for (i = 0; i < frames.length; i += 1) {
            $(".jTscroller").add($("<a href=\"#\">" + i + "</a>"));
        }
    }

    function addFrameAt(position) {
        var frame = ASCIIMatrix();
        frame.init();
        frames.splice(position, 0, frame);
    }

    function initEventHandlers() {
        $("a").click(function (e) {
            e.preventDefault();
            drawFrame(parseInt(e.target.text));
        });

        $("#addFrame").click(function (e) {
            e.preventDefault();
            addFrameAt(currentFrameIndex + 1);
            fillFrameList();
            console.log(frames);
        });

        $("#removeFrame").click(function (e) {
            e.preventDefault();
            //removeFrame(currentFrame);
            fillFrameList();
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
            setInterval(render, 1000 / 30);
        }
    };
};
