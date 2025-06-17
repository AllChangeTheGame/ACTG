import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbsZCJsdXu0WhgfK4iNQUnvYxZyFzsHqM",
  authDomain: "actg-7a9fb.firebaseapp.com",
  projectId: "actg-7a9fb",
  storageBucket: "actg-7a9fb.firebasestorage.app",
  messagingSenderId: "26105626832",
  appId: "1:26105626832:web:547dd2aa224965481dded5",
  measurementId: "G-TKGBBW46VE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);