import {clearDOM, populateUserProfile, populateLists, populateLanguages} from "../dom-manipulation.js"
import {GitHubUser, GitHubRepo, Languages} from "../types"

// Your provided DOM mock
const setupDOM = () => {
  document.body.innerHTML = `
    <div class="container">
      <header>
        <h1>GitHub Search</h1>
        <form id="search-form">
          <input
            type="text"
            id="username-input"
            placeholder="Enter GitHub username"
            required
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <div class="loader-container">
        <p class="loading-text">Loading User<span class="dots"></span></p>
      </div>

      <div id="user-not-found-container">
        <p id="user-not-found">User not found! Please try again.</p>
      </div>

      <main id="results">
        <section id="profile" class="card">
          <img id="avatar" alt="User avatar" />
          <h2 id="name">
            <a id="name-link" target="_blank"></a>
          </h2>
          <p id="bio"></p>
          <p id="location"></p>
          <p id="company"></p>
          <div class="follow-stats">
            <span id="followers">Followers: 0</span>
            <span id="following">Following: 0</span>
          </div>
        </section>

        <section id="languages-container">
          <div class="languages-placeholder">
            <p class="loading-text">
              Loading Languages<span class="dots"></span>
            </p>
          </div>

          <div class="languages-list">
            <h4>Most used languages:</h4>
            <ul id="languages"></ul>
          </div>
        </section>

        <section id="repos">
          <div class="filter-container">
            <h3>Repositories</h3>
            <select name="repo-filter" id="repo-filter">
              <option value="">Filter by</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div class="card-grid" id="repo-list"></div>
        </section>

        <section id="starred">
          <div class="filter-container">
            <h3>Starred Repositories</h3>
            <select name="starred-filter" id="starred-filter">
              <option value="">Filter by</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div class="card-grid" id="starred-list"></div>
        </section>
      </main>
    </div>

    <script src="out/index.js" type="module"></script>
  `
}

// Setup DOM before each test
beforeEach(() => {
  setupDOM()
})

describe("clearDOM function test", () => {
  it("should reset all DOM elements to initial state", () => {
    // First populate some data
    const avatar = document.getElementById("avatar") as HTMLImageElement
    const nameLink = document.getElementById("name-link") as HTMLLinkElement
    const bioEl = document.getElementById("bio") as HTMLElement
    const locationEl = document.getElementById("location") as HTMLElement
    const companyEl = document.getElementById("company") as HTMLElement
    const followersEl = document.getElementById("followers") as HTMLElement
    const followingEl = document.getElementById("following") as HTMLElement
    const repoList = document.getElementById("repo-list") as HTMLUListElement
    const starredList = document.getElementById("starred-list") as HTMLUListElement

    avatar.src = "http//someAddress.com"
    nameLink.textContent = "Filipe"
    bioEl.textContent = "Hi I am Filipe"
    locationEl.textContent = "London"
    companyEl.textContent = "Company"
    followersEl.textContent = "Followers: 10"
    followingEl.textContent = "Following: 20"
    repoList.innerHTML = "<li>Test repo</li>"
    starredList.innerHTML = "<li>Test star repo</li>"

    // Clear the DOM
    clearDOM()

    // Assert all elements are cleared
    expect(avatar.src).toBe("http://localhost/")
    expect(nameLink.textContent).toBe("")
    expect(bioEl.textContent).toBe("")
    expect(locationEl.textContent).toBe("")
    expect(companyEl.textContent).toBe("")
    expect(followersEl.textContent).toBe("Followers: 0")
    expect(followingEl.textContent).toBe("Following: 0")
    expect(repoList.innerHTML).toBe("")
    expect(starredList.innerHTML).toBe("")
  })
})

describe("populateUserProfile  function test", () => {
  it("should populate user profile with provided data", () => {
    const testUser: GitHubUser = {
      avatar_url: "https://avatar.url/",
      name: "Filipe",
      html_url: "https://github.com/test/",
      bio: "Test bio",
      location: "Test Location",
      company: "Test Company",
      followers: 100,
      following: 50
    }

    populateUserProfile(testUser)

    const avatar = document.getElementById("avatar") as HTMLImageElement
    const nameLink = document.getElementById("name-link") as HTMLLinkElement
    const bioEl = document.getElementById("bio") as HTMLElement
    const locationEl = document.getElementById("location") as HTMLElement
    const companyEl = document.getElementById("company") as HTMLElement
    const followersEl = document.getElementById("followers") as HTMLElement
    const followingEl = document.getElementById("following") as HTMLElement

    expect(avatar.src).toBe(testUser.avatar_url)
    expect(nameLink.textContent).toBe(testUser.name)
    expect(nameLink.href).toBe(testUser.html_url)
    expect(bioEl.textContent).toBe(testUser.bio)
    expect(locationEl.textContent).toBe(testUser.location)
    expect(companyEl.textContent).toBe(testUser.company)
    expect(followersEl.textContent).toBe(`Followers: ${testUser.followers}`)
    expect(followingEl.textContent).toBe(`Following: ${testUser.following}`)
  })

  it("should handle missing optional fields", () => {
    const testUser: GitHubUser = {
      avatar_url: "avatar_url",
      name: "",
      bio: "",
      location: "",
      company: "",
      followers: 10,
      following: 5,
      html_url: "html_url"
    }

    populateUserProfile(testUser)

    const nameLink = document.getElementById("name-link") as HTMLLinkElement
    const bioEl = document.getElementById("bio") as HTMLElement
    const locationEl = document.getElementById("location") as HTMLElement
    const companyEl = document.getElementById("company") as HTMLElement

    expect(nameLink.textContent).toBe("No name provided")
    expect(bioEl.textContent).toBe("")
    expect(locationEl.textContent).toBe("")
    expect(companyEl.textContent).toBe("")
  })
})

describe("populateLists  function test", () => {
  it("should populate repository list with provided data", () => {
    const testRepos: GitHubRepo[] = [
      {
        id: 1,
        updated_at: "2023-01-01T00:00:00Z",
        name: "repo1",
        html_url: "https://github.com/user/repo1",
        languages_url: "https://api.github.com/repos/user/repo1/languages"
      } as GitHubRepo,
      {
        id: 2,
        updated_at: "2023-01-03T00:00:00Z",
        name: "repo2",
        html_url: "https://github.com/user/repo2",
        languages_url: "https://api.github.com/repos/user/repo2/languages"
      } as GitHubRepo,
      {
        id: 3,
        updated_at: "2023-01-02T00:00:00Z",
        name: "repo3",
        html_url: "https://github.com/user/repo3",
        languages_url: "https://api.github.com/repos/user/repo3/languages"
      } as GitHubRepo
    ]

    const container = document.getElementById("repo-list") as HTMLElement
    populateLists(testRepos, container, "repo")

    const cards = container.querySelectorAll(".repo-card")
    expect(cards.length).toBe(3)

    const firstLink = cards[0].querySelector("a") as HTMLAnchorElement
    expect(firstLink.textContent).toBe("repo1")
    expect(firstLink.href).toBe("https://github.com/user/repo1")

    const firstDate = cards[0].querySelector("p") as HTMLParagraphElement
    expect(firstDate.textContent).toBe("2023/01/01")
  })

  it("should show message for empty repository list", () => {
    const container = document.getElementById("repo-list") as HTMLElement
    populateLists([], container, "repo")

    const card = container.querySelector(".repo-card") as HTMLDivElement
    expect(card).toBeTruthy()

    const link = card.querySelector("a") as HTMLAnchorElement
    expect(link.textContent).toBe("No repositories found")
  })

  it("should show message for empty starred list", () => {
    const container = document.getElementById("starred-list") as HTMLElement
    populateLists([], container, "star")

    const card = container.querySelector(".repo-card") as HTMLDivElement
    expect(card).toBeTruthy()

    const link = card.querySelector("a") as HTMLAnchorElement
    expect(link.textContent).toBe("No starred repositories found")
  })
})

describe("populateLanguages  function test", () => {
  test("should populate languages list with provided data", async () => {
    const testLangData: Languages = {
      languages: {
        TypeScript: 5000,
        JavaScript: 3000,
        HTML: 2000
      },
      totalValue: 10000
    }

    await populateLanguages(testLangData)

    const languagesUList = document.getElementById("languages") as HTMLUListElement
    const listItems = languagesUList.querySelectorAll("li")

    expect(listItems.length).toBe(3) // Should be sorted alphabetically

    // Check first language (HTML)
    const firstLang = listItems[0]
    expect(firstLang.querySelector("p")?.textContent).toBe("HTML")
    expect(firstLang.querySelector(".lang-percentage")?.textContent).toBe("20%")
    expect((firstLang.querySelector(".lang-bar") as HTMLElement)?.style.width).toBe("20%")

    // Check visibility toggling
    const languagesPlaceholder = document.querySelector(".languages-placeholder") as HTMLDivElement
    const languagesList = document.querySelector(".languages-list") as HTMLDivElement
    expect(languagesPlaceholder.style.display).toBe("none")
    expect(languagesList.style.display).toBe("block")
  })

  test("should show message for empty languages data", async () => {
    const testLangData: Languages = {
      languages: {},
      totalValue: 0
    }

    await populateLanguages(testLangData)

    const languagesUList = document.getElementById("languages") as HTMLUListElement
    const listItems = languagesUList.querySelectorAll("li")

    expect(listItems.length).toBe(1)
    expect(listItems[0].textContent).toBe("No language used found")
  })

  test("should filter out languages with <1% usage", async () => {
    const testLangData: Languages = {
      languages: {
        TypeScript: 9999,
        JavaScript: 1
      },
      totalValue: 10000
    }

    await populateLanguages(testLangData)

    const languagesUList = document.getElementById("languages") as HTMLUListElement
    const listItems = languagesUList.querySelectorAll("li")

    expect(listItems.length).toBe(1) // Only TypeScript should be shown
    expect(listItems[0].querySelector("p")?.textContent).toBe("TypeScript")
  })
})
