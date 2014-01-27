/*globals window, document, console, $, setInterval, ASCIIMatrix, ASCIICanvas, ASCIIFileLoader, setTimeout */

var ASCIIFrameManager = function () {
    "use strict";

    var playing = false,
        currentFrameIndex = 0,
        frames = [],
        loopFrames = false,
        frameRate = 30,
        fileLoader = new ASCIIFileLoader();

    function drawFrame(frameIndex) {
        if (frameIndex < frames.length) {
            currentFrameIndex = frameIndex;
            ASCIICanvas.drawFrame(frames[frameIndex]);

            if (playing) {
                // get some variables controling the play from the html's input fields
                loopFrames = document.getElementById("loopFrames").checked;
                var fps = parseInt(document.getElementById("fps").value, 10);
                frameRate = (fps > 0 && fps <= 60 ? fps : frameRate);
                //Queue next frame drawing
                setTimeout(function () {
                    if (currentFrameIndex + 1 < frames.length) {
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
            element = null;

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
            drawFrame(parseInt(e.target.text, 10));
        });
    }

    function addFrameAt(position, defaultValue, frameMatrix) {
        var frame = new ASCIIMatrix(),
            frameWidth = 0,
            frameHeight = 0;

        // //No frame selected currently (probably first insertion)
        // if (undefined === frames[currentFrameIndex]) {
        //     frame = new ASCIIMatrix();
        // } else {
        //     frame = new ASCIIMatrix(frames[currentFrameIndex]);
        // }

        if (undefined === frameMatrix) {
            frameWidth = Math.floor((ASCIICanvas.getWidth() - 2) / ASCIICanvas.getFontWidth());
            frameHeight = Math.floor((ASCIICanvas.getHeight() - 2) / ASCIICanvas.getFontHeight());
            frame.init(frameHeight, frameWidth, defaultValue);
        } else {
            frame = frameMatrix;
        }

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
            addFrameAt(currentFrameIndex + 1, null, new ASCIIMatrix(frames[currentFrameIndex]));
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
                if (currentFrameIndex + 1 >= frames.length) {
                    currentFrameIndex = 0;
                }
                drawFrame(currentFrameIndex);
            }
        });

        $("#ascii").focusout(function () {
            editFrame($(this)[0].value);
        });
    }

    function onFileLoad(file) {
        var img = document.createElement('img'),
            frameWidth = 0,
            frameHeight = 0,
            r = 0,
            g = 0,
            b = 0,
            gray = 0,
            colordata,
            i = 0,
            j = 0,
            canvas = document.createElement("canvas"),
            canvasContext = canvas.getContext("2d"),
            newFrame = new ASCIIMatrix(),
            pixels;

        frameWidth = frames[0].getWidth();
        frameHeight = frames[0].getHeight();
        canvas.width = frameWidth;
        canvas.height = frameHeight;

        // playing it safe ...
        img.onload = function() {
            //painting the canvas white before painting the image to deal with pngs
            canvasContext.fillStyle = "white";
            canvasContext.fillRect(0, 0, frameWidth, frameHeight);

            //drawing the image on the canvas
            canvasContext.drawImage(img, 0, 0, frameWidth, frameHeight);

            //accessing pixel data
            pixels = canvasContext.getImageData(0, 0, frameWidth, frameHeight);
            colordata = pixels.data;
            newFrame.init(frameHeight, frameWidth);
            for (i = 0; i < colordata.length; i += 4) {
                r = colordata[i];
                g = colordata[i + 1];
                b = colordata[i + 2];
                //converting the pixel into grayscale
                gray = 0.2126 * r + 0.7152 * g + 0.0722 * b; //http://en.wikipedia.org/wiki/Grayscale

                if (i !== 0 && (i / 4) % frameWidth === 0) {//if the pointer reaches end of pixel-line
                    j += 1;
                }

                newFrame.setElement(j, (i / 4) % frameWidth, gray);
            }

            //document.getElementById('testImage').appendChild(canvas);
            addFrameAt(currentFrameIndex, 0, newFrame);
            fillFrameList();
        }

        img.className = 'test';
        img.style.width = 'auto';
        img.style.maxHeight = frames[0].getHeight() + 'px';
        img.src = file;
    }

    return {
        init: function () {
            initEventHandlers();
            fileLoader.setOnLoadCallback(onFileLoad);
            fileLoader.attachToInput("files");
            addFrameAt(0, 'a');
            fillFrameList();
        }
    };
};
