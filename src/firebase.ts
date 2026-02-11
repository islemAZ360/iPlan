import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAizFwWVKOw9HKyz3k_lJ52J130XSRjbs",
  authDomain: "iplan-bad48.firebaseapp.com",
  projectId: "iplan-bad48",
  storageBucket: "iplan-bad48.firebasestorage.app",
  messagingSenderId: "424874599522",
  appId: "1:424874599522:web:e35d9678a41e7ee8545d3b",
  measurementId: "G-LK8TMJG2ZR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);