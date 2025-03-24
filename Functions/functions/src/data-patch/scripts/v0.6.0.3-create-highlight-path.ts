import { Transaction, QuerySnapshot } from "firebase-admin/firestore";
import { DataPatchScriptBase, DataPatchScriptParams } from "../script-base";

/**
 * 代表作品のサムネイル画像URLフィールドの作成 (creators)
 */
export class V0603_CreateHighlightPath extends DataPatchScriptBase {
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
    for (const creatorDoc of snapshot.docs) {
      const creatorData = creatorDoc.data();
      const highlightId = creatorData.highlightProductId;

      // 作品サブコレクションを取得
      const productsRef = creatorDoc.ref.collection("products");

      // 代表作品が指定されている場合
      if (highlightId) {
        const highlightSnap = await productsRef
          .where("id", "==", highlightId)
          .get();

        // 代表作品が存在する場合
        if (!highlightSnap.empty) {
          const highlightData = highlightSnap.docs[0].data();

          transaction.set(
            creatorDoc.ref,
            { highlightProductThumbPath: highlightData.thumbPath },
            { merge: true }
          );

          continue;
        }
      }

      // 代表作品が指定されていないか、存在しない場合、先頭の作品を使用
      const productsSnap = await productsRef.orderBy("order").limit(1).get();

      // 作品が1つも存在しない場合はスキップ
      if (productsSnap.empty) {
        continue;
      }

      const highlightData = productsSnap.docs[0].data();

      // クリエイターの代表作品IDを更新
      transaction.set(
        creatorDoc.ref,
        {
          highlightProductId: highlightData.id,
          highlightProductThumbPath: highlightData.thumbPath,
        },
        { merge: true }
      );
    }
  }
}
