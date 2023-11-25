// @ts-nocheck
/*****page de conexion js*****/
const form = document.querySelector("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
//const logOut = document.getElementById("login-link");

function main() {
  userLog();
}
main();
/********Ecouteur d'évènement du Form de conexion***********/
// recupération de l'email et du password via les inputs
function userLog() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const userEmail = email.value;
    const userPassword = password.value;
    const login = {
      email: userEmail,
      password: userPassword,
    };
    const user = JSON.stringify(login);

    /****Envoi de la requette****/
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: user,
    })
      // recupération de la réponse de la base de donnée
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          email.style.border = "2px solid #FF0000";
          password.style.border = "2px solid #FF0000";
          const errorLogin = document.querySelector("p");
          errorLogin.textContent =
            "Le mot de passe ou l'identifiant que vous avez fourni est incorrect.";
          throw new Error("Je ne suis pas Admin");
        }
        if (response.ok) {
          console.log("je suis admin");
          email.style.border = "2px solid green";
          password.style.border = "2px solid green";
          //logOut.textContent = "logout";
          window.location.href = "index.html";
        }
        return response.json(); // Cela parse la réponse JSON
      })
      .then((data) => {
        // Initialisation des donnés Token et id de l'utilisateur
        console.log(data);
        const userID = data.userId;
        const userToken = data.token;
        console.log(userID, userToken);
        window.localStorage.loged = userToken;
        localStorage.setItem("isLoggedIn", "true");
        console.log("user ID: " + userID);
        console.log("user Token: " + userToken);
      })
      .catch((error) => {
        console.error("Une erreur est survenue : ", error);
      });
  });
}

