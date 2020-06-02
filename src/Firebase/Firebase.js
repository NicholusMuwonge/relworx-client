import firebase from "firebase/app";
import dotenv from "dotenv";

import "firebase/storage";

dotenv.config();
var firebaseConfig = {
  apiKey: `${process.env.REACT_APP_API_KEY}`,
  authDomain: `${process.env.REACT_APP_DOMAIN}`,
  databaseURL: `${process.env.REACT_APP_URL}`,
  projectId: `${process.env.REACT_APP_PROJECTID}`,
  storageBucket: `${process.env.REACT_APP_BUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_SENDER_ID}`,
  appId: `${process.env.REACT_APP_APP_ID}`,
  measurementId: `${process.env.REACT_APP_MEASUREMENT_ID}`,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
