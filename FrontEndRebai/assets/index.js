
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


const buttonSubmitAddWork = document.querySelector(".btn-submit");

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
    const token = window.sessionStorage.getItem("token");
    if (token !== null) {

        //on récupère tous les éléments admin
        const elementsAdmin = document.querySelectorAll(".hiddenAdmin");

     
        elementsAdmin.forEach((elementAdmin) => elementAdmin.classList.remove("hiddenAdmin"));

        filters.classList.add("hiddenAdmin");

        const lienLogin = document.querySelector(".login");
        lienLogin.innerText = "Logout";


        lienLogin.addEventListener("click", function (e) {
            e.preventDefault();
            sessionStorage.removeItem('token');
            location.reload();
        });


        gestionModale();

        gestionDisabledButtonSubmit();

        gestionAddWorksModale();

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
        trashicon.addEventListener("click", function (e) {

            //Get catégorie id

            let projectId = trashicon.getAttribute("data-id");
            deleteElement(projectId);



            //getWorks();
        });
    });
}



function toggleModal() {
    modalContainer1.classList.toggle("active")
    //modalContainer1.style.display = "block";
}



function gestionModale() {

    modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))


    // Événement de clic sur le bouton de fermeture
    modalTriggers2.forEach(close => close.addEventListener("click", closeModal));

    // Ajouter un gestionnaire d'événements au bouton "Retourner"
    boutonRetourner.addEventListener('click', function () {
        // Cacher le second modal
        modalContainer2.classList.toggle("active")

        // Afficher le premier modal
        //modalContainer1.classList.toggle("active")
    });


    btnajoutphoto.addEventListener("click", function () {
        modalContainer1.classList.toggle("active");
        modalContainer2.classList.toggle("active");
    });

}


// Fonction pour fermer la modal

function closeModal() {
    modalContainer1.classList.toggle("active")
    modalContainer2.classList.toggle("active")

}



//fonction boutton disabled
function disabled() {
    buttonSubmitAddWork.disabled = true;
    buttonSubmitAddWork.style.backgroundColor = "#a7a7a7";
}
//fonction boutton  pas disabled
function notDisabled() {
    buttonSubmitAddWork.disabled = false;
    buttonSubmitAddWork.style.backgroundColor = "#1d6154";
}


//fonction comportement boutton
function buttonDisabled() {

    const titleModal = document.getElementById("title");
    const select = document.getElementById("category");
    const inputFile = document.getElementById("image");
    const file = inputFile.files[0];
    const titleNotEmpty = titleModal.value !== "";
    const optionNotNull = select.value !== "";



    //si aucun champ n'est vide  boutton activé sinon boutton désactivé
    if (file && titleNotEmpty && optionNotNull) {
        notDisabled();
        console.log("plus disabled");
        console.log(file);
        console.log(titleModal.value);
        console.log(select.value);
    } else {
        disabled();
        console.log("problème disabled");
        console.log(file);
        console.log(titleModal.value);
        console.log(select.value);
    }
}


function gestionDisabledButtonSubmit() {

    //lorsque l'utilisateur modifie un champ alors fonction buttonDisabled appelée
    const titleModal = document.getElementById("title");
    const select = document.getElementById("category");
    const inputFile = document.getElementById("image");
    titleModal.addEventListener("input", buttonDisabled);
    select.addEventListener("input", buttonDisabled);
    inputFile.addEventListener("input", buttonDisabled);

    disabled();



}


//function pour supprimer les elements de l'API//

function deleteElement(projectId) {


    let token = sessionStorage.getItem("token");

    fetch(`http://localhost:5678/api/works/${projectId}`, {

        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'

        },
    })

        .then((response) => {
            if (response.ok) {
                console.log("L'élément a été supprimé avec succès")
                getWorks();
            } else {
                console.log(" Gérez l'erreur en cas de problème lors de la suppression");
            }
        })
        .then(data => {

            console.log(data)
            //sessionStorage.setItem("token", data.token);
        })
        .catch((error) => {
            console.log(error);
        });
}





// Récupérer les éléments du DOM
const form = document.getElementById('photoForm');
const imageInput = document.getElementById('image');
const preview = document.getElementById('preview');

const prevImg = document.getElementById("prev-img")
const image = document.getElementById("image")
const remuveIcone = document.getElementById("preview")
const closephoto = document.querySelector(".close-photo");

const imageVide = document.querySelector(".ajout_fichier img");
const photoUploadButton = document.querySelector(".photo-upload-button");
const typeFiles = document.querySelector(".type-files");



const apiEndpoint = 'http://localhost:5678/api/works/';
const monToken = sessionStorage.getItem("token");


const formulaire = document.getElementById('photoForm');
const closeBtn = document.querySelector(".close-photo");
const fermerphoto = document.getElementById("prev-img")


function gestionAddWorksModale() {

    // Écouter l'événement de soumission du formulaire
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Vérifier s'il y a une image sélectionnée
        if (imageInput.files.length === 0) {
            alert('Veuillez sélectionner une image.');
            return;
        }

        const formData = new FormData();
        formData.append("image", document.getElementById("image").files[0]);
        formData.append("title", document.getElementById("title").value);
        formData.append("category", document.getElementById("category").value);




        try {
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${monToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Une erreur est survenue lors de l\'envoi de l\'image.');
            }

            getWorks(); //on actualise les galeries avec les works fraichement récupérer de l'api
            form.reset();//réinitilaisation formulaire ajout works
            resetPrevImage();
            closeModal();

            // Faire quelque chose avec la réponse de l'API si nécessaire
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error.message);
        }
    });




    image.onchange = Event => {
        const [file] = image.files
        if (file) {
    
            prevImg.style.display = "block";
            closephoto.style.display = "block";
            remuveIcone.style.display = "none";
            imageVide.style.display = "none";
            photoUploadButton.style.display = "none";
            typeFiles.style.display = "none";
    
            prevImg.src = URL.createObjectURL(file)
        }
    }

    closeBtn.addEventListener("click", function (e) {

        e.preventDefault();
        e.stopPropagation();
    
        resetPrevImage();
    });
    

}





function resetPrevImage() {
    fermerphoto.style.display = "none";
    image.value = null;
    closeBtn.style.display = "none";
    imageVide.style.display = "block";
    photoUploadButton.style.display = "inherit";
    typeFiles.style.display = "block";
}