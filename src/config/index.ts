// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
import {getFirestore} from "firebase/firestore"
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBvz-HPODSQzDAg1AcWXtYTqjHfvFpDq_k",
  authDomain: "csdept-fa540.firebaseapp.com",
  projectId: "csdept-fa540",
  storageBucket: "csdept-fa540.appspot.com",
  messagingSenderId: "589518063861",
  appId: "1:589518063861:web:177c330a963148fd2d5dbc",
  measurementId: "G-6MS584Z5FR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };