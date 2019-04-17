import { firestore } from 'firebase';
type QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;

export default interface ChoiceData {
  choiceId: string;
  sourcePageId: string;
  targetPageId: string;
  text: string;
}

export function MapToChoiceData(doc: QueryDocumentSnapshot): ChoiceData {
  const data = doc.data();
  return {
    choiceId: doc.id,
    sourcePageId: data.sourcePageId,
    targetPageId: data.targetPageId,
    text: data.text
  } as ChoiceData;
}

export function MapFromChoiceData(data: ChoiceData): Object {
  let firebaseData: any = {
    sourcePageId: data.sourcePageId,
    text: data.text
  };

  if (data.targetPageId !== undefined) {
    firebaseData.targetPageId = data.targetPageId;
  }

  return firebaseData;
}