import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLPCWmrh1eQzbdyuRmVFraVZGHXP6aZqI",
  authDomain: "providentia-b8a9d.firebaseapp.com",
  databaseURL:
    "https://providentia-b8a9d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "providentia-b8a9d",
  storageBucket: "providentia-b8a9d.appspot.com",
  messagingSenderId: "1071408431623",
  appId: "1:1071408431623:web:1e77928a5de4d64b89e0a2",
  measurementId: "G-DZ1XBRKHFK",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
