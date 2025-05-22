import {GitHubRepo} from "../types"
import {cacheData, fetchWithToken, clearLocalStorage} from "../tools.js"
import {GITHUB_TOKEN} from "../../token.js"

describe("cacheData function test", () => {
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

  it("stores userData in localStorage and date", () => {
    cacheData(mockData, "userData")
    expect(localStorage.setItem).toHaveBeenCalledWith("userData", JSON.stringify(mockData))
    expect(localStorage.setItem).toHaveBeenCalledWith("expirationTime", expect.any(String))
  })

  it("stores reposData in localStorage  and date", () => {
    cacheData(mockArrayData, "reposData")
    expect(localStorage.setItem).toHaveBeenCalledWith("reposData", JSON.stringify(mockArrayData))
    expect(localStorage.setItem).toHaveBeenCalledWith("expirationTime", expect.any(String))
  })

  it("stores starredData in localStorage  and date", () => {
    cacheData(mockArrayData, "starredData")
    expect(localStorage.setItem).toHaveBeenCalledWith("starredData", JSON.stringify(mockArrayData))
    expect(localStorage.setItem).toHaveBeenCalledWith("expirationTime", expect.any(String))
  })

  it("stores languages in localStorage  and date", () => {
    cacheData(mockLangData, "languages")
    expect(localStorage.setItem).toHaveBeenCalledWith("langData", JSON.stringify(mockLangData))
    expect(localStorage.setItem).toHaveBeenCalledWith("expirationTime", expect.any(String))
  })

  it("throws an error for unknown type", () => {
    expect(() => cacheData(mockData, "invalidType")).toThrow("No data to be stored in LocalStorage!")
  })
})

describe("fetchWithToken function test", () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("calls fetch with correct headers", async () => {
    const mockResponse = Promise.resolve({ok: true, json: () => Promise.resolve({})})
    ;(global.fetch as jest.Mock) = jest.fn(() => mockResponse)

    const url = "https://api.github.com/users/Cancellier27"
    await fetchWithToken(url)

    expect(global.fetch).toHaveBeenCalledWith(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json"
      }
    })
  })
})

describe("clearLocalStorage function test", () => {
  const logSpy = jest.spyOn(global.console, "log")


  beforeEach(() => {
    Storage.prototype.setItem = jest.fn()
    localStorage.clear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it("clears localStorage if time has passed", () => {
    const now = Date.now()
    const past = now - 60 * 60 * 1000 // 1 hour ago

    jest.spyOn(Date, "now").mockReturnValue(now)

    localStorage.setItem("expirationTime", JSON.stringify(past))
    localStorage.setItem("dummy", "data")

    clearLocalStorage(30)

    expect(localStorage.getItem("dummy")).toBeNull()
    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith("localStorage cleaned")
  })

  it("does not clear localStorage if within time", () => {
    const now = Date.now()
    const recent = now - 10 * 60 * 1000

    jest.spyOn(Date, "now").mockReturnValue(now)

    localStorage.setItem("expirationTime", JSON.stringify(recent))
    localStorage.setItem("dummy", "data")

    clearLocalStorage(30)

    expect(localStorage.getItem("dummy")).toBe("data")
    expect(logSpy).not.toHaveBeenCalled()
  })
})
