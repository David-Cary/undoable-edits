"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUndoableProxy = exports.UndoableProxyHandler = exports.APPLY_UNDOABLE_ACTION = exports.PROXY_TARGET = void 0;
exports.PROXY_TARGET = Symbol('Proxy_target');
exports.APPLY_UNDOABLE_ACTION = Symbol('applyUndoableAction');
/**
 * Adds special access properties for undoable actions to a proxy handler.
 * @template T
 * @class
 * @extends ProxyHandler<T>
 * @property {UndoableActionCallback | undefined} onChange - callback to be applied when the proxy target changes
 */
var UndoableProxyHandler = /** @class */ (function () {
    function UndoableProxyHandler(onChange) {
        this.onChange = onChange;
    }
    /**
     * Applies the provided action's effects and passed that action to our onChange callback.
     * @function
     * @param {UndoableAction} change - action to be executed
     */
    UndoableProxyHandler.prototype.applyChange = function (change) {
        if (this.onChange != null) {
            this.onChange(change);
        }
        change.redo();
        return true;
    };
    UndoableProxyHandler.prototype.get = function (target, property) {
        var _this = this;
        if (property === exports.APPLY_UNDOABLE_ACTION) {
            return function (action) { return _this.applyChange(action); };
        }
        if (property === exports.PROXY_TARGET) {
            return target;
        }
        return Reflect.get(target, property);
    };
    return UndoableProxyHandler;
}());
exports.UndoableProxyHandler = UndoableProxyHandler;
/**
 * Creates a proxy with special access properties for undoable actions.
 * @template T
 * @function
 * @param {T} source - object be proxied
 * @param {UndoableProxyHandler<T>} handler - handler for the target proxy
 * @returns {UndoableProxy<T>}
 */
function createUndoableProxy(source, handler) {
    return new Proxy(source, handler);
}
exports.createUndoableProxy = createUndoableProxy;
