// // import {fetchData, cacheLanguages} from "../fetch-data.js"
// // import * as fetchDataModule from "../fetch-data.js"
// // import {GitHubUser, GitHubRepo, Languages} from "../types"

// // // Mock the dependencies
// // jest.mock('../tools', () => ({
// //   fetchWithToken: jest.fn(),
// //   cacheData: jest.fn(),
// //   GITHUB_TOKEN: 'test-token' // Add this if your tests need it
// // }));

// // import {cacheData, fetchWithToken} from "../tools.js"

// // // Mock DOM elements
// // beforeEach(() => {
// //   document.body.innerHTML = `
// //     <div id="user-not-found"></div>
// //   `

// //   // Reset all mocks
// //   jest.clearAllMocks()

// //   // Mock localStorage
// //   Object.defineProperty(window, "localStorage", {
// //     value: {
// //       clear: jest.fn(),
// //       setItem: jest.fn(),
// //       getItem: jest.fn()
// //     },
// //     writable: true
// //   })
// // })

// // describe("fetchData function test", () => {
// //   const testUsername = "testUser"

// //   const mockUserData: GitHubUser = {
// //     avatar_url: "https://avatar.url",
// //     name: "Test User",
// //     html_url: "https://github.com/test",
// //     bio: "Test bio",
// //     location: "Test Location",
// //     company: "Test Company",
// //     followers: 100,
// //     following: 50
// //   }

// //   const mockReposData: GitHubRepo[] = [
// //     {
// //       name: "repo1",
// //       html_url: "https://github.com/repo1",
// //       languages_url: "https://api.github.com/repos/test/repo1/languages",
// //       updated_at: "2023-01-01T00:00:00Z"
// //     }
// //   ]

// //   const mockStarredData: GitHubRepo[] = [
// //     {
// //       name: "starred1",
// //       html_url: "https://github.com/starred1",
// //       languages_url: "https://api.github.com/repos/test/starred1/languages",
// //       updated_at: "2023-02-01T00:00:00Z"
// //     }
// //   ]

// //   const mockLangData: Languages = {
// //     totalValue: 1000,
// //     languages: {
// //       TypeScript: 800,
// //       JavaScript: 200
// //     }
// //   }

// //   const logSpy = jest.spyOn(global.console, "warn")

// //   it("should fetch and cache user data successfully", async () => {
// //     // Mock successful API responses
// //     ;(fetchWithToken as jest.Mock)
// //       .mockImplementationOnce(() =>
// //         Promise.resolve({
// //           ok: true,
// //           json: () => Promise.resolve(mockUserData)
// //         })
// //       )
// //       .mockImplementationOnce(() =>
// //         Promise.resolve({
// //           ok: true,
// //           json: () => Promise.resolve(mockReposData)
// //         })
// //       )
// //       .mockImplementationOnce(() =>
// //         Promise.resolve({
// //           ok: true,
// //           json: () => Promise.resolve(mockStarredData)
// //         })
// //       )

// //     // Mock cacheLanguages response
// //     jest.spyOn(fetchDataModule, "cacheLanguages").mockResolvedValue(mockLangData)

// //     const result = await fetchData(testUsername)

// //     // Verify API calls
// //     expect(fetchWithToken).toHaveBeenCalledTimes(4)
// //     expect(fetchWithToken).toHaveBeenCalledWith(`https://api.github.com/users/${testUsername}`)
// //     expect(fetchWithToken).toHaveBeenCalledWith(`https://api.github.com/users/${testUsername}/repos`)
// //     expect(fetchWithToken).toHaveBeenCalledWith(`https://api.github.com/users/${testUsername}/starred`)

// //     // Verify cache operations
// //     expect(localStorage.clear).toHaveBeenCalled()
// //     expect(cacheData).toHaveBeenCalledTimes(4)
// //   })

// //   it("should handle user not found error", async () => {
// //     // Setup DOM properly
// //     document.body.innerHTML = `
// //       <div id="user-not-found" style="display: none;"></div>
// //     `

// //     // Mock failed user fetch
// //     ;(fetchWithToken as jest.Mock).mockResolvedValueOnce({
// //       ok: false,
// //       status: 404
// //     })

// //     await expect(fetchData(testUsername)).rejects.toThrow("User not found")

// //     const userNotFound = document.getElementById("user-not-found") as HTMLElement
// //     expect(userNotFound.style.display).toBe("flex")
// //   })

// //   it("should handle partial failures in repos/starred fetches", async () => {
// //     // Mock responses
// //     ;(fetchWithToken as jest.Mock)
// //       .mockImplementationOnce(() =>
// //         Promise.resolve({
// //           ok: true,
// //           json: () => Promise.resolve(mockUserData)
// //         })
// //       )
// //       .mockImplementationOnce(() =>
// //         Promise.resolve({
// //           ok: false,
// //           status: 403
// //         })
// //       )
// //       .mockImplementationOnce(() =>
// //         Promise.resolve({
// //           ok: true,
// //           json: () => Promise.resolve(mockStarredData)
// //         })
// //       )

// //     const result = await fetchData(testUsername)

// //     expect(result.userData).toBe(mockUserData)
// //     expect(result.starredData).toBe(mockStarredData)
// //     expect(result.reposData).toStrictEqual([])
// //     expect(logSpy).toHaveBeenCalledWith("Could not fetch repositories")
// //   })
// // })

// import { fetchData, cacheLanguages } from '../fetch-data';
// import { GitHubUser, GitHubRepo, Languages } from '../types';

// // Mock the tools module including GITHUB_TOKEN
// jest.mock('../tools', () => ({
//   fetchWithToken: jest.fn(),
//   cacheData: jest.fn(),
//   GITHUB_TOKEN: 'test-token' // Add this if your tests need it
// }));

// // Import the mocked version
// import { fetchWithToken, cacheData } from '../tools';

// // Mock the global fetch if your fetchWithToken uses it
// global.fetch = jest.fn() as jest.Mock;

// beforeEach(() => {
//   document.body.innerHTML = `
//     <div id="user-not-found" style="display: none;"></div>
//   `;
//   jest.clearAllMocks();
// });

// describe('fetchWithToken mock', () => {
//   test('should mock fetchWithToken properly', async () => {
//     // Setup mock response
//     (fetchWithToken as jest.Mock).mockResolvedValueOnce({
//       ok: true,
//       json: () => Promise.resolve({ test: 'data' })
//     });

//     const response = await fetchWithToken('test-url');
//     const data = await response.json();

//     expect(fetchWithToken).toHaveBeenCalledWith('test-url');
//     expect(data).toEqual({ test: 'data' });
//   });
// });

// describe('fetchData', () => {
//   const testUsername = 'testuser';
//   const mockUserData: GitHubUser = {
//     avatar_url: "https://avatar.url",
//     name: "Test User",
//     html_url: "https://github.com/test",
//     bio: "Test bio",
//     location: "Test Location",
//     company: "Test Company",
//     followers: 100,
//     following: 50
//   };
//   const mockReposData: GitHubRepo[] = [ /* ... */ ];
//   const mockStarredData: GitHubRepo[] = [ /* ... */ ];

//   test('should use fetchWithToken correctly', async () => {
//     // Mock successful responses
//     (fetchWithToken as jest.Mock)
//       .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockUserData) })
//       .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockReposData) })
//       .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockStarredData) });

//     await fetchData(testUsername);

//     expect(fetchWithToken).toHaveBeenCalledWith(
//       `https://api.github.com/users/${testUsername}`
//     );
//     expect(fetchWithToken).toHaveBeenCalledWith(
//       `https://api.github.com/users/${testUsername}/repos`
//     );
//     expect(fetchWithToken).toHaveBeenCalledWith(
//       `https://api.github.com/users/${testUsername}/starred`
//     );
//   });
// });

// // ... rest of your tests ...


// describe('cacheLanguages function test', () => {
//   const mockRepos: GitHubRepo[] = [
//     {
//       name: 'repo1',
//       languages_url: 'https://api.github.com/repos/test/repo1/languages',
//       html_url: 'https://github.com/repo1',
//       updated_at: '2023-01-01T00:00:00Z'
//     },
//     {
//       name: 'repo2',
//       languages_url: 'https://api.github.com/repos/test/repo2/languages',
//       html_url: 'https://github.com/repo2',
//       updated_at: '2023-02-01T00:00:00Z'
//     }
//   ];

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('should aggregate language data from multiple repos', async () => {
//     // Mock successful language fetches
//     (fetchWithToken as jest.Mock)
//       .mockImplementationOnce(() => Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({
//           TypeScript: 500,
//           JavaScript: 300
//         })
//       }))
//       .mockImplementationOnce(() => Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({
//           TypeScript: 300,
//           Java: 200
//         })
//       }));

//     const result = await cacheLanguages(mockRepos);

//     expect(result).toEqual({
//       totalValue: 1000, // 500 + 300 + 300 + 200
//       languages: {
//         TypeScript: 800, // 500 + 300
//         JavaScript: 300,
//         Java: 200
//       }
//     });
//   });

//   test('should handle empty repos array', async () => {
//     const result = await cacheLanguages([]);

//     expect(result).toEqual({
//       totalValue: 0,
//       languages: {}
//     });

//     expect(fetchWithToken).not.toHaveBeenCalled();
//   });

//   test('should handle failed language fetches', async () => {
//     // Mock one successful and one failed fetch
//     (fetchWithToken as jest.Mock)
//       .mockImplementationOnce(() => Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({
//           TypeScript: 500,
//           JavaScript: 300
//         })
//       }))
//       .mockImplementationOnce(() => Promise.resolve({
//         ok: false,
//         status: 404
//       }));

//     const result = await cacheLanguages(mockRepos);

//     expect(result).toEqual({
//       totalValue: 800, // Only from successful fetch
//       languages: {
//         TypeScript: 500,
//         JavaScript: 300
//       }
//     });

//     expect(console.warn).toHaveBeenCalledWith(
//       `Could not fetch languages for repo: ${mockRepos[1].name}`
//     );
//   });

//   test('should handle fetch errors', async () => {
//     // Mock a fetch that throws an error
//     (fetchWithToken as jest.Mock)
//       .mockImplementationOnce(() => Promise.reject(new Error('Network error')));

//     const result = await cacheLanguages([mockRepos[0]]);

//     expect(result).toEqual({
//       totalValue: 0,
//       languages: {}
//     });

//     expect(console.error).toHaveBeenCalledWith(
//       "Error while fetching the languages:",
//       expect.any(Error)
//     );
//   });
// });