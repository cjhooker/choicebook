import * as firebase from "firebase";

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
