import { getFirestore } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCeJGS_Gw9k6RQk6iTuH5YaRfoRIH8uxv4",
  authDomain: "ateatampa.firebaseapp.com",
  projectId: "ateatampa",
  storageBucket: "ateatampa.firebasestorage.app",
  messagingSenderId: "953680922638",
  appId: "1:953680922638:web:dd88dae7489bc65c5d545f"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);

let auth;
try{
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app)
}

export { db, auth };
