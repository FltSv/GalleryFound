import {
  Transaction,
  QuerySnapshot,
  Timestamp,
} from "firebase-admin/firestore";
import { DataPatchScriptBase, DataPatchScriptParams } from "../script-base";
import { getStorage, Storage } from "firebase-admin/storage";
import { File } from "@google-cloud/storage";

/**
 * - 作品のサムネイル画像URLフィールドの作成 (products, exhibits)
 * - 作品の作成日と追加日フィールドの作成 (products)
 */
export class V0602_CreatePathAtField extends DataPatchScriptBase {
  constructor(params: DataPatchScriptParams) {
    super(params);
  }

  targetDocsQuery() {
    return this.db.collection("creators");
  }

  async updateFunction(
    transaction: Transaction,
    snapshot: QuerySnapshot
  ): Promise<void> {
    // imagePath, thumbPathフィールドの作成 (products, exhibits)
    await createImageThumbPathField(transaction, snapshot);

    // 作品の作成日と追加日フィールドの作成 (products)
    await createProductAtField(transaction, snapshot);
  }
}

const createImageThumbPathField = async (
  transaction: Transaction,
  snapshot: QuerySnapshot
) => {
  const storage = getStorage();

  // 各クリエイターごとにサブコレクションを処理
  for (const doc of snapshot.docs) {
    const creatorId = doc.id;

    // productsサブコレクション
    const productsRef = doc.ref.collection("products");
    const productsSnap = await productsRef.get();

    for (const doc of productsSnap.docs) {
      const productData = doc.data();

      const { imagePath, thumbPath } = await getImageThumbPath(
        creatorId,
        productData.image,
        storage
      );

      transaction.set(
        doc.ref,
        {
          order: productsSnap.docs.indexOf(doc),
          imagePath,
          thumbPath,
        },
        { merge: true }
      );
    }

    // exhibitsサブコレクション
    const exhibitsCollectionRef = doc.ref.collection("exhibits");
    const exhibitsSnapshot = await exhibitsCollectionRef.get();

    for (const exhibitDoc of exhibitsSnapshot.docs) {
      const exhibitData = exhibitDoc.data();

      const { imagePath, thumbPath } = await getImageThumbPath(
        creatorId,
        exhibitData.image,
        storage
      );

      transaction.set(
        exhibitDoc.ref,
        {
          imagePath,
          thumbPath,
        },
        { merge: true }
      );
    }
  }
};

const getImageThumbPath = async (
  creatorId: string,
  image: string,
  storage: Storage
) => {
  const bucket = storage.bucket();
  const imagePath = `${creatorId}%2F${image}`;

  // サムネイル画像のパスとURLを取得
  const thumbName = image.replace(/\.png.*/, ".webp");
  const file = bucket.file(`creators/${creatorId}/thumbs/${thumbName}`);

  // トークンを取得または生成
  const token = await getOrCreateFileToken(file);

  // Pathを生成
  const thumbPath = `${creatorId}%2Fthumbs%2F${thumbName}?alt=media&token=${token}`;

  return { imagePath, thumbPath };
};

/** ファイルのメタデータからトークンを取得または生成する */
const getOrCreateFileToken = async (file: File) => {
  // メタデータからトークンを取得
  const [metadata] = await file.getMetadata();
  const token = metadata.metadata?.firebaseStorageDownloadTokens;

  if (token) {
    return token;
  }

  // トークンが存在しない場合は生成・保存する
  const newToken = crypto.randomUUID(); // UUIDで新しいトークン生成
  await file.setMetadata({
    metadata: {
      firebaseStorageDownloadTokens: newToken,
    },
  });

  return newToken;
};

const createProductAtField = async (
  transaction: Transaction,
  snapshot: QuerySnapshot
) => {
  const storage = getStorage();
  const bucket = storage.bucket();

  // 各クリエイターごとにサブコレクションを処理
  for (const creatorDoc of snapshot.docs) {
    const creatorId = creatorDoc.id;

    // productsサブコレクションを取得
    const productsRef = creatorDoc.ref.collection("products");
    const productsSnap = await productsRef.get();

    for (const productDoc of productsSnap.docs) {
      const productData = productDoc.data();
      const imageName = productData.image?.split("?")?.[0]; // トークン部分を除去

      const epochDate = new Date(0);

      if (!imageName) {
        transaction.set(
          productDoc.ref,
          {
            createdAt: Timestamp.fromDate(epochDate),
            addedAt: Timestamp.fromDate(epochDate),
          },
          { merge: true }
        );

        continue;
      }

      const filePath = `creators/${creatorId}/${imageName}`;
      const file = bucket.file(filePath);

      // ファイルのメタデータを取得
      const [metadata] = await file.getMetadata();

      // 画像の作成日時を取得
      const createdAt = metadata.timeCreated
        ? new Date(metadata.timeCreated)
        : epochDate;

      transaction.set(
        productDoc.ref,
        {
          createdAt: Timestamp.fromDate(createdAt),
          addedAt: Timestamp.fromDate(createdAt),
        },
        { merge: true }
      );
    }
  }
};
