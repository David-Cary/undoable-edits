import { type AnyObject, DelegatingUndoableAction, type UndoableAction, type ValidKey } from './actions';
export type CommonKey = string | number;
/**
 * Sets the target value or array item by the provided key/index.
 * @class
 * @extends UndoableAction
 */
export declare class UndoableDeleteValue extends DelegatingUndoableAction {
    target: AnyObject;
    key: ValidKey;
    constructor(target: AnyObject, key: ValidKey);
    createDelegatedAction(): UndoableAction | undefined;
}
/**
 * Sets the target value or array item by the provided key/index.
 * @class
 * @extends DelegatingUndoableAction
 */
export declare class UndoableSetValue extends DelegatingUndoableAction {
    target: AnyObject;
    key: ValidKey;
    value: any;
    constructor(target: AnyObject, key: ValidKey, value: any);
    createDelegatedAction(): UndoableAction | undefined;
}
/**
 * Insert an item if targetting an array or sets a value if targetting other objects.
 * @class
 * @extends UndoableAction
 */
export declare class UndoableInsertValue extends UndoableSetValue {
    createDelegatedAction(): UndoableAction | undefined;
}
export interface PropertyReference {
    target: AnyObject;
    key: ValidKey;
}
/**
 * Creates a clone of the provided object at the new destination.
 * @class
 * @extends UndoableAction
 */
export declare class UndoableCopyValue extends UndoableSetValue {
    constructor(from: PropertyReference, to: PropertyReference);
}
/**
 * Moves a property or item from one object to another.
 * @class
 * @extends DelegatingUndoableAction
 */
export declare class UndoableTransferValue extends DelegatingUndoableAction {
    from: PropertyReference;
    to: PropertyReference;
    constructor(from: PropertyReference, to: PropertyReference);
    createDelegatedAction(): UndoableAction | undefined;
}
/**
  * Tries to reduce a nested property path to a simple property reference.
  * @function
  * @param {AnyObject} source - top-level container of the target value
  * @param {ValidKey[]} path - key/index chain to get to the target value
  * @returns {PropertyReference | undefined}
  */
export declare function reducePropertyPath(source: AnyObject, path: ValidKey[]): PropertyReference | undefined;
/**
 * Sets a nested value of the provided object
 * @class
 * @extends DelegatingUndoableAction
 */
export declare class UndoableDeleteNestedValue extends DelegatingUndoableAction {
    target: AnyObject;
    path: ValidKey[];
    constructor(target: AnyObject, path: ValidKey[]);
    createDelegatedAction(): UndoableAction | undefined;
}
export interface SetValueRequest extends PropertyReference {
    value: any;
}
/**
 * Reduces an attempt to set a nested property down to more direct value assignment.
 * @function
 * @param {AnyObject} source - top-level container for the target property
 * @param {ValidKey[]} path - steps to reach the target container
 * @param {any} value - value to assigned
 * @param {boolean} populate - whether objects should be created if traversing to the target container fails
 * @returns {SetValueRequest | undefined}
 */
export declare function createSetNestedValueRequest(source: AnyObject, path: ValidKey[], value: any, populate?: boolean): SetValueRequest | undefined;
/**
 * Sets a nested value of the provided object
 * @class
 * @extends DelegatingUndoableAction
 */
export declare class UndoableSetNestedValue extends DelegatingUndoableAction {
    target: AnyObject;
    path: ValidKey[];
    value: any;
    populate: boolean;
    constructor(target: AnyObject, path: ValidKey[], value: any, populate?: boolean);
    createDelegatedAction(): UndoableAction | undefined;
}
/**
 * Inserts a value into a nested array or sets the value of a nested object.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - action to be applied after resolving pathing
 */
export declare class UndoableInsertNestedValue extends UndoableSetNestedValue {
    createDelegatedAction(): UndoableAction | undefined;
}
/**
 * Converts a path string to an array of keys and indices.
 * @function
 * @param {string} path - text to be parsed
 * @param {string} separator - substring used to break up the provided text
 * @returns {Array<CommonKey>}
 */
export declare function parsePathString(path: string, separator?: string): CommonKey[];
