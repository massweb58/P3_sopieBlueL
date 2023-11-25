
// Get nav Filters
const filters = document.querySelector("#filters");
const optionsSelect = document.querySelector("#category");


const gallery = document.querySelector(".gallery");
const galleryModale = document.querySelector(".galleryModale");

const modalContainer1 = document.querySelector(".contenu_modal");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const modalContainer2 = document.querySelector(".contenu-modal2");
const btnajoutphoto = document.querySelector(".ajoutphoto");
const modalTriggers2 = document.querySelectorAll(".modal-trigger2");
const boutonRetourner = document.querySelector(".retourner");
const boutonsupprimer = document.querySelector(".supprimerphoto");


async function main() {

    await getWorks();
    await getCategories();
    await admin();
}

main();




async function getWorks(categoryId) {
    fetch("http://localhost:5678/api/works")

        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Erreur dans la récupération des données de l'API");
            }
        })
        .then((projects) => {

            console.log(projects)

            //on vide la gallerie
            gallery.innerHTML = "";
            galleryModale.innerHTML = "";

            projects.forEach((project) => {
                if (categoryId == project.category.id || categoryId == null) {
                    createProject(project);
                }
                createProjectModal(project);

            });

            gestionDeleteWorksModale()





        })
        .catch((error) => {
            console.log(error);
        });
}

async function admin() {
    // On récupère le token
    const token = window.localStorage.getItem("token");
    if (token !== null) {

        //on récupère tous les éléments admin
        const elementsAdmin = document.querySelectorAll(".hiddenAdmin");

        //on enlève, pour chaque bouton la classe is-active
        elementsAdmin.forEach((elementAdmin) => elementAdmin.classList.remove("hiddenAdmin"));

        filters.classList.add("hiddenAdmin");

        const lienLogin = document.querySelector(".login");
        lienLogin.innerText = "Logout";


        lienLogin.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem('token');
            location.reload();
        });

    }

}




// la partie filtrer 
async function getCategories() {
    fetch("http://localhost:5678/api/categories")

        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Erreur");
            }
        })

        .then((categories) => {

            console.log(categories)
            //Auxquelles on applique la fonction createButton
            categories.forEach((categorie) => {

                createButton(categorie);
                creatOptionSelectAjoutWorks(categorie)

            });
        })
        .then(() => {
            //on récupère les boutons
            const buttons = document.querySelectorAll(".filtres button");


            buttons.forEach((button) => {
                //Pour chaque bouton, au clic
                button.addEventListener("click", function () {
                    // Get (et Affiche le data-tag)
                    let buttonTag = button.getAttribute("data-tag");
                    console.log(buttonTag);

                    //Get catégorie id
                    let categorieId = button.getAttribute("data-id");
                    console.log(categorieId);

                    //on enlève, pour chaque bouton la classe is-active
                    buttons.forEach((button) => button.classList.remove("is-active"));
                    //puis on ajoute la classe active au bouton cliqué
                    this.classList.add("is-active");
                    // On récupère les works de l'API en fonction des categories
                    getWorks(categorieId);
                });
            });
        })


        .catch((error) => {
            console.log(error);
        });
}

// Fonction pour créer un bouton dans la nav des filtres
function createButton(categorie) {
    const buttonFilter = document.createElement("button");
    buttonFilter.setAttribute("data-tag", categorie.name);
    buttonFilter.setAttribute("data-id", categorie.id);
    buttonFilter.classList.add("btn_filter");
    buttonFilter.innerText = categorie.name;
    filters.appendChild(buttonFilter);
};


// Fonction pour créer un bouton dans la nav des filtres
function creatOptionSelectAjoutWorks(categorie) {
    const optionSelect = document.createElement("option");
    optionSelect.setAttribute("value", categorie.id);

    optionSelect.innerText = categorie.name;
    optionsSelect.appendChild(optionSelect);
};



// Fonction pour créer un projet dans la galerie
function createProject(project) {
    const figureProject = document.createElement("figure");
    figureProject.setAttribute("data-tag", project.category.name);
    figureProject.setAttribute("data-id", project.id);

    const imageProject = document.createElement("img");
    imageProject.src = project.imageUrl;
    imageProject.alt = project.title;

    const figcaptionProject = document.createElement("figcaption");
    figcaptionProject.innerText = project.title;



    figureProject.appendChild(imageProject);
    figureProject.appendChild(figcaptionProject);
    gallery.appendChild(figureProject);
};

// fonction pour créer les elements de premier Modal //
function createProjectModal(project) {
    const figureModalProject = document.createElement("figure");
    figureModalProject.setAttribute("data-id", project.id);

    const imageModalProject = document.createElement("img");
    imageModalProject.src = project.imageUrl;
    imageModalProject.alt = project.title;
    imageModalProject.classList.add("modal-project-img");

    const trashIcon = document.createElement("img");
    trashIcon.src = "assets/icons/trash-icon.svg";
    trashIcon.classList.add("trash-icon");
    trashIcon.setAttribute("data-id", project.id);
    let trashIconID = trashIcon.getAttribute("data-id");


    const figcaptionModalProject = document.createElement("figcaption");
    figcaptionModalProject.innerText = "éditer";

    figureModalProject.appendChild(imageModalProject);
    figureModalProject.appendChild(trashIcon);
    //figureModalProject.appendChild(moveIcon);
    figureModalProject.appendChild(figcaptionModalProject);
    galleryModale.appendChild(figureModalProject);
}
/*partie modal */


function gestionDeleteWorksModale() {

    //on récupère les boutons
    const trashIcons = document.querySelectorAll(".trash-icon");


    trashIcons.forEach((trashicon) => {
        //Pour chaque bouton, au clic
        trashicon.addEventListener("click", function () {
            // Get (et Affiche le data-tag)


            //Get catégorie id
            let projectId = trashicon.getAttribute("data-id");

            deleteElement(projectId)

            getWorks();
        });
    });
}

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))

function toggleModal() {
    modalContainer1.classList.toggle("active")
}
;

btnajoutphoto.addEventListener("click", function () {
    modalContainer1.style.display = "none";
    modalContainer2.style.display = "block";
});

// Fonction pour fermer la modal

function closeModal() {
    modalContainer2.style.display = "none";
}

// Événement de clic sur le bouton de fermeture
modalTriggers2.forEach(close => close.addEventListener("click", closeModal));

// Ajouter un gestionnaire d'événements au bouton "Retourner"
boutonRetourner.addEventListener('click', function () {
    // Cacher le second modal
    modalContainer2.style.display = 'none';

    // Afficher le premier modal
    modalContainer1.style.display = 'block';
});

// Evénement de clic sur le bouton supprimer 
//boutonsupprimer.addEventListener('click', deleteElement());




//function pour supprimer les elements de l'API//

function deleteElement(projectId) {




    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE'
    })

        .then((response) => {
            if (response.ok) {
                console.log("L'élément a été supprimé avec succès")
            } else {
                console.log(" Gérez l'erreur en cas de problème lors de la suppression");
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

/*ajout photo 
 // Fonction exécutée lorsque le formulaire est soumis
 function handleFormSubmit(event) {
    event.preventDefault(); // Empêche l'envoi du formulaire par défaut

    // Récupérer l'élément input qui contient la photo
    const photoInput = document.getElementById('image');
    
    // Vérifier si une photo a été sélectionnée
    if (photoInput.files.length > 0) {
        const file = photoInput.files[0]; // Récupérer le fichier photo
        
        // Vous pouvez ici envoyer le fichier photo au serveur ou effectuer d'autres traitements
        // Par exemple, utiliser AJAX pour envoyer le fichier au serveur
        
        console.log('Photo sélectionnée:', file.name);
    } else {
        console.log('Aucune photo sélectionnée.');
    }
}

// Ajouter un gestionnaire d'événement sur le formulaire pour détecter quand il est soumis
const uploadForm = document.getElementById('photoForm');
uploadForm.addEventListener('submit', handleFormSubmit);*/

document.getElementById("photoForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le rechargement de la page par défaut
    uploadPhoto();
});

function uploadPhoto() {
    const photoInput = document.getElementById("image");
    const file = photoInput.files[0];

    if (!file) {
        alert("Veuillez sélectionner une photo.");
        return;
    }

    // Créer un objet FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append("photo", file);


    const uploadUrl = "http://localhost:5678/api/works";

    // Envoi de la photo via la requête Fetch
    fetch(uploadUrl, {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Traitez la réponse du serveur ici si nécessaire
            console.log("Réponse du serveur :", data);
            alert("La photo a été envoyée avec succès !");
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi de la photo :", error);
            alert("Une erreur s'est produite lors de l'envoi de la photo.");
        });
}

/*afficher les categories */

// Fonction pour afficher les catégories dans le document
function displayCategories(categories) {
    const categoriesContainer = document.getElementById("category");
}