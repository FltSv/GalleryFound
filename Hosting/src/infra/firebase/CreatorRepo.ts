import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import {
  collectionNames,
  db,
  getConfig,
} from 'src/infra/firebase/firebaseConfig';
import { Creator, Exhibit, Product } from 'src/domain/entities';
import {
  creatorConverter,
  exhibitConverter,
  getProductConverter,
} from 'src/infra/firebase/converter';
import { storageCreatorsBaseUrl } from './StorageRepo';

export const getCreatorStorageUrl = (userId: string) =>
  `${storageCreatorsBaseUrl}${userId}%2F`;

export const getCreatorData = async (user: User) => {
  const userId = user.uid;

  // Firestoreからユーザーデータを取得
  const docRef = doc(db, collectionNames.creators, userId).withConverter(
    creatorConverter,
  );
  const docSnap = await getDoc(docRef);

  // 作家情報が存在しているか
  if (!docSnap.exists()) {
    // 存在しない場合、情報は空のままで登録を促す
    const empty: Creator = {
      name: '',
      genre: '',
      profile: '',
      profileHashtags: [],
      links: [],
      highlightProductId: null,
      highlightThumbUrl: null,
      products: [],
      exhibits: [],
    };

    return empty;
  }

  // ドキュメントが存在する場合、詳細を取得
  const data = docSnap.data();

  // 発表作品
  const productsRef = getProductsCollectionRef(
    userId,
    data.highlightProductId ?? null,
  );
  const productsQuery = query(productsRef, orderBy('order'));
  const productsSnap = await getDocs(productsQuery);
  const products = productsSnap.docs.map(doc => doc.data());

  // 展示登録
  const exhibitsRef = getExhibitsCollectionRef(userId);
  const exhibitsSnap = await getDocs(exhibitsRef);
  const exhibits = exhibitsSnap.docs.map(doc => doc.data());

  const creator: Creator = {
    ...data,
    products: products.length === 0 ? data.products : products,
    exhibits: exhibits.length === 0 ? data.exhibits : exhibits,
  };

  console.debug('creator:', creator);
  return creator;
};

/**
 *  値の確定、DBへデータを送信する
 */
export const setCreatorData = async (user: User, data: Creator) => {
  const userId = user.uid;

  // 画像のアップロード
  const updateProductTasks = data.products.map((product, i) =>
    updateProduct(userId, { ...product, order: i }),
  );
  const updateExhibitTasks = data.exhibits.map(exhibit =>
    updateExhibit(userId, exhibit),
  );
  await Promise.all([...updateProductTasks, ...updateExhibitTasks]);

  // DB更新
  const docRef = doc(db, collectionNames.creators, userId).withConverter(
    creatorConverter,
  );

  // メインドキュメント更新
  await setDoc(docRef, data, { merge: true });
};

const getProductsCollectionRef = (
  userId: string,
  highlightProductId: string | null,
) =>
  collection(
    db,
    collectionNames.creators,
    userId,
    collectionNames.products,
  ).withConverter(getProductConverter(highlightProductId));

const getExhibitsCollectionRef = (userId: string) =>
  collection(
    db,
    collectionNames.creators,
    userId,
    collectionNames.exhibits,
  ).withConverter(exhibitConverter);

/**
 * 指定日時以降の展示を取得する
 */
export const getActiveExhibits = async (date: Date): Promise<Exhibit[]> => {
  const config = await getConfig();
  const ignoreIds = config.debugUserIds;
  const isDebug = process.env.NODE_ENV === 'development';

  const exhibitsQuery = query(
    collectionGroup(db, collectionNames.exhibits),
    where('endDate', '>=', date),
  ).withConverter(exhibitConverter);
  const exhibitsSnapshot = await getDocs(exhibitsQuery);

  return exhibitsSnapshot.docs
    .map(doc => {
      const data = doc.data();
      const creatorId = doc.ref.parent.parent?.id;
      if (creatorId === undefined) {
        return;
      }

      // 本番環境ではデバッグユーザー非表示
      if (!isDebug && ignoreIds.includes(creatorId)) {
        return;
      }

      return data;
    })
    .filter(x => x !== undefined);
};

/**
 * 画像アップロード前の、空の作品情報を作成する
 * @returns 作成されたドキュメントのID
 */
const createEmptyProduct = async (userId: string): Promise<string> =>
  createEmptyDocument(userId, collectionNames.products);

/**
 * 画像アップロード前の、空の展示情報を作成する
 * @returns 作成されたドキュメントのID
 */
const createEmptyExhibit = async (userId: string): Promise<string> =>
  createEmptyDocument(userId, collectionNames.exhibits);

const createEmptyDocument = async (
  userId: string,
  subCollectionName: string,
): Promise<string> => {
  const collectionRef = collection(
    db,
    collectionNames.creators,
    userId,
    subCollectionName,
  );

  const docRef = await addDoc(collectionRef, {});
  return docRef.id;
};

/**
 * 作品情報を更新する
 */
const updateProduct = async (userId: string, product: Product) => {
  const productConverter = getProductConverter(
    product.isHighlight ? product.id : null,
  );

  const docRef = doc(
    db,
    collectionNames.creators,
    userId,
    collectionNames.products,
    product.id,
  ).withConverter(productConverter);
  await setDoc(docRef, product, { merge: true });
};

/**
 * 展示情報を更新する
 */
const updateExhibit = async (userId: string, exhibit: Exhibit) => {
  const docRef = doc(
    db,
    collectionNames.creators,
    userId,
    collectionNames.exhibits,
    exhibit.id,
  ).withConverter(exhibitConverter);
  await setDoc(docRef, exhibit, { merge: true });
};

/** 作品情報を削除する */
const deleteProduct = async (userId: string, product: Product) => {
  const CollectionRef = getProductsCollectionRef(userId, null);
  const docRef = doc(CollectionRef, product.id);
  await deleteDoc(docRef);
};

/** 展示情報を削除する */
const deleteExhibit = async (userId: string, exhibit: Exhibit) => {
  const CollectionRef = getExhibitsCollectionRef(userId);
  const docRef = doc(CollectionRef, exhibit.id);
  await deleteDoc(docRef);
};

export const FirestoreCreatorRepo = {
  createEmptyProduct,
  updateProduct,
  createEmptyExhibit,
  updateExhibit,
  deleteProduct,
  deleteExhibit,
};
