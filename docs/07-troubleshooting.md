# Troubleshooting checklist

## Vite / React

**The terminal says a package cannot be found.**
- Confirm you are in the client folder.
- Run npm install in client.
- Check that the import path and filename casing match exactly.

**The page is blank.**
- Inspect the browser console for a JSX or import error.
- Check the terminal running Vite.
- Confirm main.jsx imports both index.css and App.css.

**Firebase setup warning appears.**
- Make sure client/.env exists (not just .env.example).
- Check each VITE_FIREBASE_* value.
- Restart Vite after editing the env file.
- Confirm the Email/Password provider is enabled in Firebase Authentication.

## Express API

**The browser reports a network or CORS error.**
- Confirm the Express server is running.
- Check VITE_API_BASE_URL in client/.env.
- Check CLIENT_ORIGIN in server/.env matches the frontend origin exactly.
- Restart both servers after editing environment variables.

**The task request returns 401.**
- Confirm you are signed in.
- Inspect the request to see whether Authorization: Bearer is present.
- Check the Firebase project ID and Admin service-account credentials.
- Do not try to fix this by trusting a UID from the request body.

**The task request returns 500.**
- Read the server terminal output.
- Check the spreadsheet ID and service-account credentials.
- Make sure the Sheets API is enabled.
- Check that the spreadsheet is shared with the Google service-account email.
- Confirm the tab is named Tasks and the columns are in the documented order.

## Google Sheets

**The spreadsheet is found but access is denied.**
The spreadsheet must be shared with the service account email as an Editor. Being signed into the browser with your personal Google account does not grant access to the server's service account.

**The API cannot find the tab.**
Check the tab name. It must be Tasks with a capital T.

**Rows do not line up with the application fields.**
Do not reorder columns casually. The server maps the values array by fixed column position. Update the header list and rowToTask/create/update mapping together when you add a field.

## Debugging habit

Capture the exact error message and identify which layer produced it: browser React code, Firebase client SDK, network request, Express middleware, route validation, Google API authentication, or Sheets range. This makes troubleshooting much faster than changing several files at once.
