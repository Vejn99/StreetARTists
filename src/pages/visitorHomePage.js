export function initVisitorHomePage() {
  // Event listener for image clicks
  const movingImages = document.querySelectorAll(".slide-img");
  movingImages.forEach((ev) => {
    ev.addEventListener("click", () => {
      location.hash = "#visitorListing";
    });
  });
}
