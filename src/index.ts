let canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
let context = canvas.getContext('2d')!;
let bigWidth = 500;
let bigHeight = 500;
let smallWidth = 50;
let smallHeight = 50;

render();

const enum Rect {
    x,
    y,
    width,
    height,
}

function render() {
    bigWidth = parseInt((document.getElementById('bigWidth') as HTMLInputElement).value, 10);
    bigHeight = parseInt((document.getElementById('bigHeight') as HTMLInputElement).value, 10);
    smallWidth = parseInt((document.getElementById('smallWidth') as HTMLInputElement).value, 10);
    smallHeight = parseInt((document.getElementById('smallHeight') as HTMLInputElement).value, 10);
    canvas.width = bigWidth;
    canvas.height = bigHeight;
    context.fillStyle = '#0000FF';
    context.fillRect(0, 0, bigWidth, bigHeight);
    const begin = new Date().getTime();
    const list = getRandomList();
    const end = new Date().getTime();
    context.fillStyle = '#FF0000';
    list.forEach((val) => {
        context.fillRect(val[0], val[1], smallWidth, smallHeight);
    });
    (document.getElementById('max') as HTMLElement).innerHTML =
        `最多${(Math.floor(bigHeight / smallHeight) * Math.floor(bigWidth / smallWidth))}个`;
    (document.getElementById('cur') as HTMLElement).innerHTML = `实际${list.length}个`;
    (document.getElementById('time') as HTMLElement).innerHTML = `随机耗时${end - begin}ms`;
}

function getRandomList() {
    const randomArea = [[0, 0, bigWidth - smallWidth, bigHeight - smallHeight]];
    const res: number[][] = [];
    if (randomArea[0][Rect.width] >= 0 && randomArea[0][Rect.height] >= 0) {
        while (randomArea.length > 0) {
            const next = getNextFromArea(randomArea);
            reject(randomArea, next);
            res.push(next);
        }
    }
    return res;
}

function getNextFromArea(randomArea: number[][]) {
    const allArea = randomArea.reduce((pre, cur) => {
        return pre + (cur[Rect.width] + 1) * (cur[Rect.height] + 1);
    }, 0);
    let point = Math.floor(Math.random() * allArea);
    let index = 0;
    while (index < randomArea.length) {
        const x = randomArea[index][Rect.x];
        const y = randomArea[index][Rect.y];
        const width = randomArea[index][Rect.width];
        const height = randomArea[index][Rect.height];
        if (point < (width + 1) * (height + 1)) {
            return [x + point % (width + 1), y + Math.floor(point / (width + 1))];
        } else {
            point -= (width + 1) * (height + 1);
        }
        index++;
    }
    throw new Error('get Next From Area时index越界');
}

function reject(randomRect: number[][], rect: number[]) {
    const left = rect[Rect.x] - smallWidth;
    const up = rect[Rect.y] - smallHeight;
    const right = rect[Rect.x] + smallWidth;
    const down = rect[Rect.y] + smallHeight;
    let length = randomRect.length;
    while (length > 0) {
        const curRect = randomRect.shift()!;
        const left2 = Math.max(left, curRect[Rect.x]);
        const right2 = Math.min(right, curRect[Rect.x] + curRect[Rect.width]);
        const up2 = Math.max(up, curRect[Rect.y]);
        const down2 = Math.min(down, curRect[Rect.y] + curRect[Rect.height]);
        if (down2 >= up2 && right2 >= left2) {
            if (left >= curRect[Rect.x]) {
                randomRect.push([curRect[Rect.x], curRect[Rect.y],
                left - curRect[Rect.x], curRect[Rect.height]]);
            }
            if (right <= curRect[Rect.x] + curRect[Rect.width]) {
                randomRect.push([right, curRect[Rect.y],
                    curRect[Rect.x] + curRect[Rect.width] - right, curRect[Rect.height]]);
            }
            if (up >= curRect[Rect.y]) {
                randomRect.push([left2, curRect[Rect.y],
                    right2 - left2, up - curRect[Rect.y]]);
            }
            if (down <= curRect[Rect.y] + curRect[Rect.height]) {
                randomRect.push([left2, down,
                    right2 - left2, curRect[Rect.y] + curRect[Rect.height] - down]);
            }
        } else {
            randomRect.push(curRect.slice());
        }
        length--;
    }
}
