// TS types
export interface GitHubUser {
  avatar_url: string
  name: string
  bio: string
  location: string
  company: string
  followers: number
  following: number
  html_url: string
}

export interface GitHubRepo {
  name: string
  html_url: string
  updated_at: string
  languages_url: string
}

export interface Data {
  userData: GitHubUser
  reposData: GitHubRepo[]
  starredData: GitHubRepo[]
  langData: Languages
}

export interface Languages {
  totalValue: number
  languages: {[key: string]: number}
}
