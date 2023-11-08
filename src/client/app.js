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
    // If the response status is 200, store the user ID and role
    const userData = await response.json();
    const userId = userData.userId;
    const userRole = userData.role;

    // Store the user ID and role in localStorage
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', userRole);

    // Redirect to the desired profile page or other appropriate page based on the role
    window.location.href = determineRedirectURL(userRole);
  } else {
    // If the response status is not 200, show an alert message
    alert('Check the credentials.');
  }
});


function determineRedirectURL(role) {
  if (role === 'Admin') {
    return 'home.html'; // Redirect to the admin page
  } else if (role === 'Employee') {
    return 'profile.html'; // Redirect to the employee profile page
  } else {
    // Handle other roles or scenarios
    return 'error.html'; // Redirect to an error page or handle the case as needed
  }
}




registerButton.addEventListener('click', () => {
  // Define the URL of the page you want to open in a new tab
  const localFileURL = 'register.html';

  // Open a new tab or window with the specified URL
  window.open(localFileURL, '_self');
});





