const profile = document.getElementById("profile");
const fetchBtn = document.getElementById("fetchBtn");
const username = document.getElementById("username");
const profileImg = document.getElementsByClassName("profile-img")[0];
// Card Info
const profileCard = document.getElementById("profile-card");
const cardName = document.getElementById("name");
const cardBio = document.getElementById("bio");
const cardCompany = document.getElementById("company");
const cardfollowers = document.getElementById("followers");
const cardfollowing = document.getElementById("following");
const cardlocation = document.getElementById("location");
const userData = document.getElementById("userData");
const form = document.getElementsByTagName("form");
//
const upChevron = document.getElementById("up-chevron");
let publicRepoCount = 0;
let lastUserFetched;
let Cardtemplate, SkeletonProfileCardtemplate;

document.addEventListener("DOMContentLoaded", () => {
  Cardtemplate = document.getElementById("repo-card");

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
  profileCard.style.display = "none";
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

  /// NEW REQUEST
  // Clear
  clearRepoSection();
  profileCard.style.display = "";

  try {
    const url = `https://api.github.com/users/${username}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found");
      }
      throw new Error("Something went wrong, try again later");
    }

    const data = await response.json();

    renderProfile(data);
    lastUserFetched = username;
    localStorage.setItem("latestRequest", JSON.stringify(data));

    profile.innerHTML = "";
  } catch (error) {
    profile.innerHTML = `<p>${error.message}</p>`;
    profile.classList.toggle("error");
    profile.style.gridColumn = "1/3";
    profileCard.style.display = "none";
  }
}

function renderProfile(data) {
  userData.style.display = "";
  let cardInfo = {
    avatar_url: "",
    name: "",
    login: "",
    bio: "",
    company: "",
    followers: 0,
    following: 0,
    location: "",
  };
  // console.log("cardInfo:", cardInfo);
  let requiredData = [
    "name",
    "login",
    "bio",
    "company",
    "followers",
    "following",
    "location",
    "public_repos",
    "avatar_url",
    "repos_url",
  ];

  // Need Re-factoring -- no need for this loop
  Object.entries(data).forEach(([key, value]) => {
    if (requiredData.includes(key)) {
      cardInfo[key] = value;
    } else {
      return; // skip non-essential keys
    }
    if (key === "repos_url") {
      renderRepos(value);
    }
    if (key === "public_repos") {
      publicRepoCount = value;
    }
  });
  renderCard(cardInfo);
}

function renderAvatar(src) {
  profileImg.src = src;
}

function renderCard({
  avatar_url,
  name,
  login,
  bio,
  company,
  followers,
  following,
  location,
}) {
  resetCardInfo();
  renderAvatar(avatar_url);
  cardName.textContent = name ?? login;
  cardBio.textContent = bio ?? "";
  cardCompany.textContent = company ?? "";
  cardfollowers.querySelector(".number").textContent = followers;
  cardfollowing.querySelector(".number").textContent = following;
  if (location || location !== null) {
    cardlocation.textContent += location;
  } else {
    document.getElementById("location-info").style.display = "none";
  }
}

async function fetchGithubRepos(url) {
  try {
    console.log("Start Fetch repos");
    const result = await fetch(url);
    if (!result.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await result.json();
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
  const card = Cardtemplate.content.cloneNode(true);

  card.querySelector(".repo-title").textContent = name;
  card.querySelector(".repo-desc").textContent = description;
  card.querySelector(".starCount").textContent = stargazers_count;

  const link = card.querySelector(".repo_link");
  link.href = svn_url;

  return card;
}

async function renderRepos(url) {
  clearRepoSection();
  showSkeleton();
  let data = await fetchGithubRepos(url);
  let RepoCountEle = buildRepoCountElement(publicRepoCount);
  profile.appendChild(RepoCountEle);
  removeSkeleton();
  const repoInfo = {
    name: "",
    description: "",
    stargazers_count: 0,
    svn_url: "",
  };
  let requiredData = ["name", "svn_url", "description", "stargazers_count"];
  Object.entries(data).forEach(([key, value]) => {
    // Retrieve needed values
    Object.entries(value).forEach(([key, value]) => {
      if (requiredData.includes(key)) {
        repoInfo[key] = value ?? ""; // handle null desc value
      }
    });
    let card = buildRepoCard(repoInfo);
    profile.append(card);
  });
}

function showSkeleton() {
  SkeletonProfileCardtemplate = document.getElementById(
    "skeleton-profile-repo"
  );
  const templateContent = SkeletonProfileCardtemplate.content;
  const count = 2;
  for (let i = 1; i <= count; i++) {
    const clone = templateContent.cloneNode(true);
    profile.appendChild(clone);
  }
}

function removeSkeleton() {
  const skeltons = document.querySelectorAll(".skeleton-profile-repo");
  skeltons.forEach((skel) => skel.remove());
}

upChevron.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

function buildRepoCountElement(count) {
  const container = document.createElement("div");
  container.id = "publicReposCount";

  const title = document.createElement("h2");
  title.textContent = "Public Repos:";

  const number = document.createElement("p");
  number.classList.add("repoCount");
  number.textContent = count;

  container.appendChild(title);
  container.appendChild(number);

  return container;
}

function clearRepoSection() {
  profile.querySelectorAll(".profile-repo").forEach((r) => r.remove()); // clear profile with affech skeleton
  profile.querySelectorAll("#publicReposCount").forEach((r) => r.remove());
}
