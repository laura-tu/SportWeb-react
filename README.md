# SportWeb-React

A full-stack MERN application using Express, MongoDB, React, and TypeScript. This project includes a server-side API and a client-side React application for managing a to-do list.

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
   yarn install


### Configuration

1. **Server configuration**

In server/src/config/db.ts, replace the MongoDB connection string with your own:
... await mongoose.connect('mongodb+srv://username:password@cluster.mongodb.net/mydatabase'...

2. **Client configuration**
check environment variables set in .env files

### Running the Application
   ```bash
   cd server
   yarn dev
   cd client
   yarn start

   or on root level
   
   ```bash
   yarn dev //start development simultaneously for both client+ server```
