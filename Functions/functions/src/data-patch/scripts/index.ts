import { DataPatchScriptBase, DataPatchScriptParams } from "../script-base";
import { V060_MigrateToSubcollections } from "./v0.6.0-migrate-to-subcollections";
import { V0601_ProductsAddMigrationOrder } from "./v0.6.0.1-products-add-migration-order";
import { V0602_CreatePathAtField } from "./v0.6.0.2-create-path-at-field";
import { V0603_CreateHighlightPath } from "./v0.6.0.3-create-highlight-path";
import { V0604_RenameDocId } from "./v0.6.0.4-rename-doc-id";

const registry: Record<string, DataPatchScript> = {
  V060_MigrateToSubcollections,
  V0601_ProductsAddMigrationOrder,
  V0602_CreatePathAtField,
  V0603_CreateHighlightPath,
  V0604_RenameDocId,
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
