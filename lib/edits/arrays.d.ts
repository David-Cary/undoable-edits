import { type UndoableAction, type UndoableActionCallback } from './actions';
import { UndoableProxyHandler, type ValidKey } from './proxies';
import { type UntypedRecord } from './objects';
/**
 * Undoable action for changing an array's length.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {number} length - desired length for the target array
 * @property {number} originalLength - cached length of array prior to change
 * @property {any[} trimmed - cached values removed by resizing
 */
export declare class UndoableArrayResize implements UndoableAction {
    readonly target: any[];
    readonly length: number;
    readonly originalLength: number;
    readonly trimmed: any[];
    constructor(target: any[], length: number);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's copyWithin method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {number} destination - position elements should be copied to
 * @property {number} start - starting position elements should be copied from
 * @property {number | undefined} end - position copy should stop at
 * @property {any[]} overwritten - cached values overwritten by copy
 */
export declare class UndoableCopyWithin implements UndoableAction {
    readonly target: any[];
    readonly destination: number;
    readonly start: number;
    readonly end?: number;
    readonly overwritten: any[];
    constructor(target: any[], destination: number, start: number, end?: number);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's fill method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any} value - value to fill the target positions with
 * @property {number} start - starting position of the fill
 * @property {number | undefined} end - position the fill stops at
 * @property {any[]} overwritten - cached values overwritten by the fill
 */
export declare class UndoableFill implements UndoableAction {
    readonly target: any[];
    readonly value: any;
    readonly start: number;
    readonly end?: number;
    readonly overwritten: any[];
    constructor(target: any[], value: any, start: number, end?: number);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's pop method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any} value - cached value to be removed
 */
export declare class UndoablePopItem implements UndoableAction {
    readonly target: any[];
    readonly value: any;
    constructor(target: any[]);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's push method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any[]} values - values to be added to the array
 */
export declare class UndoablePushItems implements UndoableAction {
    readonly target: any[];
    readonly values: any[];
    constructor(target: any[], ...values: any[]);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's reverse method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 */
export declare class UndoableReverse implements UndoableAction {
    readonly target: any[];
    constructor(target: any[]);
    redo(): void;
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
export declare class UndoableSetItemAt implements UndoableAction {
    readonly target: any[];
    readonly index: number;
    readonly previousValue: any;
    readonly nextValue: any;
    readonly priorLength: number;
    constructor(target: any[], index: number, nextValue: any);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's shift method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any} value - cached value to be removed
 */
export declare class UndoableShiftItem implements UndoableAction {
    readonly target: any[];
    readonly value: any;
    constructor(target: any[]);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's sort method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {((a: any, b: any) => number) | undefined} compare - comparison function to be applied to sort
 * @property {any[]} unsorted - order of the array's contents before the sort
 */
export declare class UndoableSort implements UndoableAction {
    readonly target: any[];
    readonly compare?: (a: any, b: any) => number;
    readonly unsorted: any[];
    constructor(target: any[], compare?: (a: any, b: any) => number);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's splice method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {number} value - position the splice starts at
 * @property {any[]} deletions - values removed by the splice
 * @property {any[]} insertions - values added by the splice
 */
export declare class UndoableSplice implements UndoableAction {
    readonly target: any[];
    readonly start: number;
    readonly deletions: any[];
    readonly insertions: any[];
    constructor(target: any[], start: number, deleteCount?: number, ...items: any[]);
    redo(): void;
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
    constructor(from: ArrayElementReference<T>, to: ArrayElementReference<T>);
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
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any[]} values - values to be added to the array
 */
export declare class UndoableUnshiftItems implements UndoableAction {
    readonly target: any[];
    readonly values: any[];
    constructor(target: any[], ...values: any[]);
    redo(): void;
    undo(): void;
}
/**
 * Proxy handler with undoable action reporting for arrays.
 * @class
 * @extends UndoableProxyHandler<UntypedRecord>
 * @property {boolean} deep - if true, any array elements will be wrapped in a proxy
 * @property {UndoableProxyHandler<any[]>} recordHandler - handler to be applied to records when making a deep proxy
 */
export declare class UndoableArrayHandler<T = any> extends UndoableProxyHandler<T[]> {
    readonly deep: boolean;
    recordHandler: UndoableProxyHandler<UntypedRecord>;
    constructor(onChange?: UndoableActionCallback, deep?: boolean, recordHandler?: UndoableProxyHandler<UntypedRecord>);
    get(target: T[], property: ValidKey): any;
    set(target: T[], property: ValidKey, value: any): boolean;
}
