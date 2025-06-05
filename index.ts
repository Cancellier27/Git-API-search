import {GitHubRepo, Data} from "./src/types.js"
import {fetchData, formatReposForPagination} from "./src/fetch-data.js"
import {clearDOM, populateUserProfile, populateLists, populateLanguages} from "./src/dom-manipulation.js"

function startListeners(): void {
  // get DOM elements
  const form = (document.getElementById("search-form") as HTMLFormElement) || null
  const filterRepo = (document.getElementById("repo-filter") as HTMLSelectElement) || null
  const filterStar = (document.getElementById("starred-filter") as HTMLSelectElement) || null

  if (form) {
    form.addEventListener("submit", async (e: Event) => submitButton(e))
  }

  if (filterRepo) {
    filterRepo.addEventListener("change", (e: Event) => sortRepos(e))
  }

  if (filterStar) {
    filterStar.addEventListener("change", (e: Event) => sortStars(e))
  }
}

async function submitButton(e: Event) {
  e.preventDefault()

  // get DOM elements
  const userNotFound = (document.getElementById("user-not-found-container") as HTMLElement) || null
  const loading = (document.querySelector(".loader-container") as HTMLDivElement) || null
  const results = (document.getElementById("results") as HTMLBodyElement) || null
  const usernameInput = (document.getElementById("username-input") as HTMLInputElement) || null
  const repoList = (document.getElementById("repo-list") as HTMLUListElement) || null
  const starredList = (document.getElementById("starred-list") as HTMLUListElement) || null

  try {
    clearDOM()
    // hide the previous search UI
    userNotFound.style.display = "none"
    results.style.display = "none"
    // show loading message for the hole component
    loading.style.display = "flex"
    // get username input and return if none was inserted
    const username = usernameInput.value.trim()
    if (!username) return

    // check if there is any data in the localStorage
    let data: Data
    const cachedUserData = localStorage.getItem("userData")
    if (cachedUserData && JSON.parse(cachedUserData).login === username) {
      // get data from "cache"
      console.log("getting data from localStorage")
      data = {
        userData: JSON.parse(cachedUserData),
        reposData: JSON.parse(localStorage.getItem("reposData") || "[]"),
        starredData: JSON.parse(localStorage.getItem("starredData") || "[]"),
        langData: JSON.parse(localStorage.getItem("langData") || "{}")
      }
    } else {
      // fetch the data from API
      data = await fetchData(username)
    }

    // run functions to populate the DOM
    populateUserProfile(data.userData)
    populateLists(data.reposData, repoList, "repo", 0)
    populateLists(data.starredData, starredList, "star", 0)
    populateLanguages(data.langData)

    // show the results on screen
    loading.style.display = "none"
    userNotFound.style.display = "none"
    results.style.display = "block"
  } catch (error) {
    loading.style.display = "none"
    userNotFound.style.display = "flex"
    console.error("Error fetching data!", error)
  }
}

function sortRepos(e: Event) {
  // get DOM elements
  const repoList = (document.getElementById("repo-list") as HTMLUListElement) || null

  if (!e.target) return
  const filter = (e.target as HTMLSelectElement).value
  let reposUnFormatted: GitHubRepo[] = []

  JSON.parse(localStorage.getItem("reposData") || "[]").forEach((item: GitHubRepo[]) => {
    reposUnFormatted.push(...item)
  })

  if (filter === "newest") {
    reposUnFormatted.sort(function (a: GitHubRepo, b: GitHubRepo): number {
      let date_A: number = new Date(a.updated_at).getTime()
      let date_B: number = new Date(b.updated_at).getTime()
      return date_B - date_A
    })
  } else if (filter === "oldest") {
    reposUnFormatted.sort(function (a: GitHubRepo, b: GitHubRepo): number {
      let date_A: number = new Date(a.updated_at).getTime()
      let date_B: number = new Date(b.updated_at).getTime()
      return date_A - date_B
    })
  } else {
    return
  }

  // format repos to the 12 items format
  const repos: GitHubRepo[][] = formatReposForPagination(reposUnFormatted)

  // upload new repos list to the localstorage
  // ...

  populateLists(repos, repoList, "repo", 0)
  return repos
}

function sortStars(e: Event) {
  // get DOM elements
  const starredList = (document.getElementById("starred-list") as HTMLUListElement) || null

  if (!e.target) return
  const filter = (e.target as HTMLSelectElement).value
  let starUnFormatted: GitHubRepo[] = []

  JSON.parse(localStorage.getItem("starredData") || "[]").forEach((item: GitHubRepo[]) => {
    starUnFormatted.push(...item)
  })

  if (filter === "newest") {
    starUnFormatted.sort(function (a: GitHubRepo, b: GitHubRepo): number {
      let date_A: number = new Date(a.updated_at).getTime()
      let date_B: number = new Date(b.updated_at).getTime()
      return date_B - date_A
    })
  } else if (filter === "oldest") {
    starUnFormatted.sort(function (a: GitHubRepo, b: GitHubRepo): number {
      let date_A: number = new Date(a.updated_at).getTime()
      let date_B: number = new Date(b.updated_at).getTime()
      return date_A - date_B
    })
  } else {
    return
  }

  // format repos to the 12 items format
  const star: GitHubRepo[][] = formatReposForPagination(starUnFormatted)

  populateLists(star, starredList, "star", 0)
  return star
}

// start app
startListeners()

export {startListeners, submitButton, sortRepos, sortStars}
