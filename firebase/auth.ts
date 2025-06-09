// firebase/auth.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = "supersecretkey"; // Ganti dengan env secret

export async function register(email: string, password: string, apiKey: string) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCred.user.uid;
  const encryptedKey = CryptoJS.AES.encrypt(apiKey, ENCRYPTION_KEY).toString();

  await setDoc(doc(db, "Users", uid), {
    uid,
    email,
    role: "master",
    tokocryptoApiKey: encryptedKey,
    currentTier: 1,
    balance: 300000,
    settings: {
      autoTierTransition: true,
      riskTolerance: "aggressive",
      notifications: true
    }
  });
}

export async function login(email: string, password: string) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}
