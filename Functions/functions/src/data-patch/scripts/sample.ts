import {
  Transaction,
  QuerySnapshot,
  FieldValue,
} from "firebase-admin/firestore";
import { DataPatchScriptBase, DataPatchScriptParams } from "../script-base";

export class Sample extends DataPatchScriptBase {
  constructor(params: DataPatchScriptParams) {
    super(params);
  }

  targetDocsQuery() {
    return this.db.collection("my_collection").orderBy("old_field");
  }

  async updateFunction(
    transaction: Transaction,
    snapshot: QuerySnapshot
  ): Promise<void> {
    snapshot.docs.forEach((doc) => {
      transaction.update(doc.ref, {
        old_field: FieldValue.delete(),
      });
    });
  }
}
