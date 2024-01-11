
//* Firebase imports
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

//* Environment variables
require("dotenv").config();
const FB_API_KEY = process.env.FB_API_KEY;
const FB_AUTH_DOMAIN = process.env.FB_AUTH_DOMAIN;
const FB_PROJECT_ID = process.env.FB_PROJECT_ID;
const FB_STORAGE_BUCKET = process.env.FB_STORAGE_BUCKET;
const FB_MESSAGING_SENDER_ID = process.env.FB_MESSAGING_SENDER_ID;
const FB_APP_ID = process.env.FB_APP_ID;
const FB_MEASUREMENT_ID = process.env.FB_MEASUREMENT_ID;

const firebaseConfig = {
  apiKey: FB_API_KEY,
  authDomain: FB_AUTH_DOMAIN,
  projectId: FB_PROJECT_ID,
  storageBucket: FB_STORAGE_BUCKET,
  messagingSenderId: FB_MESSAGING_SENDER_ID,
  appId: FB_APP_ID,
  measurementId: FB_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);