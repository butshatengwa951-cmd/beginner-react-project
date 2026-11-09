import { google } from "googleapis";
import { randomUUID } from "node:crypto";

const SHEET_RANGE = "Tasks!A:G";

function getSheetsClient() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!spreadsheetId || !clientEmail || !rawPrivateKey) {
    throw new Error("Google Sheets settings are missing from server/.env.");
  }

  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");
  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return {
    spreadsheetId,
    sheets: google.sheets({ version: "v4", auth }),
  };
}

async function readSheetRows() {
  const { spreadsheetId, sheets } = getSheetsClient();
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: SHEET_RANGE,
  });

  // Row 1 is the heading row. Data rows start at row 2.
  return (result.data.values || []).slice(1);
}

function rowToTask(row) {
  return {
    id: row[0] || "",
    userId: row[1] || "",
    title: row[2] || "",
    category: row[3] || "Other",
    status: row[4] || "Not started",
    dueDate: row[5] || "",
    createdAt: row[6] || "",
  };
}

export async function getTasksForUser(userId) {
  const rows = await readSheetRows();
  return rows.filter((row) => row[1] === userId).map(rowToTask).reverse();
}

export async function createTask(userId, details) {
  const { spreadsheetId, sheets } = getSheetsClient();
  const task = {
    id: randomUUID(),
    userId,
    title: details.title,
    category: details.category || "Other",
    status: "Not started",
    dueDate: details.dueDate || "",
    createdAt: new Date().toISOString(),
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: SHEET_RANGE,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[
        task.id,
        task.userId,
        task.title,
        task.category,
        task.status,
        task.dueDate,
        task.createdAt,
      ]],
    },
  });

  return task;
}

async function findOwnedTaskRow(userId, taskId) {
  const rows = await readSheetRows();
  const rowIndex = rows.findIndex(
    (row) => row[0] === taskId && row[1] === userId,
  );

  // Data row zero is physical spreadsheet row two, because row one is headings.
  return rowIndex === -1
    ? null
    : { rowNumber: rowIndex + 2, row: rows[rowIndex] };
}

export async function updateTask(userId, taskId, changes) {
  const match = await findOwnedTaskRow(userId, taskId);
  if (!match) return null;

  const { spreadsheetId, sheets } = getSheetsClient();
  const current = rowToTask(match.row);
  const updated = { ...current, ...changes, userId };

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Tasks!A" + match.rowNumber + ":G" + match.rowNumber,
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        updated.id,
        updated.userId,
        updated.title,
        updated.category,
        updated.status,
        updated.dueDate,
        updated.createdAt,
      ]],
    },
  });

  return updated;
}

export async function deleteTask(userId, taskId) {
  const match = await findOwnedTaskRow(userId, taskId);
  if (!match) return false;

  const { spreadsheetId, sheets } = getSheetsClient();

  // Clear cells instead of deleting a physical row, so later row numbers stay put.
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: "Tasks!A" + match.rowNumber + ":G" + match.rowNumber,
  });

  return true;
}
