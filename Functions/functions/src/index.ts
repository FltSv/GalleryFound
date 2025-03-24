/**
 * firebase shell開始方法
 * 1. cd Functions\functions
 * 2. npm run start
 */

import { firestore } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { getDataPatchScript } from "./data-patch/scripts";

initializeApp();

const db = firestore();
db.settings({
  databaseId: "develop",
  ignoreUndefinedProperties: true,
});

/**
 * データパッチ実行
 * 下記の <class_name> には、"V060_MigrateToSubcollections"など実行するクラス名を指定
 *
 * firebase > runDataPatch({data:{name:"<class_name>",dryRun:false}})
 */
export const runDataPatch = onCall(async (request) => {
  try {
    const patchScript = getDataPatchScript({ ...request.data, db });

    if (!patchScript) {
      throw new HttpsError("not-found", "Patch script not found");
    }

    return await patchScript.exec();
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError(
      "internal",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
  }
});

export const addData = onCall(async (request) => {
  try {
    const data = request.data; // クライアントから送られるデータを取得
    const docRef = await db.collection("data").add(data); // Firestore にデータを追加
    return { message: "Data added successfully", id: docRef.id };
  } catch (error) {
    throw new HttpsError(
      "internal",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
  }
});

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
