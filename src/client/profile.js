document.addEventListener('DOMContentLoaded', async () => {
  const { isAuthenticated, id } = checkAuthentication();

  if (isAuthenticated) {
    userId = id;
    fetchUserProfile();
  } else {
    displayErrorProfile();
  }
});
const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      logoutUser();
    });
  }


function checkAuthentication() {
  const token = localStorage.getItem('accessToken');

  if (token) {
    const decodedToken = decodeToken(token);
    if (decodedToken) {
      return { isAuthenticated: true, id: decodedToken.id };
    }
  }
  return { isAuthenticated: false, id: null };
}

async function fetchUserProfile() {
  try {
    const response = await fetch(`${apiUrl}/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      displayUserProfile(userData);
      console.log('User Profile Data:', userData); 
    } else {
      console.error('Error fetching user profile:', response.status, response.statusText);
      displayErrorProfile();
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    displayErrorProfile();
  }
}

function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = parts[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(normalized));
      return decoded;
    } else {
      console.error('Invalid token format');
      return null;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

function displayUserProfile(userData) {
  console.log('User Profile Data:', userData);
  document.getElementById('profile-picture').src = userData.profilePictureUrl;
  document.getElementById('first-name').textContent = 'First Name: ' + userData.firstName;
  document.getElementById('last-name').textContent = 'Last Name: ' + userData.lastName;
  document.getElementById('email').textContent = 'Email: ' + userData.email;
  document.getElementById('phone').textContent = 'Phone: ' + userData.phone;
}

function displayErrorProfile() {
  // Implement this function to display an error message in the DOM.
  // For example, you can display an error message when user profile fetching fails.
}


function logoutUser() {
  localStorage.removeItem('accessToken');
  window.location.href = '/login.html'; 
}