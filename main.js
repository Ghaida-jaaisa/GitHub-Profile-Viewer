let profile = document.getElementById("profile");
let fetchBtn = document.getElementById("fetchBtn");
let username = document.getElementById("username");
let lastUserFetched;

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("latestRequest");
  if (saved) {
    const latestRequest = JSON.parse(saved);
    renderProfile(latestRequest);
  }
});

function getUsername() {
  if (username.value.trim() !== "") {
    return username.value.trim();
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
      if (data.message === "Not Found") {
        profile.innerHTML = "<p>User not found</p>";
        return;
      }
      renderProfile(data);
      lastUserFetched = username;
      localStorage.setItem("latestRequest", JSON.stringify(data));
    })
    .catch((err) => console.error("Error while fetching data"));
}

function renderProfile(data) {
  Object.entries(data).forEach(([key, value]) => {
    let item = document.createElement("div");
    item.classList.add("profile-card-item");
    if (key.includes("url")) {
      item.innerHTML = `<div><b>${key}</b>: <a href = ${value} target='_blank'>${value}</a></div>`;
    } else {
      item.innerHTML = `<div><b>${key}</b>: ${value}</div>`;
    }

    profile.appendChild(item);
  });
}

let avatar = document.createElement("img");
avatar.src = "user-icon-vector-profile-solid.webp";

document.getElementsByClassName("avatar").innerHTML = avatar;
