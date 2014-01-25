var ASCIIMatrix = function () {
    "use strict";
    var arr = [];

    return {
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
        }
    };
};