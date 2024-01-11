// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const FB_API_KEY = process.env.FB_API_KEY;
const FB_AUTH_DOMAIN = process.env.FB_AUTH_DOMAIN;
const FB_PROJECT_ID = process.env.FB_PROJECT_ID;
const FB_STORAGE_BUCKET = process.env.FB_STORAGE_BUCKET;
const FB_MESSAGING_SENDER_ID = process.env.FB_MESSAGING_SENDER_ID;
const FB_APP_ID = process.env.FB_APP_ID;
const FB_MEASUREMENT_ID = process.env.FB_MEASUREMENT_ID;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);