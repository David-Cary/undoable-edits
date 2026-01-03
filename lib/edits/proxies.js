"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndoableProxyListener = exports.UndoableTransformation = exports.applyUndoableActionVia = exports.unwrapProxyTarget = exports.createUndoableProxy = exports.ClassedUndoableProxyFactory = exports.UndoableProxyHandler = exports.getSetFrom = exports.APPLY_UNDOABLE_ACTION = exports.PROXY_TARGET = exports.PROXY_HANDLER = void 0;
var actions_1 = require("./actions");
exports.PROXY_HANDLER = Symbol('Proxy_handler');
exports.PROXY_TARGET = Symbol('Proxy_target');
exports.APPLY_UNDOABLE_ACTION = Symbol('applyUndoableAction');
function getSetFrom(source) {
    if (typeof source === 'object' && source != null && Symbol.iterator in source) {
        return source instanceof Set ? source : new Set(source);
    }
    return new Set([source]);
}
exports.getSetFrom = getSetFrom;
/**
 * Adds special access properties for undoable actions to a proxy handler.
 * @template T
 * @class
 * @extends ProxyHandler<T>
 * @property {UndoableActionCallback[]} actionCallbacks - callbacks to be applied when the proxy target changes
 * @property {ProxyFactory | undefined} proxyFactory - allows generating proxies for property values and returns
 * @property {Record<ValidKey, GetPropertyOf<T>>} propertyGetters - allows specifying proxy getter callbacks for key properties
 */
var UndoableProxyHandler = /** @class */ (function () {
    function UndoableProxyHandler(actionCallbacks, proxyFactory, propertyGetters) {
        if (propertyGetters === void 0) { propertyGetters = {}; }
        this.actionCallbacks = getSetFrom(actionCallbacks);
        this.proxyFactory = typeof proxyFactory === 'boolean'
            ? (proxyFactory ? new ClassedUndoableProxyFactory(actionCallbacks) : undefined)
            : proxyFactory;
        this.propertyGetters = propertyGetters;
    }
    /**
     * Applies out action callbacks to the provided change.
     * @function
     * @param {UndoableAction} change - action to be executed
     * @returns {boolean}
     */
    UndoableProxyHandler.prototype.onChange = function (change) {
        this.actionCallbacks.forEach(function (callback) { callback(change); });
    };
    /**
     * Applies the provided action's effects and triggers the corresponding callbacks.
     * @function
     * @param {UndoableAction} change - action to be executed
     * @returns {boolean}
     */
    UndoableProxyHandler.prototype.applyChange = function (change) {
        this.onChange(change);
        return change.apply();
    };
    UndoableProxyHandler.prototype.get = function (target, property) {
        var _this = this;
        var getValue = this.propertyGetters[property];
        if (getValue != null) {
            return getValue(target);
        }
        if (property === exports.APPLY_UNDOABLE_ACTION) {
            return function (action) { return _this.applyChange(action); };
        }
        if (property === exports.PROXY_TARGET) {
            return target;
        }
        if (property === exports.PROXY_HANDLER) {
            return this;
        }
        var value = Reflect.get(target, property);
        if (typeof value === 'function' && target != null) {
            return value.bind(target);
        }
        return this.getProxiedValue(value);
    };
    /**
     * Tries to wrap the value in a proxy.
     * If the value isn't an object or there's no proxy factory, the value itself is returned.
     * @function
     * @param {any} value - value to be wrapped
     * @returns {any}
     */
    UndoableProxyHandler.prototype.getProxiedValue = function (value) {
        if (this.proxyFactory != null && typeof value === 'object' && value != null) {
            return this.proxyFactory.getProxyFor(value);
        }
        return value;
    };
    UndoableProxyHandler.prototype.has = function (target, property) {
        var symbols = [exports.APPLY_UNDOABLE_ACTION, exports.PROXY_TARGET, exports.PROXY_HANDLER];
        if (symbols.includes(property)) {
            return true;
        }
        return Reflect.has(target, property);
    };
    return UndoableProxyHandler;
}());
exports.UndoableProxyHandler = UndoableProxyHandler;
/**
 * Produces proxies with undoable action support based on the prototype chain of the target value.
 * @class
 * @property {UndoableActionCallback[]} actionCallbacks - callbacks to be applied when the proxy target changes
 * @property {Map<UntypedObject, UndoableProxyHandlerClass>} handlerClasses - map of handler classes by target prototype
 * @property {Map<UntypedObject, ProxyHandler<object>>} handlers - map of cached handlers by target prototype
 */
var ClassedUndoableProxyFactory = /** @class */ (function () {
    function ClassedUndoableProxyFactory(actionCallbacks, handlerClasses) {
        if (handlerClasses === void 0) { handlerClasses = ClassedUndoableProxyFactory.defaultHandlerClasses; }
        this.handlers = new Map();
        this.actionCallbacks = getSetFrom(actionCallbacks);
        this.handlerClasses = handlerClasses;
    }
    ClassedUndoableProxyFactory.prototype.getProxyFor = function (value) {
        var handler = this.getProxyHandlerFor(value);
        return new Proxy(value, handler);
    };
    /**
     * Provides a proxy handler for a given object.
     * If the value isn't an object or there's no proxy factory, the value itself is returned.
     * @function
     * @param {object} value - value handler should be generated for
     * @returns {ProxyHandler<object>}
     */
    ClassedUndoableProxyFactory.prototype.getProxyHandlerFor = function (value) {
        var proto = Object.getPrototypeOf(value);
        while (proto != null) {
            var cachedHandler = this.handlers.get(proto);
            if (cachedHandler != null)
                return cachedHandler;
            var HandlerClass = this.handlerClasses.get(proto);
            if (HandlerClass != null) {
                var handler = new HandlerClass(this.actionCallbacks, this);
                this.handlers.set(proto, handler);
                return handler;
            }
            proto = Object.getPrototypeOf(proto);
        }
        return new UndoableProxyHandler(this.actionCallbacks, this);
    };
    /**
     * Generates an UndoableProxy with it's own factory based on the target's protoype chain.
     * @static
     * @function
     * @param {object} value - value to be proxied
     * @param {MaybeIterable<UndoableActionCallback>} actionCallbacks - callbacks to be used on value change
     * @param {Map<UntypedObject, UndoableProxyHandlerClass>} handlerClasses - map of handler classes by target prototype
     * @returns {UndoableProxy}
     */
    ClassedUndoableProxyFactory.createProxyUsing = function (value, actionCallbacks, handlerClasses) {
        if (handlerClasses === void 0) { handlerClasses = ClassedUndoableProxyFactory.defaultHandlerClasses; }
        var handlerFactory = new ClassedUndoableProxyFactory(actionCallbacks, handlerClasses);
        var proxy = handlerFactory.getProxyFor(value);
        return proxy;
    };
    /**
     * Provides default values for the handlerClasses of new ClassedUndoableProxyFactory instances.
     * @static
     */
    ClassedUndoableProxyFactory.defaultHandlerClasses = new Map();
    return ClassedUndoableProxyFactory;
}());
exports.ClassedUndoableProxyFactory = ClassedUndoableProxyFactory;
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
 * Accesses the proxy target if provided an UndoableProxy.
 * @template T
 * @function
 * @param {T} source - object be evaluated
 * @returns {T}
 */
function unwrapProxyTarget(source) {
    return exports.PROXY_TARGET in source
        ? source[exports.PROXY_TARGET]
        : source;
}
exports.unwrapProxyTarget = unwrapProxyTarget;
/**
 * Tries to apply an UndoableAction through the callback of the provided UndoableProxy.
 * @template T
 * @function
 * @param {T} context - source of the target callback
 * @param {UndoableAction} action - action to be applied
 */
function applyUndoableActionVia(context, action) {
    exports.APPLY_UNDOABLE_ACTION in context
        ? context[exports.APPLY_UNDOABLE_ACTION](action)
        : action.apply();
}
exports.applyUndoableActionVia = applyUndoableActionVia;
/**
 * Allows treating a value modifying callback as a single action.
 * @class
 * @property {UndoableProxy<T>} proxy - proxy wrapper for the value to be transformed
 * @property {(value: T) => void} transform - callback to be executed
 */
var UndoableTransformation = /** @class */ (function (_super) {
    __extends(UndoableTransformation, _super);
    function UndoableTransformation(target, transform, handlerClasses) {
        var _this = _super.call(this, []) || this;
        var unwrappedTarget = unwrapProxyTarget(target);
        var handlerFactory = new ClassedUndoableProxyFactory(function (action) { _this.steps.push(action); }, handlerClasses);
        _this.proxy = handlerFactory.getProxyFor(unwrappedTarget);
        _this.transform = transform;
        return _this;
    }
    UndoableTransformation.prototype.initialize = function () {
        this.steps.length = 0;
    };
    UndoableTransformation.prototype.apply = function () {
        this.initialize();
        this.transform(this.proxy);
        return true;
    };
    UndoableTransformation.prototype.redo = function () {
        this.initialize();
        this.transform(this.proxy);
    };
    /**
     * Applies a callback to the target value, triggering the target's action callbacks
     * if it's an undoable proxy.
     * @static
     * @function
     * @param {object} target - value to be transformed
     * @param {(value: object) => void} transform - callbacks to be used
     */
    UndoableTransformation.applyTransformTo = function (target, transform) {
        if (exports.APPLY_UNDOABLE_ACTION in target) {
            var action = new UndoableTransformation(target, transform);
            applyUndoableActionVia(target, action);
        }
        else {
            transform(target);
        }
    };
    return UndoableTransformation;
}(actions_1.UndoableActionSequence));
exports.UndoableTransformation = UndoableTransformation;
var UndoableProxyListener = /** @class */ (function () {
    function UndoableProxyListener(callback, source, handlerClasses) {
        this._callback = callback;
        if (source != null) {
            this.setProxyFrom(source, handlerClasses);
        }
    }
    Object.defineProperty(UndoableProxyListener.prototype, "callback", {
        get: function () {
            return this._callback;
        },
        set: function (value) {
            if (this._callback === value)
                return;
            this.detachCallback();
            this._callback = value;
            this.attachCallback();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoableProxyListener.prototype, "proxy", {
        get: function () {
            return this._proxy;
        },
        set: function (value) {
            if (this._proxy === value)
                return;
            this.detachCallback();
            this._proxy = value;
            this.attachCallback();
        },
        enumerable: false,
        configurable: true
    });
    UndoableProxyListener.prototype.attachCallback = function () {
        if (this._proxy != null) {
            this._proxy[exports.PROXY_HANDLER].actionCallbacks.add(this.callback);
        }
    };
    UndoableProxyListener.prototype.detachCallback = function () {
        if (this._proxy != null) {
            this._proxy[exports.PROXY_HANDLER].actionCallbacks.delete(this.callback);
        }
    };
    UndoableProxyListener.prototype.setProxyFrom = function (value, handlerClasses) {
        this.proxy = exports.PROXY_HANDLER in value
            ? value
            : ClassedUndoableProxyFactory.createProxyUsing(value, this.callback, handlerClasses);
    };
    return UndoableProxyListener;
}());
exports.UndoableProxyListener = UndoableProxyListener;
