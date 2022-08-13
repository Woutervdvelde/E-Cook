const revertible = JSON.parse(localStorage.getItem("conversion_data"));
const nextButton = document.getElementById("edit_next_button");
const backButton = document.getElementById("edit_back_button");

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
}

const enableNextButton = () => { nextButton.style.opacity = 1; nextButton.disabled = false };
const disableNextButton = () => { nextButton.style.opacity = 0; nextButton.disabled = true };
const enableBackButton = () => { backButton.style.opacity = 1; backButton.disabled = false };
const disableBackButton = () => { backButton.style.opacity = 0; backButton.disabled = true };


const setNavigationActive = (page) => {
    const navigations = document.querySelector(".breadcrumbs-container").querySelectorAll("a");
    navigations.forEach(elem => elem.classList.remove("active"));

    const navigation = document.querySelector(".breadcrumbs-container").querySelector(`.${page}`);
    navigation.classList.add("active");
}

window.onload = () => {
    checkButtonToggle();
}