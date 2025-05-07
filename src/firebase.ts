import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBoY2QtYE75Brzfx3u_ZYjT2wL0Z_f9yG8",
  authDomain: "desplugapp.firebaseapp.com",
  projectId: "desplugapp",
  storageBucket: "desplugapp.firebasestorage.app",
  messagingSenderId: "579876168108",
  appId: "1:579876168108:web:f0c29636523f7c25de1a09",
  measurementId: "G-HN6P12H7FJ"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)