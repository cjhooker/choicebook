import { firestore } from 'firebase';
type QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;

export default interface IChoice {
  choiceId: string;
  targetPageId: string;
  text: string;
  wasEdited: boolean;
}

export function MapToChoice(doc: QueryDocumentSnapshot): IChoice {
  const data = doc.data();
  return {
    choiceId: doc.id,
    targetPageId: data.targetPageId,
    text: data.text,
    wasEdited: false
  } as IChoice;
}