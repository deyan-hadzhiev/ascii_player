/*globals window, document, console, $, setInterval, ASCIIMatrix, ASCIICanvas, ASCIIFileLoader, setTimeout */

var ASCIIFrameManager = function () {
    "use strict";

    var playing = false,
        currentFrameIndex = -1,
        frames = [],
        loopFrames = false,
        frameRate = 30,
        fileLoader = new ASCIIFileLoader(),
        canvasHeight = Math.floor((ASCIICanvas.getHeight()) / ASCIICanvas.getFontHeight()),
        canvasWidth = Math.floor((ASCIICanvas.getWidth()) / ASCIICanvas.getFontWidth());

    function drawFrame(frameIndex) {
        if (frameIndex < frames.length) {
            currentFrameIndex = frameIndex;
            highlightFrame(frameIndex);
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
                            document.getElementById("playIcon").className = 'play';
                        }

                    }

                }, 1000 / frameRate);
            }

        } else {
            playing = false;
            document.getElementById("playIcon").className = 'play';
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
            element.setAttribute('id', 'frame' + i);
            element.innerHTML = i;
            scroller.appendChild(element);
        }

        $("#scroller a").click(function (e) {
            e.preventDefault();
            drawFrame(parseInt(e.target.text, 10));
        });
    }

    function highlightFrame(frameIndex) {
        var i = 0;

        //Clear other highlights
        for (i = 0; i < frames.length; i += 1) {
            $('#frame' + i).attr('class', 'deselected');
        }

        $('#frame' + frameIndex).attr('class', 'selected');
    }

    function addFrameAt(position, defaultValue, frameMatrix) {
        var frame = new ASCIIMatrix(),
            frameWidth = 0,
            frameHeight = 0;

        if (undefined === frameMatrix) {
            frameWidth = canvasWidth;
            frameHeight = canvasHeight;
            frame.init(frameHeight, frameWidth, defaultValue);
        } else {
            frame = frameMatrix;
        }

        currentFrameIndex = position;
        frames.splice(position, 0, frame);
    }

    function removeFrameAt(position) {
        if (position > 0) {
            currentFrameIndex = position - 1;
            frames.splice(position, 1);
        }
    }

    function fillStringUntilLength(string, character, desiredLength) {
        while (string.length < desiredLength) {
            string += character;
        }

        return string;
    }

    function fillArrayUntilLength(array, value, desiredLength) {
        while (array.length < desiredLength) {
            array.push(value);
        }

        return array;
    }

    function editFrame(newFrame) {
        var frameWidth = canvasWidth,
            frameHeight = canvasHeight,
            i = 0,
            newFrameRows = 0;

        newFrameRows = newFrame.split('\n');
        for (i = 0; i < frameHeight; i += 1) {
            if (undefined === newFrameRows[i]) {
                frames[currentFrameIndex].setRow(i, fillStringUntilLength('', ' ', frameWidth).split(''));
            } else {
                frames[currentFrameIndex].setRow(i, fillStringUntilLength(newFrameRows[i], ' ', frameWidth).split(''));
            }
        }
    }

    function initEventHandlers() {
        $("#addFrame").click(function (e) {
            e.preventDefault();
            addFrameAt(currentFrameIndex + 1, null, new ASCIIMatrix(frames[currentFrameIndex]));
            fillFrameList();
            drawFrame(currentFrameIndex);
        });

        $("#removeFrame").click(function (e) {
            e.preventDefault();
            removeFrameAt(currentFrameIndex);
            fillFrameList();
            drawFrame(currentFrameIndex);
        });

        $("#playPause").click(function (e) {
            e.preventDefault();
            document.getElementById("playIcon").className = (playing ? 'play' : 'pause');
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
            row = [],
            canvas = document.createElement("canvas"),
            canvasContext = canvas.getContext("2d"),
            newFrame = new ASCIIMatrix(),
            pixels,
            scaleCoefficient = 1;

        // playing it safe ...
        img.onload = function () {
            if (img.height > img.width) {
                scaleCoefficient = canvasHeight / img.height;
            } else {
                scaleCoefficient = canvasWidth / img.width;
            }

            img.width = Math.ceil(img.width * scaleCoefficient);
            img.height = Math.ceil(img.height * scaleCoefficient);
            frameWidth = img.width;
            frameHeight = img.height;
            canvas.width = frameWidth;
            canvas.height = frameHeight;

            //painting the canvas white before painting the image to deal with pngs
            canvasContext.fillStyle = "white";
            canvasContext.fillRect(0, 0, frameWidth, frameHeight);

            //drawing the image on the canvas
            canvasContext.drawImage(img, 0, 0, frameWidth, frameHeight);
            //accessing pixel data
            pixels = canvasContext.getImageData(0, 0, frameWidth, frameHeight);
            colordata = pixels.data;
            newFrame.init(canvasHeight, canvasWidth, ' ');
            for (i = 0; i < colordata.length; i += 4) {
                r = colordata[i];
                g = colordata[i + 1];
                b = colordata[i + 2];

                //converting the pixel into grayscale http://en.wikipedia.org/wiki/Grayscale
                gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

                //if the pointer reaches end of pixel-line
                if (i !== 0 && (i / 4) % frameWidth === 0) {
                    j += 1;
                }

                newFrame.setElement(j, (i / 4) % frameWidth, gray);
            }

            //document.getElementById('testImage').appendChild(canvas);
            addFrameAt(currentFrameIndex + 1, 0, newFrame);
            fillFrameList();
            drawFrame(currentFrameIndex);
        };

        img.className = 'test';
        img.src = file;
    }

    return {
        init: function () {
            initEventHandlers();
            fileLoader.setOnLoadCallback(onFileLoad);
            fileLoader.attachToInput("files");

            for (var i = 0; i < 103; i += 1) {
                onFileLoad('res/' + i + '.gif');
            }
            // onFileLoad('res/tmp-0.gif');
            // onFileLoad('res/tmp-1.gif');
            // onFileLoad('res/tmp-2.gif');
            // onFileLoad('res/tmp-3.gif');
            // onFileLoad('res/tmp-4.gif');
            // onFileLoad('res/tmp-5.gif');
        }
    };
};
