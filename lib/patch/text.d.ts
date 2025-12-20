import { type AnyObject, UndoableSetValue } from '../edits/deep';
import { type ValidKey } from '../edits/proxies';
export type TextPatchStep = [number, string];
export type TextPatch = Array<number | TextPatchStep>;
/**
  * Applies a text patch array to the provided text.
  * @function
  * @param {string} source - string to be modified
  * @param {TextPatch} patch - patch to be applied
  * @returns {string}
  */
export declare function applyTextPatch(source: string, patch: TextPatch): string;
export type TextChangeTuple = [string, string];
export type TextChanges = Array<string | TextChangeTuple>;
/**
  * Gets the text change array for applying the provided text patch.
  * @function
  * @param {string} source - string to be modified
  * @param {TextPatch} patch - patch to be applied
  * @returns {TextChanges}
  */
export declare function getTextPatchChanges(source: string, patch: TextPatch): TextChanges;
/**
 * This is a simple utility class for getting the original or patched text from a list with text change tuples.
 * @class
 * @property {TextChanges} segments - array of text changes to be evaluated
 */
export declare class PatchedTextSequence {
    segments: TextChanges;
    get originalText(): string;
    get patchedText(): string;
    constructor(segments?: TextChanges);
    collapseSegments(segments: Array<string | TextChangeTuple>, index: number): string;
    static fromPatch(source: string, patch: TextPatch): PatchedTextSequence;
}
/**
 * Replaces sections of a string with the provided substrings.
 * @class
 * @extends UndoableSetValue
 */
export declare class UndoableTextPatch extends UndoableSetValue {
    constructor(target: AnyObject, key: ValidKey, patch: TextPatch);
}
export type DiffTuple<T = any> = [T, string];
/**
  * Converts an array of opcode/text pairs to a text patch.
  * @function
  * @param {DiffTuple[]} diff - array to be converted
  * @param {any} unchangedKey - opcode that indicates unchanged text
  * @param {any} removedKey - opcode that indicates text to be removed
  * @param {any} addedKey - opcode that indicates text to be added
  * @returns {TextPatch}
  */
export declare function createTextPatchFromDiffTuples(diff: DiffTuple[], unchangedKey?: number, removedKey?: number, addedKey?: number): TextPatch;
/**
  * Joins a subset of the text in an array of opcode/text pairs.
  * This can be used to get the original text by excluding additions.
  * Alternately, you can get the modified text by excluding removals.
  * @function
  * @param {DiffTuple[]} diff - array to be parsed
  * @param {any} exclude - opcode for values to be skipped
  * @returns {string}
  */
export declare function getDiffText(diff: DiffTuple[], exclude: any): string;
/**
 * Switches between versions of the target text based on the provided diff array.
 * @class
 * @extends UndoableSetValue
 */
export declare class UndoableApplyDiffTuples extends UndoableSetValue {
    constructor(target: AnyObject, key: ValidKey, diff: DiffTuple[], removedKey?: number);
}
