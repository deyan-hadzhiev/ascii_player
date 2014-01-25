var ASCIIMatrix = function (copy) {
    "use strict";
    var arr = [],
        copyIndex = 0;

    if (copy !== undefined) {
        for (copyIndex = 0; copyIndex < copy.arr.length; copyIndex += 1) {
            arr[copyIndex] = copy.arr[copyIndex].slice();
        }
    }

    return {
        init: function (rows, columns, defaultValue) {
            var i = 0,
                j = 0;
            if (defaultValue === undefined) {
                defaultValue = 0;
            }
            arr.lenght = 0;
            for (i = 0; i < rows; i += 1) {
                arr.push([]);
                for (j = 0; j < columns; j += 1) {
                    arr[i].push(defaultValue);
                }
            }
        },

        clear: function (value) {
            var i = 0,
                j = 0;
            if (value === undefined) {
                value = 0;
            }
            for (i = 0; i < arr.length; i += 1) {
                for (j = 0; j < arr[i].length; j += 1) {
                    arr[i][j] = value;
                }
            }
        },

        getRow: function (index) {
            return arr[index];
        },

        setRow: function (index, element) {
            arr[index] = element;
        },

        getElement: function (i, j) {
            return arr[i][j];
        },

        setElement: function (i, j, element) {
            arr[i][j] = element;
        },

        getWidth: function () {
            return arr.length;
        },

        getHeight: function () {
            if (arr.length > 0) {
                return arr[0].length;
            }
            return 0;
        }
    };
};