# HomeSync Frontend

A React-based web application for managing shared household tasks. Users can create or join houses, invite members via a code, and manage recurring tasks across the household.

## Features

- **Authentication** - Register and login with JWT-based sessions
- **House Management** - Create a house or join an existing one via invite code
- **Member Management** - View all members of a house
- **Task Management** - Add tasks to a house with recurrence schedules and member assignments

## Tech Stack

- **React 19** with React Router v7
- **Apollo Client** for GraphQL communication
- **Tailwind CSS** for styling
- **Create React App** as the build toolchain

## Getting Started

### Prerequisites

- Node.js and npm
- A running instance of the HomeSync backend (GraphQL API)

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home — lists all houses for the logged-in user |
| `/login` | Login page |
| `/register` | Registration page |
| `/create_house` | Create a new house |
| `/join_house` | Join a house via invite code |
| `/manage_house/:name/:id` | View and manage a specific house (members, tasks, invite code) |
| `/add_new_task/:houseId` | Add a new task to a house |

## Project Structure

```
src/
├── graphQl/
│   ├── query.js        # GraphQL queries
│   └── mutation.js     # GraphQL mutations
├── house/
│   ├── AddHouse.jsx
│   ├── JoinHouse.jsx
│   └── Managehouse.jsx
├── task/
│   └── AddNewTask.jsx
├── user/
│   ├── Login.jsx
│   └── Register.jsx
├── utils/
│   └── auth.js         # Auth helpers
├── App.js
├── AuthContext.jsx
├── HomeComponent.jsx
├── Menu.jsx
└── router.jsx
```