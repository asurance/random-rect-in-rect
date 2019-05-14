"use strict";
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var bigWidth = 500;
var bigHeight = 500;
var smallWidth = 50;
var smallHeight = 50;
render();
function render() {
    bigWidth = parseInt(document.getElementById('bigWidth').value, 10);
    bigHeight = parseInt(document.getElementById('bigHeight').value, 10);
    smallWidth = parseInt(document.getElementById('smallWidth').value, 10);
    smallHeight = parseInt(document.getElementById('smallHeight').value, 10);
    if (smallWidth >= bigWidth || smallHeight >= bigHeight) {
        alert('请确保方块宽高分别小于总宽高');
    }
    else {
        canvas.width = bigWidth;
        canvas.height = bigHeight;
        context.fillStyle = '#0000FF';
        context.fillRect(0, 0, bigWidth, bigHeight);
        var begin = new Date().getTime();
        var list = getRandomList();
        var end = new Date().getTime();
        context.fillStyle = '#FF0000';
        list.forEach(function (val) {
            context.fillRect(val[0], val[1], smallWidth, smallHeight);
        });
        document.getElementById('max').innerHTML =
            "\u6700\u591A" + (Math.floor(bigHeight / smallHeight) * Math.floor(bigWidth / smallWidth)) + "\u4E2A";
        document.getElementById('cur').innerHTML = "\u5B9E\u9645" + list.length + "\u4E2A";
        document.getElementById('time').innerHTML = "\u968F\u673A\u8017\u65F6" + (end - begin) + "ms";
    }
}
function getRandomList() {
    var randomRect = [[0, 0, bigWidth - smallWidth, bigHeight - smallHeight]];
    var res = [];
    while (randomRect.length > 0) {
        var next = getNext(randomRect);
        reject(randomRect, next);
        res.push(next);
    }
    return res;
}
function getNext(randomRect) {
    var allArea = randomRect.reduce(function (pre, cur) {
        return pre + cur[2 /* width */] * cur[3 /* height */];
    }, 0);
    var point = Math.floor(Math.random() * allArea);
    var index = 0;
    while (index < randomRect.length) {
        var x = randomRect[index][0 /* x */];
        var y = randomRect[index][1 /* y */];
        var width = randomRect[index][2 /* width */];
        var height = randomRect[index][3 /* height */];
        if (point < width * height) {
            return [x + point % width, y + point / width];
        }
        else {
            point -= width * height;
        }
        index++;
    }
    throw new Error('get Next时index越界');
}
function reject(randomRect, rect) {
    var left = rect[0 /* x */] - smallWidth;
    var up = rect[1 /* y */] - smallHeight;
    var right = rect[0 /* x */] + smallWidth;
    var down = rect[1 /* y */] + smallHeight;
    var length = randomRect.length;
    while (length > 0) {
        var curRect = randomRect.shift();
        var left2 = Math.max(left, curRect[0 /* x */]);
        var right2 = Math.min(right, curRect[0 /* x */] + curRect[2 /* width */]);
        var up2 = Math.max(up, curRect[1 /* y */]);
        var down2 = Math.min(down, curRect[1 /* y */] + curRect[3 /* height */]);
        if (down2 > up2 && right2 > left2) {
            if (left > curRect[0 /* x */]) {
                randomRect.push([curRect[0 /* x */], curRect[1 /* y */],
                    left - curRect[0 /* x */], curRect[3 /* height */]]);
            }
            if (right < curRect[0 /* x */] + curRect[2 /* width */]) {
                randomRect.push([right, curRect[1 /* y */],
                    curRect[0 /* x */] + curRect[2 /* width */] - right, curRect[3 /* height */]]);
            }
            if (up > curRect[1 /* y */]) {
                randomRect.push([left2, curRect[1 /* y */],
                    right2 - left2, up - curRect[1 /* y */]]);
            }
            if (down < curRect[1 /* y */] + curRect[3 /* height */]) {
                randomRect.push([left2, down,
                    right2 - left2, curRect[1 /* y */] + curRect[3 /* height */] - down]);
            }
        }
        else {
            randomRect.push(curRect.slice());
        }
        length--;
    }
}
//# sourceMappingURL=index.js.map