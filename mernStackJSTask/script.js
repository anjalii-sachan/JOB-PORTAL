// DOM Elements
const jobListDiv = document.getElementById("job-list");
const addJobForm = document.getElementById("add-job-form");
const toggleFormBtn = document.getElementById("toggle-form");

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const showLoginLink = document.getElementById('show-login');
const showRegisterLink = document.getElementById('show-register');

const regUsername = document.getElementById('reg-username');
const regPassword = document.getElementById('reg-password');
const registerBtn = document.getElementById('register-btn');
const regMessage = document.getElementById('reg-message');

const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const loginMessage = document.getElementById('login-message');

const logoutBtn = document.getElementById('logout-btn');

// Toggle Forms
showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    clearMessages();
});

showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    clearMessages();
});

function clearMessages() {
    regMessage.textContent = '';
    loginMessage.textContent = '';
}

// Register
registerBtn.addEventListener('click', () => {
    const username = regUsername.value.trim();
    const password = regPassword.value.trim();

    if (!username || !password) {
        regMessage.textContent = 'Please fill in all fields';
        regMessage.style.color = 'red';
        return;
    }

    if (localStorage.getItem(`user_${username}`)) {
        regMessage.textContent = 'You are already registered. Please login.';
        regMessage.style.color = 'red';
        return;
    }

    localStorage.setItem(`user_${username}`, password);
    regMessage.textContent = 'Registration successful!';
    regMessage.style.color = 'green';
    regUsername.value = '';
    regPassword.value = '';
});

// Login
loginBtn.addEventListener('click', () => {
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (!username || !password) {
        loginMessage.textContent = 'Please fill in all fields';
        loginMessage.style.color = 'red';
        return;
    }

    const storedPassword = localStorage.getItem(`user_${username}`);
    if (!storedPassword) {
        loginMessage.textContent = 'User not registered. Please register first.';
        loginMessage.style.color = 'red';
        return;
    }

    if (password !== storedPassword) {
        loginMessage.textContent = 'Incorrect password';
        loginMessage.style.color = 'red';
        return;
    }

    loginMessage.textContent = 'Login successful!';
    loginMessage.style.color = 'green';
    localStorage.setItem('loggedInUser', username);

    setTimeout(() => {
        alert(`Welcome, ${username}`);
        loginUsername.value = '';
        loginPassword.value = '';
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        updateUIForLogin();
    }, 800);
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    alert('Logged out successfully');
    updateUIForLogin();
});

// Job Data
let jobs = [
    {
        title: "Frontend Developer",
        company: "ABC Corp",
        location: "New York",
        description: "Experience in React, HTML, CSS required."
    },
    {
        title: "Backend Developer",
        company: "XYZ Ltd",
        location: "San Francisco",
        description: "Experience in Node.js, Express, and MongoDB."
    }
];

// Display Jobs
function displayJobs(jobsArray) {
    jobListDiv.innerHTML = "";
    jobsArray.forEach((job, index) => {
        const jobDiv = document.createElement("div");
        jobDiv.classList.add("job");
        jobDiv.innerHTML = `
      <h3>${job.title}</h3>
      <div class="company-location">${job.company} - ${job.location}</div>
      <p class="description">${job.description}</p>
      <button class="apply-button" data-job-index="${index}">Apply Now</button>
    `;
        jobListDiv.appendChild(jobDiv);
    });
}

// Toggle Form
toggleFormBtn.addEventListener("click", () => {
    if (addJobForm.style.display === "none") {
        addJobForm.style.display = "flex";
        toggleFormBtn.innerText = "– Hide Form";
    } else {
        addJobForm.style.display = "none";
        toggleFormBtn.innerText = "+ Add Job";
    }
});

// Add Job
addJobForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("job-title").value.trim();
    const company = document.getElementById("job-company").value.trim();
    const location = document.getElementById("job-location").value.trim();
    const description = document.getElementById("job-description").value.trim();

    if (title && company && location && description) {
        jobs.unshift({ title, company, location, description });
        displayJobs(jobs);
        addJobForm.reset();
        addJobForm.style.display = "none";
        toggleFormBtn.innerText = "+ Add Job";
        updateUIForLogin();
    }
});

// Modal Logic
const modal = document.getElementById("apply-modal");
const closeModal = document.querySelector(".close-button");
const applicationForm = document.getElementById("application-form");
let currentApplyButton = null;

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("apply-button")) {
        currentApplyButton = e.target;
        modal.style.display = "block";
    }
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Submit Application
applicationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("applicant-name").value.trim();
    const email = document.getElementById("applicant-email").value.trim();
    const contact = document.getElementById("applicant-contact").value.trim();
    const yoe = document.getElementById("applicant-yoe").value.trim();
    const skills = document.getElementById("applicant-skills").value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;

    if (!name || !email || !contact || !yoe || !skills) {
        alert("Please fill all fields!");
        return;
    }

    if (!emailPattern.test(email)) {
        alert("Invalid email!");
        return;
    }

    if (!phonePattern.test(contact)) {
        alert("Phone number must be 10 digits!");
        return;
    }

    alert(`Application submitted by ${name}`);
    if (currentApplyButton) {
        currentApplyButton.innerText = "Applied";
        currentApplyButton.disabled = true;
    }

    applicationForm.reset();
    modal.style.display = "none";
});

// Login
function updateUIForLogin() {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    toggleFormBtn.style.display = "inline-block";
    document.getElementById('auth-container').style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    displayJobs(jobs);
  } else {
    toggleFormBtn.style.display = 'none';
    addJobForm.style.display = 'none';
    toggleFormBtn.innerText = "+ Add Job";
    document.querySelectorAll('.apply-button').forEach(btn => {
      btn.style.display = 'none';
    });
    document.getElementById('auth-container').style.display = 'block';
    logoutBtn.style.display = 'none';
    jobListDiv.innerHTML = "";
  }
}

// Initial Setup
window.addEventListener("DOMContentLoaded", () => {
  updateUIForLogin();
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    displayJobs(jobs);
  }
});
