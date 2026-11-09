# Firebase Authentication

Firebase Authentication manages identity. It answers: "Who is signed in?" It does not automatically decide what that user is allowed to do in your own API.

## 1. Create a Firebase project

1. Open the Firebase console: https://console.firebase.google.com/
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

Restart the Vite server after changing environment variables. Vite reads env files when the dev server starts.

The Firebase web config is intended to identify the browser app. It is not a service-account private key. Security must be enforced by Firebase rules and, in this project, by verifying ID tokens on the server.

## 2. Firebase client SDK

Open client/src/services/firebase.js.

- initializeApp(config) creates the Firebase app instance.
- getAuth(app) gives the app's Authentication instance.
- import.meta.env reads Vite environment variables.
- The VITE_ prefix is required for values that browser code needs.
- The module checks for missing settings so the UI can still load while you study before configuring Firebase.

Never place Firebase Admin credentials or Google service-account private keys in a VITE_ variable. Anything exposed to Vite client code can be inspected by users in the browser.

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

After setting client/.env:
1. Restart the Vite development server.
2. Register an account with an email and password.
3. Refresh the dashboard. The authentication observer should restore the session.
4. Sign out, then sign in again.

The task endpoints will not work until the backend credentials and Google Sheet are configured too. That is expected; auth and data storage are separate steps.
