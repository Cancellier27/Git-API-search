import {GITHUB_TOKEN} from "../token.js"
import {GitHubUser, GitHubRepo, Languages} from "./types"

export function cacheData(
  data: GitHubUser | GitHubRepo[] | Languages,
  type: string
): void {
  if (type === "userData") {
    localStorage.setItem("userData", JSON.stringify(data))
  } else if (type === "reposData") {
    localStorage.setItem("reposData", JSON.stringify(data))
  } else if (type === "starredData") {
    localStorage.setItem("starredData", JSON.stringify(data))
  } else if (type === "languages") {
    localStorage.setItem("langData", JSON.stringify(data))
  } else {
    throw new Error("No data to be stored in LocalStorage!")
  }

  // store the last cache time in the localStorage
  let lastCacheTime = new Date()
  localStorage.setItem(
    "expirationTime",
    JSON.stringify(lastCacheTime.getTime())
  )
}

export async function fetchWithToken(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json"
    }
  })
}

// clear the localStorage after 60 minutes
function clearLocalStorage(num: number) {
  let myInterval: number = num * 60 * 1000 // interval
  let lastCacheTime: number = JSON.parse(
    localStorage.getItem("expirationTime") || "0"
  )

  if (lastCacheTime === 0) return

  let timeNow = new Date()
  if (timeNow.getTime() - lastCacheTime > myInterval) {
    // more time has passed, so clean the localStorage
    console.log("localStorage cleaned")
    localStorage.clear()
  }
}

// if reloads the page after 30min, the localStorage is cleaned
document.addEventListener("DOMContentLoaded", () => clearLocalStorage(30))
