async function fetchGithubAPI() {
  profileCard.style.display = "none";
  // Array.from(profileCard.children).forEach((el) => {
  //   el.classList.toggle("skeleton");
  //   el.classList.toggle("skeleton-text");
  // });

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
  clearProfileCard();
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

function getUsername() {
  if (username.value.trim() !== "") {
    return username.value.trim();
  } else {
    alert("Please enter valid username");
    return "";
  }
}
