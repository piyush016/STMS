// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6VlbwpdbFNJ7wrJG_vJKcAXG5IYfrKLI",
  authDomain: "resume-builder-f4199.firebaseapp.com",
  projectId: "resume-builder-f4199",
  storageBucket: "resume-builder-f4199.appspot.com",
  messagingSenderId: "340239128556",
  appId: "1:340239128556:web:58d335b1a929005d07d2c9",
  measurementId: "G-SSET9K2M08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export {app, auth, db, storage};