// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_kTQ9oEgVTCHjNHOts_Tb6ukOw1XX7g0",
  authDomain: "codesage-b4c5a.firebaseapp.com",
  projectId: "codesage-b4c5a",
  storageBucket: "codesage-b4c5a.appspot.com",
  messagingSenderId: "657472427837",
  appId: "1:657472427837:web:40be68844a25ef36cd9754",
  measurementId: "G-921KK1BNGD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);