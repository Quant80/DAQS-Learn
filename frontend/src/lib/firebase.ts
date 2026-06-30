import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

// Guard against SSR pre-rendering during `next build` — Firebase Auth
// cannot initialize server-side with missing/invalid credentials.
// The module re-evaluates fresh in the browser where real keys are available.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _auth: any = null;
try {
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  _auth = getAuth(app);
} catch {
  // SSR build context — auth will be null; real init happens in the browser
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth = _auth as ReturnType<typeof getAuth>;
