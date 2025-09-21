// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

// Your web app's Firebase configuration
// PASTE YOUR OWN CONFIGURATION OBJECT HERE
const firebaseConfig = {
  apiKey: "AIzaSyBgvQzxswDr2WJhhTbYOHNIJvhbT3gq2to",
  authDomain: "studio-8369945776-e918f.firebaseapp.com",
  projectId: "studio-8369945776-e918f",
  storageBucket: "studio-8369945776-e918f.appspot.com",
  messagingSenderId: "1064616923768",
  appId: "1:1064616923768:web:4d85b4af913b1547e0938d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you'll need
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
