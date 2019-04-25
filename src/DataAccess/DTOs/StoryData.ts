import { firestore } from "firebase";
type DocumentSnapshot = firestore.DocumentSnapshot;

export default interface StoryData {
  storyId: string;
  title: string;
  description: string;
  beginningPageId: string;
}

export function MapToStoryData(doc: DocumentSnapshot): StoryData | undefined {
  const data = doc.data();
  if (data === undefined) {
    return undefined;
  }
  return {
    storyId: doc.id,
    title: data.title,
    description: data.description,
    beginningPageId: data.beginningPageId
  } as StoryData;
}
