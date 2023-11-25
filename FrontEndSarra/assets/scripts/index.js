
const api_url_works = 'http://localhost:5678/api/works';
const api_url_categories = 'http://localhost:5678/api/categories';
let works = [];
let categories = [];
const sectionWorks = document.querySelector(".gallery");
const sectionFiltreBtns = document.querySelector(".btns");
const boutonTous = document.querySelector(".btnTous");
const modalGallery = document.querySelector(".gallery-modal");
const adminToken = sessionStorage.getItem("token");
let files = [];
let options = [];
const titleInput = document.getElementById('title');
const photoInput = document.getElementById('photo');
const categorieSelect = document.getElementById('categorie');
const submitButton = document.getElementById('submitButton');
const fileUploadForm = document.getElementById("fileUploadForm")
async function main() {
    // Appeler la fonction pour récupérer et afficher les données
    await displayWorks();
    // Ajout de l'appel pour afficher les catégories
    await displayCategories();
    //Partie Admin connecté
    admin();
}

main();

async function displayWorks(categoryId) {
    try {
        // Effectuer la requête pour récupérer les Works 
        const response = await fetch(api_url_works);
        if (!response.ok) {
            throw new Error('La requête a échoué');
        }
        // Extraire les données au format JSON
        works = await response.json();

        //Supprimez la galerie actuelle
        sectionWorks.innerHTML = '';
        //Supprimez la galerie actuelle
        modalGallery.innerHTML = '';
        // Parcourir les données et afficher chaque projet
        works.forEach((work) => {
            //console.log(work.category.id + "//" +categoryId)            
            if (work.category.id == categoryId || categoryId == null) {
                createWork(work);
            }
            createWorkModale(work);

        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données : ", error);
    }
}
// Créer un work dans la galerie
function createWork(work) {
    const figure = document.createElement("figure");
    figure.setAttribute('data-id', work.id);
    sectionWorks.appendChild(figure);
    const img = document.createElement("img");
    img.src = work.imageUrl;
    figure.appendChild(img);
    img.alt = work.title;
    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = work.title;
    figure.appendChild(figcaption);
}
// Créer un bouton pour chaque catégorie
function createCategory(category) {
    const bouton = document.createElement("button");
    bouton.innerText = category.name;
    bouton.classList.add("btn");
    bouton.classList.add("btn" + category.id);
    sectionFiltreBtns.appendChild(bouton);
    bouton.addEventListener("click", () => {
        const categoryId = category.id; // Récupérer l'ID de la catégorie
        const categoryButtons = document.querySelectorAll(".btn");
        // Supprimer la classe active de tous les boutons
        categoryButtons.forEach((button) => button.classList.remove("btn_active"));
        // Ajouter la classe active au bouton cliqué 
        bouton.classList.add("btn_active");
        //console.log(categoryId);
        displayWorks(categoryId);
    });
}
async function displayCategories() {
    try {
        // Effectuer la requête pour récupérer les catégories
        const response = await fetch(api_url_categories);

        if (!response.ok) {
            throw new Error("La requête a échoué");
        }
        // Extraire les catégories au format JSON
        categories = await response.json();
        // Parcourir les catégories et créer un bouton pour chaque catégorie
        categories.forEach((category) => {
            createCategory(category);
        });
        //clic sur le boton tous
        boutonTous.addEventListener("click", () => {
            const categoryButtons = document.querySelectorAll('.btn');
            // Supprimer la classe active de tous les boutons
            categoryButtons.forEach((button) => button.classList.remove("btn_active"));
            // Ajouter la classe active au bouton cliqué 
            boutonTous.classList.add("btn_active");
            displayWorks();

        });
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories : ", error);
    }
}

//Partie Admin connecté
function admin() {
    if (adminToken) {
        const connect = document.querySelector(".loginAdmin");
        connect.innerHTML = "<a href='#'>logout</a>";
        connect.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem("token");
            window.location.href = "index.html";
        });

        adminDisplay();
        AddPhotoModal();
    };

};

function adminDisplay() {
    //Création de la banniére
    const banner = document.querySelector(".banner");
    banner.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color: white;"></i>' + '<h2>Mode édition</h2>';
    banner.classList.add("visibleBanner");
    //On masque les filtres 
    const sectionFiltreBtns = document.querySelector(".btns");
    sectionFiltreBtns.classList.add("invisible");
    //Ajout du bouton modifie
    // Sélectionnez l'élément du modal
    const modal = document.getElementById("modal1");
    const portfolio = document.getElementById("portfolio");
    const boutonEdit = document.createElement("a");
    boutonEdit.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:black;";></i>' + '<h2 >modifier<h2/>';
    boutonEdit.addEventListener("click", ouvrirModal);
    boutonEdit.classList.add("boutonEdit");
    portfolio.appendChild(boutonEdit);
    // Fonction pour ouvrir le modal
    function ouvrirModal() {
        modal.style.display = "block";

    }
    // Fonction pour fermer le modal
    function fermerModal() {
        modal.style.display = "none";
    }

    const boutonFermerModal = document.getElementById('fermerModal');
    boutonFermerModal.addEventListener('click', () => {
        fermerModal()
    });

    // Si vous voulez également permettre de fermer la modal en cliquant à l'extérieur de celle-ci
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            fermerModal();
        }
    });

}

//function pour ajouter les photos dans la modale
function createWorkModale(work) {
    const fig = document.createElement('figure');
    fig.classList.add('gallery-modale');
    fig.setAttribute("data-id", work.id)
    modalGallery.appendChild(fig);
    const p = document.createElement('p');
    const deletIcon = document.createElement('i');
    deletIcon.classList.add('fa-solid', 'fa-trash-can', 'icon');
    p.appendChild(deletIcon);
    p.classList.add('delete');
    const divImg = document.createElement('div');
    divImg.appendChild(p);
    divImg.classList.add('gallery-modale-img');
    divImg.style.backgroundImage = "url('" + work.imageUrl + "')";
    divImg.style.width = '78px';
    divImg.style.height = '104px';
    fig.appendChild(divImg);
    deletWork(deletIcon, fig);
    modalGallery.appendChild(fig);

}
//fonction supprimer un work
function deletWork(deletIcon, fig) {
    deletIcon.addEventListener('click', async function (event) {
        event.stopPropagation();
        const workId = fig.getAttribute('data-id');
        try {
            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                //fig.remove();
                displayWorks();


            } else {
                console.error('Erreur lors de la suppression du travail.');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du travail :', error);
        }
    });
}
//Fonction pour aller vers la deuxième modale 
function AddPhotoModal() {
    const modal = document.getElementById("modal1");
    const newModal = document.getElementById("modal2");
    const boutonAjoutPhoto = document.querySelector('.btn-modal');
    boutonAjoutPhoto.addEventListener('click', () => {
        const modalNewContenu = document.querySelector('.modal-contenu2'); // Déplacez cette ligne ici
        const btnReturn = document.createElement("a");
        btnReturn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
        modalNewContenu.appendChild(btnReturn);
        btnReturn.classList.add('arrow-left');
        modal.style.display = 'none';
        newModal.style.display = 'block';
        btnReturn.style.display = 'block';
        console.log("bonjour");
        btnReturn.addEventListener('click', () => {
            modal.style.display = 'block';
            newModal.style.display = 'none';

        });
        fileUploadForm.reset();
        CategoryOption();
        uploadFile();
    });
    // Fonction pour fermer le modal
    function fermerNewModal() {
        newModal.style.display = "none";

    }
    const boutonFermerNewModal = document.getElementById('fermerModal2');
    boutonFermerNewModal.addEventListener('click', () => {
        fermerNewModal()
    });

    // Si vous voulez également permettre de fermer la modal en cliquant à l'extérieur de celle-ci
    window.addEventListener('click', (event) => {
        if (event.target === newModal) {
            fermerNewModal();
        }
    });

    //Envoi  d'un nouveau d’un nouveau projet
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        await addWork(e);
        fermerNewModal();
    });
}
async function addWork(event) {
    event.preventDefault();
    const title = titleInput.value;
    const categoryId = categorieSelect.value;
    const image = photoInput.files[0];
    const maxSizeImage = 4 * 1024 * 1024;
    // Vérifiez si une image a été sélectionnée
    if (!image) {
        alert("Veuillez sélectionner une image");
        return;
    } else if (image.size > maxSizeImage) {
        alert("La taille de votre image est superieur à 4mo ");
        return;
    } else if (title === "" || categoryId === "" || image === undefined) {
        alert("Merci de remplir tous les champs");
        return;
    } else if (!createCategory(categoryId) === categoryId) {
        alert("Merci de choisir une catégorie valide");
        return;
    } else {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", categoryId);
            formData.append("image", image);

            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
                body: formData,
            });

            if (response.status === 201) {
                alert("Projet ajouté avec succès :)");
                displayWorks();   

            } else if (response.status === 400) {
                alert("Merci de remplir tous les champs");
            } else if (response.status === 500) {
                alert("Erreur serveur");
            } else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à ajouter un projet");
                window.location.href = "login.html";
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}

async function CategoryOption(categoryId) {
    alert("options");
    displayCategories(categoryId);
    // Effacez les options existantes à chaque fois que vous mettez à jour le select
    categorieSelect.innerHTML = "<option value='' selected>--Veuillez choisir une categorie--</option>";
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id; // En supposant que la catégorie a une propriété 'id'
        option.innerHTML = category.name; // En supposant que la catégorie a une propriété 'name'
        categorieSelect .appendChild(option);
    });
}
// Fonction pour gérer le téléchargement de l'image
function uploadFile(e) {
    const iconePhotoFile = document.querySelector(".fa-image");
    iconePhotoFile.style.display = "block";
    const boutonFile = document.querySelector(".rectangle label");
    boutonFile.style.display = "block";
    const picture = document.getElementById("picture");
    const infoFile = document.querySelector(".rectangle p");
    infoFile.style.display = "block";
    picture.src = "";  // Remplacez par l'URL de l'image par défaut si nécessaire
    const [image] = e.files;
    // Mettez à jour l'aperçu de l'image
    picture.src = URL.createObjectURL(image);
    // Masquez les éléments liés au téléchargement de fichier
    iconePhotoFile.style.display = "none";
    boutonFile.style.display = "none";
    infoFile.style.display = "none";
    titleInput.addEventListener('input', updateSubmitButton);
    photoInput.addEventListener('change', updateSubmitButton);
    categorieSelect.addEventListener('change', updateSubmitButton);

}

// Fonction pour mettre à jour l'état du bouton de soumission
function updateSubmitButton() {
    // Vérifiez si tous les champs du formulaire sont remplis
    const titleFilled = titleInput.value.trim() !== '';
    const photoFilled = photoInput.files && photoInput.files[0];
    const categorieFilled = categorieSelect.value !== '';
    // Activez le bouton et changez sa couleur si tous les champs sont remplis
    if (titleFilled && photoFilled && categorieFilled) {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = " #1D6154";
    } else {
        // Désactivez le bouton, réinitialisez sa couleur et retirez la classe s'il y a des champs non remplis
        submitButton.disabled = true;
        submitButton.style.backgroundColor = " #A7A7A7";
    }
}