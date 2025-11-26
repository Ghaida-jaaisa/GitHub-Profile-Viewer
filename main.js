let profile = document.getElementById("profile");
let fetchBtn = document.getElementById("fetchBtn");
let username = document.getElementById("username");
let profileImg = document.getElementsByClassName("profile-img")[0];
let cardName = document.getElementById("name");
let cardBio = document.getElementById("bio");
let cardCompany = document.getElementById("company");
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
  let cardInfo = { name: "", bio: "", company: "" };
  console.log("cardInfo:", cardInfo);
  Object.entries(data).forEach(([key, value]) => {
    // skip non-nessesary items
    if (value === null || value === "") {
      return;
    }
    if (key === "avatar_url") {
      renderAvatar(value);
      // return;
    }
    if (key === "name" || key === "bio" || key === "company") {
      cardInfo[key] = value;
    }
    let item = document.createElement("div");
    item.classList.add("profile-details-item");
    if (key.includes("url")) {
      item.innerHTML = `<b>${key}:</b><a href = ${value} target='_blank'>${value}</a>`;
    } else {
      item.innerHTML = `<b>${key}:</b> ${value}`;
    }
    profile.appendChild(item);
  });
  renderCard(cardInfo);
}

function renderAvatar(src) {
  console.log("img loading");
  profileImg.src = src;
}

function renderCard({ name, bio, company }) {
  console.log(name, bio, company);
  cardName.textContent = name;
  cardBio.textContent = bio;
  cardCompany.textContent = company;
}
