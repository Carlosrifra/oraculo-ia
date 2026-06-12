import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDCkJLFxzQeJEnNLCHeDEgXcgE1h6F6yOs",
  authDomain: "oraculo-ia-199af.firebaseapp.com",
  projectId: "oraculo-ia-199af",
  storageBucket: "oraculo-ia-199af.firebasestorage.app",
  messagingSenderId: "860140791040",
  appId: "1:860140791040:web:a118d511672c2304747fe5"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
