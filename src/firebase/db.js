import { initializeApp } from "firebase/app";
import firebaseConfig from "@/firebase/firebaseConfig";
import { getFirestore } from "firebase/firestore";

initializeApp(firebaseConfig);
const db = getFirestore();

export { db };
