import { type UndoableAction, type UndoableActionCallback } from './actions';
import { UndoableProxyHandler, type ValidKey } from './proxies';
/**
 * Remove a property from the target object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {string} key - property to be removed
 * @property {any} previousValue - cached value of the removed property
 */
export declare class UndoableDeleteProperty implements UndoableAction {
    readonly target: Record<string, any>;
    readonly key: string;
    readonly previousValue: any;
    constructor(target: Record<string, any>, key: string);
    redo(): void;
    undo(): void;
}
/**
 * Sets a specific property value for a given object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {ValidKey} key - property to be modified
 * @property {any} previousValue - cached value of the removed property
 * @property {any} nextValue - value to be assigned
 * @property {boolean} priorProperty - cached check for if the property already existed
 */
export declare class UndoableSetProperty implements UndoableAction {
    readonly target: Record<ValidKey, any>;
    readonly key: ValidKey;
    readonly previousValue: any;
    readonly nextValue: any;
    readonly priorProperty: boolean;
    constructor(target: Record<ValidKey, any>, key: ValidKey, nextValue: any);
    redo(): void;
    undo(): void;
}
/**
 * Changes a given property value to a new property within the same object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {string} previousKey - property to be replaced
 * @property {string} nextKey - property the value should be move to
 * @property {any} value - cached value of the target property
 * @property {any} displacedValue - cached value overwriten by moving the target value
 * @property {boolean} overwritesProperty - cached check for if target property name was already in use
 */
export declare class UndoableRenameProperty implements UndoableAction {
    readonly target: Record<string, any>;
    readonly previousKey: string;
    readonly nextKey: string;
    readonly value: any;
    readonly displacedValue: any;
    readonly overwritesProperty: boolean;
    constructor(target: Record<string, any>, previousKey: string, nextKey: string);
    redo(): void;
    undo(): void;
}
/**
 * Typing for plain old javascript object.
 * @type
 */
export type UntypedRecord = Record<ValidKey, any>;
/**
 * Proxy handler with undoable action reporting for plain old javascript objects.
 * @class
 * @extends UndoableProxyHandler<UntypedRecord>
 * @property {boolean} deep - if true, any object property value will be wrapped in a proxy
 * @property {UndoableProxyHandler<any[]>} arrayHandler - handler to be applied to arrays when making a deep proxy
 */
export declare class UndoableRecordHandler extends UndoableProxyHandler<UntypedRecord> {
    readonly deep: boolean;
    arrayHandler: UndoableProxyHandler<any[]>;
    constructor(onChange?: UndoableActionCallback, deep?: boolean, arrayHandler?: UndoableProxyHandler<any[]>);
    deleteProperty(target: UntypedRecord, property: string): boolean;
    get(target: UntypedRecord, property: ValidKey): any;
    set(target: UntypedRecord, property: ValidKey, value: any): boolean;
}
