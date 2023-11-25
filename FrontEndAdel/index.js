let worksData
let worksArray
let works = []
let categoryData = []

async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    categoryData = categories;
    return categories;
};
let categorieArray = await fetchCategories();



async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    worksData = works
    return works;
};

async function fetchData() {
    const works = await fetchWorks();
    const categories = await fetchCategory();
    projetsFiltres(categories, works);
}



async function afficherWorks() {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    let worksArray = await fetchWorks();
    console.log(worksArray);
    worksArray.forEach((works) => {
        const figure = document.createElement("figure");
        figure.setAttribute("data-name", works.category.name);
        gallery.appendChild(figure);

        const img = document.createElement("img");
        img.src = works.imageUrl;
        img.alt = works.title;
        figure.appendChild(img);

        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = works.title;
        figure.appendChild(figcaption)
    });
};

await afficherWorks();

const filterButtons = document.querySelectorAll(".filter-container button");
const filteredFigure = document.querySelectorAll(".gallery figure")

const filterFigure = button => {
    document.querySelector(".active").classList.remove("active");
    button.target.classList.add("active")
    console.log(button.target)
    
    filteredFigure.forEach(figure => {
        figure.classList.add("hide");
        if(figure.dataset.name === button.target.dataset.name || button.target.dataset.name === "Tous")
        figure.classList.remove("hide");
    })
}
    
filterButtons.forEach(button => button.addEventListener("click", filterFigure));



/**Modale */

let token = localStorage.getItem("token");

const login = document.querySelector(".login_link")
const modalButton = document.querySelectorAll(".modal-button");
const editingToolsBanner = document.querySelector(".editing-tools-banner");


/**Authentification */

if(token) {
    editingToolsBanner.style.display = "flex";

    modalButton.forEach((button) => {
        button.style.display = "flex";
    });

    login.innerHTML = "logout"
    login.addEventListener("click", function(){
        localStorage.removeItem("token")
        window.location.href = "login.html"
    })
}


/** Generation de la modale editer/supprimer */

async function displayModal() {
    const modalGallery = document.querySelector(".modal_gallery");
    modalGallery.innerHTML = "";
    let worksArray = await fetchWorks();
    console.log(worksArray);
    worksArray.forEach((works) => {
        const figure = document.createElement("figure");
        figure.classList.add("figure-position", "hoverArrows");
        figure.setAttribute("data-id", works.id);
        modalGallery.appendChild(figure);

        const img = document.createElement("img");
        img.src = works.imageUrl;
        img.alt = works.title;
        figure.appendChild(img);

        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = "éditer";
        figure.appendChild(figcaption) 

        const deleteLogo = document.createElement("i");
        deleteLogo.classList.add("fa-regular", "fa-trash-can", "delete-logo");
        deleteLogo.setAttribute("data-id", works.id);
        figure.appendChild(deleteLogo);

        const expendArrow = document.createElement("i");
        expendArrow.classList.add("fa-solid", "fa-arrows-up-down-left-right", "expend-arrow-logo");
        figure.appendChild(expendArrow);

    });

    const modalDeleteLogo = document.querySelectorAll(".delete-logo");

    let deleteRequest = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    modalDeleteLogo.forEach((trashcan) => {
        trashcan.addEventListener("click", function() {
            const workId = trashcan.getAttribute("data-id");
            fetch(`http://localhost:5678/api/works/${workId}`, deleteRequest)
                .then((res) => {
                    if(res.ok) {
                        trashcan.parentElement.remove();
                        const deleteFigure = document.querySelector(`figure[data-id="${workId}"]`);
                        deleteFigure.remove();
                    }
                });
        });
    });
      
}
displayModal()


const modal = document.querySelector("dialog"); 
const closeModalIcon = document.querySelector(".close_modal_icon")




/** Fonction ouverture/fermeture modale */

function OpenAndCloseModal() {
    modalButton[2].addEventListener("click", () => {
        modal.showModal();
    });
};
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.close();
    }
});
closeModalIcon.addEventListener("click", () => {
    modal.close();
});
OpenAndCloseModal();


const modalGallery = document.querySelector(".modal_gallery");
const modalContent = document.querySelector(".modal_content");

/** Generation modale ajout photo  */
function newWorkModal (){
    const modalNewButton = document.querySelector(".modal_add-btn");
    let newModalContentHTML = "";
    modalNewButton.addEventListener("click", function(){
        newModalContentHTML = modalContent.innerHTML;
        modalContent.innerHTML = "";
        modalContent.innerHTML =`
        <i class="fa-solid fa-arrow-left modal_add-work_return-icon"></i>
            <div class="modal_content_add-work">
                <h3>Ajout photo</h3>
                <form  id="myForm" action="">
                    <div class="form-add-img">
                        <i class="fa-sharp fa-regular fa-image picture-logo"></i>
                        <label for="photo" class="form-add-img-button">+ Ajouter photo</label>
                        <input type="file" id="photo" name="photo">
                        <img alt"image preview" class="selected-img">
                        <p>jpg, png : 4mo max</p>
                    </div>
            
                        <div class="form-add-input">
                            <label for="titre">Titre</label>
                            <input type="text" id="titre" name="titre">
                        </div>
                        <div class="form-add-input">
                            <label for="categorie">Catégorie</label>
                            <select name="categorie" id="categorie" >
                                <option id="select_categorie" value"></option>
                                ${categorieArray.map(
                                    (category) =>
                                        `<option value="${category.id}">${category.name}</option>`
                                )}
                            </select>
                        </div>
                    </form>
                    <p class="invalid-form-message">Veuillez remplir tous les champs pour ajouter un projet</p>
                <p class="valid-form-message">Formulaire enregistré !</p>
                <p class="invalid-request-form-message">Une erreur s'est produite lors de la soumission du formulaire</p>
                    <hr>
                    <button id="modal_add-work-btn" class="modal_add-work-btn">Valider</button>
            </div>`;

        const modalReturnIcon = document.querySelector(".modal_add-work_return-icon");
        modalReturnIcon.addEventListener("click", function(){
           modalContent.innerHTML = newModalContentHTML;
           newWorkModal()
        })
        const modalCloseIcon = document.querySelector(".close_modal_icon");
        modalCloseIcon.addEventListener("click", function(){

            modalContent.innerHTML = newModalContentHTML;
            newWorkModal()
        })

        const photoInput = document.getElementById("photo")
        const selectedImage = document.querySelector(".selected-img");
        
        photoInput.addEventListener("change", () => {
            const file = photoInput.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                selectedImage.src = e.target.result;
                const addImgForm = document.querySelector(".form-add-img");
                const formElements = addImgForm.querySelectorAll(".form-add-img > *");

                formElements.forEach((element) => {
                    element.style.display = "none";
                });
                selectedImage.style.display = "flex";
            };
            reader.readAsDataURL(file);
        });

        const submitWorkButton = document.getElementById("modal_add-work-btn");
        const titleInput = document.getElementById("titre");
        const selectInput = document.getElementById("categorie");
        const invalidFormMessage = document.querySelector(".invalid-form-message");
        const validFormMessage = document.querySelector(".valid-form-message");
        const invalidRequestFormMessage = document.querySelector(".invalid-request-form-message");
        
        function createNewWork() {
            submitWorkButton.addEventListener("click", () => {
                if (photoInput.value === '' || titleInput.value === '' || selectInput.value === ''){
                    invalidFormMessage.style.display = "block";
                    return;
                }
                
                let formData = new FormData();
                formData.append("image", selectedImage.src);
                formData.append("title", titleInput.value);
                formData.append("category", selectInput.value);
    
                let requestAdd = {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                };
                
                fetch("http://localhost:5678/api/works", requestAdd)
                .then((res) => {
                    if (res.ok) {
                        invalidFormMessage.style.display = "none";
                        validFormMessage.style.display = "block";
                        submitWorkButton.classList.add("valide")
                    } else {
                        invalidFormMessage.style.display = "none";
                        invalidRequestFormMessage.style.display = "block"
                    }
                });
            });
        }
        createNewWork();
    });
    
}
newWorkModal()


