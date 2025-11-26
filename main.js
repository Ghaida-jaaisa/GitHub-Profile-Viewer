const profile = document.getElementById("profile");
const fetchBtn = document.getElementById("fetchBtn");
const username = document.getElementById("username");
const profileImg = document.getElementsByClassName("profile-img")[0];
// Card Info
const cardName = document.getElementById("name");
const cardBio = document.getElementById("bio");
const cardCompany = document.getElementById("company");
const cardfollowers = document.getElementById("followers");
const cardfollowing = document.getElementById("following");
const cardlocation = document.getElementById("location");
const userData = document.getElementById("userData");
const form = document.getElementsByTagName("form");

let lastUserFetched;

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("latestRequest");
  if (saved) {
    const latestRequest = JSON.parse(saved);
    username.value = latestRequest["login"];
    renderProfile(latestRequest);
  } else {
    // first time
    userData.style.display = "none";
  }
});

fetchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // fetchUserData();
  fetchGithubAPI();
});

function getUsername() {
  if (username.value.trim() !== "") {
    return username.value.trim();
  } else {
    alert("Please enter valid username");
    return "";
  }
}

async function fetchGithubAPI() {
  let username = getUsername();
  if (username === "") {
    userData.style.display = "none";
    return;
  }
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
    .catch((err) => console.error("Error while fetching data:", err.message));
}

function renderProfile(data) {
  userData.style.display = "";
  let cardInfo = {
    avatar_url: "",
    name: "",
    bio: "",
    company: "",
    followers: 0,
    following: 0,
    location: "",
  };
  console.log("cardInfo:", cardInfo);
  Object.entries(data).forEach(([key, value]) => {
    let requiredData = [
      "name",
      "bio",
      "company",
      "followers",
      "following",
      "location",
      "public_repos",
      "avatar_url",
      "repos_url",
    ];
    if (requiredData.includes(key)) {
      cardInfo[key] = value;
    } else {
      return; // skip non-essential keys
    }
    if (key === "repos_url") {
      renderRepos(value);
    }
  });
  renderCard(cardInfo);
}

function renderAvatar(src) {
  console.log("img loading");
  profileImg.src = src;
}

function renderCard({
  avatar_url,
  name,
  bio,
  company,
  followers,
  following,
  location,
}) {
  resetCardInfo();
  renderAvatar(avatar_url);
  cardName.textContent = name;
  cardBio.textContent = bio;
  cardCompany.textContent = company;
  cardfollowers.lastChild.textContent += followers;
  cardfollowing.lastChild.textContent += following;
  cardlocation.textContent += location;
}

async function fetchGithubRepos(url) {
  try {
    console.log("Start Fetch repos");
    const result = await fetch(url);
    if (!result.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = result.json();
    return data;
  } catch (err) {
    console.error("Error occurred while fetching repos:", err.message);
  }
}

function resetCardInfo() {
  cardName.textContent = "";
  cardBio.textContent = "";
  cardCompany.textContent = "";
  cardfollowers.lastChild.textContent = "";
  cardfollowing.lastChild.textContent = "";
  cardlocation.textContent = "";
}

function buildRepoCard({ name, description, stargazers_count, svn_url }) {
  // recieve string data
  const item = document.createElement("div");
  item.classList.add("profile-repo");
  const title = document.createElement("h3");
  title.textContent = name;
  //
  const desc = document.createElement("p");
  desc.textContent = description;
  //
  const info = document.createElement("div");
  info.classList.add("info");
  // Star
  const starContainer = document.createElement("div");
  starContainer.classList.add("starContainer");
  const starIcon = document.createElement("img");
  starIcon.src = "star-solid-full.svg";
  const star = document.createElement("span");
  star.textContent = "Star";
  const starCount = document.createElement("span");
  starCount.classList.add("starCount"); // handle in css
  starCount.textContent = stargazers_count;
  // View repo

  const viewBtn = document.createElement("button");
  viewBtn.classList.add("Repobtn", "liquid");
  const viewRepo = document.createElement("a");
  viewRepo.classList.add("repo_link");
  viewRepo.textContent = "Visit Repo";
  viewRepo.href = svn_url;
  viewRepo.target = "_blank";
  viewBtn.appendChild(viewRepo);
  //
  starContainer.append(starIcon);
  starContainer.append(star);
  starContainer.append(starCount);
  //
  info.append(starContainer);
  info.append(viewBtn);
  //
  item.append(title);
  item.append(description);
  item.append(info);

  return item;
}
async function renderRepos(url) {
  let data = await fetchGithubRepos(url);
  const repoInfo = {
    name: "",
    description: "",
    stargazers_count: 0,
    svn_url: "",
  };

  let requiredData = ["name", "svn_url", "description", "stargazers_count"];
  Object.entries(data).forEach(([key, value]) => {
    Object.entries(value).forEach(([key, value]) => {
      if (requiredData.includes(key)) {
        repoInfo[key] = value ?? ""; // handle null desc value
      }
    });
    console.log(repoInfo);
    let card = buildRepoCard(repoInfo);
    profile.append(card);
  });
}
