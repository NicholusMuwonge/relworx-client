import firebase from "firebase/app";
import dotenv from "dotenv";

import "firebase/storage";

dotenv.config();
var firebaseConfig = {
  // apiKey: `${process.env.REACT_APP_API_KEY}`,
  // authDomain: `${process.env.REACT_APP_DOMAIN}`,
  // databaseURL: `${process.env.REACT_APP_URL}`,
  // projectId: `${process.env.REACT_APP_PROJECTID}`,
  // storageBucket: `${process.env.REACT_APP_BUCKET}`,
  // messagingSenderId: `${process.env.REACT_APP_SENDER_ID}`,
  // appId: `${process.env.REACT_APP_APP_ID}`,
  // measurementId: `${process.env.REACT_APP_MEASUREMENT_ID}`,
    apiKey: "AIzaSyAl7KMRFa1fagUoFvdS_ObsDLl88ix9zyE",
    authDomain: "relworx-53b83.firebaseapp.com",
    databaseURL: "https://relworx-53b83.firebaseio.com",
    projectId: "relworx-53b83",
    storageBucket: "relworx-53b83.appspot.com",
    messagingSenderId: "818782650463",
    appId: "1:818782650463:web:66c975506a8ce825fe9bea",
    measurementId: "G-ZQ869QFGFK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
