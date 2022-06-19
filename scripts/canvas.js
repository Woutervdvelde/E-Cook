const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let backgroundColor = 'white';
let drawing = false;
let background = new window.Image();
let mouseStart = { x: 0, y: 0 };
let mouseEnd = { x: 0, y: 0 };

const startDraw = (x, y) => {
    mouseStart = { x: x, y: y };
    drawing = true;
}

const stopDraw = () => {
    drawing = false;
    saveDrawing();

    const bounds = parseCords(mouseStart.x, mouseStart.y, mouseEnd.x, mouseEnd.y);
    revertible.addToHistory(bounds, null, background);
}

const drawBackground = () => {
    if (!background.src) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else
        ctx.drawImage(background, 0, 0);
}

const drawSelection = (x, y) => {
    drawBackground();
    ctx.drawRoundRect(mouseStart.x, mouseStart.y, x, y, 'rgba(255,0,0,.2)', 'rgb(255,0,0)');
}

const saveDrawing = () => {
    background.src = canvas.toDataURL();
}

canvas.onmousedown = (e) => {
    startDraw(e.x - canvas.offsetLeft, e.y - canvas.offsetTop);
}

canvas.onmousemove = (e) => {
    if (!drawing) return;
    mouseEnd.x = e.x - canvas.offsetLeft;
    mouseEnd.y = e.y - canvas.offsetTop;
    drawSelection(mouseEnd.x, mouseEnd.y);
}

canvas.onmouseleave = (e) => { if (drawing) stopDraw() };
canvas.onmouseup = (e) => stopDraw();

const undo = () => {
    const item = revertible.undo();;
    if (item)
        background.src = item.image.src;
    else
        background = new window.Image();
    drawBackground();
}

const redo = () => {
    const item = revertible.redo();
    if (item)
        background.src = item.image.src;
    else
        background = new window.Image();
    drawBackground();
}
