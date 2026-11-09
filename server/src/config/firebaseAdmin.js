import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export function getFirebaseAdminAuth() {
  if (getApps().length > 0) {
    return getAuth();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawPrivateKey) {
    throw new Error("Firebase Admin credentials are missing from server/.env.");
  }

  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");
  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  return getAuth(app);
}
