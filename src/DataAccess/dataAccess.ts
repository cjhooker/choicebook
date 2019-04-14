import * as firebase from "firebase";

export function initialize() {
  firebase.initializeApp({
    apiKey: ' AIzaSyBi2KbEFSMemDyHnYuKnISxWibsrMbx3fE',
    authDomain: 'choicebook-cjh.firebaseapp.com',
    projectId: 'choicebook-cjh'
  });
}