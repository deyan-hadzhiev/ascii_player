/*globals window, document, console, $, setInterval, ASCIIMatrix, ASCIICanvas */

var ASCIIFrameManager = function () {
    "use strict";

    var playing = false,
        currentFrameIndex = 0,
        frames = [],
        loopFrames = true,
        frameRate = 60;

    function drawFrame(frameIndex) {
        console.log("drawFrame:" + frameIndex);
        if (frameIndex < frames.length) {
            currentFrameIndex = frameIndex;
            ASCIICanvas.drawFrame(frames[frameIndex]);

            if (playing) {
                //Queue next frame drawing
                setTimeout(function () {
                    if (currentFrameIndex + 1 < frames.length){
                      drawFrame(currentFrameIndex + 1);  
                    } else {
                        if (loopFrames) {
                            drawFrame(0); 
                        } else {
                            playing = false;
                        }
                        
                    }
                    
                }, 1000 / frameRate);
            }

        } else {
            playing = false;
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

    function addFrameAt(position, defaultValue) {
        var frame = new ASCIIMatrix(),
            frameWidth = 0,
            frameHeight = 0;
        frameWidth = Math.floor((ASCIICanvas.getWidth() - 2) / ASCIICanvas.getFontWidth());
        frameHeight = Math.floor((ASCIICanvas.getHeight() - 2) / ASCIICanvas.getFontHeight());
        frame.init(frameHeight, frameWidth, defaultValue);
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
            if (playing) {
                playing = false;
            } else {
                playing = true;
                drawFrame(currentFrameIndex);
            }
        });
    }

    return {
        init: function () {
            initEventHandlers();
            addFrameAt(0, 0);
            addFrameAt(1, 50);
            addFrameAt(2, 100);
            addFrameAt(3, 150);
            addFrameAt(4, 170);
            addFrameAt(5, 190);
            addFrameAt(6, 210);
            fillFrameList();
        }
    };
};
