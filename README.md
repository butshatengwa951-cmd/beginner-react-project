# Study Tracker — React + Firebase + Google Sheets

A practical learning project for moving from Vue and vanilla JavaScript into React while building a real application.

The Study Tracker lets a signed-in user create, view, update, and delete personal study tasks. React powers the interface, Firebase Authentication manages identity, an Express API verifies users and handles requests, and Google Sheets stores task records.

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
├── server/                 # Express API
│   ├── credentials/        # Local service-account JSON (not committed)
│   └── src/
└── docs/                   # Guided study notes
~~~

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- A Google account
- A Firebase project with Email/Password Authentication enabled
- A Google Cloud service account with access to the Google Sheets API

## Run locally

### 1. Install dependencies

From the repository root:

~~~bash
cd client
npm install
cd ../server
npm install
~~~

### 2. Configure the React app

Copy client/.env.example to client/.env and fill in the Firebase web-app configuration from Firebase Console → Project settings → General → Your apps → SDK setup and configuration.

In Windows PowerShell, run this from inside client:

~~~powershell
Copy-Item .env.example .env
~~~

On macOS/Linux, use cp .env.example .env. Restart Vite after changing environment variables.

### 3. Add the server service-account key

In Firebase Console → Project settings → Service accounts, generate a new private key and download the JSON file.

Create server/credentials if it does not exist. Move the downloaded JSON into that folder and rename it:

~~~text
server/credentials/service-account.json
~~~

The file is ignored by Git. **Never commit it, upload it to the repository, or paste its private key into chat.**

The same service account can be used for Firebase Admin and Sheets if the Google Sheets API is enabled in its Google Cloud project and the spreadsheet is shared with the service-account email as an Editor.

### 4. Configure the backend environment

Copy server/.env.example to server/.env. In Windows PowerShell, run this from inside server:

~~~powershell
Copy-Item .env.example .env
~~~

On macOS/Linux, use cp .env.example .env. The Firebase service-account path is already set in the example. Add your spreadsheet ID to GOOGLE_SHEETS_SPREADSHEET_ID. It is the long value between /d/ and /edit in the spreadsheet URL.

If you use a different service account for Sheets, set GOOGLE_SERVICE_ACCOUNT_PATH in server/.env to the path of its JSON file.

### 5. Prepare the spreadsheet

Create a Google spreadsheet and add a tab named exactly Tasks. Put these headers in row 1, in this order:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| id | userId | title | category | status | dueDate | createdAt |

Share the spreadsheet with the service-account email address as an Editor. Follow docs/04-google-sheets.md for details.

### 6. Start the backend

In a terminal inside server:

~~~bash
npm run dev
~~~

The API runs at http://localhost:4000. Check http://localhost:4000/api/health.

### 7. Start the frontend

In a second terminal inside client:

~~~bash
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
2. docs/01-react-foundations.md — React foundations with Vue comparisons
3. docs/02-firebase-auth.md — Firebase Authentication
4. docs/03-express-api.md — Express API and middleware
5. docs/04-google-sheets.md — Google Sheets as the data store
6. docs/05-end-to-end-flow.md — How the whole request flows
7. docs/06-practice-labs.md — Practical exercises
8. docs/07-troubleshooting.md — Common setup issues

## Important limitations

Google Sheets is useful for learning and lightweight prototypes, but it is not a production database. It has API quotas, limited transaction/concurrency guarantees, and no database-style row-level security. This project applies ownership checks in the backend, but a production system with multiple users and important data should use a proper database such as PostgreSQL or Firestore.

Before deploying, configure exact allowed CORS origins, secure environment variables, Firebase Authentication settings, logging, input validation, and API rate limits. Do not expose service-account credentials or accept a client-supplied owner UID.
