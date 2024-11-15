import { type UndoableAction } from './actions';
import { UndoableProxyHandler, type ValidKey, type UntypedObject } from './proxies';
/**
 * Duplicates the property of a source object, deleting if said property is absent.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {Record<string, any>} source - object property should be drawn from
 * @property {ValidKey} key - property to be modified
 * @property {any} previousValue - cached value of the removed property
 * @property {boolean} priorProperty - cached check for if the property already existed
 */
export declare class UndoableCopyPropertyFrom implements UndoableAction {
    readonly target: Record<ValidKey, any>;
    readonly source: Record<ValidKey, any>;
    readonly key: ValidKey;
    readonly previousValue: any;
    readonly priorProperty: boolean;
    constructor(target: Record<ValidKey, any>, key: ValidKey, source: Record<ValidKey, any>);
    redo(): void;
    undo(): void;
}
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
 * Proxy handler with undoable action reporting for plain old javascript objects.
 * @class
 * @extends DefaultedUndoableProxyHandler<UntypedObject>
 * @property {boolean} deep - if true, any object property value will be wrapped in a proxy
 */
export declare class UndoableRecordHandler extends UndoableProxyHandler<UntypedObject> {
    deleteProperty(target: UntypedObject, property: string): boolean;
    set(target: UntypedObject, property: ValidKey, value: any): boolean;
}
