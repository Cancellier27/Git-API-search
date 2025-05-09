// Define DOM elements
const form = document.getElementById("search-form") as HTMLFormElement
const usernameInput = document.getElementById(
  "username-input"
) as HTMLInputElement

const results = document.getElementById("results") as HTMLBodyElement
const userNotFound = document.getElementById("user-not-found") as HTMLElement
const avatar = document.getElementById("avatar") as HTMLImageElement
const nameEl = document.getElementById("name") as HTMLElement
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
}

interface GitHubRepo {
  name: string
  html_url: string
}

form.addEventListener("submit", async (event: Event) => {
  try {
    event.preventDefault()
    results.style.display = "none"
    const username = usernameInput.value.trim()
    if (!username) return

    clearData()

    const [userRes, reposRes, starredRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos`),
      fetch(`https://api.github.com/users/${username}/starred`)
    ])

    if (!userRes.ok) {
      // show error message
      userNotFound.style.display = "flex"
      throw new Error("User not found")
    }

    const userData: GitHubUser = await userRes.json()
    const reposData: GitHubRepo[] = await reposRes.json()
    const starredData: GitHubRepo[] = await starredRes.json()

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

function clearData() {
  avatar.src = ""
  nameEl.textContent = ""
  bioEl.textContent = ""
  locationEl.textContent = ""
  companyEl.textContent = ""
  followersEl.textContent = "Followers: 0"
  followingEl.textContent = "Following: 0"
  repoList.innerHTML = ""
  starredList.innerHTML = ""
}

function populateUserProfile(user: GitHubUser) {
  avatar.src = user.avatar_url
  nameEl.textContent = user.name || "No name provided"
  bioEl.textContent = user.bio || ""
  locationEl.textContent = user.location || ""
  companyEl.textContent = user.company || ""
  followersEl.textContent = `Followers: ${user.followers}`
  followingEl.textContent = `Following: ${user.following}`
}

function populateLists(
  repos: GitHubRepo[],
  container: HTMLElement,
  type: string
) {
  container.innerHTML = "" // Clear old content

  if (repos.length === 0) {
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
      const card = document.createElement("div")
      card.className = "repo-card"

      const link = document.createElement("a")
      link.href = repo.html_url
      link.textContent = repo.name
      link.target = "_blank"

      card.appendChild(link)
      container.appendChild(card)
    })
  }
}
