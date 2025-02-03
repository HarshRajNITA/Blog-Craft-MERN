import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { initializeApp } from "firebase/app";
import { getEnv } from "./getEnv";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API'),
  authDomain: "blog-mern-harsh.firebaseapp.com",
  projectId: "blog-mern-harsh",
  storageBucket: "blog-mern-harsh.firebasestorage.app",
  messagingSenderId: "817382639802",
  appId: "1:817382639802:web:e9b9bea8fc2c6417135a83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}