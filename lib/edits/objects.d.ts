import { type ValidKey, type UndoableAction, type UntypedObject, type ValueWrapper } from './actions';
import { UndoableProxyHandler } from './proxies';
/**
 * Sets multiple properties to the provided key values.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {Record<string, any>} source - object properties should be drawn from
 */
export declare class UndoableAssignProperties implements UndoableAction {
    readonly target: UntypedObject;
    readonly source: UntypedObject;
    protected _initializedData?: UntypedObject;
    constructor(target: UntypedObject, source: UntypedObject);
    initialize(): void;
    apply(): UntypedObject;
    redo(): void;
    undo(): void;
}
/**
 * Duplicates the property of a source object, deleting if said property is absent.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {Record<string, any>} source - object property should be drawn from
 * @property {ValidKey} key - property to be modified
 */
export declare class UndoableCopyPropertyFrom implements UndoableAction {
    readonly target: UntypedObject;
    readonly source: UntypedObject;
    readonly key: ValidKey;
    protected _initializedData?: UntypedObject;
    constructor(target: UntypedObject, key: ValidKey, source: UntypedObject);
    initialize(): void;
    apply(): any;
    redo(): void;
    undo(): void;
}
/**
 * Remove a property from the target object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {string} key - property to be removed
 */
export declare class UndoableDeleteProperty implements UndoableAction {
    readonly target: Record<string, any>;
    readonly key: string;
    protected _initializedData?: ValueWrapper;
    constructor(target: Record<string, any>, key: string);
    initialize(): void;
    apply(): boolean;
    redo(): void;
    undo(): void;
}
/**
 * Sets a specific property value for a given object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {ValidKey} key - property to be modified
 * @property {any} nextValue - value to be assigned
 */
export declare class UndoableSetProperty implements UndoableAction {
    readonly target: UntypedObject;
    readonly key: ValidKey;
    readonly nextValue: any;
    protected _initializedData?: UntypedObject;
    constructor(target: UntypedObject, key: ValidKey, nextValue: any);
    initialize(): void;
    apply(): any;
    redo(): void;
    undo(): void;
}
/**
 * Sets default values for the provided properties.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {Record<string, any>} source - object properties should be drawn from
 */
export declare class UndoableSetPropertyDefaults implements UndoableAction {
    readonly target: UntypedObject;
    readonly source: UntypedObject;
    protected _initializedData?: UntypedObject;
    constructor(target: UntypedObject, source: UntypedObject);
    initialize(): void;
    apply(): boolean;
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
 */
export declare class UndoableRenameProperty implements UndoableAction {
    readonly target: Record<string, any>;
    readonly previousKey: string;
    readonly nextKey: string;
    protected _initializedData?: UntypedObject;
    constructor(target: Record<string, any>, previousKey: string, nextKey: string);
    initialize(): void;
    apply(): any;
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
