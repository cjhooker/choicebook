import IChoice from "../Choice/IChoice";
import * as firebase from "firebase"

export default function IChoiceMapper(doc: firebase.firestore.QueryDocumentSnapshot): IChoice {
  const data = doc.data();
  return { targetPageId: data.targetPageId, text: data.text } as IChoice;
}