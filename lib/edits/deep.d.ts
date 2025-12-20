import { type UndoableAction } from './actions';
import { type ValidKey, type UntypedObject } from './proxies';
export type AnyObject = UntypedObject | any[];
export type CommonKey = string | number;
/**
 * Sets the target value or array item by the provided key/index.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
export declare class UndoableDeleteValue implements UndoableAction {
    readonly delegate?: UndoableAction;
    constructor(target: AnyObject, key: ValidKey);
    /**
     * Creates a more specific delete action based on whether the target is an array.
     * @function
     * @param {AnyObject} target - reference object for the target action
     * @param {ValidKey} key - target property name or index
     * @returns {UndoableAction | undefined}
     */
    createDelegatedAction(target: AnyObject, key: ValidKey): UndoableAction | undefined;
    redo(): void;
    undo(): void;
}
/**
 * Sets the target value or array item by the provided key/index.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
export declare class UndoableSetValue implements UndoableAction {
    readonly delegate?: UndoableAction;
    constructor(target: AnyObject, key: ValidKey, nextValue: any);
    /**
     * Creates a more specific setter action based on whether the target is an array.
     * @function
     * @param {AnyObject} target - reference object for the target action
     * @param {ValidKey} key - target property name or index
     * @param {any} value - value to be assigned
     * @returns {UndoableAction | undefined}
     */
    createDelegatedAction(target: AnyObject, key: ValidKey, value: any): UndoableAction | undefined;
    redo(): void;
    undo(): void;
}
/**
 * Insert an item if targetting an array or sets a value if targetting other objects.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
export declare class UndoableInsertValue extends UndoableSetValue {
    createDelegatedAction(target: AnyObject, key: ValidKey, value: any): UndoableAction | undefined;
}
export interface PropertyReference {
    target: AnyObject;
    key: ValidKey;
}
/**
 * Creates a clone of the provided object at the new destination.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
export declare class UndoableCopyValue extends UndoableSetValue {
    constructor(from: PropertyReference, to: PropertyReference);
}
/**
 * Moves a property or item from one object to another.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
export declare class UndoableTransferValue implements UndoableAction {
    readonly delegate: UndoableAction;
    constructor(from: PropertyReference, to: PropertyReference);
    /**
     * Creates a more specific transfer action based on whether the target is an array.
     * @function
     * @param {PropertyReference} from - provider of the target value
     * @param {PropertyReference} to - recipient of the target value
     * @returns {UndoableAction | undefined}
     */
    createDelegatedAction(from: PropertyReference, to: PropertyReference): UndoableAction;
    redo(): void;
    undo(): void;
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
 * @extends UndoableAction
 * @property {UndoableAction} delegate - action to be applied after resolving pathing
 */
export declare class UndoableDeleteNestedValue implements UndoableAction {
    readonly delegate?: UndoableAction;
    constructor(target: AnyObject, path: ValidKey[]);
    /**
     * Creates a more specific delete action based on the reduced property path.
     * @function
     * @param {PropertyReference} prop - reference to the target value
     * @returns {UndoableAction | undefined}
     */
    createDelegatedAction(prop: PropertyReference): UndoableAction;
    redo(): void;
    undo(): void;
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
 * @extends UndoableAction
 * @property {UndoableAction} delegate - action to be applied after resolving pathing
 */
export declare class UndoableSetNestedValue implements UndoableAction {
    readonly delegate?: UndoableAction;
    constructor(target: AnyObject, path: ValidKey[], value: any, populate?: boolean);
    /**
     * Creates a more specific setter action based on the reduced property path.
     * @function
     * @param {SetValueRequest} request - reference to the target property and value to be assigned
     * @returns {UndoableAction | undefined}
     */
    createDelegatedAction(request: SetValueRequest): UndoableAction;
    redo(): void;
    undo(): void;
}
/**
 * Inserts a value into a nested array or sets the value of a nested object.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - action to be applied after resolving pathing
 */
export declare class UndoableInsertNestedValue extends UndoableSetNestedValue {
    createDelegatedAction(request: SetValueRequest): UndoableAction;
}
/**
 * Converts a path string to an array of keys and indices.
 * @function
 * @param {string} path - text to be parsed
 * @param {string} separator - substring used to break up the provided text
 * @returns {Array<CommonKey>}
 */
export declare function parsePathString(path: string, separator?: string): CommonKey[];
