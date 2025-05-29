import {cacheData, fetchWithToken} from "./tools.js"
import {GitHubUser, GitHubRepo, Languages} from "./types.js"

export async function fetchData(username: string) {
  console.log("fetching user data from API")

  // DOM elements
  const userNotFound = document.getElementById("user-not-found") as HTMLElement

  // fetch all information separately
  const [userResponse, reposResponse, starredResponse] = await Promise.all([
    fetchWithToken(`https://api.github.com/users/${username}`),
    fetchWithToken(`https://api.github.com/users/${username}/repos`),
    fetchWithToken(`https://api.github.com/users/${username}/starred`)
  ])

  if (!userResponse.ok) {
    // show error message
    userNotFound.style.display = "flex"
    throw new Error("User not found")
  }
  if (!reposResponse.ok) {
    // show error message
    console.warn("Could not fetch repositories")
  }
  if (!starredResponse.ok) {
    // show error message
    console.warn("Could not fetch starred repositories")
  }

  // get json data from the responses
  const userData: GitHubUser = await userResponse.json()
  const reposDataNotFormatted: GitHubRepo[] = reposResponse.ok ? await reposResponse.json() : []
  const starredDataNotFormatted: GitHubRepo[] = starredResponse.ok ? await starredResponse.json() : []

  // fetch Languages
  const langData = await cacheLanguages(reposDataNotFormatted)

  // format repos for pagination
  const reposData = formatReposForPagination(reposDataNotFormatted)
  const starredData = formatReposForPagination(starredDataNotFormatted)

  // clean local storage
  localStorage.clear()

  // add new data to local storage
  cacheData(userData, "userData") //user data
  cacheData(reposData, "reposData") // repos data
  cacheData(starredData, "starredData") // starred repos data
  cacheData(langData, "languages") // used languages data

  return {userData, reposData, starredData, langData}
}

export function formatReposForPagination(reposDataNotFormatted: GitHubRepo[]): GitHubRepo[][] {
  // format repos for pagination
  let repoInnerArr: GitHubRepo[] = []
  const reposData: GitHubRepo[][] = []

  reposDataNotFormatted.forEach((item) => {
    if (repoInnerArr.length === 12) {
      reposData.push(repoInnerArr)
      repoInnerArr = []
    }
    repoInnerArr.push(item)
  })
  reposData.push(repoInnerArr)

  return reposData
}

export async function cacheLanguages(repos: GitHubRepo[]): Promise<Languages> {
  let totalValue: number = 0
  const languages: {[key: string]: number} = {}
  for (const repo of repos) {
    try {
      const response = await fetchWithToken(repo.languages_url)

      if (!response.ok) {
        console.warn(`Could not fetch languages for repo: ${repo.name}`)
        return {
          totalValue: 0,
          languages: {}
        }
      }

      const languageData = await response.json()

      Object.entries(languageData).forEach(([key, value]) => {
        if (typeof value === "number") {
          languages[key] = (languages[key] || 0) + value
          totalValue += value
        }
      })
    } catch (error) {
      console.error("Error while fetching the languages:", error)
    }
  }

  return {
    totalValue: totalValue,
    languages: languages
  }
}
