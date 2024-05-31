import { getAuctionItem } from "./artistsItemsPage.js";

export function initAuctionPage() {
  const noAuctionDiv = document.querySelector(".noAuction");
  const auctionDetailsDiv = document.querySelector(".auctionInner");
  const auctionTimerDiv = document.getElementById("time");
  const auctionTimer = document.getElementById("timeRemaining");
  const bidButton = document.querySelector(".bidBtn");
  const bidInput = document.querySelector(".bidInput");
  const auctionStartingPrice = document.querySelector(".auctionStartingPrice");
  const auctionImage = document.querySelector(".auctionImage");
  const auctionArtistName = document.querySelector(".auctionArtistName");
  const auctionTitle = document.querySelector(".auctionTitle");
  const auctionDescription = document.querySelector(".auctionDescription");
  const yourBidsList = document.querySelector(".yourBids");
  const otherBidsList = document.querySelector(".otherBids");
  const endpoint = "https://jsonplaceholder.typicode.com/users";

  let timer = null;
  let timeRemaining = 120; // Auction duration in seconds
  let currentBid = 0; // Track the current highest bid

  const auctionItem = getAuctionItem();
  if (auctionItem) {
    setupAuctionItem(auctionItem);
  } else {
    displayNoAuctionState();
  }

  function setupAuctionItem(item) {
    auctionImage.src = item.image;
    auctionArtistName.textContent = item.artist;
    auctionTitle.textContent = item.title;
    auctionDescription.textContent = item.description;
    auctionStartingPrice.textContent = `${item.price}`;

    auctionDetailsDiv.classList.remove("d-none");
    noAuctionDiv.classList.add("d-none");
  }

  function displayNoAuctionState() {
    auctionDetailsDiv.classList.add("d-none");
    noAuctionDiv.classList.remove("d-none");
  }

  function setupBidding() {
    bidButton.addEventListener("click", function (event) {
      event.preventDefault();

      if (isUserAnArtist()) {
        return;
      }

      const bidAmount = parseFloat(bidInput.value);
      if (!bidAmount || bidAmount <= currentBid) {
        alert("Your bid must be higher than the current bid.");
        return;
      }

      currentBid = bidAmount;
      updateBiddingLists(bidAmount);
      processBid(bidAmount);

      if (!timer) {
        initializeTimer();
      }
    });
  }

  function updateBiddingLists(bidAmount) {
    yourBidsList.innerHTML += `<li>$${bidAmount}</li>`;
  }

  function initializeTimer() {
    updateTimerDisplay();
    timer = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        timer = null;
        handleAuctionEnd();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    auctionTimer.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  function handleAuctionEnd() {
    bidButton.disabled = true;
  }

  function processBid(bidAmount) {
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bidAmount }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isBidding) {
          currentBid = data.bidAmount;
          auctionStartingPrice.textContent = `$${data.bidAmount}`;
        } else {
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        bidButton.disabled = false;
      });
  }

  setupBidding(); // Initialize the bidding setup
}
