import fb from 'firebase'
import firebase from 'firebase/app';
import "firebase/firestore"
import "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyAtqpV7LO6gCAMi2sz97VciXG0qPtFzbdM",
    authDomain: "ceklinik.firebaseapp.com",
    projectId: "ceklinik",
    storageBucket: "ceklinik.appspot.com",
    messagingSenderId: "813567883719",
    appId: "1:813567883719:web:8c0550edcbbc6a33cfc1e2",
    measurementId: "G-ZPS78GN40J"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db =  firebase.firestore()
// const realtime =  firebase.database;
const dbRef = fb.database();
// // Get a reference to the storage service, which is used to create references in your storage bucket
const storage = firebase.storage();
// // Create a storage reference from our storage service
const storageRef = storage.ref();


export {firebase, auth, db, firebaseApp, dbRef,storageRef}