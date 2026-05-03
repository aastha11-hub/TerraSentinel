import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from "firebase/auth";

export { GoogleAuthProvider };

const firebaseConfig = {
  apiKey: "AIzaSyDQPpu4FjiYhDN1Hcj7ELrG0SFGW1DGQl0",
  authDomain: "terrasentinel-1.firebaseapp.com",
  projectId: "terrasentinel-1",
  storageBucket: "terrasentinel-1.firebasestorage.app",
  messagingSenderId: "96748002872",
  appId: "1:96748002872:web:e5c984f7487884e5bed0cd",
  measurementId: "G-0WMWRM9SV2",
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);

export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
