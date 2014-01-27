var ASCIIMatrix = function (copy) {
    "use strict";
    var arr = [],
        copyIndex = 0,
        i = 0;

    if (copy !== undefined) {
        for (i = 0; i < copy.getHeight(); i += 1) {
            arr.push(copy.getRow(i).slice());
        }
    }

    return {
        init: function (rows, columns, defaultValue) {
            var i = 0,
                j = 0;
            if (defaultValue === undefined) {
                defaultValue = 0;
            }
            arr.length = 0;
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
            if (arr.length > 0) {
                return arr[0].length;
            }
            return 0;
        },

        getHeight: function () {
            return arr.length;
        }
    };
};