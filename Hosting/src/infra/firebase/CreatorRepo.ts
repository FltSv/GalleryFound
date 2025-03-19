import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { getStorage, ref, listAll, deleteObject } from 'firebase/storage';
import {
  collectionNames,
  db,
  fbCreatorConverter,
  getConfig,
} from 'src/infra/firebase/firebaseConfig';
import {
  Creator,
  Exhibit,
  getDatePeriod,
  ImageStatus,
  Product,
} from 'src/domain/entities';
import {
  exhibitConverter,
  productConverter,
} from 'src/infra/firebase/converter';
import { getThumbnailUrl, storageCreatorsBaseUrl } from './StorageRepo';

export const getCreatorStorageUrl = (userId: string) =>
  `${storageCreatorsBaseUrl}${userId}%2F`;

export const getCreatorData = async (user: User) => {
  const userId = user.uid;
  const creatorUrl = getCreatorStorageUrl(userId);

  // Firestoreからユーザーデータを取得
  const docRef = doc(db, collectionNames.creators, userId).withConverter(
    fbCreatorConverter,
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
      highlightThumbUrl: null,
      products: [],
      exhibits: [],
    };

    return empty;
  }

  // ドキュメントが存在する場合、詳細を取得
  const data = docSnap.data();

  const name = data.name ?? '';
  const genre = data.genre ?? '';
  const profile = data.profile ?? '';
  const profileHashtags = data.profileHashtags ?? [];
  const links = data.links ?? [];
  const highlightProductId = data.highlightProductId ?? '';
  const highlightThumbUrl =
    data.highlightProductThumbPath === undefined
      ? null
      : storageCreatorsBaseUrl + data.highlightProductThumbPath;

  // 発表作品
  const productsRef = getProductsCollectionRef(userId);
  const productsQuery = query(productsRef, orderBy('order'));
  const productsSnap = await getDocs(productsQuery);
  const products = productsSnap.docs.map(doc => doc.data());

  // todo: 次バージョンで削除
  const fbProducts = data.products ?? [];
  const products_old = fbProducts.map((x, i) => ({
    id: x.id,
    title: x.title ?? '',
    isHighlight: x.id === highlightProductId,
    detail: x.detail ?? '',
    order: i,
    createdAt: x.createdAt?.toDate(),
    addedAt: x.addedAt?.toDate(),
    srcImage: x.image,
    imageUrl: creatorUrl + x.image,
    thumbUrl: '',
    tmpImageData: '',
  }));

  // 展示登録
  const exhibitsRef = getExhibitsCollectionRef(userId);
  const exhibitsSnap = await getDocs(exhibitsRef);
  const exhibits = exhibitsSnap.docs.map(doc => doc.data());

  // todo: 次バージョンで削除
  const fbExhibits = data.exhibits ?? [];
  const today = new Date();
  const exhibits_old = fbExhibits.map(x => ({
    id: x.id,
    title: x.title,
    location: x.location,
    startDate: x.startDate?.toDate() ?? today,
    endDate: x.endDate?.toDate() ?? today,
    galleryId: x.galleryId,
    srcImage: x.image,
    imageUrl: creatorUrl + x.image,
    thumbUrl: '',
    tmpImageData: '',
    getDatePeriod: function () {
      return getDatePeriod(this.startDate, this.endDate);
    },
  }));

  const creator: Creator = {
    name: name,
    genre: genre,
    profile: profile,
    profileHashtags: profileHashtags,
    links: links,
    highlightThumbUrl: highlightThumbUrl,
    products: products.length === 0 ? products_old : products,
    exhibits: exhibits.length === 0 ? exhibits_old : exhibits,
  };

  console.debug('creator:', creator);
  return creator;
};

/**
 *  値の確定、DBへデータを送信する
 */
export const setCreatorData = async (user: User, data: Creator) => {
  const userId = user.uid;
  const batch = writeBatch(db);

  // 画像のアップロード
  const updateProductTasks = data.products.map((product, i) =>
    updateProduct(userId, { ...product, order: i }),
  );
  const updateExhibitTasks = data.exhibits.map(exhibit =>
    updateExhibit(userId, exhibit),
  );
  await Promise.all([...updateProductTasks, ...updateExhibitTasks]);

  const products = data.products;
  const exhibits = data.exhibits;

  // DB更新
  const docRef = doc(db, collectionNames.creators, userId).withConverter(
    fbCreatorConverter,
  );

  // メインドキュメント更新
  await setDoc(
    docRef,
    {
      name: data.name,
      genre: data.genre,
      profile: data.profile,
      profileHashtags: data.profileHashtags,
      links: data.links,
      highlightProductId: data.products.find(x => x.isHighlight)?.id,
      highlightProductThumbPath: getHighlightThumbUrl(data.products)?.match(
        /.*creators%2F(.*)$/,
      )?.[1],
      // todo: 次バージョンで削除
      products: products.map(x => ({
        id: x.id,
        title: x.title,
        detail: x.detail,
        image: x.srcImage,
      })),
      // todo: 次バージョンで削除
      exhibits: exhibits.map(x => ({
        id: x.id,
        title: x.title,
        location: x.location,
        galleryId: x.galleryId,
        startDate: Timestamp.fromDate(x.startDate),
        endDate: Timestamp.fromDate(x.endDate),
        image: x.srcImage,
      })),
    },
    { merge: true },
  );

  // 発表作品サブコレクション更新
  const productsRef = getProductsCollectionRef(userId);

  // ドキュメントの作成・更新
  const productTasks = products.map(async (product, i) => {
    const productDocRef = doc(productsRef, product.id);

    const thumbUrl =
      product.thumbUrl === ''
        ? await getThumbnailUrl(userId, product)
        : product.thumbUrl;

    batch.set(
      productDocRef,
      { ...product, thumbUrl, order: i },
      { merge: true },
    );
  });
  await Promise.all(productTasks);

  // 削除された要素のドキュメント削除
  const productsSnap = await getDocs(productsRef);
  productsSnap.docs
    .filter(docSnap => !products.find(x => x.id === docSnap.id))
    .forEach(docSnap => batch.delete(docSnap.ref));

  // 展示登録サブコレクション更新
  const exhibitsRef = getExhibitsCollectionRef(userId);

  // ドキュメントの作成・更新
  const exhibitTasks = exhibits.map(async exhibit => {
    const exhibitDocRef = doc(exhibitsRef, exhibit.id);

    const thumbUrl =
      exhibit.thumbUrl === ''
        ? await getThumbnailUrl(userId, exhibit)
        : exhibit.thumbUrl;

    batch.set(exhibitDocRef, { ...exhibit, thumbUrl }, { merge: true });
  });
  await Promise.all(exhibitTasks);

  // 削除された要素のドキュメント削除
  const exhibitsSnap = await getDocs(exhibitsRef);
  exhibitsSnap.docs
    .filter(docSnap => !exhibits.find(x => x.id === docSnap.id))
    .forEach(docSnap => batch.delete(docSnap.ref));

  await batch.commit();

  // 使用されていない画像の削除
  // 使用中の画像
  const usingImages = [...products, ...exhibits].map(
    (x: ImageStatus) => x.srcImage.split('?')[0],
  );

  // Storage内の画像
  const allImagesRef = ref(
    getStorage(),
    `${collectionNames.creators}/${userId}`,
  );
  const allImages = await listAll(allImagesRef).then(res =>
    res.items.map(item => item.name),
  );

  // 未使用画像の抽出、削除
  const unusedImages = allImages.filter(image => !usingImages.includes(image));
  const deleteTasks = unusedImages.map(async unusedImage => {
    const unusedRef = ref(
      getStorage(),
      `${collectionNames.creators}/${userId}/${unusedImage}`,
    );
    await deleteObject(unusedRef);

    const unusedWebp = unusedImage.replace('.png', '.webp');
    const unusedThumbRef = ref(
      getStorage(),
      `${collectionNames.creators}/${userId}/thumbs/${unusedWebp}`,
    );
    await deleteObject(unusedThumbRef);
  });
  await Promise.all(deleteTasks);

  // 処理完了
  console.debug('complete setCreatorData');
};

const getHighlightThumbUrl = (products: Product[]): string | null => {
  if (products.length === 0) {
    return null;
  }

  const highlightProduct = products.find(x => x.isHighlight);

  if (highlightProduct) {
    return highlightProduct.thumbUrl;
  }

  return products[0].thumbUrl;
};

const getProductsCollectionRef = (userId: string) =>
  collection(
    db,
    collectionNames.creators,
    userId,
    collectionNames.products,
  ).withConverter(productConverter);

const getExhibitsCollectionRef = (userId: string) =>
  collection(
    db,
    collectionNames.creators,
    userId,
    collectionNames.exhibits,
  ).withConverter(exhibitConverter);

// todo: 次バージョンで削除
/** すべての展示情報の取得 */
export const getAllExhibits = async () => {
  const creatorsSnap = await getDocs(
    collection(db, collectionNames.creators).withConverter(fbCreatorConverter),
  );

  const config = await getConfig();
  const ignoreIds = config.debugUserIds;
  const isDebug = process.env.NODE_ENV === 'development';

  const exhibitsPromises = creatorsSnap.docs
    .filter(d => isDebug || !ignoreIds.includes(d.id))
    .map(creatorDocSnap => {
      const data = creatorDocSnap.data();
      const today = new Date();
      const creatorUrl = getCreatorStorageUrl(creatorDocSnap.id);
      const thumbUrl = creatorUrl + 'thumbs%2F';

      const exhibits: Exhibit[] =
        data.exhibits?.map(x => ({
          ...x,
          startDate: x.startDate?.toDate() ?? today,
          endDate: x.endDate?.toDate() ?? today,
          galleryId: x.galleryId,
          srcImage: x.image,
          imageUrl: creatorUrl + x.image,
          thumbUrl: thumbUrl + x.image,
          tmpImageData: '',
          getDatePeriod: function () {
            return getDatePeriod(this.startDate, this.endDate);
          },
        })) ?? [];

      return exhibits;
    });

  const resolvedExhibits = await Promise.all(exhibitsPromises);
  return resolvedExhibits.flat();
};

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

export const FirestoreCreatorRepo = {
  createEmptyProduct,
  updateProduct,
  createEmptyExhibit,
  updateExhibit,
};
