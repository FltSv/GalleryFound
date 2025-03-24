import { Transaction, QuerySnapshot } from "firebase-admin/firestore";
import { DataPatchScriptBase, DataPatchScriptParams } from "../script-base";

/**
 * ULIDを使用していたドキュメントIDの置き換え (products, exhibits)
 */
export class V0604_RenameDocId extends DataPatchScriptBase {
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
    // ULIDを使用していたドキュメントIDの置き換え (products, exhibits)
    for (const creatorDoc of snapshot.docs) {
      const creatorData = creatorDoc.data();

      // productsサブコレクションを取得
      const productsRef = creatorDoc.ref.collection("products");
      const productsSnap = await productsRef.get();

      // 代表作品のIDを保存
      const highlightProductId = creatorData.highlightProductId;

      for (const productDoc of productsSnap.docs) {
        const productData = productDoc.data();
        const oldProductId = productDoc.id;

        // 新しいドキュメントを自動IDで作成
        const newDocRef = productsRef.doc();
        const newProductId = newDocRef.id;

        const updatedProductData = {
          ...productData,
          id: newProductId,
        };

        // データを新しいドキュメントに設定
        transaction.set(newDocRef, updatedProductData);

        // 古いドキュメントを削除
        transaction.delete(productDoc.ref);

        // 代表作品の場合、新しいIDを保存
        if (highlightProductId === oldProductId) {
          transaction.set(
            creatorDoc.ref,
            { highlightProductId: newProductId },
            { merge: true }
          );
        }
      }

      // exhibitsサブコレクション
      const exhibitsRef = creatorDoc.ref.collection("exhibits");
      const exhibitsSnap = await exhibitsRef.get();

      for (const exhibitDoc of exhibitsSnap.docs) {
        const exhibitData = exhibitDoc.data();

        // 新しいドキュメントを自動IDで作成
        const newDocRef = exhibitsRef.doc();
        const updatedExhibitData = {
          ...exhibitData,
          id: newDocRef.id,
        };

        // データを新しいドキュメントに設定
        transaction.set(newDocRef, updatedExhibitData);

        // 古いドキュメントを削除
        transaction.delete(exhibitDoc.ref);
      }
    }
  }
}
