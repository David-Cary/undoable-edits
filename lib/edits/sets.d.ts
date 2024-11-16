import { type UndoableAction, type UndoableActionCallback } from './actions';
import { UndoableProxyHandler, type MaybeIterable, type ProxyFactory } from './proxies';
/**
 * UndoableAction for adding an item to a set.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Set<T>} target - set to be modified
 * @property {T} value - value to be added
 * @property {boolean} existingItem - cached check for if the item is already in the set
 */
export declare class UndoableAddSetItem<T = any> implements UndoableAction {
    readonly target: Set<T>;
    readonly value: T;
    readonly existingItem: boolean;
    constructor(target: Set<T>, value: T);
    redo(): void;
    undo(): void;
}
/**
 * UndoableAction for clearing a set.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Set<T>} target - set to be modified
 * @property {Set<T>} cache - values prior to clear
 */
export declare class UndoableClearSet<T = any> implements UndoableAction {
    readonly target: Set<T>;
    readonly cache: Set<T>;
    constructor(target: Set<T>);
    redo(): void;
    undo(): void;
}
/**
 * UndoableAction for removing an item to a set.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Set<T>} target - set to be modified
 * @property {T} value - value to be removed
 * @property {boolean} existingItem - cached check for if the item is already in the set
 */
export declare class UndoableDeleteSetItem<T = any> implements UndoableAction {
    readonly target: Set<T>;
    readonly value: T;
    readonly existingItem: boolean;
    constructor(target: Set<T>, value: T);
    redo(): void;
    undo(): void;
}
/**
 * Proxy handler with undoable action reporting for sets.
 * @class
 * @extends UndoableProxyHandler<UntypedRecord>
 */
export declare class UndoableSetHandler<T = any> extends UndoableProxyHandler<Set<T>> {
    constructor(actionCallbacks: MaybeIterable<UndoableActionCallback>, proxyFactory?: ProxyFactory | boolean);
}
