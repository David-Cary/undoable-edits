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
exports.UndoableSetHandler = exports.UndoableDeleteSetItem = exports.UndoableClearSet = exports.UndoableAddSetItem = void 0;
var proxies_1 = require("./proxies");
/**
 * UndoableAction for adding an item to a set.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Set<T>} target - set to be modified
 * @property {T} value - value to be added
 * @property {boolean} existingItem - cached check for if the item is already in the set
 */
var UndoableAddSetItem = /** @class */ (function () {
    function UndoableAddSetItem(target, value) {
        this.target = target;
        this.value = value;
        this.existingItem = target.has(value);
    }
    UndoableAddSetItem.prototype.redo = function () {
        this.target.add(this.value);
    };
    UndoableAddSetItem.prototype.undo = function () {
        if (!this.existingItem) {
            this.target.delete(this.value);
        }
    };
    return UndoableAddSetItem;
}());
exports.UndoableAddSetItem = UndoableAddSetItem;
/**
 * UndoableAction for clearing a set.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Set<T>} target - set to be modified
 * @property {Set<T>} cache - values prior to clear
 */
var UndoableClearSet = /** @class */ (function () {
    function UndoableClearSet(target) {
        this.target = target;
        this.cache = new Set(target);
    }
    UndoableClearSet.prototype.redo = function () {
        this.target.clear();
    };
    UndoableClearSet.prototype.undo = function () {
        var _this = this;
        this.cache.forEach(function (value) { return _this.target.add(value); });
    };
    return UndoableClearSet;
}());
exports.UndoableClearSet = UndoableClearSet;
/**
 * UndoableAction for removing an item to a set.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Set<T>} target - set to be modified
 * @property {T} value - value to be removed
 * @property {boolean} existingItem - cached check for if the item is already in the set
 */
var UndoableDeleteSetItem = /** @class */ (function () {
    function UndoableDeleteSetItem(target, value) {
        this.target = target;
        this.value = value;
        this.existingItem = target.has(value);
    }
    UndoableDeleteSetItem.prototype.redo = function () {
        this.target.delete(this.value);
    };
    UndoableDeleteSetItem.prototype.undo = function () {
        if (this.existingItem) {
            this.target.add(this.value);
        }
    };
    return UndoableDeleteSetItem;
}());
exports.UndoableDeleteSetItem = UndoableDeleteSetItem;
/**
 * Proxy handler with undoable action reporting for sets.
 * @class
 * @extends UndoableProxyHandler<UntypedRecord>
 */
var UndoableSetHandler = /** @class */ (function (_super) {
    __extends(UndoableSetHandler, _super);
    function UndoableSetHandler(actionCallbacks, proxyFactory) {
        var _this = _super.call(this, actionCallbacks, proxyFactory, {
            add: function (target) {
                return function (value) {
                    _this.onChange(new UndoableAddSetItem(target, value));
                    var result = target.add(value);
                    return new Proxy(result, _this);
                };
            },
            clear: function (target) {
                return function () {
                    _this.onChange(new UndoableClearSet(target));
                    target.clear();
                };
            },
            delete: function (target) {
                return function (value) {
                    _this.onChange(new UndoableDeleteSetItem(target, value));
                    return target.delete(value);
                };
            }
        }) || this;
        return _this;
    }
    return UndoableSetHandler;
}(proxies_1.UndoableProxyHandler));
exports.UndoableSetHandler = UndoableSetHandler;
proxies_1.ClassedUndoableProxyFactory.defaultHandlerClasses.set(Set.prototype, UndoableSetHandler);
