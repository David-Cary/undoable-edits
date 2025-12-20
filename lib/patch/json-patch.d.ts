import { type UndoableAction, UndoableActionSequence } from '../edits/actions';
import { type AnyObject, type CommonKey, UndoableCopyValue, UndoableDeleteNestedValue, UndoableInsertNestedValue, UndoableSetNestedValue, UndoableTransferValue } from '../edits/deep';
export interface JSONPatchStep {
    op: string;
    path: string | CommonKey[];
    from?: string | CommonKey[];
    value?: any;
}
/**
  * Converts a JSONPatch path property to an array of keys and indices.
  * @function
  * @param {string | CommonKey[]} path - path string/array to be evaluated.
  * @returns {CommonKey | undefined}
  */
export declare function parseJSONPatchPath(path: string | CommonKey[]): CommonKey[];
export type JSONPatchToAction = (target: AnyObject, step: JSONPatchStep) => UndoableAction | undefined;
export declare const DEFAULT_JSON_PATCH_OPS_TO_ACTIONS: {
    add: (target: AnyObject, step: JSONPatchStep) => UndoableInsertNestedValue;
    copy: (target: AnyObject, step: JSONPatchStep) => UndoableCopyValue | undefined;
    move: (target: AnyObject, step: JSONPatchStep) => UndoableTransferValue | undefined;
    remove: (target: AnyObject, step: JSONPatchStep) => UndoableDeleteNestedValue;
    replace: (target: AnyObject, step: JSONPatchStep) => UndoableSetNestedValue;
};
/**
 * Applies the provided JSON patch to the target object.
 * @class
 * @extends UndoableActionSequence
 */
export declare class UndoableJSONPatch extends UndoableActionSequence {
    constructor(target: AnyObject, patch: JSONPatchStep[], stepParsers?: Record<string, JSONPatchToAction>);
}
