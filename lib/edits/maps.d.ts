import { type UndoableActionCallback, UndoableCallback } from './actions';
import { UndoableProxyHandler, type MaybeIterable, type ProxyFactory } from './proxies';
/**
 * UndoableAction for clearing a map.
 * @template K, V
 * @class
 * @extends UndoableCallback
 */
export declare class UndoableClearMap<K = any, V = any> extends UndoableCallback<Map<K, V>, Map<K, V>, typeof Map.prototype.clear> {
    constructor(target: Map<K, V>);
    initialize(): void;
    undo(): void;
}
/**
 * UndoableAction for removing an item to a map.
 * @template T
 * @class
 * @extends UndoableCallback
 * @property {Map<K, V>} target - map to be modified
 * @property {K} key - key of entry to be removed
 */
export declare class UndoableDeleteMapItem<K = any, V = any> extends UndoableCallback<Map<K, V>, Map<K, V>, typeof Map.prototype.delete> {
    constructor(target: Map<K, V>, key: K);
    initialize(): void;
    undo(): void;
}
/**
 * UndoableAction for setting a map value.
 * @template T
 * @class
 * @extends UndoableCallback
 */
export declare class UndoableSetMapValue<K = any, V = any> extends UndoableCallback<Map<K, V>, Map<K, V>, typeof Map.prototype.set> {
    constructor(target: Map<K, V>, ...params: Parameters<typeof Map.prototype.set>);
    initialize(): void;
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
