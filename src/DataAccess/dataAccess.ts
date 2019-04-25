import * as firebase from "firebase";

const API_KEY = process.env.FIREBASE_API_KEY;

export function initialize() {
  firebase.initializeApp({
    apiKey: API_KEY,
    authDomain: 'choicebook-cjh.firebaseapp.com',
    projectId: 'choicebook-cjh'
  });
}