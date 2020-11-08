import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCSdBy_L9kBsTPcyRuyadFNwMoj6P6elZs",
    authDomain: "sujaygram.firebaseapp.com",
    databaseURL: "https://sujaygram.firebaseio.com",
    projectId: "sujaygram",
    storageBucket: "sujaygram.appspot.com",
    messagingSenderId: "331310509137",
    appId: "1:331310509137:web:330807aa5acd97e793dc70",
    measurementId: "G-P228X62PDQ"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };