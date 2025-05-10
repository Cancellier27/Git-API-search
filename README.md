<h3 align="center">
    <b>GitHub API search</b> 
</h3>

<p align="center">
  <a href="https://www.linkedin.com/in/filipe-cancellier-da-costa-8459ab160/">
    <img alt="Made by Filipe" src="https://img.shields.io/badge/made%20by-Filipe-brightgreen">
  </a>

  <img alt="GitHub language count" src="https://img.shields.io/badge/languages-3-brightgreen">
</p>

## 🖥️ App to search users in the GitHub API

- Project to search for users using the GitHub API, retrieving key user data.
- It is Frontend only, and was built with TypeScript, HTML, and CSS, without using any frameworks or libraries, with the goal of enhancing my skills in Typescript
- The UI/UX was inspired by GitHub and designed following mobile-first principles

<h1 align="center">
<img alt="GitHub language count" src="/appImage.png">
</h1>

## 🚀 Tech Stack

- [Typescript](https://www.typescriptlang.org/)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)


## 🔧 How to Run

1. Clone the repository:

```bash

git clone https://github.com/Cancellier27/Git-API-search
```


2. Install dependencies:
```bash

npm install
```


4. You will need to have a GitHub Token.
   - Get your token and paste it inside a file named token.ts
   - If you are using another file name, make sure to add it to .gitignore 
   - Using a token will allow you to make many more requests to the API

```bash
//token.ts

export const GITHUB_TOKEN: string = <your git token>
```

5. If you do not have a token, you can still run it, buy will need to modify a few lines.
By doing this you will be limited to only 60 API calls per hour
```bash
  //Remove the first line from the index.ts file, the import token statement:
    import {GITHUB_TOKEN} from "./token.js"

  // Can delete the function "fetchWithToken()" as it is not needed anymore.

  // Change all the calls made by "fetchWithToken()" to only "fetch()".
```



6. Start the http-server
```bash
npm start
```
Now the app should be running on http://localhost:8080




## :mailbox_with_mail: Get in touch!

<a href="https://cancellier27.github.io/web-app-fc/" target="_blank" >
  <img alt="Website - Filipe" src="https://img.shields.io/badge/Website--%23F8952D?style=social">
</a>&nbsp;&nbsp;&nbsp;
<a href="https://www.linkedin.com/in/filipe-cancellier-da-costa-8459ab160/" target="_blank" >
  <img alt="Linkedin - Filipe" src="https://img.shields.io/badge/Linkedin--%23F8952D?style=social&logo=linkedin">
</a>&nbsp;&nbsp;&nbsp;
<a href="mailto:filipecancelliercosta@gmail.com" target="_blank" >
  <img alt="Email - Filipe" src="https://img.shields.io/badge/Email--%23F8952D?style=social&logo=gmail">
</a>
