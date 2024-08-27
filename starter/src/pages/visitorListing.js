// Import items from the data module
import { items, itemTypes } from "../../data/data.js";
// console.log(itemTypes);

// Select the container for the visitor listing cards
const container = document.querySelector("#visitorListingCardContainer");

// // Selectors
const filterPanel = document.getElementById("filterPanell");
const closeFilterBtn = document.getElementById("closeFilterBtn");
const itemTitleInput = document.querySelector("#item-input");
const artistInput = document.querySelector("#artist-input-select");
const minPriceInput = document.querySelector("#min-price-input");
const maxPriceInput = document.querySelector("#max-price-input");
const typeInput = document.querySelector("#type-input-selectt");

// Function to initialize the visitor listing page
export function initVisitorListing() {
  // Load the items from local storage
  const storedItems = localStorage.getItem("items");
  const localItems = storedItems ? JSON.parse(storedItems) : items;

  const publishedItems = localItems.filter((item) => item.isPublished);

  container.innerHTML = "";

  publishedItems.forEach((item, index) => {
    renderCard(item, index);
  });
}

// Function to render a card for an item
function renderCard(item, idx) {
  const isDark = idx % 2 === 0;
  const bgColorClass = isDark ? "bg-color-dark" : "bg-color-light-light";
  const fontColorClass = isDark ? "font-color-light" : "font-color-dark-brown";
  const priceBgColorClass = isDark ? "price-tag-light" : "price-tag-dark";

  const card = document.createElement("div");
  card.className = `card mb-3 border-0 ${fontColorClass} ${bgColorClass}`;

  card.innerHTML = `
      <img src="${item.image}" class="card-img-top" alt="${item.title}">
      <div class="card-body py-1 ">
        <div class="d-flex justify-content-between align-items-center">
        <h1 class="card-title reenie-font">${item.artist}</h1>
        <div class="price-tag mb-3 ${priceBgColorClass}">$${item.price}</div>
        </div>
        <p class="item-title mb-0">${item.title}</p>
        <p class="card-text">${item.description}</p>
      </div>
    `;

  container.appendChild(card);
}

// Event Listeners
document.getElementById("filterIcon").addEventListener("click", function () {
  filterPanel.classList.add("active");
});

closeFilterBtn.addEventListener("click", function () {
  filterPanel.classList.remove("active");
});

// Function to populate the type select input
function populateTypeSelect() {
  itemTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    typeInput.appendChild(option);
  });
}

// Function to apply the filters
function applyFilters() {
  const localItems = JSON.parse(localStorage.getItem("items")) || items;

  const title = itemTitleInput.value.toLowerCase();
  const artist = artistInput.value;
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
  const type = typeInput.value;

  const filteredItems = localItems.filter((item) => {
    const matchesTitle =
      title === "" || item.title.toLowerCase().includes(title);
    const matchesArtist = artist === "" || item.artist === artist;
    const withinPriceRange = item.price >= minPrice && item.price <= maxPrice;
    const matchesType = type === "" || item.type === type;

    return (
      item.isPublished &&
      matchesTitle &&
      matchesArtist &&
      withinPriceRange &&
      matchesType
    );
  });

  container.innerHTML = "";
  filteredItems.forEach((item, index) => {
    renderCard(item, index);
  });

  filterPanel.classList.remove("active");
}

document
  .querySelector(".apply-filters-btn")
  .addEventListener("click", applyFilters);

async function populateArtistSelect() {
  // Fetch artists data
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const artists = await response.json();

  // Populate the artist input select
  artists.forEach((artist) => {
    const option = document.createElement("option");
    option.value = artist.name;
    option.textContent = artist.name;
    artistInput.appendChild(option);
  });
}

closeFilterBtn.addEventListener("click", function () {
  filterPanel.classList.remove("active");

  typeInput.value = "";

  itemTitleInput.value = "";
  artistInput.value = "";
  minPriceInput.value = "";
  maxPriceInput.value = "";
  initVisitorListing();
});

window.onload = () => {
  initVisitorListing();
  populateArtistSelect();
  populateTypeSelect();
};
