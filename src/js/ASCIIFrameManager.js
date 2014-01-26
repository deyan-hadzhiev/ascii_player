/*globals window, document, console, $, setInterval, ASCIIMatrix, ASCIICanvas */

var ASCIIFrameManager = function () {
    "use strict";

    var playing = false,
        currentFrameIndex = 0,
        frames = [],
        loopFrames = false,
        frameRate = 30;

    function drawFrame(frameIndex) {
        if (frameIndex < frames.length) {
            currentFrameIndex = frameIndex;
            ASCIICanvas.drawFrame(frames[frameIndex]);

            if (playing) {
                // get some variables controling the play from the html's input fields
                loopFrames = document.getElementById("loopFrames").checked;
                var fps = parseInt(document.getElementById("fps").value);
                frameRate = (fps > 0 && fps <= 60 ? fps : frameRate);
                //Queue next frame drawing
                setTimeout(function () {
                    if (currentFrameIndex + 1 < frames.length){
                      drawFrame(currentFrameIndex + 1);  
                    } else {
                        if (loopFrames) {
                            drawFrame(0); 
                        } else {
                            playing = false;
                            currentFrameIndex = 0;
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
            element.innerHTML = i;
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

    function appendUntilLength(string, symbolToAppend, desiredLength) {
        while (string.length < desiredLength) {
            string += symbolToAppend;
        }

        return string;
    }

    function editFrame(newFrame) {
        var frameWidth = frames[currentFrameIndex].getWidth(),
            frameHeight = frames[currentFrameIndex].getHeight(),
            i = 0,
            newFrameRows = 0;

        newFrameRows = newFrame.split('\n');
        for (i = 0; i < frameHeight; i += 1) {
            if (undefined === newFrameRows[i]) {
                frames[currentFrameIndex].setRow(i, appendUntilLength('', ' ', frameWidth).split('')); 
            } else {
                frames[currentFrameIndex].setRow(i, appendUntilLength(newFrameRows[i], ' ', frameWidth).split('')); 
            }   
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

        $("#ascii").focusout(function(){
            editFrame($(this)[0].value);
        });
    }

    return {
        init: function () {
            initEventHandlers();
            addFrameAt(0, 'a');
            addFrameAt(1, 'b');
            addFrameAt(2, 'v');
            addFrameAt(3, 'g');
            addFrameAt(4, 'd');
            addFrameAt(5, 'e');
            addFrameAt(6, 'j');
            fillFrameList();
        }
    };
};
