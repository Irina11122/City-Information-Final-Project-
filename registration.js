const usersAPI = "https://66c4c5c0b026f3cc6cf0a1d8.mockapi.io/api/users";
const registrationBtn = document.getElementById("registrationBtn");
const video = document.getElementById("videoBg");
window.addEventListener("click", () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
});

document
  .getElementById("registrationModal")
  .addEventListener("hidden.bs.modal", () => {
    video.play();
    document.getElementById("content").style.display = "flex";
  });
document
  .getElementById("loginModal")
  .addEventListener("hidden.bs.modal", () => {
    video.play();
    document.getElementById("content").style.display = "flex";
  });
const registerSubmit = document.getElementById("registrationSubmitBtn");

import { loginForm } from "./login.js";

registerSubmit.addEventListener("click", async (e) => {
  e.preventDefault();
  const firstNameInput = document.getElementById("firstNameInput").value;
  const firstNameError = document.getElementById("firstNameError");
  const lastNameInput = document.getElementById("lastNameInput").value;
  const lastNameError = document.getElementById("lastNameError");
  const emailInput = document.getElementById("emailInput").value;
  const emailError = document.getElementById("emailError");
  const phoneNumberInput = document.getElementById("phoneNumberInput").value;
  const phoneNumberError = document.getElementById("phoneNumberError");
  const passwordInput = document.getElementById("passwordInput").value;
  const passwordError = document.getElementById("passwordError");
  let allIsValid = true;

  if (Number(firstNameInput) || !firstNameInput) {
    firstNameError.innerText = "The first name is not valid. Please try again";
    allIsValid = false;
  } else {
    firstNameError.innerText = "";
  }
  if (Number(lastNameInput) || !lastNameInput) {
    lastNameError.innerText = "The last name is not valid. Please try again.";
    allIsValid = false;
  } else {
    lastNameError.innerText = "";
  }
  if (!emailInput.match(/[^\s@]+@[^\s@]+\.[^\s@]+/gi)) {
    emailError.innerText = "The email is not valid. Please try again.";
    allIsValid = false;
  } else {
    emailError.innerText = "";
  }
  if (
    !phoneNumberInput.match(
      /^(\+?\d{1,4}[-.\s]?)?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})$/
    )
  ) {
    phoneNumberError.innerText = "The phone number is incorrect";
  } else {
    phoneNumberError.innerText = "";
  }
  if (!passwordInput.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
    passwordError.innerText = `The password is incorrect.Please try again. There must be:                  
                  At Least 8 characters
                  One Upper Letter
                  One Number.
                  `;
    allIsValid = false;
  } else {
    passwordError.innerText = "";
  }

  if (allIsValid) {
    const data = {
      firstName: firstNameInput,
      lastName: lastNameInput,
      email: emailInput,
      password: passwordInput,
      phoneNumber: phoneNumberInput,
    };

    const response = await fetch(usersAPI, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
    document.getElementById("registrationForm").reset();
    document.getElementById("successMessage").innerText =
      "Registration Successful!";
    document.getElementById("successMessage").style.color = "rgb(30, 148, 30)";
  }
});
document.getElementById("loginSubmit").addEventListener("click", loginForm);
registrationBtn.addEventListener("click", () => {
  document.getElementById("content").style.display = "none";
});
