import { items, itemTypes } from "../../data/data.js";
import { getCurrentArtist } from "../globals.js";

let localItems = [...items];

const filterPanel = document.querySelector(".filter-panel");
const itemsContainer = document.querySelector("#artist-card-container");

function saveItemsToLocalStorage() {
  localStorage.setItem("items", JSON.stringify(localItems));
}

function loadItemsFromLocalStorage() {
  const storedItems = localStorage.getItem("items");
  if (storedItems) {
    localItems = JSON.parse(storedItems);
  }
}

export function initArtistsItemsPage() {
  loadItemsFromLocalStorage();
  populateTypeSelect();
  const currentArtistName = getCurrentArtist();

  itemsContainer.innerHTML = "";

  localItems
    .filter((item) => item.artist === currentArtistName)
    .forEach((item, index) => {
      renderCard(item, index);
    });

  captureCamera();
}

function updateUI() {
  saveItemsToLocalStorage();
  initArtistsItemsPage();
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

// Function to render a card for an item
function renderCard(item) {
  const formattedDate = formatDate(item.dateCreated);

  const card = document.createElement("div");
  card.className = `card mb-3 border-0 font-color-dark-brown bg-color-light-light`;
  const publishButtonClass = item.isPublished ? "unpublish-btn" : "publish-btn";

  card.innerHTML = `
        <img src="${item.image}" class="card-img-top" alt="${item.title}">
        <div class="card-body px-3 py-2">
          <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
          <h5 class="card-title  m-0">${item.artist}</h5>
          <span class="mb-3"> ${formattedDate} </span>
          </div>
          <div class="price-tag mb-3 price-tag-dark">$${item.price}</div>
          </div>
          <p class="item-title mb-0">${item.title}</p>
          <p class="card-text">${item.description}</p>
        </div>
        <div class="items-buttons d-flex justify-content-between bg-color-dark p-3">
        <button class="auctionBtn" data-id="${item.id}">Send to Auction</button>
        <button class="${publishButtonClass}" 
        data-id="${item.id}" data-published="${item.isPublished}">
        ${item.isPublished ? "Unpublish" : "Publish"}
        </button>
        <button class="removeBtn" data-id="${item.id}">Remove</button>
        <button class="editBtn" data-id="${item.id}">Edit</button>
        </div>
      `;

  document.querySelector("#artist-card-container").appendChild(card);
}

itemsContainer.addEventListener("click", function (event) {
  const itemId = event.target.getAttribute("data-id");

  if (event.target.matches(".removeBtn")) {
    removeItem(itemId);
  }
  if (event.target.matches(".auctionBtn")) {
    sendToAuction(itemId);
  }
  if (event.target.matches(".publish-btn, .unpublish-btn")) {
    togglePublish(itemId);
  } else if (event.target.matches(".editBtn")) {
    editItem(itemId);
  }
});

function sendToAuction(id) {
  const ongoingAuction = localItems.some((item) => item.isAuctioning);

  if (ongoingAuction) {
    alert(
      "An auction is already ongoing. Cannot send this item to auction at this time."
    );
  } else {
    const item = localItems.find((item) => item.id === parseInt(id));
    if (item) {
      item.isAuctioning = true;
      alert(`Item ${item.title} sent to auction.`);
    }
  }
}

export function getAuctionItem() {
  return localItems.find((item) => item.isAuctioning);
}

function togglePublish(id) {
  const item = localItems.find((item) => item.id === parseInt(id));
  if (item) {
    item.isPublished = !item.isPublished;
    updateUI();
  }
}

function removeItem(id) {
  if (confirm("Are you sure you want to remove this item?")) {
    const index = localItems.findIndex((item) => item.id === parseInt(id));
    if (index !== -1) {
      localItems.splice(index, 1);
    }
  }
  updateUI();
}
function populateTypeSelect() {
  const selectElement = document.getElementById("type-input-select");
  selectElement.innerHTML = "";
  selectElement.appendChild(new Option("Choose", "", true, true));

  itemTypes.forEach((type) => {
    const option = new Option(type, type);
    selectElement.appendChild(option);
  });
}

function editItem(id) {
  const item = localItems.find((item) => item.id === parseInt(id));
  if (item) {
    document.querySelector("#isPublishedCheckbox").checked = item.isPublished;
    document.querySelector("#title-input").value = item.title;
    document.querySelector("#description-input").value = item.description;
    document.querySelector("#type-input-select").value = itemTypes;
    document.querySelector("#price-input").value = item.price;
    document.querySelector("#image-url-input").value = item.image;

    const capturedImageDisplay = document.querySelector(
      "#displayCapturedImage"
    );
    capturedImageDisplay.src = item.image;
    capturedImageDisplay.style.display = "block";

    filterPanel.classList.add("active");
    document.querySelector(".addNewItemBtn").classList.add("d-none");
    document.querySelector(".saveItemBtn").classList.remove("d-none");

    document.querySelector(".saveItemBtn").setAttribute("data-id", id);
  }

  const capturedImageDisplay = document.querySelector("#displayCapturedImage");
  capturedImageDisplay.src = "";
  capturedImageDisplay.style.display = "none";
  updateUI();
}

document.querySelector(".addNewItemBtn").addEventListener("click", function () {
  const capturedImageDisplay = document.querySelector("#displayCapturedImage");
  const imageSrc =
    capturedImageDisplay.style.display === "block"
      ? capturedImageDisplay.src
      : "default-image-url";

  const newItem = {
    id: Date.now(),
    title: document.getElementById("title-input").value,
    description: document.getElementById("description-input").value,
    type: document.getElementById("type-input-select").value,
    price: parseFloat(document.getElementById("price-input").value),
    image: imageSrc,
    isPublished: document.getElementById("isPublishedCheckbox").checked,
    artist: getCurrentArtist(),
    dateCreated: new Date().toISOString(),
  };

  localItems.push(newItem);
  updateUI();
  filterPanel.classList.remove("active");

  resetFormFields();
});

document.querySelector(".saveItemBtn").addEventListener("click", function () {
  const itemId = parseInt(this.getAttribute("data-id"));
  const item = localItems.find((item) => item.id === itemId);

  if (item) {
    item.title = document.getElementById("title-input").value;
    item.description = document.getElementById("description-input").value;
    item.price = parseFloat(document.getElementById("price-input").value);
    item.image = document.getElementById("image-url-input").value;
    item.type = document.getElementById("type-input-select").value;
    item.isPublished = document.getElementById("isPublishedCheckbox").checked;

    const capturedImageDisplay = document.querySelector(
      "#displayCapturedImage"
    );
    if (capturedImageDisplay.style.display === "block") {
      item.image = capturedImageDisplay.src;
    }

    saveItemsToLocalStorage();
    initArtistsItemsPage();

    filterPanel.classList.remove("active");
    capturedImageDisplay.src = "";
    capturedImageDisplay.style.display = "none";

    document.querySelector(".addNewItemBtn").classList.remove("d-none");
    document.querySelector(".saveItemBtn").classList.add("d-none");
  }
});

document.querySelector(".newItemInner").addEventListener("click", function () {
  document.getElementById("isPublishedCheckbox").checked = true;
  document.getElementById("title-input").value = "";
  document.getElementById("description-input").value = "";
  document.getElementById("type-input-select").selectedIndex = 0;
  document.getElementById("price-input").value = "";
  document.getElementById("image-url-input").value = "";

  filterPanel.classList.add("active");

  document.querySelector(".addNewItemBtn").classList.remove("d-none");
  document.querySelector(".saveItemBtn").classList.add("d-none");

  document.querySelector(".saveItemBtn").removeAttribute("data-id");
});

// Artist - New/Edit Item
document.querySelector(".newItemInner").addEventListener("click", function () {
  filterPanel.classList.add("active");
});

document.querySelector(".cancelBtn").addEventListener("click", function () {
  filterPanel.classList.remove("active");

  const capturedImageDisplay = document.querySelector("#displayCapturedImage");
  capturedImageDisplay.src = "";
  capturedImageDisplay.style.display = "none";
});

// Camera
const captureCamera = () => {
  const cameraContainer = document.querySelector(".camera-container");
  const cameraBtn = document.querySelector("#cameraBtn");
  const liveStreamVideo = document.querySelector("#liveStream");
  const captureStreamCanvas = document.querySelector("#captureCanvas");
  const capturedImageImg = document.querySelector("#capturedImage");
  const capturedImageDisplay = document.querySelector("#displayCapturedImage");

  cameraBtn.addEventListener("click", function () {
    cameraContainer.classList.add("active");
  });

  const captureImageBtn = document.querySelector("#captureImageBtn");

  // navigor MDN
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: {
          ideal: "environment",
        },
      },
    })
    .then((stream) => {
      liveStreamVideo.srcObject = stream;
    })
    .catch((err) => {
      console.log(err);
    });

  liveStreamVideo.addEventListener("canplay", function () {
    captureStreamCanvas.width = liveStreamVideo.videoWidth;
    captureStreamCanvas.height = liveStreamVideo.videoHeight;
  });

  captureImageBtn.addEventListener("click", function () {
    const ctx = captureStreamCanvas.getContext("2d");
    ctx.drawImage(liveStreamVideo, 0, 0);

    const imgUrl = captureStreamCanvas.toDataURL("image/png");
    console.log(imgUrl);
    capturedImageImg.src = imgUrl;
  });

  captureImageBtn.addEventListener("click", function () {
    const ctx = captureStreamCanvas.getContext("2d");
    ctx.drawImage(liveStreamVideo, 0, 0);

    const imgUrl = captureStreamCanvas.toDataURL("image/png");
    capturedImageDisplay.src = imgUrl;
    capturedImageDisplay.style.display = "block";

    cameraContainer.classList.remove("active");
  });
};
