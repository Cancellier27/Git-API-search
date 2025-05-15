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
  languages_url: string
}

interface Languages {
  totalValue: number
  languages: {[key: string]: number}
}

export function cacheData(data: GitHubUser | GitHubRepo[] | Languages, type: string): void {
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
}
