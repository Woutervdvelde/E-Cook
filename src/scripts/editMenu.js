const contextMenu = document.getElementById("context_menu");
const enableContextMenu = () => {
    document.querySelectorAll("input").forEach(input => {
        input.oncontextmenu = (e) => {
            e.preventDefault();
            const { clientX: mouseX, clientY: mouseY } = e

            contextMenu.classList.remove("visible");
            setTimeout(() => {
                contextMenu.classList.add("visible");
                contextMenu.style.top = `${mouseY - (contextMenu.clientHeight * 1.5)}px`;
                contextMenu.style.left = `${mouseX - (contextMenu.clientWidth / 2)}px`;
            });
        }

        document.body.addEventListener("click", (e) => {
            if (e.target.offsetParent != contextMenu)
                contextMenu.classList.remove("visible");
        });
    });
}