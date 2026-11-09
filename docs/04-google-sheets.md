# Google Sheets as a lightweight data store

This project uses one spreadsheet tab as a simple table. Each row represents a task. This is a learning exercise, not a recommendation to use spreadsheets as a production database.

## 1. Create the spreadsheet

1. Create a new Google spreadsheet.
2. Rename the first tab to Tasks (capital T).
3. Add these exact headings to row 1:

| Column | Heading | Meaning |
|---|---|---|
| A | id | Unique task ID |
| B | userId | Firebase UID of the owner |
| C | title | Task title |
| D | category | Learning area |
| E | status | Not started / In progress / Completed |
| F | dueDate | Optional date |
| G | createdAt | ISO date-time when created |

Keep the column order stable because the service maps each array position to a property.

## 2. Enable the Google Sheets API

1. Open Google Cloud Console: https://console.cloud.google.com/
2. Select or create a Google Cloud project.
3. Open APIs & Services → Library.
4. Search for Google Sheets API and enable it.
5. Create a service account under IAM & Admin → Service Accounts.
6. Create a key for that service account and store it securely.

Google Cloud's interface may change over time; follow the current console labels if a menu has moved.

## 3. Share the spreadsheet

Copy the service account email address. It looks like an email address ending in iam.gserviceaccount.com.

Open the spreadsheet's Share dialog and give that email Editor access. The API can only edit a spreadsheet that the service account has permission to access.

The spreadsheet ID is the long value between /d/ and /edit in the spreadsheet URL. Put it in server/.env as GOOGLE_SHEETS_SPREADSHEET_ID.

## 4. Configure server credentials

The server uses:
- GOOGLE_SERVICE_ACCOUNT_EMAIL
- GOOGLE_PRIVATE_KEY
- GOOGLE_SHEETS_SPREADSHEET_ID

The Firebase Admin setup uses a separate set of environment variable names. You may use one service account for both roles if it is configured with the required project permissions and spreadsheet access; otherwise use separate service accounts.

For the private key in .env, keep it as one quoted value with newline characters represented as \n. The server replaces those escaped newline sequences before creating the Google API client.

Do not put these credentials in client/.env. Do not prefix them with VITE_. Never commit server/.env or a downloaded service-account key.

## 5. How the code maps rows to objects

Google Sheets returns values as a two-dimensional array:

~~~js
[
  ["id", "userId", "title", "category", "status", "dueDate", "createdAt"],
  ["abc123", "firebase-uid", "Learn hooks", "React", "In progress", "", "2026-11-09T08:00:00.000Z"]
]
~~~

googleSheets.js removes the heading row, then rowToTask maps array positions into an object. The frontend can then work with task.title instead of task[2].

## 6. CRUD operations

| Operation | Sheets API method | Project function |
|---|---|---|
| Read | spreadsheets.values.get | readSheetRows / getTasksForUser |
| Create | spreadsheets.values.append | createTask |
| Update | spreadsheets.values.update | updateTask |
| Delete | spreadsheets.values.clear | deleteTask |

The delete operation clears cells rather than deleting the physical spreadsheet row. This keeps the row numbers of other tasks stable and avoids shifting the rows during a simple learning example.

## 7. Important database caveats

Google Sheets does not provide the same constraints, indexes, transactions, concurrency control or row-level security as a database. This sample:
- Filters reads by the verified Firebase UID.
- Looks up a row by both task ID and owner UID before updating or clearing it.
- Generates task IDs on the server.
- Never accepts the owner UID from the browser.

For a real application with important or high-volume data, choose a database designed for concurrent application requests. Also review Google Sheets API quotas and limits before relying on it.
