import fb from "firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
// const realtime =  firebase.database;
const dbRef = fb.database();
// // Get a reference to the storage service, which is used to create references in your storage bucket
const storage = firebase.storage();
// // Create a storage reference from our storage service
const storageRef = storage.ref();

export { firebase, auth, db, firebaseApp, dbRef, storageRef };
