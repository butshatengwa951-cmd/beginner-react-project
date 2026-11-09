import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const defaultServiceAccountPath = fileURLToPath(
  new URL("../../credentials/service-account.json", import.meta.url),
);

// Load the downloaded Google service-account JSON as JSON. This avoids
// manually copying PEM keys into .env and accidentally corrupting newlines.
export function loadServiceAccount(pathFromEnvironment) {
  const filePath = pathFromEnvironment
    ? resolve(process.cwd(), pathFromEnvironment)
    : defaultServiceAccountPath;

  let serviceAccount;

  try {
    serviceAccount = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(
      "Could not read service-account JSON at " + filePath +
      ". Check the file path and make sure the JSON file is valid.",
      { cause: error },
    );
  }

  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error("The service-account JSON is missing project_id, client_email or private_key.");
  }

  return serviceAccount;
}
