const form = document.getElementById("search-form") as HTMLFormElement
const usernameInput = document.getElementById(
  "username-input"
) as HTMLInputElement

const results = document.getElementById("results") as HTMLBodyElement
const userNotFound = document.getElementById("user-not-found") as HTMLElement
const avatar = document.getElementById("avatar") as HTMLImageElement
const nameLink = document.getElementById("name-link") as HTMLLinkElement
const bioEl = document.getElementById("bio") as HTMLElement
const locationEl = document.getElementById("location") as HTMLElement
const companyEl = document.getElementById("company") as HTMLElement
const followersEl = document.getElementById("followers") as HTMLElement
const followingEl = document.getElementById("following") as HTMLElement
const repoList = document.getElementById("repo-list") as HTMLUListElement
const starredList = document.getElementById("starred-list") as HTMLUListElement

interface GitHubUser {
  avatar_url: string
  name: string
  bio: string
  location: string
  company: string
  followers: number
  following: number
  html_url: string
}

interface GitHubRepo {
  name: string
  html_url: string
  updated_at: string
}

form.addEventListener("submit", async (event: Event) => {
  try {
    event.preventDefault()
    // hide the previous search UI
    results.style.display = "none"
    // get username input and return is none was inserted
    const username = usernameInput.value.trim()
    if (!username) return

    clearData()

    // fetch all information separately
    const [userResponse, reposResponse, starredResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos`),
      fetch(`https://api.github.com/users/${username}/starred`)
    ])

    if (!userResponse.ok) {
      // show error message
      userNotFound.style.display = "flex"
      throw new Error("User not found")
    }

    // get json data from the responses
    const userData: GitHubUser = await userResponse.json()
    const reposData: GitHubRepo[] = await reposResponse.json()
    const starredData: GitHubRepo[] = await starredResponse.json()

    // run functions to populate the DOM
    populateUserProfile(userData)
    populateLists(reposData, repoList, "repo")
    populateLists(starredData, starredList, "star")

    // show the results on screen
    userNotFound.style.display = "none"
    results.style.display = "block"
  } catch (error) {
    console.error("Error fetching data!", error)
  }
})

// clear DOM elements
function clearData() {
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
  avatar.src = user.avatar_url
  nameLink.textContent = user.name || "No name provided"
  bioEl.textContent = user.bio || ""
  locationEl.textContent = user.location || ""
  companyEl.textContent = user.company || ""
  followersEl.textContent = `Followers: ${user.followers}`
  followingEl.textContent = `Following: ${user.following}`
  nameLink.href = user.html_url
}

function populateLists(
  repos: GitHubRepo[],
  container: HTMLElement,
  type: string
) {
  container.innerHTML = "" // Clear old content

  // sort the repos array from newest to oldest
  const sortedRepos = repos.sort(function(a: GitHubRepo, b: GitHubRepo): number {
    let date_A: number = new Date(a.updated_at).getTime()
    let date_B: number = new Date(b.updated_at).getTime()
    return date_B - date_A
  })

  if (sortedRepos.length === 0) {
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
    sortedRepos.forEach((repo) => {
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


