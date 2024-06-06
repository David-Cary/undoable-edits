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
var proxies_1 = require("./proxies");
/**
 * UndoableAction for clearing a map.
 * @template K, V
 * @class
 * @extends UndoableAction
 * @property {Map<K, V>} target - map to be modified
 * @property {Set<T>} cache - values prior to clear
 */
var UndoableClearMap = /** @class */ (function () {
    function UndoableClearMap(target) {
        this.target = target;
        this.cache = new Map(target);
    }
    UndoableClearMap.prototype.redo = function () {
        this.target.clear();
    };
    UndoableClearMap.prototype.undo = function () {
        var _this = this;
        this.cache.forEach(function (value, key) { return _this.target.set(key, value); });
    };
    return UndoableClearMap;
}());
exports.UndoableClearMap = UndoableClearMap;
/**
 * UndoableAction for removing an item to a map.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Map<K, V>} target - map to be modified
 * @property {K} key - key of entry to be removed
 * @property {boolean} existingItem - cached check for if the item is already in the map
 */
var UndoableDeleteMapItem = /** @class */ (function () {
    function UndoableDeleteMapItem(target, key) {
        this.target = target;
        this.key = key;
        this.previousValue = target.get(key);
        this.existingItem = target.has(key);
    }
    UndoableDeleteMapItem.prototype.redo = function () {
        this.target.delete(this.key);
    };
    UndoableDeleteMapItem.prototype.undo = function () {
        if (this.existingItem && this.previousValue !== undefined) {
            this.target.set(this.key, this.previousValue);
        }
    };
    return UndoableDeleteMapItem;
}());
exports.UndoableDeleteMapItem = UndoableDeleteMapItem;
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
var UndoableSetMapValue = /** @class */ (function () {
    function UndoableSetMapValue(target, key, value) {
        this.target = target;
        this.key = key;
        this.nextValue = value;
        this.previousValue = target.get(key);
        this.existingItem = target.has(key);
    }
    UndoableSetMapValue.prototype.redo = function () {
        this.target.set(this.key, this.nextValue);
    };
    UndoableSetMapValue.prototype.undo = function () {
        if (this.existingItem && this.previousValue !== undefined) {
            this.target.set(this.key, this.previousValue);
        }
        else {
            this.target.delete(this.key);
        }
    };
    return UndoableSetMapValue;
}());
exports.UndoableSetMapValue = UndoableSetMapValue;
/**
 * Proxy handler with undoable action reporting for sets.
 * @class
 * @extends UndoableProxyHandler<UntypedRecord>
 */
var UndoableMapHandler = /** @class */ (function (_super) {
    __extends(UndoableMapHandler, _super);
    function UndoableMapHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UndoableMapHandler.prototype.get = function (target, property) {
        if (this.onChange != null) {
            var onChange_1 = this.onChange;
            switch (property) {
                case 'clear': {
                    return function () {
                        onChange_1(new UndoableClearMap(target));
                        target.clear();
                    };
                }
                case 'delete': {
                    return function (key) {
                        onChange_1(new UndoableDeleteMapItem(target, key));
                        return target.delete(key);
                    };
                }
                case 'set': {
                    return function (key, value) {
                        onChange_1(new UndoableSetMapValue(target, key, value));
                        return target.set(key, value);
                    };
                }
            }
        }
        return _super.prototype.get.call(this, target, property);
    };
    return UndoableMapHandler;
}(proxies_1.UndoableProxyHandler));
exports.UndoableMapHandler = UndoableMapHandler;
