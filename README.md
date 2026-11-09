# Study Tracker — React + Firebase + Google Sheets

A practical learning project for moving from Vue and vanilla JavaScript into React while building a real application.

The Study Tracker lets a signed-in user create, view, update, and delete personal study tasks. React powers the interface, Firebase Authentication manages identity, an Express API verifies users and handles requests, and Google Sheets stores task records.

> **Learning-first project:** The code is intentionally separated into small files and accompanied by notes in docs/. Read the relevant note, trace the request through the code, then experiment. You do not need to understand every file before running the project.

## Architecture

~~~text
Browser
  React + Vite
      |
      | Firebase client SDK: sign in / create account
      v
Firebase Authentication
      |
      | Firebase ID token (Bearer token)
      v
React API service ---- HTTP ----> Express API
                                  |
                                  | Firebase Admin verifies ID token
                                  v
                              Auth middleware
                                  |
                                  v
                           Google Sheets service
                                  |
                                  v
                           Google Sheets API
~~~

**Security boundary:** The browser never receives the Google service-account credentials. Every task API request carries a Firebase ID token. The Express server verifies that token and derives the owner's UID from the verified token; it does not trust a userId supplied by the browser.

## Repository layout

~~~text
beginner-react-project/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable interface pieces
│   │   ├── context/        # Shared authentication state
│   │   ├── pages/          # Route-level screens
│   │   └── services/       # Firebase and API communication
│   └── .env.example
├── server/                 # Express API
│   ├── src/
│   │   ├── middleware/     # Firebase token verification
│   │   ├── routes/         # HTTP endpoints
│   │   └── services/       # Google Sheets access
│   └── .env.example
└── docs/                   # Guided study notes and setup walkthroughs
~~~

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- A Google account
- A Firebase project (for authentication)
- A Google Cloud service account with access to the Google Sheets API (for spreadsheet storage)

## Run locally

### 1. Install dependencies

Open a terminal in the repository root:

~~~bash
cd client
npm install
cd ../server
npm install
~~~

### 2. Configure the React app

Copy client/.env.example to client/.env and fill in the Firebase **web app** configuration values.

~~~bash
cd client
cp .env.example .env
~~~

On Windows PowerShell, use:

~~~powershell
Copy-Item .env.example .env
~~~

The frontend can start without Firebase values, but sign-in and registration will show a setup message until they are provided.

### 3. Configure the API

Copy server/.env.example to server/.env. Set the Firebase Admin service-account values, Google Sheets service-account values, and the spreadsheet ID. The two service-account variable groups may use the same service account if it has both the Firebase Admin permissions you need and access to the spreadsheet.

~~~bash
cd server
cp .env.example .env
~~~

On Windows PowerShell:

~~~powershell
Copy-Item .env.example .env
~~~

**Never commit either .env file or a service-account JSON key.** Share the spreadsheet with the Google service-account email address as an Editor.

### 4. Prepare the spreadsheet

Create a Google spreadsheet and add a tab named exactly **Tasks**. Put these headers in row 1, in this order:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| id | userId | title | category | status | dueDate | createdAt |

Copy the spreadsheet ID from its URL into GOOGLE_SHEETS_SPREADSHEET_ID. Follow the Google Sheets setup notes in docs/04-google-sheets.md to enable the API and grant access.

### 5. Start the backend

In one terminal:

~~~bash
cd server
npm run dev
~~~

The API runs at http://localhost:4000. Check http://localhost:4000/api/health.

### 6. Start the frontend

In a second terminal:

~~~bash
cd client
npm run dev
~~~

Open the Vite URL shown in the terminal, usually http://localhost:5173.

## API overview

All task endpoints require:

~~~http
Authorization: Bearer <Firebase-ID-token>
~~~

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/health | Check that the API is running |
| GET | /api/tasks | List the signed-in user's tasks |
| POST | /api/tasks | Create a task |
| PATCH | /api/tasks/:id | Update a task owned by the signed-in user |
| DELETE | /api/tasks/:id | Delete a task owned by the signed-in user |

## Suggested study order

1. docs/00-roadmap.md — Learning roadmap
2. docs/01-react-foundations.md — React foundations, with Vue comparisons
3. docs/02-firebase-auth.md — Firebase Authentication
4. docs/03-express-api.md — Express API and middleware
5. docs/04-google-sheets.md — Google Sheets as the data store
6. docs/05-end-to-end-flow.md — How the whole request flows
7. docs/06-practice-labs.md — Practical exercises

## Important limitations

Google Sheets is useful for learning and lightweight prototypes, but it is not a production database. It has API quotas, limited transaction/concurrency guarantees, and no database-style row-level security. This project applies ownership checks in the backend, but a production system with multiple users and important data should use a proper database such as PostgreSQL or Firestore.

Before deploying, configure exact allowed CORS origins, secure environment variables, Firebase Authentication settings, logging, input validation, and API rate limits. Do not expose service-account credentials or accept a client-supplied owner UID.
