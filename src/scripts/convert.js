const validateUserInput = () => {
    const validBoudingBoxes = revertible.history.filter(h => h.type != "background").length > 0;
    const validBackground = revertible.history.filter(h => h.type == "background").length > 0;

    return validBoudingBoxes && validBackground;
}

const getLoadingOverlay = () => {
    const template = document.getElementById('canvasLoadingOverlay');
    const elem = template.content.cloneNode(true);
    return elem;
}

const startConverting = async () => {
    if (!validateUserInput()) return;

    const onRecorgnizeUpdate = (m) => {
        console.log(m);
    }

    const overlay = getLoadingOverlay();
    canvasContainer.appendChild(overlay);
    setTimeout(() => {
        canvasContainer.querySelector("div").style.opacity = 1;
        canvasContainer.querySelector("div").style.height = `${canvas.height}px`;
    },0);

    await recognize(onRecorgnizeUpdate);

    document.body.style.opacity = 0;
    localStorage.setItem("conversion_data", JSON.stringify(revertible));
    setTimeout(() => window.location = "edit.html", 250);
}

convertButton.onclick = startConverting;