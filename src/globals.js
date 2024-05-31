let currentArtist = localStorage.getItem("currentArtist") ?? "";

export function getCurrentArtist() {
  return localStorage.getItem("currentArtist") ?? currentArtist;
}

export function setCurrentArtist(artist) {
  currentArtist = artist;
  localStorage.setItem("currentArtist", currentArtist);
}
