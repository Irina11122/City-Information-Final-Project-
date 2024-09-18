const apiUSERS = "https://66c4c5c0b026f3cc6cf0a1d8.mockapi.io/api/users";
const loginBtn = document.getElementById("loginBtn");
export async function loginForm(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const loginEmailError = document.getElementById("loginEmailError");
  const loginPasswordError = document.getElementById("loginPasswordError");

  let allIsValid = true;
  if (email.match(/[^\s@]+@[^\s@]+\.[^\s@]+/gi)) {
    loginEmailError.innerText = "";
  } else {
    loginEmailError.innerText = "Invalid";
    allIsValid = false;
  }

  if (password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
    loginPasswordError.innerText = "";
  } else {
    loginPasswordError.innerText = "Invalid";
    allIsValid = false;
  }

  if (allIsValid) {
    try {
      const response = await fetch(apiUSERS);
      const result = await response.json();

      const users = result.find(
        (user) => user.email === email && user.password === password
      );

      if (users) {
        localStorage.setItem("loggedIn", JSON.stringify(users));
        window.location.href = "cities.html";
      } else {
        loginPasswordError.innerText = "Invalid";
      }
    } catch (error) {
      alert("Error!");
    }
  }
}

loginBtn.addEventListener("click", () => {
  document.getElementById("content").style.display = "none";
});
