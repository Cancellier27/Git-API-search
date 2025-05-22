import {GitHubUser, GitHubRepo, Languages} from "./types"

// Clear DOM elements to initial state
function clearDOM() {
  const avatar = document.getElementById("avatar") as HTMLImageElement
  const nameLink = document.getElementById("name-link") as HTMLLinkElement
  const bioEl = document.getElementById("bio") as HTMLElement
  const locationEl = document.getElementById("location") as HTMLElement
  const companyEl = document.getElementById("company") as HTMLElement
  const followersEl = document.getElementById("followers") as HTMLElement
  const followingEl = document.getElementById("following") as HTMLElement
  const repoList = document.getElementById("repo-list") as HTMLUListElement
  const starredList = document.getElementById("starred-list") as HTMLUListElement

  avatar.src = ""
  nameLink.textContent = ""
  bioEl.textContent = ""
  locationEl.textContent = ""
  companyEl.textContent = ""
  followersEl.textContent = "Followers: 0"
  followingEl.textContent = "Following: 0"
  repoList.innerHTML = ""
  starredList.innerHTML = ""
}

// Populate the user tags
function populateUserProfile(user: GitHubUser) {
  const avatar = document.getElementById("avatar") as HTMLImageElement
  const nameLink = document.getElementById("name-link") as HTMLLinkElement
  const bioEl = document.getElementById("bio") as HTMLElement
  const locationEl = document.getElementById("location") as HTMLElement
  const companyEl = document.getElementById("company") as HTMLElement
  const followersEl = document.getElementById("followers") as HTMLElement
  const followingEl = document.getElementById("following") as HTMLElement

  avatar.src = user.avatar_url
  nameLink.textContent = user.name || "No name provided"
  nameLink.href = user.html_url
  bioEl.textContent = user.bio || ""
  locationEl.textContent = user.location || ""
  companyEl.textContent = user.company || ""
  followersEl.textContent = `Followers: ${user.followers}`
  followingEl.textContent = `Following: ${user.following}`
}

// Populate the lists, langData and starred
function populateLists(repos: GitHubRepo[], container: HTMLElement, type: string) {
  container.innerHTML = "" // Clear old content

  if (repos.length === 0) {
    // if there is no repos or no starred repos, create a card saying that no repos were found
    let message = type === "star" ? "starred " : ""

    const card = document.createElement("div")
    card.className = "repo-card"

    const link = document.createElement("a")
    link.href = "#"
    link.textContent = `No ${message}repositories found`

    card.appendChild(link)
    container.appendChild(card)
    return
  } else {
    repos.forEach((repo) => {
      // create card tag
      const card = document.createElement("div")
      card.className = "repo-card"

      // create link tag
      const link = document.createElement("a")
      link.href = repo.html_url
      link.textContent = repo.name
      link.target = "_blank"

      // create paragraph tag
      const date = document.createElement("p")
      // format the date to be like YYYY/MM/DD
      let lastUpdate = repo.updated_at.split("T")[0].split("-").join("/")
      date.textContent = lastUpdate

      // append both elements to card
      card.appendChild(link)
      card.appendChild(date)

      // append card to the main container
      container.appendChild(card)
    })
  }
}

// Populate the languages
async function populateLanguages(langData: Languages) {
  const languagesUList = document.getElementById("languages") as HTMLUListElement
  const languagesPlaceholder = document.querySelector(".languages-placeholder") as HTMLDivElement
  const languagesList = document.querySelector(".languages-list") as HTMLDivElement

  // reset DOM element
  languagesUList.innerHTML = ""
  // Hide previous list and show loading message
  languagesList.style.display = "none"
  languagesPlaceholder.style.display = "block"

  // append the languages in a tag elements
  if (Object.keys(langData.languages).length === 0) {
    let listEl = document.createElement("li")
    listEl.textContent = "No language used found"
    languagesUList.appendChild(listEl)
  } else {
    Object.entries(langData.languages)
      .sort()
      .forEach(([key, value]) => {
        let percentage: number = Math.round(100 * (value / langData.totalValue))

        // do not create any languages that are 0%
        if (percentage >= 1) {
          let listEl = document.createElement("li") as HTMLLIElement
          let langName = document.createElement("p") as HTMLParagraphElement
          let container = document.createElement("div") as HTMLDivElement
          let langBar = document.createElement("div") as HTMLDivElement
          let langPercentage = document.createElement("p") as HTMLParagraphElement

          langName.textContent = key
          langPercentage.textContent = `${percentage}%`

          langBar.style.width = `${percentage}%`

          langBar.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 80%)`

          langBar.classList.add("lang-bar")
          langPercentage.classList.add("lang-percentage")
          container.classList.add("lang-bar-container")

          container.appendChild(langBar)
          container.appendChild(langPercentage)
          listEl.appendChild(langName)
          listEl.appendChild(container)
          languagesUList.appendChild(listEl)
        }
      })
  }
  // show languages list and hid the loading message
  languagesPlaceholder.style.display = "none"
  languagesList.style.display = "block"

  return
}

export {clearDOM, populateUserProfile, populateLists, populateLanguages}
