# Practical labs

These are small experiments to do while reading the project. They are not the end-of-three-day test. The aim is to make one change, observe it, and explain what happened.

## Lab 1 — React components and props

1. Find TaskList.jsx.
2. Add a small piece of UI showing each task's category.
3. Change the category options in TaskForm.jsx.
4. Explain how the child receives tasks and callbacks from DashboardPage.

Vue connection: compare props and callback props with defineProps and emitted events.

## Lab 2 — State and forms

1. Add a notes field to TaskForm.
2. Keep it controlled with value and onChange.
3. Decide whether it should be saved in the spreadsheet.
4. If yes, update the column headers, row mapping, API validation and frontend form.

Do not update only the form: follow the data through all layers.

## Lab 3 — Add a filter

Add a filter to show All, Not started, In progress, or Completed tasks.

Hint: keep the original tasks in state and derive a filtered array during render. Do not store a second copy of the same data unless there is a good reason.

## Lab 4 — Improve authentication

Add a confirm-password field to registration. Validate that both password fields match before calling Firebase. Explain which validation belongs in the browser and which checks must be enforced by a trusted service.

## Lab 5 — Add an API endpoint

Add GET /api/tasks/:id. It should only return a task if both its ID and request.user.uid match a row. Return 404 for a missing task or a task owned by another user.

## Lab 6 — Understand the data boundary

Temporarily inspect the browser's Network tab while creating a task. Identify:
- The HTTP method and URL.
- The JSON request body.
- The Authorization header.
- The JSON response.

Do not copy ID tokens or private credentials into notes, screenshots, chat messages, or Git commits.

## Lab 7 — Explain the architecture

Without looking at the notes, draw the route from the Register button to Firebase, then from the Add Task button to Google Sheets. Mark which code runs in the browser and which code runs on the server.
