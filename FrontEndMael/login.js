const form = document.getElementById("formLogin");
const errorMessage = document.getElementById("formError")
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Fonctions pour gérer l'affichage des erreurs
passwordInput.addEventListener('input', function () { // on enlève les alerte d'erreur lors d'un input password
  emailInput.classList.remove("loginError")
  passwordInput.classList.remove("loginError")
  clearErrorMessage();
});

emailInput.addEventListener('input', function () { // on enlève les alerte d'erreur lors d'un input email
  emailInput.classList.remove("loginError")
  passwordInput.classList.remove("loginError")
  clearErrorMessage();
});

function clearErrorMessage() { // on éfface le message d'erreur 
  errorMessage.innerHTML = ""
}

function setErrorMessage(Error) { // on affiche un message d'erreur en fonction du type d'erreur
  errorMessage.innerText = Error;
}

// Ajout d'un event sur la soumission du formulaire
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Empêche le rechargement de la page

  // Récupération des valeurs des champs email et mot de passe du formulaire
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Envoi à l'API pour authentification
  try {
    let response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) { // identifiant valide
      const data = await response.json();
      sessionStorage.setItem("token", data.token);  // on enregistre le token pour cette session
      window.location.href = "index.html"; // on retourne sur la page index 
    } else if (response.status === 401) { // Erreur mauvais mot de passe
      passwordInput.classList.add("loginError");
      clearErrorMessage();
      setErrorMessage('Mot de passe incorrect');
    } else if (response.status === 404) { // Erreur mauvais utilisateur
      emailInput.classList.add("loginError");
      clearErrorMessage();
      setErrorMessage('Utilisateur non trouvé');
    } else { // Erreur inattendue
      setErrorMessage('Une erreur inattendue s\'est produite, veuillez réessayer plus tard')
    }
  } catch (error) {
    setErrorMessage('Une erreur inattendue s\'est produite, veuillez réessayer plus tard')
  };
});