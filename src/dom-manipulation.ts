import {GitHubUser, GitHubRepo, Languages} from "./types.js"

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
function populateLists(repos: GitHubRepo[][], container: HTMLElement, type: string, index: number) {
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
    repos[index].forEach((repo) => {
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

    createPagination(repos, type, index)
  }
}

function createPagination(repos: GitHubRepo[][], type: string, index: number): void {
  const repoLength: number = repos.length
  let pagContainer: HTMLDivElement
  let container: HTMLUListElement
  let paginationEl: HTMLDivElement
  let prev: HTMLButtonElement
  let next: HTMLButtonElement

  if (type === "star") {
    container = (document.getElementById("starred-list") as HTMLUListElement) || null
    pagContainer = document.querySelector(".page-count-container-star") as HTMLDivElement
    // cleans the element
    pagContainer.innerHTML = ""

    // create the elements
    paginationEl = document.createElement("div")
    paginationEl.setAttribute("class", "pagination-star")

    prev = document.createElement("button")
    prev.setAttribute("class", "page-star-prev")
    prev.innerHTML = "&#10094;"

    next = document.createElement("button")
    next.setAttribute("class", "page-star-next")
    next.innerHTML = "&#10095;"

    // add the event listener to next and per buttons
    next.addEventListener("click", () => nextPrevPage(["star", "next"]))
    prev.addEventListener("click", () => nextPrevPage(["star", "prev"]))

    // Append them to the DOM tree
    pagContainer.appendChild(prev)
    pagContainer.appendChild(paginationEl)
    pagContainer.appendChild(next)

    for (let i = 0; i < repoLength; i++) {
      // create the new pagination item
      let pagButton = document.createElement("button")
      pagButton.setAttribute("class", "pag-star-num")
      pagButton.addEventListener("click", () => {
        populateLists(repos, container, type, i)
      })
      pagButton.textContent = `${i + 1}`

      if (i === index) {
        pagButton.classList.add("page-selected")
      }

      // append to DOM element
      paginationEl?.appendChild(pagButton)
    }
  } else {
    container = (document.getElementById("repo-list") as HTMLUListElement) || null
    pagContainer = document.querySelector(".page-count-container-repo") as HTMLDivElement
    // cleans the element
    pagContainer.innerHTML = ""

    // create the elements
    paginationEl = document.createElement("div")
    paginationEl.setAttribute("class", "pagination-repo")

    prev = document.createElement("button")
    prev.setAttribute("class", "page-repo-prev")
    prev.innerHTML = "&#10094;"

    next = document.createElement("button")
    next.setAttribute("class", "page-repo-next")
    next.innerHTML = "&#10095;"

    // add the event listener to next and per buttons
    next.addEventListener("click", () => nextPrevPage(["repo", "next"]))
    prev.addEventListener("click", () => nextPrevPage(["repo", "prev"]))

    // Append them to the DOM tree
    pagContainer.appendChild(prev)
    pagContainer.appendChild(paginationEl)
    pagContainer.appendChild(next)

    for (let i = 0; i < repoLength; i++) {
      // create the new pagination item
      let pagButton = document.createElement("button")
      pagButton.setAttribute("class", "pag-repo-num")
      pagButton.addEventListener("click", () => {
        populateLists(repos, container, type, i)
      })
      pagButton.textContent = `${i + 1}`

      if (i === index) {
        pagButton.classList.add("page-selected")
      }

      // append to DOM element
      paginationEl?.appendChild(pagButton)
    }
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

function nextPrevPage([type, data]: [string, string]) {
  if (type === "repo") {
    let container = (document.getElementById("repo-list") as HTMLUListElement) || null
    let repoData: GitHubRepo[][] = JSON.parse(localStorage.getItem("reposData") || "[]")
    let paginationList = document.querySelectorAll(".pag-repo-num")
    let currentPage: number = -1
    // check if there is only one page or less
    if (paginationList.length <= 1) return

    for (let i = 0; i < paginationList.length; i++) {
      if (paginationList[i].className === "pag-repo-num page-selected") {
        currentPage = i
      }
    }

    if (currentPage != -1) {
      if (data === "next" && currentPage < repoData.length - 1) {
        populateLists(repoData, container, type, currentPage + 1)
        return
      } else if (data === "prev" && currentPage > 0) {
        populateLists(repoData, container, type, currentPage - 1)
        return
      } else {
        return
      }
    }
  } else if (type === "star") {
    let container = (document.getElementById("starred-list") as HTMLUListElement) || null
    let repoData: GitHubRepo[][] = JSON.parse(localStorage.getItem("starredData") || "[]")

    let paginationList = document.querySelectorAll(".pag-star-num")
    let currentPage: number = -1
    // check if there is only one page or less
    if (paginationList.length <= 1) return

    for (let i = 0; i < paginationList.length; i++) {
      if (paginationList[i].className === "pag-star-num page-selected") {
        currentPage = i
      }
    }

    if (currentPage != -1) {
      if (data === "next" && currentPage < repoData.length - 1) {
        populateLists(repoData, container, type, currentPage + 1)
        return
      } else if (data === "prev" && currentPage > 0) {
        populateLists(repoData, container, type, currentPage - 1)
        return
      } else {
        return
      }
    }
  } else {
    return
  }
}

export {clearDOM, populateUserProfile, populateLists, populateLanguages}
