document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form');
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');  

    if (!loginForm) return; // Exit if the login form is not found on the page

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = nameInput.value;
        const email = emailInput.value;

        const loginData = { name, email };

        try {
            const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Login Successful!');
                window.location.href = '/search.html'; // Redirect to search page
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    });
});