import {
  Transaction,
  QuerySnapshot,
  DocumentReference,
} from "firebase-admin/firestore";
import { DataPatchScriptBase, DataPatchScriptParams } from "../script-base";

export class V060_MigrateToSubcollections extends DataPatchScriptBase {
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

      this.migrateToSubcollection(
        transaction,
        doc.ref,
        "products",
        data.products
      );

      this.migrateToSubcollection(
        transaction,
        doc.ref,
        "exhibits",
        data.exhibits
      );
    });
  }

  private migrateToSubcollection(
    transaction: Transaction,
    creatorRef: DocumentReference,
    subCollectionName: string,
    items: any[]
  ) {
    if (!items || !Array.isArray(items)) {
      return;
    }

    const subCollectionRef = creatorRef.collection(subCollectionName);
    items.forEach((item) => {
      const docRef = subCollectionRef.doc(item.id);
      transaction.set(docRef, item, { merge: true });
    });
  }
}
