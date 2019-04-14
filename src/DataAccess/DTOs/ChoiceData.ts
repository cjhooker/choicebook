import { firestore } from 'firebase';
type QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;

export default interface ChoiceData {
  choiceId: string;
  targetPageId: string;
  text: string;
  wasEdited: boolean;
}

export function MapToChoiceData(doc: QueryDocumentSnapshot): ChoiceData {
  const data = doc.data();
  return {
    choiceId: doc.id,
    targetPageId: data.targetPageId,
    text: data.text,
    wasEdited: false
  } as ChoiceData;
}