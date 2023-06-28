// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2FfvJLpK-_CeW0vbcpAh_e3rgzEj0NMM",
  authDomain: "traffic-management-74f3d.firebaseapp.com",
  projectId: "traffic-management-74f3d",
  storageBucket: "traffic-management-74f3d.appspot.com",
  messagingSenderId: "972874750777",
  appId: "1:972874750777:web:6518519f0d9f8de2efe6e8",
  measurementId: "G-HX29W9E2B3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export {app, auth, db, storage};