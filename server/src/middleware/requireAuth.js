import { getFirebaseAdminAuth } from "../config/firebaseAdmin.js";

export async function requireAuth(request, response, next) {
  const authorization = request.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return response.status(401).json({
      message: "Authentication is required for this request.",
    });
  }

  const idToken = authorization.slice("Bearer ".length);

  // Treat a server configuration problem differently from an invalid user token.
  let firebaseAuth;
  try {
    firebaseAuth = getFirebaseAdminAuth();
  } catch (configurationError) {
    return next(configurationError);
  }

  try {
    // verifyIdToken validates the token before we trust its UID.
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    request.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
    };
    return next();
  } catch (tokenError) {
    return response.status(401).json({
      message: "Your session is invalid or has expired. Please sign in again.",
    });
  }
}
