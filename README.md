# HomeSync Frontend

A React-based web application for managing shared household tasks. Users can create or join houses, invite members via a code, manage recurring tasks, and track completions across the household.

## Features

- **Authentication** - Register and login with JWT-based sessions
- **Private Routing** - All routes except `/login` and `/register` are protected; unauthenticated users are redirected to login
- **User Profile** - View your name, email, and a list of houses with your role in each
- **House Management** - Create a house or join an existing one via invite code
- **Member Management** - View, manage roles, and remove members; add users without an account (dummy users)
- **Role-based Access** - Admin-only sections (e.g. inactive user tasks) are gated by `currentUserRole`
- **Task Management** - Add tasks with recurrence schedules and member assignments
- **Task Completion** - Check off tasks; when multiple inactive users are assigned, a modal prompts to select who completed it
- **House Statistics** - Per-house task completion stats filtered by user and date range, with time-spent tracking
- **Internationalisation** - Full French/English support via i18next; language switcher (🇬🇧 / 🇫🇷) in the navigation bar, persisted in `localStorage`
- **Error Handling** - GraphQL union errors (`UserError`, `HouseError`) are displayed inline
- **Mobile-responsive** - All pages, including ManageUsers, are designed for small screens

## Tech Stack

- **React 19** with React Router v7
- **Apollo Client** for GraphQL communication
- **Tailwind CSS** for styling
- **i18next / react-i18next** for internationalisation (EN + FR)
- **Create React App** as the build toolchain

## Getting Started

### Prerequisites

- Node.js and npm
- A running instance of the HomeSync backend (GraphQL API)

### Installation

```bash
npm install
```

### Environment

Create a `.env` file at the project root:

```
REACT_APP_GRAPHQL_URL=http://localhost:8000/graphql
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

All routes except `/login` and `/register` are protected by `PrivateRoute` — unauthenticated users are redirected to `/login`.

| Path | Description |
|------|-------------|
| `/` | Home — lists all houses for the logged-in user |
| `/login` | Login page |
| `/register` | Registration page |
| `/profile` | User profile — name, email, and house memberships |
| `/create_house` | Create a new house |
| `/join_house` | Join a house via invite code |
| `/manage_house/:name/:id` | View and manage a specific house (members, tasks, invite code) |
| `/profile_house/:name/:id` | Consult house tasks assigned to the current user |
| `/add_new_task/:houseId` | Add a new task to a house |
| `/consult_task/:houseId/:taskName/:taskId` | View and interact with a specific task |
| `/update_task/:houseId/:taskName/:taskId` | Edit an existing task's title, description, weight and duration |
| `/all_tasks/:houseId` | List all tasks in a house |
| `/manage_users/:houseId` | Manage house members, roles, and dummy users |
| `/house_statistics/:name/:id` | Task completion statistics for a house |

## Project Structure

```
src/
├── graphQl/
│   ├── query.js        # GraphQL queries
│   └── mutation.js     # GraphQL mutations
├── house/
│   ├── AddHouse.jsx
│   ├── AdminNavigationBar.jsx
│   ├── JoinHouse.jsx
│   ├── Managehouse.jsx
│   ├── ConsultHouse.jsx
│   ├── HouseStatistics.jsx
│   └── ManageUsers.jsx
├── task/
│   ├── AddNewTask.jsx
│   ├── AddNewTaskButton.jsx
│   ├── AllTasks.jsx
│   ├── ConsultTask.jsx
│   └── UpdateTask.jsx
├── user/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Profile.jsx
├── locales/
│   ├── en/translation.json
│   └── fr/translation.json
├── utils/
│   ├── auth.js              # Auth helpers
│   └── periodKeyService.js
├── App.js
├── AuthContext.jsx
├── HomeComponent.jsx
├── i18n.js                  # i18next initialisation
├── LanguageSwitcher.jsx
├── Menu.jsx
└── router.jsx
```

## Key Behaviours

### Internationalisation
- Supported languages: **English** and **French**
- The language switcher (flag + code) is displayed in both the desktop nav and the mobile menu
- The selected language is persisted in `localStorage` under the key `i18nextLng`
- On first visit, the browser language is detected and used if it is `en` or `fr`; otherwise it falls back to English
- All UI strings — labels, placeholders, validation messages, success/error toasts — are translated
- Translation files live in `src/locales/{en,fr}/translation.json`

### HouseStatistics (`/house_statistics/:name/:id`)
- Visible to admins only via the `AdminNavigationBar`
- Filter completions by user (all or a specific member) and by date range
- The range start defaults to the beginning of the current week (Monday 00:00:00)
- Each task card shows actual vs. expected completions and a progress bar
- Total time spent is shown at the bottom when `timeToComplete` data is available

### ManageUsers (`/manage_users/:houseId`)
- Displays members as responsive cards (no table) — works on all screen sizes
- Change a member's role via a dropdown — updates fire immediately on `onChange`
- Remove a member with a confirmation modal before the mutation runs
- Add a user without an account (dummy user) via the form at the bottom
- `UserError` and `HouseError` messages from mutations are displayed in a red banner

### ConsultHouse (`/profile_house/:name/:id`)
- Tasks are grouped by recurrence and shown in two sections: tasks for the current user and tasks for inactive (dummy) users
- The inactive user section is only visible to admins
- When an inactive-user task has multiple assignees, a modal prompts the admin to pick who completed it before the mutation is called

### Profile (`/profile`)
- Displays the logged-in user's name, email, and all house memberships with their role in each house

## Deployment

A GitHub Actions workflow (`.github/workflows/frontend-deploy.yml`) automatically deploys on every push to `main`:

1. SSH into the production server
2. Pull the latest code
3. Run `npm install`
4. Run `npm run build`

Required GitHub secrets: `HOST`, `USERNAME`, `SSH_KEY`.
