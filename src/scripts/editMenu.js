const contextMenu = document.getElementById("context_menu");
const contextMenuSplit = document.getElementById("context_menu_split");
let focusedInput;

const enableContextMenu = () => {
    document.querySelectorAll("input").forEach(input => {
        input.oncontextmenu = (e) => {
            e.preventDefault();
            focusedInput = input;
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
                hideContextMenu();
        });
    });
}

const hideContextMenu = () => contextMenu.classList.remove("visible");

contextMenuSplit.onclick = (e) => splitIngredientText(e, focusedInput);