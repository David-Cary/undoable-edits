import { type UndoableActionCallback, UndoableCallback } from './actions';
import { UndoableProxyHandler, type MaybeIterable, type ProxyFactory } from './proxies';
/**
 * UndoableAction for adding an item to a set.
 * @template T
 * @class
 * @extends UndoableCallback
 */
export declare class UndoableAddSetItem<T = any> extends UndoableCallback<boolean, Set<T>, typeof Set.prototype.add> {
    constructor(target: Set<T>, ...params: Parameters<typeof Set.prototype.add>);
    initialize(): void;
    undo(): void;
}
/**
 * UndoableAction for clearing a set.
 * @template T
 * @class
 * @extends UndoableCallback
 */
export declare class UndoableClearSet<T = any> extends UndoableCallback<Set<T>, Set<T>, typeof Set.prototype.clear> {
    constructor(target: Set<T>);
    initialize(): void;
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
export declare class UndoableDeleteSetItem<T = any> extends UndoableCallback<any, Set<T>, typeof Set.prototype.delete> {
    constructor(target: Set<T>, value: T);
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
