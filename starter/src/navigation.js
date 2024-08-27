export function setupNavigation() {
  const navIcon = document.querySelector(".navIcon");
  const navMenu = document.querySelector(".navMenu");
  const navLinks = document.querySelectorAll(".navMenu a");

  navIcon.addEventListener("click", () => {
    navMenu.classList.toggle("hamburger-active");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("hamburger-active")) {
        navMenu.classList.toggle("hamburger-active");
      }
    });
  });
}
