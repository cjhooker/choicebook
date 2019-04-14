import * as firebase from "firebase";
import PageData, { MapToPageData } from "./DTOs/PageData";

export function getBeginningPageIdForStory(storyId: string) {
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

export function getPage(pageId: string): Promise<PageData> {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var docRef = db.collection("pages").doc(pageId);

    docRef.get()
      .then((doc) => {
        if (doc.exists) {
          let data = MapToPageData(doc);
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

export function savePage(page: PageData) {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var docRef = db.collection("pages").doc(page.pageId);
    docRef.set({ ...page }, { merge: true })
      .then(() => resolve())
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