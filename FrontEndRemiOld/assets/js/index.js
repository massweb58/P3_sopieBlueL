const url = "http://localhost:5678/api/";
const urlworks = "http://localhost:5678/api/works";
console.log(urlworks)
const urlcategory = "http://localhost:5678/api/categories";
const filtres = document.getElementById("filtres");
//console.log("works")

const header = document.querySelector("header")
const gallery = document.getElementById("gallery");
const sectionPortfolio = document.getElementById("portfolio");
const modif = document.querySelector(".modif");
const modif2 = document.querySelector(".modif2");
const H2 = document.querySelector(".titre");

//CONSTANTES PARTIE ADMIN

const login = document.querySelector(".login");
const logout = document.querySelector(".logout")
const aLink = document.querySelector("#portfolio a");
const modal1 = document.querySelector("#modal_1");
const closeModal1 = document.querySelector("#modal_close");
const modal2 = document.querySelector("#modal_2");
const closeModal2 = document.querySelector("#modal_close2");
const openModal2 = document.querySelector(".submit_button");
const modalGallery = document.querySelector(".modalGallery");
const errors = document.querySelector(".error-message");
const suppression = document.querySelector(".suppression-réussite");
const arrow = document.querySelector(".arrow");

const formAddWork = document.querySelector("#formAddWork");


const submitWork = document.querySelector(".submit_button2");
async function main() {
    await getWorks();
    await getCategories()
    gestionModale();


}

main()



async function getWorks(categoryId) {
    await fetch(urlworks)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Erreur dans la récupération des données de l'API");
            }

        })
        .then(function (data) {
            console.log(data)

            //on vide les galleries
            gallery.innerHTML = "";
            modalGallery.innerHTML = "";

            data.forEach((project) => {

                if (categoryId == project.category.id || categoryId == null) {
                    createProject(project);
                    createProjectModal(project);
                }



            });
        })
        .catch((error) => {
            console.log(error);

        });

}

// Fonction pour créer un projet dans la galerie
function createProject(project) {
    console.log(project)
    const figureProject = document.createElement("figure");
    figureProject.classList.add("figureM");
    figureProject.setAttribute("data-tag", project.category.name);
    figureProject.setAttribute("data", project.categoryId);
    figureProject.setAttribute("data-id", project.id);

    const imageProject = document.createElement("img");
    imageProject.src = project.imageUrl;
    imageProject.alt = project.title;

    const figcaptionProject = document.createElement("figcaption");
    figcaptionProject.innerText = project.title;

    //idByCategory(project.category.name);

    figureProject.appendChild(imageProject);
    figureProject.appendChild(figcaptionProject);
    gallery.appendChild(figureProject);

};




async function getCategories() {
    await fetch(urlcategory)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Erreur dans la récupération des données de l'API");
            }

        })
        .then(function (categories) {
            console.log(categories)
            categories.forEach((categorie) => {
                buttonFilter(categorie)

            });
        })
        .then(() => {
            //on récupère les boutons
            const buttons = document.querySelectorAll("#filtres .filter");

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
function buttonFilter(categorie) {
    console.log(categorie)

    const flitreBtn = document.createElement("button");

    flitreBtn.classList.add("filter");
    flitreBtn.setAttribute("data-tag", categorie.name);
    flitreBtn.setAttribute("data-id", categorie.id);
    flitreBtn.innerText = categorie.name;
    filtres.appendChild(flitreBtn);

}




var token = sessionStorage.getItem("token");
if (token) {
    filtres.style.display = "none";
    gallery.style.paddingTop = " 75px";
    modif.style.display = "inline-block";
    modif2.style.display = "block";
    H2.style.paddingLeft = " 14px ";
    login.style.display = "none"
    logout.style.display = "block"
    menuNoir();
    console.log(token);

}
else; {

};

logout.addEventListener("click", () => {
    sessionStorage.removeItem("token")
    window.location.href = "index.html"
    confirm("voulez-vous vous deconnecter ?")

})

function menuNoir() {

    const menu = document.createElement("div")
    menu.classList.add("blocNoir");

    const edition = document.createElement("div");
    edition.innerText = "Mode édition";
    const iconEdition = document.createElement("i");
    iconEdition.classList.add("fa-solid", "fa-pen-to-square");

    edition.classList.add("edit");

    const publier = document.createElement("div");
    publier.innerText = "publier les changements";
    publier.classList.add("publier")

    header.appendChild(menu);
    menu.appendChild(edition);
    menu.appendChild(publier);
    edition.appendChild(iconEdition);
}
/*******PARTIE ADMIN ******************************************/

console.log(modalGallery);

// Fonction pour ouvrir une modale
function openModal(modal) {
    modal.style.display = "flex";
}

// Fonction pour fermer une modale
function closeModal(modal) {
    modal.style.display = "none";
}

function gestionModale() {
    // Ouverture de la première modale
    aLink.addEventListener('click', function () {
        openModal(modal1);
    });

    // Fermeture de la première modale
    closeModal1.addEventListener('click', function () {
        closeModal(modal1);
    });

    openModal2.addEventListener('click', function () {
        closeModal(modal1);
        openModal(modal2)
    });
    arrow.addEventListener('click', function () {
        openModal(modal1);
        closeModal(modal2);
    });
    closeModal2.addEventListener('click', function () {
        closeModal(modal2);
    });



    // Fermeture de la première modale en cliquant en dehors de la fenêtre
    window.addEventListener("click", (event) => {
        if (event.target === modal1) {
            closeModal(modal1);
        }
        if (event.target === modal2) {
            closeModal(modal2);
        }
    });
}
function createProjectModal(project) {
    console.log(modalGallery);

    const figureModal = document.createElement("figure");
    figureModal.setAttribute("data-id", project.id)
    figureModal.classList.add("modal_figure");

    const imageModal = document.createElement("img");
    imageModal.classList.add("modal_works");
    imageModal.src = project.imageUrl;
    imageModal.alt = project.title;
    const figcaptionModal = document.createElement("figcaption");
    figcaptionModal.innerText = "éditer";

    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.dataset.projectId = project.id;
    const iconDeleteModal = document.createElement("i");
    iconDeleteModal.classList.add("fa-solid", "fa-trash-can");

    const moveBtn = document.createElement("div");
    moveBtn.classList.add("move-btn");
    const iconMoveModal = document.createElement("i");
    iconMoveModal.classList.add("fa-solid", "fa-arrows-up-down-left-right");

    figureModal.appendChild(imageModal);
    figureModal.appendChild(figcaptionModal);

    figureModal.appendChild(deleteBtn);
    deleteBtn.appendChild(iconDeleteModal);

    figureModal.appendChild(moveBtn);
    moveBtn.appendChild(iconMoveModal);
    modalGallery.appendChild(figureModal);

    deleteBtn.addEventListener("click", function (event) {
        console.log(project.id)

        btnDelete(project.id)
        event.preventDefault();

    })
}

function btnDelete(project) {

    fetch("http://localhost:5678/api/works/" + project, {
        method: 'DELETE',
        headers: {
            authorization: `Bearer ${sessionStorage.getItem("token")}`,
            Accept: "application/json",
            "content-type": "application/json",
        }
    }
    )
        .then((res) => {
            if (res.ok) {
                //figureModal();
                getWorks();
                //confirm("Voulez-vous vraiment supprimer la galerie?");
                console.log("Projet n°" + project + " supprimée !");
            }
        })
        .catch((error) => {
            console.log("Une erreur c'est produite" + error);
        });

    console.log(project.id);
}

// vue photo au telechargement

const Preview = document.getElementById("Preview");
const fileUpload = document.getElementById("file");
const photoButton = document.getElementById("btnPhoto")
const restriction = document.getElementById("image_restriction")
const logoPhoto = document.getElementById("logoPhoto")

fileUpload.addEventListener("change", getImage,);

function getImage(event) {


    if (event.target.files.length > 0) {
        let src = URL.createObjectURL(event.target.files[0]);

        Preview.src = src;

    }
    photoButton.style.display = "none"
    restriction.style.display = "none"
    logoPhoto.style.display = "none"
}


/* creation works  */
const titleInput = document.getElementById("input-title");
const category = document.getElementById("category");



function NewWork() {

    

    formAddWork.addEventListener("submit", (e) => {
        e.preventDefault();
        if (fileUpload.value === '' || titleInput.value === '' || category.value === '') {
            alert("veuillez renseigner tous les champs indiqués")
            return;
        }
        try {
            const formData = new FormData();
            formData.append("title", titleInput.value);
            formData.append("category", category.value);
            formData.append("image", fileUpload.files[0]);

            const response =   fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,                    
                },
                body: formData,
            }

            )
            if (response.status === 201) { 
                getWorks();
            }
        }


        catch (error) {
            console.error(error);
            alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
        }


    })




}
NewWork();