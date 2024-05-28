let ingredientes;
let recetas;
let selectedIngredientes = [];

async function populateIngredientes() {
    // Carga el json de ingredientes en nuestra variable
    await fetch("./res/ingredients.json").then((response) => response.json()).then((json) => ingredientes = json);
    // Los pone en orden alfabético
    ingredientes.sort((a,b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
}

async function populateRecetas() {
    // Carga el json de recetas en nuestra variable
    await fetch('./res/recipes.json').then((response) => response.json()).then((json) => recetas = json);
}

function addIngredient(ev) {
    // funcion de cuando clicamos para añadir un ingrediente
    if (selectedIngredientes.length >= 5)
        {
            return null;
        }
    ing = ingredientes.filter(obj => {
        return obj.id == ev.target.parentElement.dataset.id;
    })[0];
    selectedIngredientes.push(ing);
    updateSelectedIngredientDisplay();
}


function removeIngredient(ev) {
    // funcion de cuando clicamos para remover un ingrediente
    index = ev.target.dataset.index;
    selectedIngredientes.splice(index, 1);
    updateSelectedIngredientDisplay();
}

function updateSelectedIngredientDisplay () {
    // Esta funcion es llamada siempre que cambiamos la lista de ingredientes selecionados
    // Actualiza la pantalla con los ingredientes selecionados
    const selectedDisplays = document.querySelectorAll(".ingredient-box");
    for (let i = 0; i < selectedDisplays.length; i++) {
        selectedDisplays[i].replaceChildren();
        if (i < selectedIngredientes.length) {
            const selImg = document.createElement('img');
            selImg.src = './res/ingredients/' + selectedIngredientes[i].id + '.png';
            selImg.alt = selectedIngredientes[i].name;
            selImg.dataset.index = i;
            selImg.addEventListener('click', removeIngredient);
            selectedDisplays[i].appendChild(selImg);
        }
    }
}

function computeHearts(HP) {
    // Crea la cantidad correcta de corazones
    let wholeHearts = Math.floor(HP/4);
    let halfHearts = Math.floor((HP % 4) / 2);
    let quartHearts = HP % 2;
    let hearts = [];
    for (let i = 0; i < wholeHearts; i++)
        {
            const hrt = document.createElement('img');
            hrt.src = './res/icons/heart.png';
            hrt.classList.add('hearticon');
            hearts.push(hrt);
        }
    for (let i = 0; i < halfHearts; i++)
        {
            const hrt = document.createElement('img');
            hrt.src = './res/icons/half-heart.png';
            hrt.classList.add('hearticon');
            hearts.push(hrt);
        }
    for (let i = 0; i < quartHearts; i++)
        {
            const hrt = document.createElement('img');
            hrt.src = './res/icons/quart-heart.png';
            hrt.classList.add('hearticon');
            hearts.push(hrt);
        }
    return hearts;
}

function selectItemDetails(ev) {
    //Rellena los detalles con el ingrediente selecionado
    id = ev.target.dataset.id;
    ing = ingredientes.filter((obj) => {return obj.id == id})[0];
    document.querySelector('#res-foto').src = './res/ingredients/' + id + '.png';
    document.querySelector('#valor-precio').innerHTML = ing.BuyingPrice;
    document.querySelector('#material-name').innerHTML = ing.name;
    document.querySelector('#detalles').style.right = 0;
    hearts = computeHearts(ing.HitPointRecover);
    document.querySelector('#hp-holder').replaceChildren();
    for (i = 0; i < hearts.length; i++) {
        document.querySelector('#hp-holder').appendChild(hearts[i]);
    }
}

function createIngredientElement(ing) {
    // Esta funcion crea el elemento HTML de un ingrediente dado y retorna este elemento HTML
    // ing es un objeto con id y nombre
    const elemContainer = document.createElement('div');
    elemContainer.classList.add('list-box');
    elemContainer.dataset.id = ing.id;
    
    const elemImgContainer = document.createElement('div');
    elemImgContainer.classList.add('list-img');
    elemImgContainer.dataset.id = ing.id;
    
    const elemImg = document.createElement('img');
    elemImg.src = './res/ingredients/' + ing.id + '.png';
    elemImg.alt = ing.name;
    elemImg.dataset.id = ing.id;

    elemImgContainer.appendChild(elemImg);
    elemImgContainer.addEventListener('click', selectItemDetails);
    elemContainer.appendChild(elemImgContainer);

    const elemBut = document.createElement('div');
    elemBut.classList.add('add-button');
    elemBut.dataset.id = ing.id;
    elemBut.dataset.name = ing.name;
    elemBut.addEventListener('click', addIngredient);

    const elemButImg = document.createElement('img');
    elemButImg.src = './res/icons/add-item.png';
    elemButImg.alt = 'Adicionar ingrediente';

    elemBut.appendChild(elemButImg);
    elemContainer.appendChild(elemBut);

    return elemContainer;
}

async function populatePage() {
    // Llamamos esta función para cargar los ingredientes, recetas, y popular la pagina con los elementos de cada ingrediente.
    await populateIngredientes();
    await populateRecetas();
    const listaIngredients = document.querySelector("#ingredient-list");

    for (i in ingredientes)
        {
            listaIngredients.appendChild(createIngredientElement(ingredientes[i]));
        }
    
    document.querySelector('#close-detalles').addEventListener('click', (ev) => {
        document.querySelector('#detalles').style.right = "-50%";
    })
}

populatePage();

