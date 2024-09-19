document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const signUpForm = document.getElementById("signUpForm");
    const signUpLink = document.getElementById("signUpLink");
    const loginLink = document.getElementById("loginLink");

    // Switch to Sign Up Form
    signUpLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.style.display = "none";
        signUpForm.style.display = "block";
    });

    // Switch to Login Form
    loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        signUpForm.style.display = "none";
        loginForm.style.display = "block";
    });

    // Handle Sign Up
    signUpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newUsername = document.getElementById("newUsername").value;
        const newPassword = document.getElementById("newPassword").value;

        // Check if username already exists
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        if (existingUsers.some(user => user.username === newUsername)) {
            alert("Username already exists. Please choose another one.");
            return;
        }

        // Store new user in local storage
        existingUsers.push({ username: newUsername, password: newPassword });
        localStorage.setItem("users", JSON.stringify(existingUsers));

        alert("Account created successfully! Please login.");
        signUpForm.style.display = "none";
        loginForm.style.display = "block";
    });

    // Handle Login
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            alert("Login successful!");
            window.location.href = "dashboard.html"; // Redirect to the dashboard page
        } else {
            alert("Invalid username or password. Please try again.");
        }
    });
});
