// @ts-nocheck
/* Variables */
const btnObjects = document.querySelector(".objects");
const btnApartment = document.querySelector(".apartment");
const btnHotelsRestaurants = document.querySelector(".hotels-restaurants");
const gallery = document.querySelector(".gallery");
const body = document.querySelector("body");
const containerFiltres = document.querySelector(".container-filtres");
// Variables pour la partie conexion
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
const logOut = document.getElementById("login-link");
const sectionPortfolio = document.querySelector("#portfolio");
const sectionPortfolioH2 = document.querySelector("#portfolio h2");
const adminText = "Mode édition";
const adminLogo = `<i class="fa-regular fa-pen-to-square"></i>`;
const divEdit = document.createElement("div");
const spanEdit = document.createElement("span");
const adminConexionDown = `${adminLogo}  ${adminText} `;
const adminConexion = `<div class="admin-edit">
<p>${adminLogo}${adminText}</p>
</div>`;

/* Chercher le tableau de works avec une requête à l'API */
async function fetchWorks() {
  const requete = await fetch("http://localhost:5678/api/works");
  return requete.json();
}
async function fetchCategory() {
  const requete = await fetch("http://localhost:5678/api/categories");
  return requete.json();
}

function main() {
  displayWorksDom();
  creationButtons();
  logginAdmin();
  logoutAdmin();
}
main();

/* affichage des works dans le dom */
function displayWorksDom() {
  fetchWorks().then((data) => {
    //cree pour chaque élément du tableau
    // console.log(data);
    data.forEach((work) => {
      createWork(work);
    });
  });
}

function createWork(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;
  img.src = work.imageUrl;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

/*****Création des bouton dynamiquement******/
/*Boucle for pour creer les bouton par catégorie*/
function creationButtons() {
  fetchCategory().then((data) => {
    console.log(data);
    data.forEach((category) => {
      categoryContentButton(category);
    });
  });
}
function categoryContentButton(category) {
  const btn = document.createElement("button");
  btn.classList.add("buttons-filtres");
  btn.textContent = category.name;
  btn.id = category.id;
  containerFiltres.appendChild(btn);
  console.log(category.id);
  console.log(category.name);
}

/*Creation d'évènement sur le container filtres*/
//gère la classe active & remet a zéro l'affichage des works
containerFiltres.addEventListener("click", function (event) {
  if (event.target.classList.contains("buttons-filtres")) {
    document.querySelectorAll(".buttons-filtres").forEach(function (btn) {
      btn.classList.remove("active");
    });
    event.target.classList.add("active");
    gallery.innerHTML = "";
  }
  //creation des works a partir de la catégory et id button
  const idValue = event.target.id;
  fetchWorks().then((works) => {
    works.forEach((work) => {
      //creation d'un work que si son id et egal a la catégory
      //car on filtre les catégories différentes
      if (idValue == work.categoryId) {
        createWork(work);
      }
      if (idValue == 0) {
        createWork(work);
      }
    });
  });
});

function createWork(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;
  img.src = work.imageUrl;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

// Vérifiez si l'utilisateur est conecté ou non
/*****Partie ou l'utilisateur et conecté*****/
function logginAdmin() {
  if (isLoggedIn) {
    // Modifications si L'utilisateur est connecté
    console.log("L'utilisateur est connecté");
    logOut.textContent = "logout";
    document.body.insertAdjacentHTML("beforebegin", adminConexion);
    spanEdit.innerHTML = adminConexionDown;
    divEdit.classList.add("div-edit");
    divEdit.appendChild(sectionPortfolioH2);
    divEdit.appendChild(spanEdit);
    sectionPortfolio.prepend(divEdit);
    containerFiltres.style = "display:none";
  } else {
    // L'utilisateur n'est pas connecté
    console.log("L'utilisateur n'est pas connecté");
    logOut.textContent = "login";
  }
}

/****Suprimer le userToken du local storage si click sur log Out******/
function logoutAdmin() {
  logOut.addEventListener("click", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      window.localStorage.loged = "";
      logOut.textContent = "login";
      localStorage.setItem("isLoggedIn", "false");
      window.location.href = "index.html";
    } else {
      //renvoi sur page conexion
      window.location.href = "login.html";
    }
  });
}
