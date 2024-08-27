let currentArtist = localStorage.getItem("currentArtist") ?? "";

export function getCurrentArtist() {
  return localStorage.getItem("currentArtist") ?? currentArtist;
}

export function setCurrentArtist(artist) {
  currentArtist = artist;
  localStorage.setItem("currentArtist", currentArtist);
}

// resolution

// elements
const banner = document.querySelector("#responsive-banner");
const overlay = document.querySelector("#overlay");

// Function to hide the banner and overlay
function hideBannerAndOverlay() {
  banner.style.display = "none";
  overlay.style.display = "none";
}

// Function to show the banner and overlay
function showBannerAndOverlay() {
  banner.style.display = "flex";
  overlay.style.display = "block";
}

// Function to check screen size and show/hide the banner accordingly
function checkScreenSize() {
  if (window.innerWidth <= 426) {
    hideBannerAndOverlay(); // Hide the banner if the screen is mobile-sized
  } else {
    showBannerAndOverlay(); // Show the banner if the screen is desktop-sized
  }
}

// Initialize the banner check on page load and window resize
window.addEventListener("load", checkScreenSize);
window.addEventListener("resize", checkScreenSize);

// Ensure banner state is managed globally
checkScreenSize();
