document.addEventListener('DOMContentLoaded', () => {
    const employeeRegisterButton = document.getElementById('employeeRegisterButton');
    const hirerRegisterButton = document.getElementById('hirerRegisterButton');
  
    // Input fields for employee registration
    const employeeFirstNameInput = document.getElementById('employeeFirstName');
    const employeeLastNameInput = document.getElementById('employeeLastName');
    const employeeEmailInput = document.getElementById('employeeEmail');
    const employeePasswordInput = document.getElementById('employeePassword');
    const employeeBirthdayInput = document.getElementById('employeeBirthday');
    const employeeProfilePictureInput = document.getElementById('employeeProfilePicture');
    const employeeDepartmentSelect = document.getElementById('employeeDepartment');
    const employeePhoneSelect = document.getElementById('employeePhone');
    const employeeMessage = document.getElementById('employeeMessage');
   

  
    // Input fields for Admin registration
    const hirerFirstNameInput = document.getElementById('hirerFirstName');
    const hirerLastNameInput = document.getElementById('hirerLastName');
    const hirerEmailInput = document.getElementById('hirerEmail');
    const hirerPasswordInput = document.getElementById('hirerPassword');
    const hirerBirthdayInput = document.getElementById('hirerBirthday');
    const hirerProfilePictureInput = document.getElementById('hirerProfilePicture');
    const hirerPhoneSelect = document.getElementById('hirerPhone');
    const hirerSecurityCodeInput = document.getElementById('securitycode');
    const hirerMessage = document.getElementById('hirerMessage');
    hirerMessage.style.display = 'block';
   
  

// Event listener for the tab selection (Employee or Admin)
  const employeeTab = document.getElementById('home-tab');
  const adminTab = document.getElementById('profile-tab');
  let selectedRole = 'Employee'; // Default role is Employee

  employeeTab.addEventListener('click', () => {
    selectedRole = 'Employee';
  });

  adminTab.addEventListener('click', () => {
    selectedRole = 'Admin';
  });

  hirerRegisterButton.addEventListener('click', async () => {
    const name = hirerFirstNameInput.value;
    const lastname = hirerLastNameInput.value;
    const email = hirerEmailInput.value;
    const password = hirerPasswordInput.value;
    const birthday = hirerBirthdayInput.value;
    const adminDepartmentSelect = "Adminstrator";
    const profilePicture = hirerProfilePictureInput.files[0];
    const phone = hirerPhoneSelect.value; // Updated phone input for hirer
    const securityCode = hirerSecurityCodeInput.value; // Get the security code input
  
    // Log the values to the console
    console.log('FirstName:', name);
    console.log('Lastname:', lastname);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Birthday:', birthday);
    console.log('Department', adminDepartmentSelect);
    console.log('Profile Picture:', profilePicture);
    console.log('Phone:', phone);
    console.log('Role: Admin');
    console.log('Security Code:', securityCode);
  
    // Check if the security code matches your secret code
    if (securityCode !== 'Kreatx') {
      hirerMessage.textContent = 'Invalid security code. Registration failed.';
      return;
    }
  
    // Check for required fields
    if (!name.trim() || !email.trim() || !password.trim() || !birthday) {
      hirerMessage.textContent = 'Not all required fields have been filled in.';
      return;
    }
  
    const formData = new FormData();
    formData.append('firstname', name);
    formData.append('lastname', lastname);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('birthday', birthday);
    formData.append('profilePicture', profilePicture);
    formData.append('phone', phone);
    formData.append('department', adminDepartmentSelect);
    formData.append('role', 'Admin'); // Set the role as 'Admin'
  
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        body: formData,
      });
  
      if (response.status === 200) {
        hirerMessage.textContent = 'Admin registered successfully';
        console.log('Admin registered successfully');
        window.location.href = 'home.html';
      } else {
        hirerMessage.textContent = 'Admin registration failed. Status: ' + response.status;
        console.log('Response Text:', await response.text());
      }
    } catch (error) {
      console.error('An error occurred:', error);
      hirerMessage.textContent = 'An error occurred during Admin registration.';
    }
  });
  
  

  employeeRegisterButton.addEventListener('click', async () => {
    const firstname = employeeFirstNameInput.value;
    const lastname = employeeLastNameInput.value;
    const email = employeeEmailInput.value;
    const password = employeePasswordInput.value;
    const birthday = employeeBirthdayInput.value;
    const profilePicture = employeeProfilePictureInput.files[0];
    const department = employeeDepartmentSelect.value;
    const phone = employeePhoneSelect.value; // Updated phone input for employee
  
    // Log the values to the console
    console.log('Name:', firstname);
    console.log('Lastname:', lastname);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Birthday:', birthday);
    console.log('Profile Picture:', profilePicture);
    console.log('Department:', department);
    console.log('Phone:', phone);
    console.log('Role: Employee');
  
    // Check for required fields
    if (!firstname.trim() || !email.trim() || !password.trim() || !birthday) {
      employeeMessage.textContent = 'Not all required fields have been filled in.';
      return;
    }
  
    const formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('birthday', birthday);
    formData.append('profilePicture', profilePicture);
    formData.append('department', department);
    formData.append('phone', phone);
    formData.append('role', 'Employee'); // Set the role as 'Employee'
  
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        body: formData,
      });
  
      if (response.status === 200) {
        employeeMessage.textContent = 'Employee registered successfully';
        console.log('Employee registered successfully');
        window.location.href = 'home.html';
      } else {
        employeeMessage.textContent = 'Employee registration failed. Status: ' + response.status;
        console.log('Response Text:', await response.text());
      }
    } catch (error) {
      console.error('An error occurred:', error);
      employeeMessage.textContent = 'An error occurred during employee registration.';
    }
  });

  
  });

