import IChoice from "../Choice/IChoice";
import * as firebase from "firebase"

export default function IChoiceMapper(doc: firebase.firestore.QueryDocumentSnapshot): IChoice {
  const data = doc.data();
  return { choiceId: doc.id, targetPageId: data.targetPageId, text: data.text, wasEdited: false } as IChoice;
}