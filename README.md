# SportWeb-React

A full-stack MERN application using Express, MongoDB, React, and TypeScript. This project includes a server-side API and a client-side React application for managing a to-do list.

## Project Structure

SportWeb-React/
├── .gitignore
├── .yarn/
├── client/ # Client-side React application
│ ├── src/ 
│ ├── public/
│ └── package.json
├── server/ # Server-side application
│ ├── src/
│ │ ├── config/ # Database configuration 
│ │ ├── controllers/ # API controllers 
│ │ ├── models/ # Mongoose models 
│ │ ├── routes/ # API routes 
│ │ └── server.ts # Entry point for the server
│ ├── package.json 
│ └── tsconfig.json
├── package.json 
├── tsconfig.json 
└── yarn.lock

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Yarn](https://yarnpkg.com/) (for dependency management)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/SportWeb-React.git
   cd SportWeb-React
   
2. **Install Dependencies**

For the server + client:


 ```bash
cd server
yarn install

cd ../client
yarn install ```
