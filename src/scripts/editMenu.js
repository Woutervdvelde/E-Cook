const contextMenu = document.getElementById("context_menu");
const enableContextMenu = () => {
    document.querySelectorAll("input").forEach(input => {
        input.oncontextmenu = (e) => {
            e.preventDefault();
            const { clientX: mouseX, clientY: mouseY } = e;

            contextMenu.style.top = `${mouseY}px`;
            contextMenu.style.left = `${mouseX}px`;
            contextMenu.classList.add("visible");
        }

        document.body.addEventListener("click", (e) => {
            if (e.target.offsetParent != contextMenu)
                contextMenu.classList.remove("visible");
        });
    });
}