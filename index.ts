import {GitHubRepo, Data} from "./src/types"
import {fetchData} from "./src/fetch-data"
import {
  clearDOM,
  populateUserProfile,
  populateLists,
  populateLanguages
} from "./src/dom-manipulation"

// DOM elements
const form = document.getElementById("search-form") as HTMLFormElement
const filterRepo = document.getElementById("repo-filter") as HTMLSelectElement
const filterStar = document.getElementById(
  "starred-filter"
) as HTMLSelectElement
const usernameInput = document.getElementById(
  "username-input"
) as HTMLInputElement
const results = document.getElementById("results") as HTMLBodyElement
const userNotFound = document.getElementById(
  "user-not-found-container"
) as HTMLElement
const repoList = document.getElementById("repo-list") as HTMLUListElement
const starredList = document.getElementById("starred-list") as HTMLUListElement
const loading = document.querySelector(".loader-container") as HTMLDivElement

form.addEventListener("submit", async (e: Event) => submitButton(e))

filterRepo.addEventListener("change", (e: Event) => sortRepos(e))

filterStar.addEventListener("change", (e: Event) => sortStars(e))

async function submitButton(e: Event) {
  e.preventDefault()
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
    populateLists(data.reposData, repoList, "repo")
    populateLists(data.starredData, starredList, "star")
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
  if (!e.target) return
  const filter = (e.target as HTMLSelectElement).value
  let repos = JSON.parse(localStorage.getItem("reposData") || "[]")

  if (filter === "newest") {
    repos.sort(function (a: GitHubRepo, b: GitHubRepo): number {
      let date_A: number = new Date(a.updated_at).getTime()
      let date_B: number = new Date(b.updated_at).getTime()
      return date_B - date_A
    })
  }

  if (filter === "oldest") {
    repos.sort(function (a: GitHubRepo, b: GitHubRepo): number {
      let date_A: number = new Date(a.updated_at).getTime()
      let date_B: number = new Date(b.updated_at).getTime()
      return date_A - date_B
    })
  }

  populateLists(repos, repoList, "repo")
}

function sortStars(e: Event) {
  if (!e.target) return
  const filter = (e.target as HTMLSelectElement).value
  let star = JSON.parse(localStorage.getItem("starredData") || "[]")

  if (filter === "newest") {
    star.sort(function (a: GitHubRepo, b: GitHubRepo): number {
      let date_A: number = new Date(a.updated_at).getTime()
      let date_B: number = new Date(b.updated_at).getTime()
      return date_B - date_A
    })
  }

  if (filter === "oldest") {
    star.sort(function (a: GitHubRepo, b: GitHubRepo): number {
      let date_A: number = new Date(a.updated_at).getTime()
      let date_B: number = new Date(b.updated_at).getTime()
      return date_A - date_B
    })
  }

  populateLists(star, starredList, "star")
}

function testSum(a: number, b: number) {
  return a + b
}

export {submitButton, sortRepos, sortStars, testSum}