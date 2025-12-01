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
