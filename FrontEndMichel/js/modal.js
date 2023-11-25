// @ts-nocheck
// Variables Globales
//const modalContent = document.getElementById("modalContent");
/* Chercher le tableau de works avec une requête à l'API */
async function fetchWorksModal() {
  const requete = await fetch("http://localhost:5678/api/works");
  return requete.json();
}

function mainModal() {
  if (isLoggedIn) { 
  displayModalGallery();
  displayWorksModal();
  closeModalGallery();

  }
}
mainModal();
// Affichage Modal Gallery
function displayModalGallery() {
  const modeEdition = document.querySelector(".div-edit span");
  // Votre code ici
  modalContent.innerHTML = `
  <section class="modalPortfolio">
  <span><i class="fa-solid fa-xmark"></i></span>
  <h2>Galerie Photo</h2>
  <div class="modalGallery">
  </div>
  <div class="container-button ">
  <button class="buttons">Ajouter une photo</button>
  </div>
  </section>
  `;
  
    // Modifications si L'utilisateur est connecté
    modeEdition.addEventListener("click", () => {
      console.log("mode édition click");
      modalContent.style.display = "flex";
    });
  
}
/* affichage des works dans le Portfolio */
function displayWorksModal() {
  fetchWorks().then((data) => {
    //cree pour chaque élément du tableau
    // console.log(data);
    data.forEach((work) => {
      createWorkModal(work);
    });
  });
}
function createWorkModal(work) {
  const modalGallery = document.querySelector(".modalGallery");
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const trash = document.createElement("span");
  trash.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  trash.id = work.id;
  img.src = work.imageUrl;
  figure.appendChild(img);
  figure.appendChild(trash);
  modalGallery.appendChild(figure);
  deleteWork(trash, modalGallery);
}

//Fermuture de la modal sur la croix
function closeModalGallery() {
  const xmarkModal = document.querySelector(".modalPortfolio span .fa-xmark");
  xmarkModal.addEventListener("click", () => {
    modalContent.style.display = "none";
  });

  //Fermeture de la modal sur le container grisé
  body.addEventListener("click", (e) => {
    if (e.target == modalContent) {
      modalContent.style.display = "none";
      console.log(e.target);
    }
  });
}

//***********************************Supression de la photo de la Modal*******************************

const token = window.localStorage.loged;
console.log(token);

const deleteWorkID = {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  mode: "cors",
  credentials: "same-origin",
};

 function deleteWork(trash, modalGallery) {
  trash.addEventListener("click", (e) => {
    const workID = trash.id;
    console.log(trash);
    fetch(`http://localhost:5678/api/works/${workID}`, deleteWorkID)
    .then((response) => {
      modalGallery.innerHTML = "";
      gallery.innerHTML = "";
      displayWorksModal();
      displayWorksDom();
    })
    
  });
}

