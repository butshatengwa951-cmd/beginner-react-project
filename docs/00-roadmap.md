# Learning roadmap

This repository is both a working application and a guided set of practical lessons. The goal is to understand the decisions and data flow, not merely to get a screen running.

## Day 1 — React foundations

Study:
- JSX and how it differs from Vue templates.
- Function components, props, and component composition.
- State with useState and why React state updates trigger renders.
- Event handlers and controlled inputs.
- useEffect for synchronising with external systems.
- Context for shared authentication state.
- Client-side routing and protected screens.

Explore:
- client/src/main.jsx
- client/src/App.jsx
- client/src/pages/
- client/src/components/
- client/src/context/AuthContext.jsx

Practical result: understand the interface and be able to add a field, a component, and a new piece of state.

## Day 2 — Firebase Authentication

Study:
- Firebase project and web app configuration.
- Email/password provider.
- createUserWithEmailAndPassword and signInWithEmailAndPassword.
- onAuthStateChanged and session restoration.
- Firebase ID tokens and getIdToken().
- The difference between authentication and authorization.

Explore:
- client/src/services/firebase.js
- client/src/context/AuthContext.jsx
- client/src/pages/LoginPage.jsx
- client/src/pages/RegisterPage.jsx
- client/src/components/ProtectedRoute.jsx

Practical result: register, sign in, refresh the page without losing the session, and sign out.

## Day 3 — Express and Google Sheets

Study:
- HTTP methods, status codes, JSON and REST-style routes.
- Express middleware and request lifecycle.
- Firebase Admin token verification.
- Google Cloud service accounts and spreadsheet sharing.
- Reading, appending, updating and clearing spreadsheet rows.
- User ownership checks on every data operation.

Explore:
- server/src/server.js
- server/src/middleware/requireAuth.js
- server/src/routes/taskRoutes.js
- server/src/services/googleSheets.js
- client/src/services/api.js

Practical result: trace create, read, update and delete from the browser to the spreadsheet.

## End-of-learning assessment

After three days of practical work, ask for the assessment. It should test concepts from the actual codebase and include practical changes rather than trivia. Until then, use the notes as a reference and ask questions whenever something is unclear.

## A useful study loop

1. Read the note for the topic.
2. Open the referenced source file.
3. Explain to yourself what each function receives and returns.
4. Trace one user action across the app.
5. Change one small thing and run it.
6. Read the error message before changing code.
7. Write down what surprised you or what you still do not understand.
