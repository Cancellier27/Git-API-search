import {startListeners, submitButton, sortRepos, sortStars} from "./index"
import {
  clearDOM,
  populateUserProfile,
  populateLists,
  populateLanguages
} from "./src/dom-manipulation.js"

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

// Clear the mock DOM elements
afterEach(() => {
  document.body.innerHTML = ""
})

describe("check the DOM elements", () => {
  beforeEach(() => {
    setupDOM()
    jest.clearAllMocks()
  })

  it("check if tags exists", () => {
    const form =
      (document.getElementById("search-form") as HTMLFormElement) || null
    const filterRepo =
      (document.getElementById("repo-filter") as HTMLSelectElement) || null
    const filterStar =
      (document.getElementById("starred-filter") as HTMLSelectElement) || null
    const usernameInput = document.getElementById(
      "username-input"
    ) as HTMLInputElement
    const results = document.getElementById("results") as HTMLBodyElement
    const userNotFound = document.getElementById(
      "user-not-found-container"
    ) as HTMLElement
    const repoList = document.getElementById("repo-list") as HTMLUListElement
    const starredList = document.getElementById(
      "starred-list"
    ) as HTMLUListElement
    const loading = document.querySelector(
      ".loader-container"
    ) as HTMLDivElement

    expect(form).not.toBeNull()
    expect(filterRepo).not.toBeNull()
    expect(filterStar).not.toBeNull()
    expect(usernameInput).not.toBeNull()
    expect(results).not.toBeNull()
    expect(userNotFound).not.toBeNull()
    expect(repoList).not.toBeNull()
    expect(starredList).not.toBeNull()
    expect(loading).not.toBeNull()
  })

  it("user not found text", () => {
    const user = document.getElementById("user-not-found")
    expect(user?.textContent).toBe("User not found! Please try again.")
    expect(user?.textContent).toContain("Please try again.")
  })
})

describe("checking event listeners", () => {
  beforeEach(() => {
    setupDOM()
    jest.clearAllMocks()
  })

  it("check the submit form button", () => {
    const mockCallback = jest.fn()
    const form =
      (document.getElementById("search-form") as HTMLFormElement) || null

    // create the eventListeners on submit
    form.addEventListener("submit", mockCallback)

    // create the event
    const event = new Event("submit", {
      bubbles: true,
      cancelable: true
    })

    // dispatch the event
    form.dispatchEvent(event)

    // expect the form to have been submitted once
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it("check the filter tag listener change", () => {
    const mockCallback = jest.fn()
    const filterRepo =
      (document.getElementById("repo-filter") as HTMLSelectElement) || null
    const filterStar =
      (document.getElementById("starred-filter") as HTMLSelectElement) || null

    // create the eventListeners on change
    filterRepo.addEventListener("change", mockCallback)
    filterStar.addEventListener("change", mockCallback)

    // create the event
    const event = new Event("change", {
      bubbles: true,
      cancelable: true
    })

    // dispatch the event
    filterRepo.dispatchEvent(event)
    filterStar.dispatchEvent(event)

    // expect the form to have been submitted once
    expect(mockCallback).toHaveBeenCalledTimes(2)
  })
})

describe("checking the submit button fn", () => {
  
  beforeEach(() => {
    setupDOM()
    jest.clearAllMocks()
  })

  it("should prevent default form submission", async () => {
    const e = {preventDefault: jest.fn()} as unknown as Event
    await submitButton(e)
    expect(e.preventDefault).toHaveBeenCalled()
  })

  it("should return early if username is empty", async () => {
    const e = {preventDefault: jest.fn()} as unknown as Event
    const input = document.getElementById("username-input") as HTMLInputElement
    input.value = ""
    await submitButton(e)
    expect(input.value).toBe("")
  })

  it("should show loading state during fetch", async () => {
    const e = {preventDefault: jest.fn()} as unknown as Event
    const input = document.getElementById("username-input") as HTMLInputElement
    input.value = "testuser"
    const loader = document.querySelector(".loader-container") as HTMLDivElement

    await submitButton(e)

    expect(loader.style.display).toBe("none") // Should hide after loading
  })
})
