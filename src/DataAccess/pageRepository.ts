import * as firebase from "firebase";
import PageData, { MapToPageData } from "./DTOs/PageData";

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