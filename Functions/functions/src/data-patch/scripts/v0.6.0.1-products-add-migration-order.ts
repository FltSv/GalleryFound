import { Transaction, QuerySnapshot } from "firebase-admin/firestore";
import { DataPatchScriptBase, DataPatchScriptParams } from "../script-base";

export class V0601_ProductsAddMigrationOrder extends DataPatchScriptBase {
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
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const productsArray = data.products;

      if (!productsArray || !Array.isArray(productsArray)) {
        return;
      }

      const productsCollectionRef = doc.ref.collection("products");
      productsArray.forEach((item, i) => {
        const productDocRef = productsCollectionRef.doc(item.id);
        transaction.update(productDocRef, { order: i });
      });
    });
  }
}
