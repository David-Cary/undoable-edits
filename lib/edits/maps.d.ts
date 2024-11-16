import { type UndoableAction, type UndoableActionCallback } from './actions';
import { UndoableProxyHandler, type MaybeIterable, type ProxyFactory } from './proxies';
/**
 * UndoableAction for clearing a map.
 * @template K, V
 * @class
 * @extends UndoableAction
 * @property {Map<K, V>} target - map to be modified
 * @property {Set<T>} cache - values prior to clear
 */
export declare class UndoableClearMap<K = any, V = any> implements UndoableAction {
    readonly target: Map<K, V>;
    readonly cache: Map<K, V>;
    constructor(target: Map<K, V>);
    redo(): void;
    undo(): void;
}
/**
 * UndoableAction for removing an item to a map.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Map<K, V>} target - map to be modified
 * @property {K} key - key of entry to be removed
 * @property {boolean} existingItem - cached check for if the item is already in the map
 */
export declare class UndoableDeleteMapItem<K = any, V = any> implements UndoableAction {
    readonly target: Map<K, V>;
    readonly key: K;
    readonly previousValue?: V;
    readonly existingItem: boolean;
    constructor(target: Map<K, V>, key: K);
    redo(): void;
    undo(): void;
}
/**
 * UndoableAction for setting a map value.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Map<K, V>} target - map to be modified
 * @property {K} key - key of target entry
 * @property {V} value - value to be assigned
 * @property {boolean} existingItem - cached check for if the item is already in the map
 */
export declare class UndoableSetMapValue<K = any, V = any> implements UndoableAction {
    readonly target: Map<K, V>;
    readonly key: K;
    readonly previousValue?: V;
    readonly nextValue: V;
    readonly existingItem: boolean;
    constructor(target: Map<K, V>, key: K, value: V);
    redo(): void;
    undo(): void;
}
/**
 * Proxy handler with undoable action reporting for sets.
 * @class
 * @extends UndoableProxyHandler<UntypedRecord>
 */
export declare class UndoableMapHandler<K = any, V = any> extends UndoableProxyHandler<Map<K, V>> {
    constructor(actionCallbacks: MaybeIterable<UndoableActionCallback>, proxyFactory?: ProxyFactory | boolean);
}
