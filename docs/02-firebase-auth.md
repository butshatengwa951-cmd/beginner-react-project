# Firebase Authentication

Firebase Authentication manages identity. It answers: "Who is signed in?" It does not automatically decide what that user is allowed to do in your own API.

## 1. Create a Firebase project

1. Open the Firebase console.
2. Create a project for this practice application.
3. Add a Web app to the project.
4. Register the app and copy its web configuration.
5. In Authentication, open Sign-in method and enable Email/Password.

Copy the web configuration values into client/.env:

~~~env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
~~~

Restart Vite after changing environment variables. Vite reads env files when the dev server starts.

The Firebase web config identifies the browser app. It is not a service-account private key. Never put Admin SDK private keys into VITE_ variables: anything exposed to Vite client code can be inspected by users in the browser.

## 2. Configure Firebase Admin on the server

The server needs a trusted service-account credential so Firebase Admin can verify ID tokens.

1. In Firebase Console, open Project settings → Service accounts.
2. Generate a new private key and download the JSON file.
3. Create server/credentials if it does not exist.
4. Move the downloaded JSON into that folder and rename it service-account.json.

The resulting path should be:

~~~text
server/credentials/service-account.json
~~~

The file is deliberately ignored by Git. Keep it local and private. Do not commit it, upload it to GitHub, or paste the private key into chat.

The server loads the original JSON file directly using cert(serviceAccount). This avoids manual copy/paste errors and broken PEM newlines. The relevant code is:
- server/src/config/serviceAccount.js — reads and parses the JSON file.
- server/src/config/firebaseAdmin.js — passes the parsed service account to Firebase Admin.

## 3. Register and sign in

The project uses:
- createUserWithEmailAndPassword(auth, email, password)
- signInWithEmailAndPassword(auth, email, password)
- signOut(auth)

They return promises. That is why the form handlers use async / await and try / catch.

Vue comparison: the concepts are framework-independent. Your component calls an authentication service, awaits the result, and then updates the UI. React's state and render model is different, but the Firebase SDK calls are the same JavaScript APIs you could call from Vue.

## 4. Restore the signed-in state

onAuthStateChanged(auth, callback) observes the current authentication state. It fires when Firebase has determined whether a user is signed in, including after a page refresh.

This is why AuthContext starts with loading = true. Until the first callback arrives, the app should not assume that the user is signed out; otherwise a refresh could briefly redirect an authenticated user to the login screen.

The observer returns an unsubscribe function. The effect returns it as cleanup so the listener is removed when the provider unmounts.

## 5. Authentication versus authorization

Authentication: Firebase confirms the user's identity.

Authorization: your backend decides whether that identity may perform a specific action or access a specific record.

A Firebase user object contains a UID. The UID is a stable identifier for that account. This application uses the verified UID as the owner field for task rows.

## 6. ID tokens

The frontend calls user.getIdToken() before requesting protected API data. It sends the token in this HTTP header:

~~~http
Authorization: Bearer <ID_TOKEN>
~~~

The backend uses Firebase Admin's verifyIdToken() to validate the token. Do not decode a token yourself and treat the decoded text as proof; verification must check its signature and validity.

## 7. Try it

After setting client/.env and placing the service-account JSON in server/credentials:
1. Restart the Vite and Express development servers.
2. Register an account with an email and password.
3. Refresh the dashboard. The authentication observer should restore the session.
4. Sign out, then sign in again.

The task endpoints also need the Google Sheets API enabled and the spreadsheet shared with the service account. That is a separate step from Firebase Authentication.
