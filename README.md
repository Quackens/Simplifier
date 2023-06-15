# Simplifier
A reading tool designed to simplify / organize / summarize papers or reports

<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
<!-- Here's a blank template to get started: To avoid retyping too much info. Do a search and replace with your text editor for the following: `github_username`, `repo_name`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description` -->
### Built With
ReactJS and Express using the OpenAI API

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps. Make sure you have the prerequisites listed below.

### Prerequisites

* Node Package Manager (npm) [https://nodejs.org/en/download](https://nodejs.org/en/download). If required, update npm below:
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get an API Key at [https://platform.openai.com/](https://platform.openai.com/)
2. Clone the repo
   ```sh
   git clone https://github.com/Quackens/Simplifier.git
   ```
   
3. Enter your API in `config.js`
   ```js
   const constants = {
    const API_KEY = 'ENTER YOUR API'
   }
   ```
   
4. Go into the backend directory
   ```sh
   cd Simplify/backend
   ```
   
5. Install NPM packages for the Express server
   ```sh
   npm install
   ```
   
6. Run the NPM development server
   ```sh
   npm run dev
   ```
   
7. Open another terminal window. Go into the frontend directory and install the npm dependencies. Then run the reaect app
   ```sh
   cd ../frontend
   npm install
   npm start
   ```
   
 8. Use the web app at [http://localhost:3000/](http://localhost:3000/). Enjoy!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

### Add and Change Text
Enter your text in the input field, and add it to the site. From there, you have a few options to use with this text:
* **Simplify**: Converts the text to make it less technical, changing it into layman terms and eliminating jargon
* **Bullet Points**: Converts the text into a few bullet points, for concise reading
* **Summarize**: Summarizes the text into a more succint paragraph
* **Add to Linked Texts**: Adds this text to the linked selection, explained below
* **Delete**: delete this text from the site

![image showing how to use texts](https://github.com/Quackens/Simplifier/blob/main/readme/simplifier-texts.png)

### Linking Text
Once you have added your choices of texts to the "Linked Texts" section, you may do the following:
* **Generate Similarity Report**: Generates a paragraph summarizing the trends and similarities that the two texts have in common
* **Search Query**: type in a search query, (e.g Asking "Trend for Tesla Stock" for the example SP500 reports) and getting an answer based only on the text information it is given

![image showing how to link texts](https://github.com/Quackens/Simplifier/blob/main/readme/simplifier-link.png)

### Results
The results of each request is generated here. In this example, I asked "Trend for Tesla Stock" in the search query, after linking articles 2 and 3:

![image showing how to use results](https://github.com/Quackens/Simplifier/blob/main/readme/simplifier-result.png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Jimmy Zhou - jameszho@andrew.cmu.edu

Project Link: [https://github.com/Quackens/Simplifier](https://github.com/Quackens/Simplifier)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

