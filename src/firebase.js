// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence, inMemoryPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCpkcTKF-5g4ZIFEVDy0lalAylYY6hSb7o",
    authDomain: "skillsync-e6540.firebaseapp.com",
    projectId: "skillsync-e6540",
    storageBucket: "skillsync-e6540.appspot.com",
    messagingSenderId: "498427951370",
    appId: "1:498427951370:web:d64bcb23426e6289f522f3",
    measurementId: "G-KTJFVETW42"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Set session token refresh time to 20 minutes (1200000 milliseconds)
auth.tokenRefreshTime = 1200000;
// Configure persistence to keep user logged in between page refreshes
setPersistence(auth, browserLocalPersistence);

export const db = getFirestore(app);
export const storage = getStorage(app);
