import * as firebase from "firebase";
import ChoiceData, { MapToChoiceData } from "./DTOs/ChoiceData";
import ChoiceCollection, { ChoiceStatus } from "./DTOs/ChoiceCollection";

export function getChoicesForPage(pageId: string): Promise<ChoiceData[]> {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var choicesRef = db.collection("choices");
    var query = choicesRef.where("sourcePageId", "==", pageId);

    query
      .get()
      .then(querySnapshot => {
        resolve(querySnapshot.docs.map(MapToChoiceData));
      })
      .catch(error => reject("Error getting documents: " + error));
  });
}

export function saveChoices(
  choices: ChoiceCollection
): Promise<ChoiceCollection> {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var choicesRef = db.collection("choices");
    let promises: Promise<void | boolean>[] = [];

    for (let choice of choices.getByStatus(ChoiceStatus.Deleted)) {
      promises.push(deleteChoice(choice.choiceId));
    }

    for (let choice of choices.getByStatus(ChoiceStatus.Edited)) {
      let doc = choicesRef.doc(choice.choiceId);
      promises.push(doc.set({ text: choice.text }, { merge: true }));
    }

    for (let choice of choices.getByStatus(ChoiceStatus.Added)) {
      let promise = addChoice(choice).then(choiceId => {
        choice.choiceId = choiceId;
      });
      promises.push(promise);
    }

    Promise.all(promises)
      .then(() => {
        resolve(choices.onCollectionSaved());
      })
      .catch(error => reject("Error saving choices:" + error));
  });
}

// Returns the id of the added choice
export function addChoice(choice: ChoiceData): Promise<string> {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var choicesRef = db.collection("choices");

    choicesRef
      .add(choice)
      .then(doc => resolve(doc.id))
      .catch(error => reject("Error adding choice:" + error));
  });
}

export function deleteChoice(choiceId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    var choicesRef = db.collection("choices");

    choicesRef
      .doc(choiceId)
      .delete()
      .then(() => resolve())
      .catch(error => reject("Error deleting choice:" + error));
  });
}
