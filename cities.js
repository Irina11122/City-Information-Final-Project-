const apiURL = "https://66c4c5c0b026f3cc6cf0a1d8.mockapi.io/api/cities";
let cities = [];
let countriesArray = ["all"];
let timezonesArray = ["All"];
const storageKey = "loggedIn";
async function myData() {
  const response = await fetch(apiURL);
  const data = await response.json();
  cities = data;
  console.log(cities);
  return data;
}
const citiesRow = document.getElementById("citiesRow");
document.addEventListener("DOMContentLoaded", async () => {
  cities = await myData();
  showCity(cities);
  const getFromStorage = localStorage.getItem(storageKey);
  const user = JSON.parse(getFromStorage);
  const loginNameTitle = document.getElementById("loginNameTitle");
  if (user) {
    loginNameTitle.textContent = `Welcome, ${user.firstName}  `;
  } else {
    window.location.href = "./index.html";
  }
  const timezoneSelect = document.getElementById("timezoneSelect");
  const countrySelect = document.getElementById("countrySelect");
  function countryOption() {
    cities.forEach((country) => {
      countriesArray.push(country.countryName);
    });

    countriesArray.forEach((countryItem) => {
      const option = document.createElement("option");
      option.value = countryItem;
      option.innerHTML = countryItem;
      countrySelect.appendChild(option);
    });

    document
      .getElementById("countrySelect")
      .addEventListener("change", (country) => {
        const selectedCountry = country.target.value;
        if (selectedCountry === "all") {
          showCity(cities);
        } else {
          const filteredCities = cities.filter(
            (city) => city.countryName === selectedCountry
          );

          showCity(filteredCities);
        }
        sessionStorage.setItem("country", selectedCountry);
      });
    cities.forEach((timezone) => {
      timezonesArray.push(timezone.timeZone);
    });

    timezonesArray.forEach((timezoneItem) => {
      const option = document.createElement("option");
      option.value = timezoneItem;
      option.innerHTML = timezoneItem;
      timezoneSelect.appendChild(option);
    });
    timezoneSelect.addEventListener("change", (cityTimezone) => {
      const selectedTimezone = cityTimezone.target.value;
      if (selectedTimezone == "All") {
        showCity(cities);
      } else {
        const filteredTimezone = cities.filter(
          (c) => c.timeZone === selectedTimezone
        );
        showCity(filteredTimezone);
      }
      sessionStorage.setItem("timezone", selectedTimezone);
    });
    const savedCountry = sessionStorage.getItem("country");
    if (savedCountry) {
      countrySelect.value = savedCountry;
      const filteredCountries = cities.filter(
        (city) => city.countryName === savedCountry
      );
      showCity(filteredCountries);
      console.log(savedCountry);
    }
    if (savedCountry === "all") {
      showCity(cities);
    }
  }
  const savedTimezone = sessionStorage.getItem("timezone");
  if (savedTimezone) {
    timezoneSelect.value = savedTimezone;
    const filteredSavedTimezone = cities.filter(
      (t) => t.timeZone === savedTimezone
    );
    showCity(filteredSavedTimezone);
  }
  if (savedTimezone === "All") {
    showCity(cities);
  }
  countryOption();

  document.getElementById("descriptionSearch").addEventListener("keyup", () => {
    const searchWord = descriptionSearch.value;
    descriptionSearch.innerHTML = "";

    const filteredCitiesDescriptions = cities.filter((city) => {
      const descriptionFilter = city.description.toLowerCase();
      return descriptionFilter.includes(searchWord);
    });
    showCity(filteredCitiesDescriptions);
  });

  document.getElementById("submitBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    const cityName = document.getElementById("cityName").value;
    const countryName = document.getElementById("countryName").value;
    const timeZone = document.getElementById("timeZone").value;
    const image = document.getElementById("image").value;
    const description = document.getElementById("description").value;
    const zipCode = document.getElementById("zipCode").value;

    try {
      const data = {
        cityName: cityName,
        countryName: countryName,
        timeZone: timeZone,
        image: image,
        zipCode: zipCode,
        description: description,
      };

      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const myResponse = await fetch(apiURL);
      const result = await myResponse.json();
      const cities = result;
      showCity(cities);
      document.getElementById("addCityMessage").innerText = "City Created!";
      document.getElementById("addCityMessage").style.color = "green";
    } catch (error) {
      alert("There is an Error.");
    }
  });

  document.getElementById("logOutBtn").addEventListener("click", () => {
    window.location.href = "index.html";
    localStorage.removeItem(storageKey);
  });
});

function showCity(city) {
  citiesRow.innerHTML = "";
  city.forEach((item) => {
    citiesRow.innerHTML += `        <div class="col-lg-3 col-md-6">
          <div class="card h-100 text-center">
            <div class="card-header"><h4> ${item.cityName} </h4></div>
            <div class="card-body"><div><img class="img" src="${item.image}" alt="${item.cityName}" /></div>
              
              <h5> ${item.countryName} </h5>
              <p> ${item.timeZone} </p> 
            </div>
            <div class="card-footer"><button       type="button"
      class="btn btn-outline-light"
      data-bs-toggle="modal"
      data-bs-target="#cityModal" onclick="showCityModal(${item.id})">See description</button></div>
          </div>
        </div>`;
  });
}

async function showCityModal(cityId) {
  const city = cities.find((item) => item.id == cityId);
  const cityModalBody = document.getElementById("cityModalBody");
  const modalFooter = document.getElementById("modalFooter");
  const modalHeader = document.getElementById("modalHeader");
  cityModalBody.innerHTML = `<img class="h-100 w-100 rounded-2" src="${city.image}" alt="${city.cityName}" /><h1> ${city.countryName} </h1> <p> ${city.description} </p>   <p> The Zip Code of <span class="text-success fw-bold"> ${city.cityName} </span>: <strong> ${city.zipCode} </strong> </p> <p> Timezone : <strong> ${city.timeZone} </strong>  `;

  modalFooter.innerHTML = `<button class="btn btn-danger me-2" id="deleteBtn"> Delete </button><button class="btn btn-warning" id="editBtn"> Edit </button> `;
  modalHeader.innerHTML = `<h2> ${city.cityName} </h2>`;

  document.getElementById("deleteBtn").addEventListener("click", async () => {
    const response = await fetch(`${apiURL}/${city.id}`, {
      method: "DELETE",
    });
    await myData();
    showCity(cities);
    cityModalBody.innerHTML = "";
    cityModalBody.innerHTML = `</p> <p id="deleteMessage"> </p>`;
    document.getElementById("deleteMessage").innerText =
      "You Succesfully Deleted this City!";
    modalFooter.innerHTML = "";

    document.getElementById("deleteMessage").style.color = "green";
    document.getElementById("deleteMessage").style.fontWeight = "bold";
    setTimeout(() => {
      const hideCityModal = document.getElementById("cityModal");
      const modal = bootstrap.Modal.getInstance(hideCityModal);
      modal.hide();
    }, 1000);
  });

  document.getElementById("editBtn").addEventListener("click", async () => {
    cityModalBody.innerHTML = "";
    cityModalBody.innerHTML += `<div class="mb-3"><p>Edit City Name:
      <input id="cityNameEditedInput" class="form-control text-danger" value="${city.cityName}"></p> </div>
    <p> Edit Country Name: <input id="countryNameEditedInput" class="form-control text-danger" value="${city.countryName}"> </p>
    <p> Edit Timezone: <input id="timezoneEditedInput" class="form-control text-danger " value="${city.timeZone}"> </p>
    <p> Edit Zip Code: <input id="zipcodeEditedInput" class="form-control text-danger" value="${city.zipCode}"> </p>
    <p> Edit description <input id="descriptionEditedInput" class="form-control text-danger" placeholder="Type new description here"></p>
    <p> Edit description <input id="imageEditedInput" class="form-control text-danger" value="${city.image}"></p>
    `;
    modalFooter.innerHTML = "";
    modalFooter.innerHTML += `<button class="btn btn-outline-success" id="savedEditBtn" > Save Changes </button>`;
    console.log("click");
    document
      .getElementById("savedEditBtn")
      .addEventListener("click", async () => {
        console.log("edit btn click");
        const updatedCity = {
          cityName: document.getElementById("cityNameEditedInput").value,
          countryName: document.getElementById("countryNameEditedInput").value,
          timeZone: document.getElementById("timezoneEditedInput").value,
          zipCode: document.getElementById("zipcodeEditedInput").value,
          description: document.getElementById("descriptionEditedInput").value,
          image: document.getElementById("imageEditedInput").value,
        };
        const response = await fetch(`${apiURL}/${city.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCity),
        });
        await myData();
        cityModalBody.innerHTML = "";
        cityModalBody.innerHTML += ` <h4 class="text-success"> You successfuly edited this content. </h4> `;
        modalFooter.innerHTML = "";
        showCity(cities);
        setTimeout(() => {
          const hideCityModal = document.getElementById("cityModal");
          const modal = bootstrap.Modal.getInstance(hideCityModal);
          modal.hide();
        }, 1000);
      });
  });
}
