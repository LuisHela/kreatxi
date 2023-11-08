document.addEventListener('DOMContentLoaded', async () => {
  // Add event listener for the search form submission
  const searchInput = document.getElementById('search');
  const resultsContainer = document.querySelector('.content');

  searchInput.addEventListener('input', async () => {
    const query = searchInput.value;

    // Replace 'http://localhost:3000' with the appropriate URL for your backend.
    const apiUrl = 'http://localhost:3000';

    try {
      const response = await fetch(`${apiUrl}/auth/search-users?query=${query}`);

      if (response.status === 200) {
        const users = await response.json();

        // Clear previous search results
        resultsContainer.innerHTML = '';

        // Iterate through the 'users' array and display the results
        users.forEach((user) => {
          const userElement = document.createElement('div');
          userElement.textContent = `User ID: ${user.id}, First Name: ${user.firstname}, Last Name: ${user.lastname}`;
          resultsContainer.appendChild(userElement);
        });
      } else {
        console.error('Error searching users:', response.status, response.statusText);
        // Handle the error, e.g., display an error message to the user
      }
    } catch (error) {
      console.error('Error searching users:', error);
      // Handle the error, e.g., display an error message to the user
    }
  });
});
document.addEventListener('DOMContentLoaded', async () => {
  // Add event listener for the search form submission
  const searchInput = document.getElementById('search');
  const resultsContainer = document.querySelector('.content');

  searchInput.addEventListener('input', async () => {
    const query = searchInput.value;

    // Replace 'http://localhost:3000' with the appropriate URL for your backend.
    const apiUrl = 'http://localhost:3000';

    try {
      if (query.trim() === '') {
        // Fetch user data with distinct departments
        const departmentsResponse = await fetch(`${apiUrl}/auth/departments`);

        if (departmentsResponse.status === 200) {
          const departments = await departmentsResponse.json();

          // Clear previous search results
          resultsContainer.innerHTML = '';

          // Iterate through the 'departments' array and display the results
          departments.forEach((department) => {
            const departmentElement = document.createElement('div');
            departmentElement.textContent = `Department: ${department}`;
            resultsContainer.appendChild(departmentElement);
          });
        } else {
          console.error('Error fetching departments:', departmentsResponse.status, departmentsResponse.statusText);
          // Handle the error, e.g., display an error message to the user
        }
      } else {
        // Perform user search as in your previous code
        const userResponse = await fetch(`${apiUrl}/auth/search-users?query=${query}`);

        if (userResponse.status === 200) {
          const users = await userResponse.json();

          // Clear previous search results
          resultsContainer.innerHTML = '';

          // Iterate through the 'users' array and display the results
          users.forEach((user) => {
            const userElement = document.createElement('div');
            userElement.textContent = `User ID: ${user.id}, First Name: ${user.firstname}, Last Name: ${user.lastname}`;
            resultsContainer.appendChild(userElement);
          });
        } else {
          console.error('Error searching users:', userResponse.status, userResponse.statusText);
          // Handle the error, e.g., display an error message to the user
        }
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the error, e.g., display an error message to the user
    }
  });
});


