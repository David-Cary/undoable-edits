import { type UndoableAction, type UndoableActionCallback } from './actions';
export type ValidKey = string | number | symbol;
export declare const PROXY_TARGET: unique symbol;
export declare const APPLY_UNDOABLE_ACTION: unique symbol;
/**
 * Adds special access properties for undoable actions to a proxy handler.
 * @template T
 * @class
 * @extends ProxyHandler<T>
 * @property {UndoableActionCallback | undefined} onChange - callback to be applied when the proxy target changes
 */
export declare class UndoableProxyHandler<T extends object> implements ProxyHandler<T> {
    readonly onChange?: UndoableActionCallback;
    constructor(onChange?: UndoableActionCallback);
    /**
     * Applies the provided action's effects and passed that action to our onChange callback.
     * @function
     * @param {UndoableAction} change - action to be executed
     */
    applyChange(change: UndoableAction): boolean;
    get(target: T, property: ValidKey): any;
}
/**
 * Adds special access properties for undoable actions to a proxy.
 * @template T
 * @type
 * @property {T} PROXY_TARGET - returns the proxy's target
 * @property {UndoableActionCallback} APPLY_UNDOABLE_ACTION - returns a copy of the handler's applyChange method
 */
export type UndoableProxy<T extends object> = T & {
    [PROXY_TARGET]: T;
    [APPLY_UNDOABLE_ACTION]: UndoableActionCallback;
};
/**
 * Creates a proxy with special access properties for undoable actions.
 * @template T
 * @function
 * @param {T} source - object be proxied
 * @param {UndoableProxyHandler<T>} handler - handler for the target proxy
 * @returns {UndoableProxy<T>}
 */
export declare function createUndoableProxy<T extends object>(source: T, handler: UndoableProxyHandler<T>): UndoableProxy<T>;