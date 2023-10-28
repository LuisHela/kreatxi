const email = document.getElementById('inputEmail');
const password = document.getElementById('inputPassword');
const button = document.getElementById('buttonLogin');
const message = document.getElementById('alertMessage');
const registerButton = document.getElementById('buttonRegister');



button.addEventListener('click', async () => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  });

  if (response.status === 200) {
    // If the response status is 200, open a new page
    window.location.href = 'register.html';
  } else {
    // If the response status is not 200, show an alert message
    alert('Response status is not 200.');
  }
});

registerButton.addEventListener('click', () => {
  // Define the URL of the page you want to open in a new tab
  const localFileURL = 'register.html';

  // Open a new tab or window with the specified URL
  window.open(localFileURL, '_blank');
});




