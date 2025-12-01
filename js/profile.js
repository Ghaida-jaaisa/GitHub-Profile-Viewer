function renderAvatar(src) {
  profileImg.src = src;
}

function resetCardInfo() {
  cardName.textContent = "";
  cardBio.textContent = "";
  cardCompany.textContent = "";
  cardfollowers.lastChild.textContent = "";
  cardfollowing.lastChild.textContent = "";
  cardlocation.textContent = "";
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
