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
let Cardtemplate, SkeletonProfileCardtemplate; // to avoid loading problems

document.addEventListener("DOMContentLoaded", () => {
  Cardtemplate = document.getElementById("repo-card");
  SkeletonProfileCardtemplate = document.getElementById(
    "skeleton-profile-repo"
  );

  const saved = localStorage.getItem("latestRequest");
  if (saved) {
    const latestRequest = JSON.parse(saved);
    username.value = latestRequest["login"];
    renderProfile(latestRequest);
  } else {
    // first time
    userData.style.display = "none"; // no data ta display
  }
});

fetchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  fetchGithubAPI();
});

upChevron.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
