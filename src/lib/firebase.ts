// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "task-forest-bnkxy",
  appId: "1:298212702743:web:b8166a432c895f5913fa52",
  storageBucket: "task-forest-bnkxy.firebasestorage.app",
  apiKey: "AIzaSyCoYcmcEvmqqsMSyjSDjGMWAsRA2D3A_B4",
  authDomain: "task-forest-bnkxy.firebaseapp.com",
  messagingSenderId: "298212702743"
};


// Initialize Firebase for client-side
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
