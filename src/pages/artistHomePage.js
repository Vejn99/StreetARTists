import { items } from "../../data/data.js";
import { getCurrentArtist } from "../globals.js";
import { generateDateLabels, formatDate } from "../utils/dates.js";
import { getAuctionItem } from "./artistsItemsPage.js";

export function initArtistHomePage() {
  const currentArtist = getCurrentArtist(); 
  const artistItems = items.filter((item) => item.artist === currentArtist); 
  const salesData = calculateSalesData(artistItems);

  updateAuctionDisplay();

  
  document.querySelector(
    "#soldItems"
  ).textContent = `${salesData.totalItemsSold}`;
  document.querySelector("#totalItems").textContent = `${artistItems.length}`;
  document.querySelector(
    "#totalIncome"
  ).textContent = `${salesData.totalIncome}`;

 
  updateChart(7);
  document.querySelector("#last7").classList.add("active"); 

 
  function removeActiveClass() {
    document.querySelectorAll(".chart-buttons button").forEach((button) => {
      button.classList.remove("active");
    });
  }

  function updateAuctionDisplay() {
    const auctionItem = getAuctionItem();

    const auctionInfoElement = document.querySelector(".auction-info"); 
    if (auctionItem) {
     
      auctionInfoElement.innerHTML = `      
    <p class="text-capitalize pt-2 m-0">Live auctioning item</p>
    <h1 class="liveAuctioningItem pb-2 m-0">$${auctionItem.price}</h1>
    <p id="currentBid">current bid</p>
    `;
    } else {
     
      auctionInfoElement.innerHTML = `<p class="my-5">No item in auction</p>`;
    }
  }


  document.querySelector("#last7").addEventListener("click", function () {
    removeActiveClass();
    this.classList.add("active");
    updateChart(7);
  });

  document.querySelector("#last14").addEventListener("click", function () {
    removeActiveClass();
    this.classList.add("active");
    updateChart(14);
  });

  document.querySelector("#last30").addEventListener("click", function () {
    removeActiveClass();
    this.classList.add("active");
    updateChart(30);
  });
}

function calculateSalesData(artistItems) {
  let totalItemsSold = 0;
  let totalIncome = 0;

  artistItems.forEach((item) => {
    if (item.dateSold) {
      totalItemsSold++;
      totalIncome += item.priceSold;
    }
  });

  return {
    totalItemsSold,
    totalIncome,
  };
}

function updateChart(days) {
  const labels = generateDateLabels(days);
  const data = calculateChartData(labels, days);

  const ctx = document.getElementById("myChart").getContext("2d");


  if (window.myChartInstance) {
    window.myChartInstance.destroy();
  }

  window.myChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Amount",
          data: data,
          backgroundColor: "#a16a5e",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
        },
      },
    },
  });
}

function calculateChartData(labels, days) {
 
  const data = new Array(days).fill(0);
  const currentArtist = getCurrentArtist();
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  items
    .filter((item) => {
      const dateSold = new Date(item.dateSold);
      return (
        item.artist === currentArtist &&
        dateSold >= startDate &&
        dateSold <= endDate
      );
    })
    .forEach((item) => {
      const dateSold = new Date(item.dateSold);
      const label = formatDate(dateSold.getTime());
      const index = data.findIndex((_, i) => labels[i] === label);
      if (index !== -1) {
        data[index] += item.priceSold;
      }
    });

  return data;
}

initArtistHomePage();
