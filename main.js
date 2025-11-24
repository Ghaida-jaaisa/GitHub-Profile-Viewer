let profile = document.getElementById("profile");
let fetchBtn = document.getElementById("fetchBtn");
let username = document.getElementById("username");
let lastUserFetched;

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("latestRequest");
  if (saved) {
    const latestRequest = JSON.parse(saved);
    profile.innerHTML = latestRequest.json();
  }
});

function getUsername() {
  if (username.value != null) {
    return username.value;
  } else {
    alert("Please enter valid username");
    return;
  }
}

fetchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // fetchUserData();
  fetchGithubAPI();
});

async function fetchGithubAPI() {
  let username = getUsername();
  // Don't re-send new request for the same user
  if (lastUserFetched == username) {
    console.log("Request cancelled");
    return;
  }
  // Clear
  profile.innerHTML = "";
  let url = `https://api.github.com/users/${username}`;
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      Object.entries(data).forEach(([key, value]) => {
        let item = document.createElement("div");
        item.classList.add("profile-card-item");
        item.innerHTML = `<b>${key}</b>: ${value}`;

        profile.appendChild(item);
        lastUserFetched = username;
        localStorage.setItem("latestRequest", JSON.stringify(data));
      });
    })
    .catch((err) => console.error("Error while fetching data"));
}
