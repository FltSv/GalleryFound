import { DataPatchScriptBase, DataPatchScriptParams } from "../script-base";
import { V060_MigrateToSubcollections } from "./v0.6.0-migrate-to-subcollections";
import { V0601_ProductsAddMigrationOrder } from "./v0.6.0.1-products-add-migration-order";

const registry: Record<string, DataPatchScript> = {
  V060_MigrateToSubcollections,
  V0601_ProductsAddMigrationOrder,
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
