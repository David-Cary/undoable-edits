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
var actions_1 = require("./actions");
var proxies_1 = require("./proxies");
/**
 * UndoableAction for adding an item to a set.
 * @template T
 * @class
 * @extends UndoableCallback
 */
var UndoableAddSetItem = /** @class */ (function (_super) {
    __extends(UndoableAddSetItem, _super);
    function UndoableAddSetItem(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.add, params) || this;
    }
    UndoableAddSetItem.prototype.initialize = function () {
        var value = this.values[0];
        this._initializedData = this.target.has(value);
    };
    UndoableAddSetItem.prototype.undo = function () {
        if (this._initializedData === false) {
            var value = this.values[0];
            this.target.delete(value);
        }
    };
    return UndoableAddSetItem;
}(actions_1.UndoableCallback));
exports.UndoableAddSetItem = UndoableAddSetItem;
/**
 * UndoableAction for clearing a set.
 * @template T
 * @class
 * @extends UndoableCallback
 */
var UndoableClearSet = /** @class */ (function (_super) {
    __extends(UndoableClearSet, _super);
    function UndoableClearSet(target) {
        return _super.call(this, target, target.clear, []) || this;
    }
    UndoableClearSet.prototype.initialize = function () {
        this._initializedData = new Set(this.target);
    };
    UndoableClearSet.prototype.undo = function () {
        var _this = this;
        if (this._initializedData != null) {
            this._initializedData.forEach(function (value) { return _this.target.add(value); });
        }
    };
    return UndoableClearSet;
}(actions_1.UndoableCallback));
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
var UndoableDeleteSetItem = /** @class */ (function (_super) {
    __extends(UndoableDeleteSetItem, _super);
    function UndoableDeleteSetItem(target, value) {
        return _super.call(this, target, target.delete, [value]) || this;
    }
    UndoableDeleteSetItem.prototype.undo = function () {
        var value = this.values[0];
        this.target.add(value);
    };
    return UndoableDeleteSetItem;
}(actions_1.UndoableCallback));
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
                    var result = _this.applyChange(new UndoableAddSetItem(target, value));
                    return new Proxy(result, _this);
                };
            },
            clear: function (target) {
                return function () {
                    return _this.applyChange(new UndoableClearSet(target));
                };
            },
            delete: function (target) {
                return function (value) {
                    return _this.applyChange(new UndoableDeleteSetItem(target, value));
                };
            }
        }) || this;
        return _this;
    }
    return UndoableSetHandler;
}(proxies_1.UndoableProxyHandler));
exports.UndoableSetHandler = UndoableSetHandler;
proxies_1.ClassedUndoableProxyFactory.defaultHandlerClasses.set(Set.prototype, UndoableSetHandler);
