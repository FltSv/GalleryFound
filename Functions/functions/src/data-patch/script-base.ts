import {
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  Query,
  QuerySnapshot,
  Transaction,
} from "firebase-admin/firestore";
import * as functions from "firebase-functions";

export type DataPatchScriptParams = {
  name: string;
  db: Firestore;
  dryRun: boolean;
};

export abstract class DataPatchScriptBase {
  protected readonly db: Firestore;
  protected readonly isDryRun: boolean;

  constructor(params: DataPatchScriptParams) {
    this.db = params.db;
    this.isDryRun = params.dryRun ?? true;
  }

  private executionLogs = [];
  private logging(...logs: string[]) {
    if (!this.isDryRun) {
      functions.logger.log(...logs);
    }
    Array.prototype.push.apply(this.executionLogs, logs);
  }

  /**
   * 更新対象のデータ（Doc）
   */
  abstract targetDocsQuery(): Query;
  private targetDocRefs: DocumentReference[] = [];

  /**
   * データパッチしたい更新処理
   */
  abstract updateFunction(
    transaction: Transaction,
    snapshot: QuerySnapshot
  ): Promise<unknown>;

  beforeLog(documentSnapshots: DocumentSnapshot[]): void {
    this.logSnapshot(documentSnapshots, "before");
  }

  afterLog(documentSnapshots: DocumentSnapshot[]): void {
    // DELETEを行った場合、refに対してundefinedが返るので対象から外す。
    const snapshots = documentSnapshots.filter((doc) => !!doc.data());

    this.logSnapshot(snapshots, "after");
  }

  private logSnapshot(
    documentSnapshots: DocumentSnapshot[],
    step: "before" | "after"
  ): void {
    const log: string[] = [`${step} snapshot is below:`];
    documentSnapshots.forEach((doc) => {
      log.push(
        JSON.stringify({
          documentId: doc.id,
          data: doc.data(),
        })
      );
    });
    log.push(`total count: ${documentSnapshots.length}`);
    this.logging(...log);
  }

  async exec(): Promise<string> {
    this.logging(
      `start: ${this.constructor.name}${this.isDryRun ? " as dryrun" : ""}`
    );

    const snapshot = await this.targetDocsQuery().get();
    this.targetDocRefs = snapshot.docs.map((doc) => doc.ref);
    this.beforeLog(snapshot.docs);

    if (!this.isDryRun) {
      await this.db.runTransaction(
        async (transaction) => await this.updateFunction(transaction, snapshot)
      );

      const afterSnapshot = await this.db.getAll(...this.targetDocRefs);
      this.afterLog(afterSnapshot);
    }

    this.logging(
      `finish: ${this.constructor.name}${this.isDryRun ? " as dryrun" : ""}`
    );

    return this.executionLogs.join("\n");
  }
}
