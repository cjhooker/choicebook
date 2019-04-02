import { firestore } from 'firebase';
type DocumentSnapshot = firestore.DocumentSnapshot

export default interface IPage {
    pageId: string;
    storyId: string;
    text: string;
    isEnding: boolean;
    isBeginning: boolean;
}

export function MapToPage(doc: DocumentSnapshot): IPage | undefined {
    const data = doc.data();
    if (data === undefined) {
        return undefined;
    }
    return <IPage>{
        pageId: doc.id,
        storyId: data.storyId,
        text: data.text,
        isEnding: !!data.isEnding,
        isBeginning: !!data.isBeginning
    };
}