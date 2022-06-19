const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

CanvasRenderingContext2D.prototype.drawRoundRect = function(x, y, x2, y2, radius = 5, fill = false, stroke = true) {
    let cords = { x: x, y: y, x2: x2 - x, y2: y2 - y };
    if (x2 > x && y2 < y)
        cords = { x: x, y: y2, x2: x2 - x, y2: y - y2 };
    if (x2 < x && y2 > y)
        cords = { x: x2, y: y, x2: x - x2, y2: y2 - y };
    if (x2 < x && y2 < y)
        cords = { x: x2, y: y2, x2: x - x2, y2: y - y2 };

    this.beginPath();
    this.moveTo(cords.x + radius, cords.y);
    this.lineTo(cords.x + cords.x2 - radius, cords.y);
    this.quadraticCurveTo(cords.x + cords.x2, cords.y, cords.x + cords.x2, cords.y + radius);
    this.lineTo(cords.x + cords.x2, cords.y + cords.y2 - radius);
    this.quadraticCurveTo(cords.x + cords.x2, cords.y + cords.y2, cords.x + cords.x2 - radius, cords.y + cords.y2);
    this.lineTo(cords.x + radius, cords.y + cords.y2);
    this.quadraticCurveTo(cords.x, cords.y + cords.y2, cords.x, cords.y + cords.y2 - radius);
    this.lineTo(cords.x, cords.y + radius);
    this.quadraticCurveTo(cords.x, cords.y, cords.x + radius, cords.y);
    this.closePath();
    if (fill)
        this.fill();
    if (stroke)
        this.stroke();
};

let backgroundColor = 'white';
let drawing = false;
let background = new window.Image();
let mouseStart = { x: 0, y: 0 };

const startDraw = (x, y) => { mouseStart = { x: x, y: y }; drawing = true; }
const stopDraw = () => { drawing = false; }

const drawSelection = (x, y) => {
    if (!background.src) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else
        ctx.drawImage(background, 0, 0);

    // x = x - mouseStart.x;
    // y = y - mouseStart.y;
    ctx.drawRoundRect(mouseStart.x, mouseStart.y, x, y)
}

const saveDrawing = () => {
    background.setAttribute('src', canvas.toDataURL());
}


canvas.onmousedown = (e) => {
    startDraw(e.x - canvas.offsetLeft, e.y - canvas.offsetTop);
}

canvas.onmousemove = (e) => {
    if (!drawing) return;
    drawSelection(e.x - canvas.offsetLeft, e.y - canvas.offsetTop);
}

canvas.onmouseup = (e) => {
    stopDraw();
    saveDrawing();
}

