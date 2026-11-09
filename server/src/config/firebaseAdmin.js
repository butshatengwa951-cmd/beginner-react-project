import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { loadServiceAccount } from "./serviceAccount.js";

export function getFirebaseAdminAuth() {
  if (getApps().length > 0) {
    return getAuth();
  }

  const serviceAccount = loadServiceAccount(
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
  );

  const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });

  return getAuth(app);
}
