import * as firebase from "firebase";
import StoryData, { MapToStoryData } from "./DTOs/StoryData";

export function getStory(storyId: string): Promise<StoryData> {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var docRef = db.collection("stories").doc(storyId);

    docRef.get()
      .then((doc) => {
        if (doc.exists) {
          let data = MapToStoryData(doc);
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
