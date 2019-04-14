import { firestore } from "firebase";
type DocumentSnapshot = firestore.DocumentSnapshot;

export default interface PageData {
  pageId: string;
  storyId: string;
  text: string;
  isEnding: boolean;
  isBeginning: boolean;
}

export function MapToPageData(doc: DocumentSnapshot): PageData | undefined {
  const data = doc.data();
  if (data === undefined) {
    return undefined;
  }
  return {
    pageId: doc.id,
    storyId: data.storyId,
    text: data.text,
    isEnding: !!data.isEnding,
    isBeginning: !!data.isBeginning
  } as PageData;
}
