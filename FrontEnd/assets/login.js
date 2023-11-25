const inputemail = document.querySelector("#username");
const inputpassword = document.querySelector("#pass");
const inputconnexion = document.querySelector(".btnconnection");

const formLogin = document.querySelector("#formLogin");

formLogin.addEventListener("submit", function (e) {

  e.preventDefault();

  const body = {
    email: inputemail.value,
    password: inputpassword.value
  };

  fetch("http://localhost:5678/api/users/login", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

    .then(response => {

      console.log(response)
      if (response.ok) {
        return response.json();
      }
      else {
        console.log('Erreur dans l’identifiant ou le mot de passe');
        feedback.innerText = "utilisateur non reconnue!";
        feedback.style.display = "block";
      }
    })

    .then(data => {

      console.log(data)
      localStorage.setItem("token", data.token);
      window.location.href = "index.html"
    })

    .catch(error => {
      console.error(error);
    });
})