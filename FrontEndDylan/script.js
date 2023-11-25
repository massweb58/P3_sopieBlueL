const allWorks = new Set();
const allCats = new Set();
let images = "";

const galleryDivs = document.querySelectorAll('.gallery');
const buttonsContainer = document.querySelector('.buttons');
const penIcon = document.querySelector('.fa-pen-to-square');
const modifyLink = document.querySelector('.modify');
const editionBar = document.querySelector('.edition-bar');


// Fonction d'initialisation de page 

async function init() {
  isAdmin();
  const works = await getDatabaseInfo("works");
  for (const work of works) {
    allWorks.add(work);
  }
  const cats = await getDatabaseInfo("categories");
  for (const category of cats) {
    allCats.add(category.name);
  }
  displayWorks();
  createFilter();
  await categoriesField();

}
init();

// Si un utilisateur est connecté

function isAdmin() {
  const token = sessionStorage.getItem("token");

  if (token !== null) {
    penIcon.classList.remove('hidden');
    modifyLink.classList.remove('hidden');
    buttonsContainer.classList.add('hidden');

    const iconBanner = document.createElement("i");
    iconBanner.classList.add("fa-regular", "fa-pen-to-square", "iconBanner");

    const banner = document.createElement("a");
    banner.classList.add("admin-text");
    banner.href = "#";
    banner.textContent = "Mode édition";

    const publishButton = document.createElement("button");
    publishButton.classList.add("publish-button");
    publishButton.textContent = "publier les changements";


    editionBar.appendChild(banner);
    editionBar.appendChild(publishButton);
    banner.appendChild(iconBanner);

    const loginLink = document.querySelector(".liLinkLogout");
    loginLink.textContent = "Logout";
    loginLink.href = "./index.html";
    loginLink.addEventListener("click", logout);

    modifyLink.addEventListener("click", openModal);
    const modifyUnsetElements = document.querySelectorAll(".modifyUnset");
    for (const element of modifyUnsetElements) {
      element.classList.remove("hidden");
    }
  } else {
    penIcon.classList.add('hidden');
    modifyLink.classList.add('hidden');
    editionBar.classList.add('hidden');

    const penIconElements = document.querySelectorAll('.fa-pen-to-square');
    for (const element of penIconElements) {
      element.classList.add("hidden");
    }

    const modifyUnsetElements = document.querySelectorAll(".modifyUnset");
    for (const element of modifyUnsetElements) {
      element.classList.add("hidden");
    }
  }
}

// Fonction lorsque l'utilisateur se Logout

function logout() {
  sessionStorage.removeItem("token");
  window.location.href = "index.html";
}

// Fonction pour l'affichage de la galerie
async function displayWorks(filtre = null) {
  for (const galleryDiv of galleryDivs) {
    galleryDiv.innerHTML = '';

    const fragment = document.createDocumentFragment();

    let filteredWorks = allWorks;

    if (filtre) {
      filteredWorks = Array.from(allWorks).filter(
        (work) => work.category.name === filtre
      );
    }

    for (const work of filteredWorks) {
      const figure = document.createElement('figure');
      figure.classList.add('Figure' + work.id);
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      // Charge l'image et l'Alt de l'API
      img.src = work.imageUrl;
      img.alt = work.title;

      // Vérifie la classe de la galerie
      if (galleryDiv.classList.contains('modalGallery')) {
        // Titre si Gallery modal
        const editSpan = document.createElement('span');
        editSpan.textContent = 'éditer';
        figcaption.appendChild(editSpan);

        // Ajouter l'icône de suppression
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash-can');
        figure.appendChild(deleteIcon);

        // Ajouter l'icône de déplacement
        const moveIcon = document.createElement('i');
        moveIcon.classList.add('fa-solid', 'fa-arrows-up-down-left-right');
        figure.appendChild(moveIcon);

        deleteIcon.addEventListener('click', (e) => deleteWork(e, work.id));
      } else {
        // Titre si gallerie de l'index
        figcaption.textContent = work.title;
      }

      figure.appendChild(img);
      figure.appendChild(figcaption);
      fragment.appendChild(figure);
    }

    galleryDiv.appendChild(fragment);
  }
}


// Fonction pour supprimer un travail
async function deleteWork(e, id) {
  const token = sessionStorage.getItem("token");
  const target = e.target
  const figure = target.closest("figure")
  figure.remove()

  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    console.log("Élément supprimé avec succès.");
    // Met à jour l'affichage des éléments
    const figureElements = document.querySelectorAll(`.Figure${id}`);
    for (const figureElement of figureElements) {
      figureElement.remove();
    }
    for (const work of allWorks) {
      if (work.id == id) {
        allWorks.delete(work)
        break;
      }
    }
  }
}

// Création des filtre à partir des ID
function createFilter() {
  const categories = Array.from(allCats);
  categories.unshift('Tous');

  categories.forEach(category => {
    const button = createButton(category, category === 'Tous');
    buttonsContainer.appendChild(button);
  });
}

// Création des boutons à partir des ID
function createButton(text, isSelected) {
  const button = document.createElement('div');
  button.classList.add('buttonStyle');
  button.textContent = text;
  if (isSelected) {
    button.classList.add('buttonSelected');
  }
  button.addEventListener('click', () => {
    const selectedButton = document.querySelector('.buttonSelected');
    selectedButton.classList.remove('buttonSelected');
    button.classList.add('buttonSelected');
    filterItems(button.textContent);
  });
  return button;
}

function filterItems(category) {
  if (category === 'Tous') {
    displayWorks();
  } else {
    displayWorks(category);
  }
}

async function getDatabaseInfo(type) {
  const response = await fetch('http://localhost:5678/api/' + type);
  if (response.ok) {
    return response.json();
  } else {
    console.log(response);
  }
}

// Fonction pour ouvrir la modale
function openModal() {
  createOverlay();
  const modal = document.getElementById('modal');
  modal.style.display = 'block';

  const closeButtons = document.querySelectorAll('.close');
  for (const button of closeButtons) {
    button.addEventListener('click', closeModal);
  }

  const closeOverlay = document.querySelector('.overlay');
  closeOverlay.addEventListener('click', closeModal);
}


const addPhotoButton = document.getElementById('addPhotoButton');
addPhotoButton.addEventListener('click', replaceModal);

const modalModif = document.querySelector('.modalModif');
const modalAdd = document.querySelector('.modalAdd');

// Fonction pour fermer la modale
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
  modalAdd.style.display = 'none';


  const overlay = document.querySelector('.overlay');
  overlay.remove();
  resetDivAdd();

  const wrongFile = document.querySelector('.wrongFile');
  wrongFile.textContent = "";
}

// Fonction pour créer l'overlay

function createOverlay() {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);
}

function replaceModal() {


  modalModif.style.display = 'none';
  modalAdd.style.display = 'block';
}

const arrowModal = document.querySelector('.arrowModal');

arrowModal.addEventListener('click', () => {
  modalAdd.style.display = 'none';
  modalModif.style.display = 'block';
});

// Pour bouton d'ajout d'image 

const customUploadBtn = document.getElementById('customUploadBtn');
const fileAdd = document.getElementById('fileAdd');
customUploadBtn.addEventListener('click', function () {
  fileAdd.click();
});

// Pour remplissage catégories 

async function categoriesField() {
  const categories = await getDatabaseInfo("categories");

  const catAddSelect = document.getElementById("catAdd");

  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    catAddSelect.appendChild(option);
  }
}

// Pour changement bouton modale ajout 

const form = document.getElementById('formAdd');
const inputFields = form.querySelectorAll('input, select, textarea');
const validateButton = document.getElementById('validateButton');

// Écoute les événements de saisie dans les champs du formulaire
inputFields.forEach(inputField => {
  inputField.addEventListener('input', checkFormValidity);
});
// Réinitialise l'état du bouton après un clic
validateButton.addEventListener('click', function () {
  validateButton.disabled = true;
  validateButton.style.backgroundColor = '#B9C5CC';
});

// Vérifie si tous les champs du formulaire sont remplis
function checkFormValidity() {
  const validForm = Array.from(inputFields).every(inputField => inputField.value.trim() !== '');

  if (validForm) {
    validateButton.style.backgroundColor = '#1D6154';
    validateButton.disabled = false;
  } else {
    validateButton.style.backgroundColor = '#B9C5CC';
  }
}

// Pour preview image 

const divAdd = document.querySelector('.divAdd');
const divAddContent = divAdd.innerHTML;

const fileInput = document.getElementById('fileAdd');
fileInput.addEventListener('change', filePreview);

function filePreview(event) {
  const file = event.target.files[0]; // Obtient le fichier sélectionné

  // Vérifie la taille du fichier
  if (file && (!/\.(jpg|jpeg|png)$/i.test(file.name) || file.size > 4 * 1024 * 1024)) {
    const wrongFile = document.querySelector('.wrongFile');
    wrongFile.textContent = "Le format du fichier n'est pas respecté ou la taille du fichier est trop grande (limite : 4 Mo)";
    return;
  }

  if (file) {
    image = file;
    // Crée un objet URL pour la prévisualisation de l'image
    const imageURL = URL.createObjectURL(file);

    // Crée un élément d'image pour la prévisualisation
    const imagePreview = document.createElement('img');
    imagePreview.src = imageURL;
    imagePreview.style.width = '50%';

    // Remplace le contenu de la div avec la classe "divAdd" par la prévisualisation de l'image
    const divAdd = document.querySelector('.divAdd');
    divAdd.innerHTML = '';
    divAdd.appendChild(imagePreview);

    const removeButton = document.createElement('span');
    removeButton.classList.add('removeButton');
    removeButton.innerHTML = '&#10006;';
    divAdd.appendChild(removeButton);

      // Gestionnaire d'événements au clic sur le bouton de suppression
      removeButton.addEventListener('click', () => {
       resetDivAdd();
      });
  }
}


// Fonction pour réinitialiser le preview de l'image après avoir posté
function resetDivAdd() {
  const divAdd = document.querySelector('.divAdd');
  divAdd.innerHTML = divAddContent;

  const customUploadBtn = document.getElementById('customUploadBtn');
  const fileAdd = document.getElementById('fileAdd');
  fileAdd.value = ''; 

  // Rappel l'EventListener du bouton custom à la réouverture de la modale
  customUploadBtn.addEventListener('click', function () {
    fileAdd.click();
  });
  // Rappel l'EventListener du preview à la réouverture de la modale
  fileAdd.addEventListener('change', filePreview);
}



// Fonction pour envoyer les données du formulaire à l'API

const titleInput = document.getElementById('titleAdd');
const catInput = document.getElementById('catAdd');

validateButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const token = sessionStorage.getItem("token");
  const formData = new FormData(form);
  /*

  a faire dans le change avant le preview (afficher preview si image correct, sinon ne rien fair et afficher erreur)
  const file = fileInput.files[0];

  // Vérifie le type de fichier

*/
  formData.append("image", image)
  formData.append('title', titleInput.value);
  formData.append('category', catInput.value);

  const optionsAPI = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData
  };

  fetch('http://localhost:5678/api/works', optionsAPI)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Erreur de réponse du serveur');
    })
    .then(data => {
      console.log(data);
      allWorks.add(data);
      image = "";
      document.getElementById("formAdd").reset();
      closeModal();
      displayWorks();
    })
    .catch(error => {
      console.error(error);
    });
});
