import * as firebase from "firebase";
import ChoiceData, {MapToChoiceData} from "./DTOs/ChoiceData";

export function getChoicesForPage(pageId: string) {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var choicesRef = db.collection("choices");
    var query = choicesRef.where("sourcePageId", "==", pageId);

    query.get()
      .then((querySnapshot) => {
        resolve(querySnapshot.docs.map(MapToChoiceData));
      })
      .catch(error => reject("Error getting documents: " + error))
  });
}

export function saveChoices(choices: ChoiceData[]) {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var choicesRef = db.collection("choices");
    let promises = [];
    for (let choice of choices) {
      if (!choice.wasEdited) {
        continue;
      }

      let doc = choicesRef.doc(choice.choiceId)
      promises.push(
        doc.set({ text: choice.text }, { merge: true})
      );
    }

    Promise.all(promises)
      .then(() => resolve())
      .catch(error => reject("Error saving choices:" + error))
  });
}

// Returns the id of the added choice
export function addChoice(choice: ChoiceData): Promise<string> {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var choicesRef = db.collection("choices");

    choicesRef.add(choice)
      .then((doc) => resolve(doc.id))
      .catch(error => reject("Error adding choice:" + error));
  });
}
