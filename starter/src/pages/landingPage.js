// Import necessary functions or variables from other modules if needed
import { setCurrentArtist } from "../globals.js";

// Querying the DOM elements
const asVisitorBtn = document.querySelector("#visitorOption");
const artistsSelect = document.querySelector("#artistsSelect");

// Function to fetch users and populate the artist selection dropdown
async function getUsers() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await res.json();

    const userList = (users ?? []).map((user) => user.name);

    userList.forEach((user) => {
      artistsSelect.innerHTML += `<option value="${user}">${user}</option>`;
    });

    artistsSelect.addEventListener("change", (e) => {
      const selectedArtist = e.currentTarget.value;
      setCurrentArtist(selectedArtist);
      location.hash = "#artistsHomePage";
    });
  } catch (error) {
    console.log(error);
  }
}

// Function to handle visitor option selection
function handleAsVisitor() {
  location.hash = "#visitorHomePage";
}

// Function to clear the artist options from the dropdown
function clearArtistOptions() {
  const options = document.querySelectorAll(
    "#artistsSelect option:not([value='Choose'])"
  );
  options.forEach((option) => option.remove());
}

// Function to initialize the landing page
export function initLandingPage() {
  asVisitorBtn.addEventListener("click", handleAsVisitor);
  getUsers();
  clearArtistOptions();
}
