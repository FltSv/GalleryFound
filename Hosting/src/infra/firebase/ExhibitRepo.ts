import { collectionGroup, getDocs, query, where } from 'firebase/firestore';
import { Exhibit } from 'src/domain/entities';
import { exhibitConverter } from 'src/infra/firebase/converter';
import { collectionNames, db } from 'src/infra/firebase/firebaseConfig';

/** 全作家を検索して、指定したIDの展示を取得 */
export const getExhibitById = async (
  exhibitId: string,
): Promise<Exhibit | undefined> => {
  const exhibitsQuery = query(
    collectionGroup(db, collectionNames.exhibits),
    where('id', '==', exhibitId),
  ).withConverter(exhibitConverter);

  const snapshot = await getDocs(exhibitsQuery);
  if (snapshot.empty) {
    return undefined;
  }

  return snapshot.docs[0].data();
};
