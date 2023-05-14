const revertible = JSON.parse(localStorage.getItem("conversion_data"));
const recipe = {
    title: { text: "", images: [] },
    description: { text: "", images: [] },
    ingredients: { text: [], images: [] },
    steps: { text: [], images: [] }
}
const getIngredientByElement = (element) => recipe.ingredients.text.find(i => i.element == element);

const editContainer = document.getElementById("edit_container");
const imageContainer = document.getElementById("recipe_image_container");
const imageToggleButton = document.getElementById("toggle_image_button");
const nextButton = document.getElementById("edit_next_button");
const backButton = document.getElementById("edit_back_button");
const finishButton = document.getElementById("edit_finish_button");
const getCurrentInput = () => document.getElementById("current_input");

const pages = ['title', 'description', 'ingredients', 'steps'];
let currentPage = pages[0];
let showWholeRecipe = false;

const textAreaResize = () => {
    this.style.height = "auto";
    this.style.height = `${this.scrollHeight}px`;
}

const editNavigate = async (page) => {
    if (page == 'next')
        page = pages[pages.indexOf(currentPage) + 1];

    if (page == 'back')
        page = pages[pages.indexOf(currentPage) - 1];

    if (page) {
        editContainer.style.opacity = 0;
        await timeout(200);

        currentPage = page;
        setNavigationActive(page);
        setNavigatedTemplate(page);
        loadTemplateData(page);

        if (showWholeRecipe) setWholeRecipeImage();
        else setRecipeImages(page);

        editContainer.style.opacity = 1;
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

    const textarea = editContainer.querySelector('textarea');
    if (textarea) {
        textarea.id = "current_input";
        textarea.rows = 1;
        textarea.setAttribute('oninput', 'this.style.height = "";this.style.height = this.scrollHeight + "px"');
        textarea.oninput = onTextareaChange;
    }
}

const loadTemplateData = (page) => {
    switch (page) {
        case "ingredients":
            loadIngredients();
            enableContextMenu();
            break;
        default:
            const textarea = getCurrentInput();
            textarea.value = recipe[page].text;
            textarea.dispatchEvent(new Event('input'));
            break;
    }
}

const getIngredientInput = (ingredient) => {
    const template = document.getElementById("edit_template_ingredient_input");
    const elem = template.content.cloneNode(true);

    const input = elem.querySelector("input");
    input.oninput = (e) => { onInputChange(e, ingredient) };
    input.value = ingredient.value;

    elem.querySelector(".ingredient-delete-container").onclick = (e) => { deleteIngredient(e, ingredient) };
    return elem;
}

const addEmptyIngredientInput = (afterElement) => {
    const elem = document.querySelector(".ingredients-container");
    const ingredient = { value: "" };
    const input = getIngredientInput(ingredient);

    if (afterElement) {
        const index = recipe.ingredients.text.indexOf(getIngredientByElement(afterElement));
        recipe.ingredients.text.splice(index + 1, 0, ingredient);
        afterElement.after(input);
        ingredient.element = afterElement.nextElementSibling;
    } else {
        recipe.ingredients.text.push(ingredient);
        elem.appendChild(input);
        ingredient.element = elem.children.last();
    }
    return ingredient;
}

const loadIngredients = () => {
    const elem = editContainer.querySelector(".ingredients-container");
    elem.innerHTML = "";

    recipe.ingredients.text.forEach((ingredient) => {
        elem.appendChild(getIngredientInput(ingredient));
        ingredient.element = elem.children[elem.childElementCount - 1];
    });

    document.querySelector(".add-ingredient-container").onclick = () => addEmptyIngredientInput();
}

const deleteIngredient = (e, ingredient) => {
    ingredient.element.parentElement.removeChild(ingredient.element);
    recipe.ingredients.text.splice(recipe.ingredients.text.indexOf(ingredient), 1);
}

const splitIngredientText = (e, input) => {
    const first = input.value.slice(0, input.selectionStart).trim();
    const second = input.value.slice(input.selectionStart).trim();

    input.value = first;
    input.dispatchEvent(new Event('input'));

    if (second != "") {
        const ingredient = addEmptyIngredientInput(input.closest(".ingredient-input-container"));
        ingredient.value = second;
        ingredient.element.querySelector("input").value = second;
    }
    hideContextMenu();
}

const setRecipeImages = (page) => {
    imageContainer.innerHTML = "";
    recipe[page].images.forEach(image => {
        const img = document.createElement("img");
        img.src = image;
        imageContainer.appendChild(img);
    });

    imageToggleButton.innerHTML = `<span class="material-symbols-rounded">crop_free</span>full image`;
}

const setWholeRecipeImage = () => {
    imageContainer.innerHTML = "";
    const img = document.createElement("img");
    img.src = revertible.history.find(h => h.type == "background").croppedImage;
    imageContainer.appendChild(img);

    imageToggleButton.innerHTML = `<span class="material-symbols-rounded">crop</span>cropped`;
}

const onTextareaChange = (e) => {
    const elem = e.target;
    elem.style.height = "";
    elem.style.height = `${elem.scrollHeight}px`;
    recipe[currentPage].text = elem.value;
}

const onInputChange = (e, ingredient) => {
    ingredient.value = e.target.value;
}

const getHistoryItemsByType = (revertible, type) => revertible.history.filter(h => h.type.name == type);

const parseData = (revertible) => {
    const h_titles = getHistoryItemsByType(revertible, "title");
    const h_descriptions = getHistoryItemsByType(revertible, "description");
    const h_ingredients = getHistoryItemsByType(revertible, "ingredients");
    const h_steps = getHistoryItemsByType(revertible, "steps");

    recipe.title.text = h_titles.map(item => item.recognition.text.trim()).join('\n');
    recipe.description.text = h_descriptions.map(item => item.recognition.text.trim()).join('\n');
    recipe.ingredients.text = h_ingredients.map(item => item.recognition.paragraphs).flat().map(t => { return { value: t.trim() } });
    recipe.steps.text = h_steps.map(item => item.recognition.paragraphs).flat().map(t => t.trim());

    recipe.title.images = h_titles.map(item => item.croppedImage);
    recipe.description.images = h_descriptions.map(item => item.croppedImage);
    recipe.ingredients.images = h_ingredients.map(item => item.croppedImage);
    recipe.steps.images = h_steps.map(item => item.croppedImage);
}

window.onload = () => {
    parseData(revertible);
    editNavigate(pages[0]);
}

imageToggleButton.onclick = () => {
    showWholeRecipe = !showWholeRecipe;
    if (showWholeRecipe)
        setWholeRecipeImage();
    else
        setRecipeImages(currentPage);
}

