const revertible = JSON.parse(localStorage.getItem("conversion_data"));

const pages = ['title', 'description', 'ingredients', 'steps'];

const editNavigate = (page) => {
    setNavigationActive(page);
}

const setNavigationActive = (page) => {
    const navigations = document.querySelector(".breadcrumbs-container").querySelectorAll("a");
    navigations.forEach(elem => elem.classList.remove("active"));

    const navigation = document.querySelector(".breadcrumbs-container").querySelector(`.${page}`);
    navigation.classList.add("active");
}