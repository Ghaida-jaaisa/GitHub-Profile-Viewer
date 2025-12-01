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
