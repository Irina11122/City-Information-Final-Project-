const apiUSERS = "https://6894fe76be3700414e151a1e.mockapi.io/users";
const loginBtn = document.getElementById("loginBtn");

export async function loginForm(event) {
  event.preventDefault();

  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const loginEmailError = document.getElementById("loginEmailError");
  const loginPasswordError = document.getElementById("loginPasswordError");

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  let allIsValid = true;

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    loginEmailError.innerText = "";
  } else {
    loginEmailError.innerText = "Invalid email format";
    allIsValid = false;
  }

  if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
    loginPasswordError.innerText = "";
  } else {
    loginPasswordError.innerText =
      "Invalid password. Minimum 8 chars, at least one letter and one number";
    allIsValid = false;
  }

  if (!allIsValid) return; // Stop if validation failed

  try {
    const response = await fetch(apiUSERS);
    if (!response.ok) throw new Error("Network response not ok");

    const users = await response.json();

    // Case-insensitive email check, exact password match
    const user = users.find(
      (u) => u.email.toLowerCase() === email && u.password === password
    );

    if (user) {
      localStorage.setItem("loggedIn", JSON.stringify(user));
      window.location.href = "cities.html";
    } else {
      loginPasswordError.innerText = "Invalid email or password";
    }
  } catch (error) {
    alert("Error fetching users: " + error.message);
  }
}

loginBtn.addEventListener("click", () => {
  document.getElementById("content").style.display = "none";
});
