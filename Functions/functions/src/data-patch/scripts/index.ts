import { DataPatchScriptBase, DataPatchScriptParams } from "../script-base";
import { V060_MigrateToSubcollections } from "./v0.6.0-migrate-to-subcollections";

const registry: Record<string, DataPatchScript> = {
  V060_MigrateToSubcollections,
};

type DataPatchScript = {
  new (params: DataPatchScriptParams): DataPatchScriptBase;
};

export const getDataPatchScript = (
  params: DataPatchScriptParams
): DataPatchScriptBase | undefined => {
  try {
    const patchScriptClass = registry[params.name]; // 対象のスクリプトを解決
    return new patchScriptClass(params);
  } catch (error) {
    return undefined;
  }
};
