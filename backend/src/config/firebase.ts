import admin from 'firebase-admin';

// TODO: The user will provide the service account JSON
// You can either use a path to a JSON file or environment variables
// process.env.FIREBASE_SERVICE_ACCOUNT

export const initFirebaseAdmin = (serviceAccountJson?: any) => {
  if (!admin.apps.length) {
    if (serviceAccountJson) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountJson)
      });
    } else {
      console.warn("Firebase Admin initialized without credentials. Please provide credentials.");
      admin.initializeApp();
    }
  }
};

export const verifyGoogleToken = async (idToken: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    throw new Error("Unauthorized");
  }
};
