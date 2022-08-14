const revertible = JSON.parse(localStorage.getItem("conversion_data"));
const editContainer = document.getElementById("edit_container");
const editRecipeImage = document.getElementById("edit_recipe_image");
const nextButton = document.getElementById("edit_next_button");
const backButton = document.getElementById("edit_back_button");
const finishButton = document.getElementById("edit_finish_button");

const pages = ['title', 'description', 'ingredients', 'steps'];
let currentPage = pages[0];

const editNavigate = (page) => {
    if (page == 'next')
        page = pages[pages.indexOf(currentPage) + 1];

    if (page == 'back')
        page = pages[pages.indexOf(currentPage) - 1];

    if (page) {
        currentPage = page;
        setNavigationActive(page);
        setNavigatedTemplate(page);
    }
    checkButtonToggle();
}

const checkButtonToggle = () => {
    if (!pages[pages.indexOf(currentPage) + 1])
        disableNextButton();
    else enableNextButton();
    if (!pages[pages.indexOf(currentPage) - 1])
        disableBackButton();
    else enableBackButton();

    if (currentPage == pages[pages.length - 1])
        enableFinishButton();
    else disableFinishButton();
}

const enableNextButton = () => { nextButton.style.opacity = 1; nextButton.disabled = false };
const disableNextButton = () => { nextButton.style.opacity = 0; nextButton.disabled = true };
const enableBackButton = () => { backButton.style.opacity = 1; backButton.disabled = false };
const disableBackButton = () => { backButton.style.opacity = 0; backButton.disabled = true };
const enableFinishButton = () => { finishButton.style.opacity = 1; finishButton.disabled = false };
const disableFinishButton = () => { finishButton.style.opacity = 0; finishButton.disabled = true };


const setNavigationActive = (page) => {
    const navigations = document.querySelector(".breadcrumbs-container").querySelectorAll("a");
    navigations.forEach(elem => elem.classList.remove("active"));

    const navigation = document.querySelector(".breadcrumbs-container").querySelector(`.${page}`);
    navigation.classList.add("active");
}

const setNavigatedTemplate = (page) => {
    const template = document.getElementById(`edit_template_${page}`);
    if (!template) return;

    editContainer.innerHTML = '';
    editContainer.appendChild(template.content.cloneNode(true));
}

window.onload = () => {
    checkButtonToggle();
    setNavigationActive(currentPage);
    setNavigatedTemplate(currentPage);
}