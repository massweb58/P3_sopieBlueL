const login = document.querySelector('form')
//on récupère le span error-message
const error = document.querySelector(".error-message");


// ECOUTER LE CLICK DU BOUTON
login.addEventListener("submit", function(event) {
    
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email == "" || password == "") {
        error.innerText = "Veuillez saisir l'identifiant et/ou le mot de passe";
        return;
    }

    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, password})
        
    })
    .then((response) => {
        //si status 200 on stocke les donnees dans le json
        if (response.ok) {
          return response.json();
          //si les deux champs ne matchent pas
        } else if (response.status === 401) {
          console.log("Unauthorized");
          error.innerText = "Erreur dans l'identifiant et/ou le mot de passe";
          //si utilisateur inconnu dans la base
        } else if (response.status === 404) {
          console.log("User not found");
          error.innerText = "Utilisateur inconnu";
        }
      })
    .then(data => {
        
        sessionStorage.setItem('token', data.token)
        document.location.href = "./index.html";
        alert('Connexion réussie !');

        console.log(data);
        
    })
    .catch((error) => {
        console.log(error);
    });
}) 

async function adminLogin() {
    if (sessionStorage.getItem('token') === null) {

         console.log("tokenpour")
    } else {
      console.log("token")
    }
};


var token = sessionStorage.getItem("token");
console.log("token");


