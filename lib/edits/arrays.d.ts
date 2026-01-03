import { type ValidKey, type UndoableAction, type UndoableActionCallback, UndoableCallback, type ValueWrapper } from './actions';
import { type MaybeIterable, type ProxyFactory, UndoableProxyHandler } from './proxies';
/**
 * Undoable action for changing an array's length.
 * @class
 * @extends UndoableAction
 * @property {T[]} target - array to be modified
 * @property {number} length - desired length for the target array
 * @property {number} originalLength - cached length of array prior to change
 * @property {any[} trimmed - cached values removed by resizing
 */
export declare class UndoableArrayResize<T = any> implements UndoableAction {
    protected _initialized: boolean;
    readonly target: T[];
    readonly length: number;
    protected _originalLength: number;
    protected _trimmed: T[];
    constructor(target: T[], length: number);
    initialize(): void;
    apply(): number;
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's copyWithin method.
 * @class
 * @extends UndoableCallback
 */
export declare class UndoableCopyWithin<T = any> extends UndoableCallback<T[], T[], typeof Array.prototype.copyWithin> {
    constructor(target: T[], ...params: Parameters<typeof Array.prototype.copyWithin>);
    initialize(): void;
    undo(): void;
}
/**
 * Undoable action for an array's fill method.
 * @class
 * @extends UndoableCallback
 */
export declare class UndoableFill<T = any> extends UndoableCallback<T[], T[], typeof Array.prototype.fill> {
    constructor(target: T[], ...params: Parameters<typeof Array.prototype.fill>);
    initialize(): void;
    undo(): void;
}
/**
 * Undoable action for an array's pop method.
 * @class
 * @extends UndoableCallback
 */
export declare class UndoablePopItem<T = any> extends UndoableCallback<ValueWrapper, T[], typeof Array.prototype.pop> {
    constructor(target: T[]);
    initialize(): void;
    undo(): void;
}
/**
 * Undoable action for an array's push method.
 * @class
 * @extends UndoableCallback
 */
export declare class UndoablePushItems<T = any> extends UndoableCallback<any, T[], typeof Array.prototype.push> {
    constructor(target: T[], ...values: T[]);
    undo(): void;
}
/**
 * Undoable action for an array's reverse method.
 * @class
 * @extends UndoableCallback
 */
export declare class UndoableReverse<T = any> extends UndoableCallback<boolean, T[], typeof Array.prototype.reverse> {
    constructor(target: any[]);
    initialize(): void;
    undo(): void;
}
/**
 * Undoable action for setting the array element at a given index.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {number} index - position for the target value
 * @property {any} previousValue - cached value before assignment
 * @property {any} nextValue - value to be assigned
 * @property {number} priorLength - cached length of array before assignment
 */
export declare class UndoableSetItemAt<T = any> implements UndoableAction {
    readonly target: T[];
    readonly index: number;
    protected _initializedData?: {
        value: T;
        length: number;
    };
    readonly nextValue: T;
    protected _priorLength: number;
    constructor(target: T[], index: number, nextValue: any);
    initialize(): void;
    apply(): boolean;
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's shift method.
 * @class
 * @extends UndoableCallback
 */
export declare class UndoableShiftItem<T = any> extends UndoableCallback<ValueWrapper, T[], typeof Array.prototype.shift> {
    constructor(target: T[]);
    initialize(): void;
    undo(): void;
}
/**
 * Undoable action for an array's sort method.
 * @class
 * @extends UndoableCallback
 */
export declare class UndoableSort<T = any> extends UndoableCallback<T[], T[], typeof Array.prototype.sort> {
    constructor(target: T[], ...params: Parameters<typeof Array.prototype.sort>);
    initialize(): void;
    undo(): void;
}
/**
 * Undoable action for an array's splice method.
 * @class
 * @extends UndoableCallback
 */
export declare class UndoableSplice<T = any> extends UndoableCallback<Parameters<typeof Array.prototype.splice>, T[], typeof Array.prototype.splice> {
    constructor(target: T[], ...params: Parameters<typeof Array.prototype.splice>);
    initialize(): void;
    undo(): void;
}
/**
 * References a particular position with a given array.
 * @template T
 * @interface
 * @property {T[]} source - owner of the target element
 * @property {number} index - position of the target position within the array
 */
export interface ArrayElementReference<T = any> {
    source: T[];
    index: number;
}
/**
 * Moves an element from one array to a given position in another array.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {ArrayElementReference<T>} from - position of element to be moved
 * @property {ArrayElementReference<T>} to - destination of the target element
 */
export declare class UndoableTransferItem<T = any> implements UndoableAction {
    readonly from: ArrayElementReference<T>;
    readonly to: ArrayElementReference<T>;
    protected _initializedData: any[];
    constructor(from: ArrayElementReference<T>, to: ArrayElementReference<T>);
    apply(): ArrayElementReference<T> | undefined;
    initialize(): void;
    redo(): void;
    undo(): void;
    /**
     * Helper function for moving element from one array to another.
     * @function
     * @property {ArrayElementReference<T>} from - position of element to be moved
     * @property {ArrayElementReference<T>} to - destination of the target element
     */
    transferItem(from: ArrayElementReference<T>, to: ArrayElementReference<T>): void;
}
/**
 * Undoable action for an array's unshift method.
 * @class
 * @extends UndoableCallback
 */
export declare class UndoableUnshiftItems<T = any> extends UndoableCallback<any, T[], typeof Array.prototype.unshift> {
    constructor(target: T[], ...values: any[]);
    undo(): void;
}
/**
 * Proxy handler with undoable action reporting for arrays.
 * @class
 * @extends UndoableProxyHandler<T[]>
 */
export declare class UndoableArrayHandler<T = any> extends UndoableProxyHandler<T[]> {
    constructor(actionCallbacks: MaybeIterable<UndoableActionCallback>, proxyFactory?: ProxyFactory | boolean);
    set(target: T[], property: ValidKey, value: any): boolean;
}
