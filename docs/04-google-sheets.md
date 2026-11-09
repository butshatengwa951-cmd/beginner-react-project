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

1. Open Google Cloud Console.
2. Select the same Google Cloud project that owns your Firebase service account.
3. Open APIs & Services → Library.
4. Search for Google Sheets API and enable it.

## 3. Use the service-account JSON

The project can use the same JSON key for Firebase Admin and Google Sheets:

~~~text
server/credentials/service-account.json
~~~

Download it from Firebase Console → Project settings → Service accounts → Generate new private key. Keep it local and private; never commit it or share its private key.

The code reads client_email and private_key directly from this JSON file. This avoids manually copying the PEM private key into server/.env.

If you prefer a separate service account for Sheets, create one in Google Cloud IAM & Admin → Service Accounts, grant it the required access, download its JSON key into server/credentials, then set GOOGLE_SERVICE_ACCOUNT_PATH in server/.env to that file's path.

## 4. Share the spreadsheet

Copy the client_email value from the service-account JSON. Open your spreadsheet's Share dialog and give that email Editor access. The API can only edit a spreadsheet that the service account has permission to access.

The spreadsheet ID is the long value between /d/ and /edit in the spreadsheet URL. Put it in server/.env as GOOGLE_SHEETS_SPREADSHEET_ID.

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
