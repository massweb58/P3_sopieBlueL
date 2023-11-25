const form = {
  email: document.querySelector("#email"),
  password: document.querySelector("#password"),
  submit: document.querySelector("input[type='submit']"),
};

async function initForm(){
  // Fonction pour traîter la réponse de l'API
  const handleResponse = async (response) => {
    const data = await response.json();

    if (response.ok) {
      sessionStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      const wrongPwdDiv = document.querySelector(".wrong-pwd");
      wrongPwdDiv.textContent = "Adresse mail ou mot de passe incorrect";
    }
  };

  // EventListener pour la connexion
  form.submit.addEventListener("click", async (event) => {
    event.preventDefault();

    const loginURL = "http://localhost:5678/api/users/login";

    const formInfo = {
      email: form.email.value,
      password: form.password.value,
    };

    const response = await fetch(loginURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formInfo),
    });

    await handleResponse(response);
  });
}

initForm();

