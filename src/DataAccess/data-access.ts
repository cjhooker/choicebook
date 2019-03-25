import * as firebase from "firebase"
import IChoiceMapper from "./IChoiceMapper";

export function initialize() {
  firebase.initializeApp({
    apiKey: ' AIzaSyBi2KbEFSMemDyHnYuKnISxWibsrMbx3fE',
    authDomain: 'choicebook-cjh.firebaseapp.com',
    projectId: 'choicebook-cjh'
  });
}

export function getStory(storyId: string) {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var docRef = db.collection("stories").doc(storyId);

    docRef.get()
      .then((doc) => {
        if (doc.exists) {
          let data = doc.data();
          if (data !== undefined) {
            resolve(data);
          } else {
            reject("data is undefined");
          }
        } else {
          reject("No such document!");
        }
      })
      .catch(error => reject("Error getting document: " + error))
  });
}

export function getBeginningPageId(storyId: string) {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var pagesRef = db.collection("pages");
    var query = pagesRef
      .where("storyId", "==", storyId)
      .where("isBeginning", "==", true);

    query.get()
      .then((querySnapshot) => {
        if (querySnapshot.size == 0) {
          reject("Error: No beginning page");
          return;
        }

        if (querySnapshot.size > 1) {
          reject("Error: More than one beginning page");
          return;
        }

        resolve(querySnapshot.docs[0].id);
      })
      .catch(error => reject("Error getting documents: " + error))
  });
}

export function getPage(pageId: string) {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var docRef = db.collection("pages").doc(pageId);

    docRef.get()
      .then((doc) => {
        if (doc.exists) {
          let data = doc.data();
          if (data !== undefined) {
            resolve(data);
          }
        } else {
          reject("No such document!");
        }
      })
      .catch(error => reject("Error getting document:" + error))
  });
}

export function getPageChoices(pageId: string) {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var choicesRef = db.collection("choices");
    var query = choicesRef.where("sourcePageId", "==", pageId);

    query.get()
      .then((querySnapshot) => {
        resolve(querySnapshot.docs.map(IChoiceMapper));
      })
      .catch(error => reject("Error getting documents: " + error))
  });
}

export function savePageText(pageId: string, text: string) {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var docRef = db.collection("pages").doc(pageId);
    docRef.set({ text }, { merge: true })
      .catch(error => reject("Error setting document:" + error))
  });
}

  // db.collection("pages").add({
    //   text: "Now is the time for **some** good women to come to the aid of their _state_.\n\nThe quick brown dog jumped over the lazy foxes."
    // })
    // .then(function() {
    //   console.log("Document successfully written!");
    // })
    // .catch(function(error) {
    //   console.error("Error writing document: ", error);
    // });