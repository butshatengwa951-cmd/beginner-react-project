# Follow one task through the entire application

The most useful way to understand this project is to trace a single action from the browser to the spreadsheet and back.

## Example: creating a task

1. The user types a task into TaskForm.jsx.
2. React stores input values in component state with useState.
3. The form's onSubmit handler prevents a full browser page reload.
4. TaskForm calls the onCreate prop supplied by DashboardPage.
5. DashboardPage calls createTask() from client/src/services/api.js.
6. api.js asks the signed-in Firebase user for an ID token.
7. fetch sends POST /api/tasks with a JSON body and Authorization: Bearer token.
8. Express receives the request and runs requireAuth middleware.
9. Firebase Admin verifies the token and sets request.user.uid.
10. The route validates the title and calls createTask() in googleSheets.js.
11. googleSheets.js appends a row to the Tasks sheet with the verified UID.
12. The API returns the created task as JSON.
13. DashboardPage adds that task to React state.
14. React renders the updated task list.

## Trace the source files

| Step | File |
|---|---|
| Form input | client/src/components/TaskForm.jsx |
| Parent callback and state | client/src/pages/DashboardPage.jsx |
| Browser HTTP request | client/src/services/api.js |
| Express app | server/src/server.js |
| Token verification | server/src/middleware/requireAuth.js |
| Route and validation | server/src/routes/taskRoutes.js |
| Spreadsheet API call | server/src/services/googleSheets.js |

## Why the UID matters

Imagine two people use the application. Both can send a request to GET /api/tasks. The server verifies each person's token and uses that token's UID to filter the spreadsheet rows.

For updates and deletes, the server searches for a row matching both task ID and UID. Knowing another user's task ID should not grant access to that task.

## A useful debugging sequence

When something fails, check in this order:
1. Is the React form handler being called?
2. Does the browser Network tab show a request?
3. Is the request URL and HTTP method correct?
4. Is the Authorization header present?
5. Does Express receive the request?
6. Does requireAuth accept the token?
7. Does the route validation pass?
8. Can the Google service account access the spreadsheet?
9. Does the API return the expected JSON?
10. Does the React state update?

The browser console, Network tab, and terminal running Express show different parts of the same request. Learn to use all three.
