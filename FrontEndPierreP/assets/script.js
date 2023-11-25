//**************************************************************************************************** *//
// ****************************************     CONSTANTES      *************************************** //
//**************************************************************************************************** *//

// ***************** constantes API ********************** //

const apiLogin = "http://localhost:5678/api/users/login";
const apiWorks = "http://localhost:5678/api/works";
const apiCategories = "http://localhost:5678/api/categories";

// ******************** autres constantes ******************//

// constantes concernant les boutons de filtrages //
const filterBar = document.querySelector(".filter__bar");
const gallery = document.querySelector(".gallery");
const filterBtnTous = document.getElementById("tous");
const filterBtn = document.querySelector(".filter__btn");

//constantes concernant le login et le logout//
const loginBtn = document.getElementById("login")
const logoutBtn = document.getElementById("logout")

//constantes concernant la modale //
const focusableSelector = 'button, a, input, textarea, i'
const modalGallery = document.querySelector('.modal__gallery')
const modalAddpictures = document.querySelector('.modal__addpictures')

const modalPictures = document.querySelector('.pictures__modal')
const jsModal = document.querySelector('.js__modal')
const editionBox = document.querySelector('.edition__box');

//variables concernant la modale //
let modal = null
let focusables = []
let previouslyFocusedElement = null
let trashBoxBtn;

//constantes concernants la boite de confirmation//
const confirmBox = document.querySelector(".confirm__box");
const confirmYes = document.querySelector(".confirm__yes");
const confirmNo = document.querySelector(".confirm__no");
const confirmBtn = document.querySelector(".confirm__btnclose");

// Mettre à jour la fonction filterClick pour appeler galleryCategory avec l'ID de la catégorie
const activeCategories = [];

// ******************** variables ********************** //
let dataWorks;
let categIdClick;
let dataCategories;
let filtersBtn;
let modalPictureDiv;

//**************** variables et constantes concernant l'ajout de travail *******************/

const fileInput = document.getElementById("file");
const titleInput = document.getElementById("title");
const formInput = document.getElementById("work-form");

//initialisation des variables //
let title = "";
let selectedFile;
let selectedValue = "0";
let selectedOption;
let isValid = false;

const inputFileIcone = document.querySelector('.fa-image');
const inputFileBtn = document.querySelector('.inputfile__btn');
const inputFileSpan = document.querySelector('.input__file span');
const inputFileImg = document.querySelector('.input__figure');
const fileError = document.getElementById("file-error");
const selectElement = document.getElementById("choice");

const validateBtn = document.querySelector('.body__modal .validate__btn')








//**************************************************************************************************** *//
// *********************************     FONCTIONS     ************************************************ //
//**************************************************************************************************** *//









//fonctions des fetchs//
async function main() {

  // Appel de la fonction pour récupérer les données Works de l'API et les inserer dans le DOM //
  await fetchWorks();

  // Appel de la fonction pour récupérer les données Categories de l'API //
  await fetchCategories();
}

// fonction pour insérer les données Works dans le DOM //
function displayWorks(dataWorks) {
  for (let i = 0; i < dataWorks.length; i++) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    image.src = dataWorks[i].imageUrl;
    image.alt = dataWorks[i].title;
    figcaption.textContent = dataWorks[i].title;
    figure.classList.add("figure__" + [i + 1]);
    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}

//fonction pour envoyer un nouveau travail à l'api//
async function postDataWorks(index) {
  // Récupération de la valeur du token dans le local de la session
  const tokenValue = window.sessionStorage.getItem("TokenValue");
  const headersWithToken = {
    'Authorization': `Bearer ${tokenValue}`,
    'Content-Type': 'application/json',
  };
  // Vérification de l'existence de la valeur du token
  if (!tokenValue) {
    console.error("Token de sécurité manquant.");
    return;
  }

  // URL de la requête DELETE en utilisant l'ID de la photo
  const deleteURL = `${apiWorks}/${dataWorks[index].id}`;
  console.log(deleteURL);
  try {
    const response = await fetch(deleteURL, {
      method: "DELETE",
      headers: headersWithToken,
    });

    if (response.ok) {
      // Suppression de la photo choisie
      const photoModalSelected = modalPictures.querySelector(".photo__" + (index + 1));
      const figureSelected = gallery.querySelector(".figure__" + (index + 1));

      if (photoModalSelected) {
        photoModalSelected.remove();
        figureSelected.remove();

      }
      console.log("La photo a été supprimée avec succès.");
    } else {
      console.error("Erreur lors de la suppression de la photo.");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la photo : ", error);
  }
}

//fonction pour inserer les données Works dans le DOM de la modale //
function displayWorksModal(dataWorks) {
  for (let i = 0; i < dataWorks.length; i++) {
    const image = document.createElement("img");
    const pictureTrashBoxDiv = document.createElement("div");
    const modalPictureDiv = document.createElement("div");
    const iconeTrashBox = '<i class="fa-solid fa-trash-can"></i>';
    pictureTrashBoxDiv.innerHTML = iconeTrashBox;
    image.src = dataWorks[i].imageUrl; 
    image.alt = dataWorks[i].title;
    pictureTrashBoxDiv.classList.add("trashbox__modal", "photo__" + [i + 1]);
    modalPictureDiv.classList.add("picture__modal", "photo__" + [i + 1]);
    modalPictureDiv.appendChild(image);
    modalPictureDiv.appendChild(pictureTrashBoxDiv);
    modalPictures.appendChild(modalPictureDiv);
    clickTrashBox(dataWorks);

  }
}


// fonction pour récupérer les données Works de l'API //
async function fetchWorks() {
  try {
    const responseWorks = await fetch(apiWorks);
    if (!responseWorks.ok) {
      throw new Error('Erreur lors de la requête');
    }
    dataWorks = await responseWorks.json();
    gallery.innerHTML = "";
    modalPictures.innerHTML = "";

    // appel de la fonction pour inserer les données Works dans le DOM de la modale //
    displayWorksModal(dataWorks);

    // appel de la fonction pour inserer les données Works dans le DOM //
    displayWorks(dataWorks);

  } catch (error) {
    console.error('Erreur :', error);
  }
}


// fonction pour récupérer les données Categories de l'API //
async function fetchCategories() {
  try {
    const responseCategories = await fetch(apiCategories);
    if (!responseCategories.ok) {
      throw new Error('Erreur lors de la requête');
    }
    const dataCategories = await responseCategories.json();
    // appel de la fonction pour insérer les données Categories dans le DOM //
    displayCategories(dataCategories);
    // appel de la fonction pour savoir quel filtre à été cliqué  //
    filterClick();

  } catch (error) {
    console.error('Erreur :', error);
  }
}


// fonction pour insérer les données Categories dans le DOM //
function displayCategories(dataCategories) {
  for (let i = 0; i < dataCategories.length; i++) {
    const button = document.createElement("button");
    const option = document.createElement("option");
    const categoriesId = dataCategories[i].id;
    button.classList.add("filter__btn");
    button.id = (categoriesId);
    button.type = "button";
    button.innerText = dataCategories[i].name;
    filterBar.appendChild(button);

    //insertion des categories dans le selecteur de categorie dans la modale d'envoie //
    option.value = (categoriesId);
    option.innerText = dataCategories[i].name;
    selectElement.appendChild(option);
  }
}


// fonction pour filtrer et afficher les images en fonction de la catégorie
function galleryCategory(categoryId) {
  // Réinitialise la galerie pour supprimer les images actuelles //
  gallery.innerHTML = "";

  // Utilisation de  la méthode filter pour obtenir les images de la catégorie sélectionnée //
  const filteredWorks = dataWorks.filter(work => work.categoryId === categoryId);

  // Affiche les images filtrées //
  filteredWorks.forEach(work => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    image.src = work.imageUrl;
    image.alt = work.title;
    figcaption.textContent = work.title;
    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}


function filterClick() {
  filtersBtn = document.querySelectorAll(".filter__bar .filter__btn");

  filtersBtn.forEach(filterBtn => {
    filterBtn.addEventListener('click', function (clickEvent) {
      const btnClick = clickEvent.target;
      const categIdClick = btnClick.id;

      // reinitialisation des couleurs des boutons
      resetColor();

      //Verification si le bouton clique est celui du reset//
      if (categIdClick === "tous") {
        galleryReset()
        displayWorks(dataWorks);
      } else {
        // Active le bouton 
        btnClick.classList.add("filter__btn--selected");

        // Suppression de la galerie pour éviter l'accumulation de photos
        gallery.innerHTML = "";

        // Filtrer les images en fonction du bouton actif
        const filteredWorks = dataWorks.filter(work => work.categoryId.toString() === categIdClick);

        // Appel de la fonction pour insérer les données Works filtrées par catégorie souhaitée dans le DOM
        displayWorks(filteredWorks);
      }
    });
  });
}


// fonction de reinitialisation du filtrage de la gallerie //
function galleryReset() {
  filterBtnTous.classList.add("filter__btn--selected")
  gallery.innerHTML = "";
};


// fonction de reinitialisation des couleurs des boutons //
function resetColor() {
  filtersBtn.forEach((button) => {
    button.classList.remove("filter__btn--selected")
  });
}

// fonction pour ouvrir la modale et gérer ses méthodes de fermeture et d'ouverture
const openModal = function (e) {
  e.preventDefault();

  //permet de cibler le <a> quand on clique sur le <i> sinon le clic sur l'icone ne marche pas//
  const anchorElement = e.target.closest('a'); // Trouve l'élément <a> le plus proche
  if (anchorElement) {
    modal = document.querySelector(anchorElement.getAttribute('href'));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(':focus');
    focusables[0].focus();

    modal.classList.remove("display--none");
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close-2').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

    // Réinitialise le formulaire lors de l'ouverture de la modale
    resetForm();
  }
}

// fonction pour fermer la modale et gerer ses methodes d'ouvertures
const closeModal = function () {
  if (modal === null) return

   // permet de garder en memoire l'element prealablement selectionné
  if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();

  //e.preventDefault();
  modal.classList.add("display--none");
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal');
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-close-2').removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
  confirmBox.classList.add("display--none");
  openGallery();
  resetForm();
  modal = null

  // appel de la fonction pour reinitialiser le formulaire
  resetForm();
}

//fonction qui empeche de fermer la modale en cliquant a l'interieur de la modale//
const stopPropagation = function (e) {
  e.stopPropagation()
}

// fonction pour bloquer le script à l'interieur de la boite modale // 
const focusInModal = function (e) {
  e.preventDefault()
  let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
  if (e.shiftKey === true) {
    index--
  } else {
    index++
  }

  if (index >= focusables.length) {
    index = 0
  }

  if (index < 0) {
    index = focusables.length - 1
  }
  focusables[index].focus()
}

const openAddpictures = function () {
  modalGallery.classList.add("display--none")
  modalAddpictures.classList.remove("display--none")
}

const openGallery = function () {
  modalGallery.classList.remove("display--none")
  modalAddpictures.classList.add("display--none")
}


// Fonction pour vérifier si le formulaire est rempli
function checkFormValidity() {

  console.log("***************************")

  const isFileValid = selectedFile && selectedFile.size <= 4 * 1024 * 1024 && selectedFile.type.startsWith("image/");
  const isTitleValid = title.trim() !== "";
  const isCategoryValid = selectedValue !== "0";

  console.log("selectedValue :" + selectedValue)
  console.log("isFileValid :" + isFileValid)
  console.log("isTitleValid :" + isTitleValid)
  console.log("isCategoryValid :" + isCategoryValid)

  // Mise à jour de la variable "isValid"
  isValid = isFileValid && isTitleValid && isCategoryValid;

  console.log("isValid :" + isValid)
  // Activation du bouton Valider uniquement si tous les champs sont valides
  validateBtn.disabled = !isValid;

  // Changement de classe du bouton en fonction de la validité
  validateBtn.classList.toggle("validate__btn--ok", isValid);
}

// fonction pour reinitialiser le formulaire
function resetForm() {
  const fileInput = document.getElementById("file");
  const titleInput = document.getElementById("title");
  const selectElement = document.getElementById("choice");
  fileInput.value = "";
  titleInput.value = "";
  inputFileImg.src = "";
  inputFileImg.classList.add("display--none");
  inputFileIcone.classList.remove("display--none");
  inputFileBtn.classList.remove("display--none");
  inputFileSpan.classList.remove("display--none");
  selectElement.selectedIndex = 0; // Sélectionnez l'option par défaut (0)
}


//fonction de gestion du clic sur la corbeille des images de la modale
function clickTrashBox() {
  const trashBtnAll = document.querySelectorAll(".pictures__modal .trashbox__modal");

  trashBtnAll.forEach((trashBtn, index) => {
    trashBtn.addEventListener("click", function () {
      // Affiche la boîte de dialogue de confirmation
      confirmBox.classList.remove("display--none");

      // Gére le clic sur le bouton "Oui" dans la boîte de dialogue
      confirmYes.addEventListener("click", function () {
        postDataWorks(index);
        // Cache la boîte de dialogue de confirmation
        confirmBox.classList.add("display--none");
      });

      // Gére le clic sur le bouton "Non" dans la boîte de dialogue
      confirmNo.addEventListener("click", function () {
        // Cache la boîte de dialogue de confirmation
        confirmBox.classList.add("display--none");
      });
      // Gére le clic sur le bouton "croix" dans la boîte de dialogue
      confirmBtn.addEventListener("click", function () {
        // Cache la boîte de dialogue de confirmation
        confirmBox.classList.add("display--none");
      });
    });
  });
}











//**************************************************************************************************** *//
// ************************************** EVENT LISTENERS ******************************************** //
//**************************************************************************************************** *//














// ********Event listerners d'initialisation *****//

// Verification de l'etat de l'user ID //
document.addEventListener("DOMContentLoaded", function () {

  //recuperation du token userId//
  const tokenUserId = window.sessionStorage.getItem("TokenUserId");

  // si userId est égal à 1 //
  if (tokenUserId === '1') {
    jsModal.classList.remove("display--none")
    editionBox.classList.remove("display--none")
    filterBar.classList.add("display--none")
    loginBtn.classList.add("display--none")
    logoutBtn.classList.remove("display--none")

    // si userId est égal à 0 //
  } else if (tokenUserId === '0') {
    editionBox.classList.add("display--none")
    jsModal.classList.add("display--none")
    loginBtn.classList.remove("display--none")
    logoutBtn.classList.add("display--none")

    // si userId n'est ni 1 ni 0, ou il n'est pas défini dans le sessionStorage //
  } else {
    editionBox.classList.add("display--none")
    jsModal.classList.add("display--none")
    loginBtn.classList.remove("display--none")
    logoutBtn.classList.add("display--none")
  }
});


//***************ecouteurs d'evenements pour la deconnection ***************** //
logoutBtn.addEventListener("click", function () {
  tokenUserId = window.sessionStorage.removeItem("TokenUserId");
  tokenValue = window.sessionStorage.removeItem("TokenUserId");
  window.location.href = '../index.html';
});


// ecouteurs d'evenements pour ouvrir la modale au clic sur modifier
document.querySelectorAll('.js__modal').forEach(a => {
  a.addEventListener('click', openModal)
})

// ecouteurs d'evenements pour donner des fonctions à echap et tab
window.addEventListener('keydown', function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    e.preventDefault();
    closeModal()
  }

  if (e.key === 'Tab' && modal !== null) {
    focusInModal(e)
  }
})


// ******** event listerents de GESTION DES OUVERTURES ET FERMETURES DES PAGES INTERNES DE LA MODALE **********//

document.querySelector('.addpicture__btn').addEventListener('click', openAddpictures);
document.querySelector('.return__btn').addEventListener('click', openGallery);


// *********** Event listeners de Verification et validation des choix du formulaires ***************//

//verification du fichier image//
fileInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  selectedFile = fileInput.files[0]; // Le premier fichier sélectionné

  if (!selectedFile) {
    inputFileImg.src = "";
    inputFileImg.classList.add("display--none");
    inputFileIcone.classList.remove("display--none");
    inputFileBtn.classList.remove("display--none");
    inputFileSpan.classList.remove("display--none");

    return;
  }

  if (file) {
    // Vérifie si la taille du fichier est supérieure à 4 Mo
    if (file.size > 4 * 1024 * 1024) {
      fileError.textContent = "Fichier trop volumineux (max 4 Mo).";
      // Réinitialise le champ de fichier pour empêcher l'envoi du fichier trop volumineux
      fileInput.value = "";
      inputFileImg.src = "";
      inputFileImg.classList.add("display--none");
      inputFileIcone.classList.remove("display--none");
      inputFileBtn.classList.remove("display--none");
      inputFileSpan.classList.remove("display--none");
      return;
    }
    // Vérifie si le fichier est une image 
    if (file.type.startsWith("image/")) {
      // Créez un objet URL pour l'image sélectionnée
      const imageUrl = URL.createObjectURL(file);

      // Met à jour l'image
      inputFileImg.src = imageUrl;
      inputFileImg.classList.remove("display--none");
      inputFileIcone.classList.add("display--none");
      inputFileBtn.classList.add("display--none");
      inputFileSpan.classList.add("display--none");
    } else {
      fileError.textContent = "Format png ou jpg uniquement.";
      fileInput.value = "";
      inputFileImg.src = "";
      inputFileImg.classList.add("display--none");
      inputFileIcone.classList.remove("display--none");
      inputFileBtn.classList.remove("display--none");
      inputFileSpan.classList.remove("display--none");
      return;
    }
  }
});

//verification du titre//
titleInput.addEventListener("change", function () {
  title = titleInput.value;
});

//verification du choix des categories //
selectElement.addEventListener("change", function () {
  fileError.textContent = "";
  selectedOption = selectElement.options[selectElement.selectedIndex];
  selectedValue = selectedOption.value;
});

//  écouteur d'événement au formulaire pour vérifier la validité lors de tout changement
formInput.addEventListener("change", checkFormValidity);


//écouteur d'evenement au clic du bouton valider//
validateBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  // Création d'un objet FormData pour envoyer les données, y compris le fichier
  const formData = new FormData();
  formData.append("title", title);
  formData.append("image", selectedFile); // Le nom "imageUrl" peut être approprié si l'API attend une image.
  formData.append("category", selectedValue);

  // Affichage des données FormData dans la console
  for (const pair of formData.entries()) {
    console.log(`Clé: ${pair[0]}, Valeur: ${pair[1]}`);
  }
  // Récupération de la valeur du token dans le local de la session
  const tokenValue = window.sessionStorage.getItem("TokenValue");

  // requête POST vers l'apiWorks en utilisant FormData
  try {
    const response = await fetch(apiWorks, {
      method: "POST",
      headers: { 'Authorization': `Bearer ${tokenValue}` },
      body: formData,
    });

    if (response.ok) {

      // La requête a réussi, vous pouvez gérer la réponse ici
      console.log("Travail ajouté avec succès !");
      await fetchWorks();
      closeModal()
      //galleryReset();

      // Réinitialisez le formulaire ou effectuez d'autres actions nécessaires.
    } else {
      console.error("Erreur lors de l'ajout du travail.");
    }
  } catch (error) {
    console.error("Erreur lors de la requête POST : ", error);
  }
});










//**************************************************************************************************** *//
// *********************************** INITIALISATION DU CODE ***************************************** //
//**************************************************************************************************** *//

main();