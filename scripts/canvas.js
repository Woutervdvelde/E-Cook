const canvas = document.getElementById("canvas");
const typeButtons = document.getElementsByClassName("type-button");
const uploadInput = document.getElementById("recipe_upload");
const uploadButton = document.getElementById("recipe_upload_button");
const sourceImage = document.getElementById("source_image");
const ctx = canvas.getContext('2d');
const revertible = new Revertible();

const boundingBoxFillAlpha = .4;
const types = {
    title: {
        name: 'title',
        colors: {
            name: 'red',
            outline: getComputedStyle(document.body).getPropertyValue('--color-red-400'),
            fill: HSLtoHSLA(getComputedStyle(document.body).getPropertyValue('--color-red-200'), boundingBoxFillAlpha)
        }
    },
    description: {
        name: 'description',
        colors: {
            name: 'blue',
            outline: getComputedStyle(document.body).getPropertyValue('--color-blue-400'),
            fill: HSLtoHSLA(getComputedStyle(document.body).getPropertyValue('--color-blue-200'), boundingBoxFillAlpha)
        }
    },
    ingredients: {
        name: 'ingredients',
        colors: {
            name: 'green',
            outline: getComputedStyle(document.body).getPropertyValue('--color-green-600'),
            fill: HSLtoHSLA(getComputedStyle(document.body).getPropertyValue('--color-green-200'), boundingBoxFillAlpha)
        }
    },
    steps: {
        name: 'steps',
        colors: {
            name: 'yellow',
            outline: getComputedStyle(document.body).getPropertyValue('--color-yellow-400'),
            fill: HSLtoHSLA(getComputedStyle(document.body).getPropertyValue('--color-yellow-200'), boundingBoxFillAlpha)
        }
    }
}

let backgroundColor = 'white';
let drawing = false;
let background = new Image();
let mouseStart = { x: 0, y: 0 };
let mouseEnd = { x: 0, y: 0 };
let currentType = types.title;

const startDraw = () => drawing = true;

const stopDraw = async () => {
    drawing = false;
    await saveDrawing();

    const bounds = parseCords(mouseStart.x, mouseStart.y, mouseEnd.x, mouseEnd.y);
    revertible.addToHistory(bounds, currentType, background);
}

const drawBackground = () => {
    if (!background.src) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

const drawSelection = (x, y) => {
    drawBackground();
    ctx.drawRoundRect(mouseStart.x, mouseStart.y, x, y, currentType.colors.fill, currentType.colors.outline);
}

const saveDrawing = () => {
    return new Promise(async (resolve, reject) => {
        const img = await getImageFromCanvas();
        background.src = img.src;
        resolve(true);
    });
}

const getImageFromCanvas = () => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = canvas.toDataURL();
    });
}

canvas.onmousedown = (e) => {
    e.preventDefault();
    const position = canvas.getBoundingClientRect();
    mouseStart.x = e.clientX - position.x;
    mouseStart.y = e.clientY - position.y;
    startDraw();
}

canvas.onmousemove = (e) => {
    if (!drawing) return;
    const position = canvas.getBoundingClientRect();
    mouseEnd.x = e.clientX - position.x;
    mouseEnd.y = e.clientY - position.y;
    drawSelection(mouseEnd.x, mouseEnd.y);
}

canvas.onmouseleave = (e) => { if (drawing) stopDraw() };
canvas.onmouseup = (e) => stopDraw();

const undo = () => {
    const item = revertible.undo();;
    if (item)
        background.src = item.image.src;
    else
        background = new Image();
    drawBackground();
}

const redo = () => {
    const item = revertible.redo();
    if (item)
        background.src = item.image.src;
    else
        background = new Image();
    drawBackground();
}

const typeButtonClick = (e) => {
    const type = types[e.target.dataset.type];
    if (!type) return;
    currentType = type;

    for (const button of typeButtons) {
        button.classList.remove('active');
    }
    e.target.classList.add('active');
}

for (const button of typeButtons) {
    button.onclick = typeButtonClick;
}

uploadButton.onclick = async (e) => {
    if (revertible.history.length == 0)
        return uploadInput.click();

    const modal = new Modal(
        'Upload new image',
        "Are you sure you want to upload a new image?\nAll your previous drawed bounding boxes will dissapear.\nAll generated text will stay.",
        ModalTypes.YES_NO
    );
    const response = await modal.getResponse();
    if (response)
        uploadInput.click();
}

const updateCanvasSize = (img) => {
    canvas.height = img.height / (img.width / canvas.width);
    drawBackground();
}

uploadInput.oninput = (e) => {
    const url = URL.createObjectURL(e.target.files[0]);
    const img = new Image();
    img.onload = async () => {
        updateCanvasSize(img);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        await saveDrawing();
        revertible.reset();
        revertible.addToHistory(null, 'background', background);
        sourceImage.src = img.src;
    }
    img.src = url;
}