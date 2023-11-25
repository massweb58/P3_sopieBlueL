document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.login_form');
    // const loginEmailError = document.querySelector('.loginEmail_error');
    const loginMdpError = document.querySelector('.loginMdp_error');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('submit');
    const loginEmailError = document.querySelector('.loginEmail_error');
    const loginErreur = document.querySelector('.error');
    // Gérer la soumission du formulaire
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Empêche la soumission du formulaire par défaut

        loginEmailError.textContent = ''; // Efface les messages d'erreur précédents
        loginMdpError.textContent = '';
        loginErreur.textContent = '';
        const email = emailInput.value;
        const password = passwordInput.value;
        console.log('Email saisi :', email);
        console.log('Mot de passe saisi :', password);
        // Validation de l'email (exemple de validation basique)
        if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/g)) {
            console.log('Validation de l\'email a échoué.');
            const p = document.createElement('p');
            p.innerHTML = 'Veuillez entrer une adresse email valide';
            loginEmailError.appendChild(p);
            return;
        }
        // Validation du mot de passe (exemple : au moins 6 caractères alphanumériques)
        if (password.length < 6 || !password.match(/^[a-zA-Z0-9]+$/g)) {
            const p = document.createElement('p');
            p.innerHTML = 'Veuillez entrer un mot de passe valide';
            loginMdpError.appendChild(p);
            return;
        }
        // Si les validations passent, envoyez les données d'authentification au serveur via fetch
        const userData = {
            email: email,
            password: password
        };
        console.log(userData);
        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.status === 200) {
                const responseData = await response.json();
                // Connexion réussie
                // Vous pouvez stocker le token et rediriger l'utilisateur
                console.log('Connexion réussie. Token :', responseData.token);
                sessionStorage.setItem("token", responseData.token);

                // Redirection vers la page d'acceuil
                window.location.href = 'index.html';
            } else if (response.status === 401) {
                const errorData = await response.json();

                // Connexion non autorisée
                const p = document.createElement('p');
                p.innerHTML = 'Not Authorized';
                loginErreur.appendChild(p);

            } else if (response.status === 404) {
                const errorData = await response.json();
                // Utilisateur non trouvé
                const p = document.createElement('p');
                p.innerHTML = 'User not found';
                loginErreur.appendChild(p);
            } else {
                // Autres erreurs
                throw new Error('Erreur de requête');
            }
        } catch (error) {
            console.error('Une erreur s\'est produite :', error);
        }
    });
    

});
