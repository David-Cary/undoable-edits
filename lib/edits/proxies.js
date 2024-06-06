"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassedProxyHandlerFactory = exports.createUndoableProxy = exports.UndoableProxyHandler = exports.APPLY_UNDOABLE_ACTION = exports.PROXY_TARGET = void 0;
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
    function UndoableProxyHandler(onChange, propertyHandlerFactory) {
        this.onChange = onChange;
        this.propertyHandlerFactory = propertyHandlerFactory;
    }
    /**
     * Applies the provided action's effects and passed that action to our onChange callback.
     * @function
     * @param {UndoableAction} change - action to be executed
     * @returns {boolean}
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
        var value = Reflect.get(target, property);
        switch (typeof value) {
            case 'function': {
                return value.bind(target);
            }
            case 'object': {
                if (value != null) {
                    if (this.propertyHandlerFactory != null) {
                        var handler = this.propertyHandlerFactory.getHandlerFor(value);
                        if (handler != null) {
                            return new Proxy(value, handler);
                        }
                    }
                }
                break;
            }
        }
        return value;
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
/**
 * Gets proxy handlers by what the target object is an instance of.
 * @class
 * @extends UndoableProxyHandler<UntypedRecord>
 * @property {Array<ClassValue<ProxyHandler<object>>>} classes - list of handlers by class, in descending priority order
 * @property {ProxyHandler<object>} classes - handler to use if object doesn't match the listed classes
 */
var ClassedProxyHandlerFactory = /** @class */ (function () {
    function ClassedProxyHandlerFactory(classes, defaultHandler) {
        if (classes === void 0) { classes = []; }
        this.classes = classes;
        this.defaultHandler = defaultHandler;
    }
    ClassedProxyHandlerFactory.prototype.getHandlerFor = function (value) {
        for (var _i = 0, _a = this.classes; _i < _a.length; _i++) {
            var entry = _a[_i];
            if (value instanceof entry.class) {
                return entry.value;
            }
        }
        return this.defaultHandler;
    };
    return ClassedProxyHandlerFactory;
}());
exports.ClassedProxyHandlerFactory = ClassedProxyHandlerFactory;
