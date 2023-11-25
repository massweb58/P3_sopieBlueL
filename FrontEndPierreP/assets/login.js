//**************** CONSTANTE API *********************//

const apiLogin = "http://localhost:5678/api/users/login";

//*************** constantes **************** *//

const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

// ecouteur d'evenement au clic sur le bouton "se connecter" //
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('pass').value;
  
  //vérifier si un message d'erreur est present et le supprimer //
  if (emailError) {
    emailError.textContent = "";
  }
  
  if (passwordError) {
    passwordError.textContent = "";
  }
// fonction asynchone d'envoi et de gestion des valeurs de reception //
  async function postJSON(valueLogin) {
    try {
      const response = await fetch(apiLogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(valueLogin),
      });

      switch (response.status) {
        case 200:
          const resultat = await response.json();
          const tokenValue = resultat.token;
          const tokenUserId = resultat.userId;
          console.log("Réussite :", resultat);

          // Enregistrement des valeurs du token dans le session storage        
          window.sessionStorage.setItem("TokenValue", tokenValue);
          window.sessionStorage.setItem("TokenUserId", tokenUserId);

  
          // Redirige l'utilisateur vers une autre page si la connexion réussie.
          window.location.href = '../index.html';
          break

        case 404:
          // Utilisateur non trouvé
          emailError.textContent = "Utilisateur inconnu.";
          console.error("Erreur de réponse de l'API:", response.statusText);
          break

        case 401:
          // Mot de passe erroné
          passwordError.textContent = "Utilisateur inconnu ou mot de passe incorrect";
          console.error("Erreur de réponse de l'API:", response.statusText);
          break
      }

    } catch (erreur) {
      console.error("Erreur :", erreur);
    }
  }

  const valueLogin = { email, password };
  postJSON(valueLogin);
});
