import { setCurrentArtist } from "../globals.js";

const asVisitorBtn = document.querySelector("#visitorOption");
const artistsSelect = document.querySelector("#artistsSelect");

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

function handleAsVisitor() {
  location.hash = "#visitorHomePage";
}

function clearArtistOptions() {
  const options = document.querySelectorAll(
    "#artistsSelect option:not([value='Choose'])"
  );
  options.forEach((option) => option.remove());
}

export function initLandingPage() {
  asVisitorBtn.addEventListener("click", handleAsVisitor);
  getUsers();
  clearArtistOptions();
}
