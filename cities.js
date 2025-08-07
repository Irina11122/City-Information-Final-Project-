const apiURL = "https://6894fe76be3700414e151a1e.mockapi.io/cities";
let cities = [];
let countriesArray = ["all"];
let timezonesArray = ["All"];
const storageKey = "loggedIn";

async function myData() {
  const response = await fetch(apiURL);
  const data = await response.json();
  cities = data;
  console.log("Loaded cities:", cities);
  return data;
}

const citiesRow = document.getElementById("citiesRow");

function showCity(cityList) {
  if (!citiesRow) return console.error("citiesRow element not found!");
  citiesRow.innerHTML = "";

  cityList.forEach((item) => {
    citiesRow.innerHTML += `
      <div class="col-lg-3 col-md-6">
        <div class="card h-100 text-center">
          <div class="card-header"><h4>${item.cityName}</h4></div>
          <div class="card-body">
            <img class="img" src="${item.image}" alt="${item.cityName}" />
            <h5>${item.countryName}</h5>
            <p>${item.timeZone}</p>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#cityModal" onclick="showCityModal(${item.id})">
              See description
            </button>
          </div>
        </div>
      </div>`;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  cities = await myData();
  showCity(cities);

  const user = JSON.parse(localStorage.getItem(storageKey));
  const loginNameTitle = document.getElementById("loginNameTitle");
  if (!user) return (window.location.href = "./index.html");
  loginNameTitle.textContent = `Welcome, ${user.firstName}`;

  const timezoneSelect = document.getElementById("timezoneSelect");
  const countrySelect = document.getElementById("countrySelect");

  // Unique country and timezone lists
  const uniqueCountries = [...new Set(cities.map((c) => c.countryName))];
  countriesArray = ["all", ...uniqueCountries];

  countriesArray.forEach((countryItem) => {
    const option = document.createElement("option");
    option.value = countryItem;
    option.innerHTML = countryItem;
    countrySelect.appendChild(option);
  });

  countrySelect.addEventListener("change", (event) => {
    const selected = event.target.value;
    sessionStorage.setItem("country", selected);
    const filtered =
      selected === "all"
        ? cities
        : cities.filter((c) => c.countryName === selected);
    showCity(filtered);
  });

  const uniqueTimezones = [...new Set(cities.map((c) => c.timeZone))];
  timezonesArray = ["All", ...uniqueTimezones];

  timezonesArray.forEach((timezoneItem) => {
    const option = document.createElement("option");
    option.value = timezoneItem;
    option.innerHTML = timezoneItem;
    timezoneSelect.appendChild(option);
  });

  timezoneSelect.addEventListener("change", (event) => {
    const selected = event.target.value;
    sessionStorage.setItem("timezone", selected);
    const filtered =
      selected === "All"
        ? cities
        : cities.filter((c) => c.timeZone === selected);
    showCity(filtered);
  });

  const savedCountry = sessionStorage.getItem("country");
  if (savedCountry) countrySelect.value = savedCountry;

  const savedTimezone = sessionStorage.getItem("timezone");
  if (savedTimezone) timezoneSelect.value = savedTimezone;

  if (savedCountry && savedCountry !== "all") {
    showCity(cities.filter((c) => c.countryName === savedCountry));
  } else if (savedTimezone && savedTimezone !== "All") {
    showCity(cities.filter((c) => c.timeZone === savedTimezone));
  } else {
    showCity(cities);
  }

  document
    .getElementById("descriptionSearch")
    .addEventListener("keyup", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filtered = cities.filter((city) =>
        city.description.toLowerCase().includes(searchTerm)
      );
      showCity(filtered);
    });

  document.getElementById("submitBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    const city = {
      cityName: document.getElementById("cityName").value,
      countryName: document.getElementById("countryName").value,
      timeZone: document.getElementById("timeZone").value,
      image: document.getElementById("image").value,
      zipCode: document.getElementById("zipCode").value,
      description: document.getElementById("description").value,
    };

    try {
      await fetch(apiURL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(city),
      });

      cities = await myData();
      showCity(cities);
      const msg = document.getElementById("addCityMessage");
      msg.innerText = "City Created!";
      msg.style.color = "green";
    } catch (err) {
      alert("There is an Error.");
    }
  });

  document.getElementById("logOutBtn").addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    window.location.href = "index.html";
  });
});
