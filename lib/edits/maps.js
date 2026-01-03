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
exports.UndoableMapHandler = exports.UndoableSetMapValue = exports.UndoableDeleteMapItem = exports.UndoableClearMap = void 0;
var actions_1 = require("./actions");
var proxies_1 = require("./proxies");
/**
 * UndoableAction for clearing a map.
 * @template K, V
 * @class
 * @extends UndoableCallback
 */
var UndoableClearMap = /** @class */ (function (_super) {
    __extends(UndoableClearMap, _super);
    function UndoableClearMap(target) {
        return _super.call(this, target, target.clear, []) || this;
    }
    UndoableClearMap.prototype.initialize = function () {
        this._initializedData = new Map(this.target);
    };
    UndoableClearMap.prototype.undo = function () {
        var _this = this;
        if (this._initializedData != null) {
            this._initializedData.forEach(function (value, key) { return _this.target.set(key, value); });
        }
    };
    return UndoableClearMap;
}(actions_1.UndoableCallback));
exports.UndoableClearMap = UndoableClearMap;
/**
 * UndoableAction for removing an item to a map.
 * @template T
 * @class
 * @extends UndoableCallback
 * @property {Map<K, V>} target - map to be modified
 * @property {K} key - key of entry to be removed
 */
var UndoableDeleteMapItem = /** @class */ (function (_super) {
    __extends(UndoableDeleteMapItem, _super);
    function UndoableDeleteMapItem(target, key) {
        return _super.call(this, target, target.delete, [key]) || this;
    }
    UndoableDeleteMapItem.prototype.initialize = function () {
        this._initializedData = new Map();
        var key = this.values[0];
        var value = this.target.get(key);
        if (value !== undefined)
            this._initializedData.set(key, value);
    };
    UndoableDeleteMapItem.prototype.undo = function () {
        if (this._initializedData != null) {
            var key = this.values[0];
            var value = this._initializedData.get(key);
            if (value !== undefined)
                this.target.set(key, value);
        }
    };
    return UndoableDeleteMapItem;
}(actions_1.UndoableCallback));
exports.UndoableDeleteMapItem = UndoableDeleteMapItem;
/**
 * UndoableAction for setting a map value.
 * @template T
 * @class
 * @extends UndoableCallback
 */
var UndoableSetMapValue = /** @class */ (function (_super) {
    __extends(UndoableSetMapValue, _super);
    function UndoableSetMapValue(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.set, params) || this;
    }
    UndoableSetMapValue.prototype.initialize = function () {
        this._initializedData = new Map();
        var key = this.values[0];
        var value = this.target.get(key);
        if (value !== undefined)
            this._initializedData.set(key, value);
    };
    UndoableSetMapValue.prototype.undo = function () {
        if (this._initializedData != null) {
            var key = this.values[0];
            var value = this._initializedData.get(key);
            if (value !== undefined) {
                this.target.set(key, value);
            }
            else {
                this.target.delete(key);
            }
        }
    };
    return UndoableSetMapValue;
}(actions_1.UndoableCallback));
exports.UndoableSetMapValue = UndoableSetMapValue;
/**
 * Proxy handler with undoable action reporting for sets.
 * @class
 * @extends UndoableProxyHandler<UntypedRecord>
 */
var UndoableMapHandler = /** @class */ (function (_super) {
    __extends(UndoableMapHandler, _super);
    function UndoableMapHandler(actionCallbacks, proxyFactory) {
        var _this = _super.call(this, actionCallbacks, proxyFactory, {
            clear: function (target) {
                return function () {
                    return _this.applyChange(new UndoableClearMap(target));
                };
            },
            delete: function (target) {
                return function (key) {
                    return _this.applyChange(new UndoableDeleteMapItem(target, key));
                };
            },
            set: function (target) {
                return function (key, value) {
                    return _this.applyChange(new UndoableSetMapValue(target, key, value));
                };
            }
        }) || this;
        return _this;
    }
    return UndoableMapHandler;
}(proxies_1.UndoableProxyHandler));
exports.UndoableMapHandler = UndoableMapHandler;
proxies_1.ClassedUndoableProxyFactory.defaultHandlerClasses.set(Map.prototype, UndoableMapHandler);
