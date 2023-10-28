document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('registerButton');
    const firstNameInput = document.getElementById('firstName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const birthdayInput = document.getElementById('birthday');
    const message = document.getElementById('alertMessage');

    registerButton.addEventListener('click', async () => {
        const name = firstNameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const birthday = birthdayInput.value;

        // Check for required fields
        if (!name.trim() || !email.trim() || !password.trim() || !birthday) {
            message.textContent = 'Not all required fields have been filled in.';
            return;
        }

        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('birthday', birthday);

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.status === 200) {
                message.textContent = 'User registered successfully';
                // Handle success
            } else {
                message.textContent = 'User registration failed. Status: ' + response.status;
                console.log('Response Text:', await response.text());
            }
        } catch (error) {
            console.error('An error occurred:', error);
            message.textContent = 'An error occurred during registration.';
        }
    });
});
