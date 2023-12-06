# Company Search Web App

<img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/> <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/> <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>

## Overview

This web application allows users to search for businesses in a specific location and retrieve information about them, including reviews. The application is built using HTML, JavaScript, Node.js, and the SERP API for fetching data.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Running the Application](#running-the-application)
  - [Making a Search](#making-a-search)
- [Server-Side API](#server-side-api)
- [Client-Side](#client-side)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js
- NPM (Node Package Manager)

### Installation

1. Clone the repository:
    git clone <repository-url>
2. Navigate to the project directory: 
    cd <project-directory>
3. Install dependencies:
   
    npm install
   
    npm i express
   
    npm i path
   
    npm i dotenv 

## Usage

### Running the Application
Start the server:

npm start
The server will run on the specified port, and you can access the application by navigating to http://localhost:3000 in your web browser.

## Making a Search
1. Open the application in your browser.
2. Enter the location and business keyword in the respective input fields.
3. Click the "Search" button.
4. View the search results and reviews displayed on the page.

## Server-Side API
The server provides two endpoints:

1. Google Maps Search:

Endpoint: /api/search/google_maps
Method: GET
Parameters:
location: Location of the business.
keyword: Business keyword for the search.

2. Google Maps Reviews:

Endpoint: /api/search/google_maps_reviews
Method: GET
Parameters:
dataId: Data ID obtained from the Google Maps search.
keyword: Business keyword for the reviews.

## Client-Side
The client-side is a simple HTML and JavaScript application. The search form allows users to input a location and business keyword, triggering a request to the server for search results.

## License 
This project is licensed under the MIT License.
