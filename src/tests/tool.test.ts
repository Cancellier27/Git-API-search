import {GitHubRepo, Data} from "../types"
import {cacheData, fetchWithToken} from "../tools.js"

// mock the DOM elements
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

// Clear the mock DOM elements and mocks
afterEach(() => {
  document.body.innerHTML = ""
  jest.clearAllMocks()
})

describe("cacheData", () => {
  beforeEach(() => {
    Storage.prototype.setItem = jest.fn()
    localStorage.clear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockData = {
    avatar_url: "avatar_url",
    name: "Name",
    bio: "Biographic",
    location: "Location",
    company: "Company",
    followers: 10,
    following: 5,
    html_url: "html_url"
  }
  const mockArrayData = [
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
  const mockLangData = {totalValue: 10000, languages: {JavaScript: 7000, TypeScript: 3000}}

  it("stores userData in localStorage", () => {
    cacheData(mockData, "userData")
    expect(localStorage.setItem).toHaveBeenCalledWith("userData", JSON.stringify(mockData))
    expect(localStorage.setItem).toHaveBeenCalledWith("expirationTime", expect.any(String))
  })

  it("stores reposData in localStorage", () => {
    cacheData(mockArrayData, "reposData")
    expect(localStorage.setItem).toHaveBeenCalledWith("reposData", JSON.stringify(mockArrayData))
    expect(localStorage.setItem).toHaveBeenCalledWith("expirationTime", expect.any(String))
  })

  it("stores starredData in localStorage", () => {
    cacheData(mockArrayData, "starredData")
    expect(localStorage.setItem).toHaveBeenCalledWith("starredData", JSON.stringify(mockArrayData))
    expect(localStorage.setItem).toHaveBeenCalledWith("expirationTime", expect.any(String))
  })

  it("stores languages in localStorage", () => {
    cacheData(mockLangData, "languages")
    expect(localStorage.setItem).toHaveBeenCalledWith("langData", JSON.stringify(mockLangData))
    expect(localStorage.setItem).toHaveBeenCalledWith("expirationTime", expect.any(String))
  })

  it("throws an error for unknown type", () => {
    expect(() => cacheData(mockData, "invalidType")).toThrow("No data to be stored in LocalStorage!")
  })
})
