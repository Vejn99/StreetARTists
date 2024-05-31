import { setupNavigation } from "./src/navigation.js";
import { getCurrentArtist } from "./src/globals.js";
import { initLandingPage } from "./src/pages/landingPage.js";
import { initArtistHomePage } from "./src/pages/artistHomePage.js";
import { initArtistsItemsPage } from "./src/pages/artistsItemsPage.js";
import { initVisitorHomePage } from "./src/pages/visitorHomePage.js";
import { initVisitorListing } from "./src/pages/visitorListing.js";
import { initAuctionPage } from "./src/pages/auctionPage.js";

// Header elements
const elements = {
  logo: document.querySelector("#mainLogo"),
  menuIcon: document.querySelector(".navIcon"),
  auctionIcon: document.querySelector(".auction-icon"),
  headerText: document.querySelector("header h2"),
  navMenu: document.querySelector(".navMenu"),
};

// Page header configurations
const headerConfigs = {
  "#landingPage": {
    logo: false,
    menuIcon: false,
    auctionIcon: false,
    navMenu: false,
    text: "Street ARTists",
  },
  "#artistsHomePage": {
    logo: true,
    menuIcon: true,
    auctionIcon: false,
    navMenu: true,
    text: () => getCurrentArtist(),
  },
  "#artistsItemsPage": {
    logo: true,
    menuIcon: true,
    auctionIcon: false,
    navMenu: true,
    text: () => getCurrentArtist(),
  },
  "#visitorHomePage": {
    logo: true,
    menuIcon: false,
    auctionIcon: true,
    navMenu: false,
    text: "Street ARTists",
  },
  "#visitorListing": {
    logo: true,
    menuIcon: false,
    auctionIcon: true,
    navMenu: false,
    text: "Street ARTists",
  },
  "#auctionPage": {
    logo: true,
    menuIcon: false,
    auctionIcon: true,
    navMenu: false,
    text: "Auction",
  },
};

// Generic function to set header state
function setHeaderState(config) {
  elements.logo.style.display = config.logo ? "block" : "none";
  elements.menuIcon.style.display = config.menuIcon ? "block" : "none";
  elements.auctionIcon.style.display = config.auctionIcon ? "block" : "none";
  elements.navMenu.style.display = config.navMenu ? "block" : "none";
  elements.headerText.textContent =
    typeof config.text === "function" ? config.text() : config.text;
}

// navigation
setupNavigation();

// router
function handleRouter() {
  const hash = location.hash === "" ? "#landingPage" : location.hash; // #landingPage

  const allPages = document.querySelectorAll(".page");
  allPages.forEach((page) => (page.style.display = "none"));

  document.querySelector(hash).style.display = "block";

  // Set header state based on the current page
  const headerConfig = headerConfigs[hash];
  if (headerConfig) {
    setHeaderState(headerConfig);
  } else {
    console.error("error");
  }

  switch (hash) {
    case "#landingPage":
      initLandingPage();
      break;

    case "#artistsHomePage":
      initArtistHomePage();
      break;

    case "#artistsItemsPage":
      initArtistsItemsPage();
      break;

    case "#visitorHomePage":
      initVisitorHomePage();
      break;

    case "#visitorListing":
      initVisitorListing();
      break;

    case "#auctionPage":
      initAuctionPage();
      break;

    default:
      break;
  }
}

window.addEventListener("hashchange", handleRouter);
window.addEventListener("load", handleRouter);
