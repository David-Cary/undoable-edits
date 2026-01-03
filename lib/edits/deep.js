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
exports.parsePathString = exports.UndoableInsertNestedValue = exports.UndoableSetNestedValue = exports.createSetNestedValueRequest = exports.UndoableDeleteNestedValue = exports.reducePropertyPath = exports.UndoableTransferValue = exports.UndoableCopyValue = exports.UndoableInsertValue = exports.UndoableSetValue = exports.UndoableDeleteValue = void 0;
var actions_1 = require("./actions");
var arrays_1 = require("./arrays");
var objects_1 = require("./objects");
/**
 * Sets the target value or array item by the provided key/index.
 * @class
 * @extends UndoableAction
 */
var UndoableDeleteValue = /** @class */ (function (_super) {
    __extends(UndoableDeleteValue, _super);
    function UndoableDeleteValue(target, key) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.key = key;
        return _this;
    }
    UndoableDeleteValue.prototype.createDelegatedAction = function () {
        if (Array.isArray(this.target)) {
            if (this.key === '-')
                return new arrays_1.UndoablePopItem(this.target);
            var index = Number(this.key);
            if (isNaN(index))
                return;
            return new arrays_1.UndoableSplice(this.target, index, 1);
        }
        return new objects_1.UndoableDeleteProperty(this.target, String(this.key));
    };
    return UndoableDeleteValue;
}(actions_1.DelegatingUndoableAction));
exports.UndoableDeleteValue = UndoableDeleteValue;
/**
 * Sets the target value or array item by the provided key/index.
 * @class
 * @extends DelegatingUndoableAction
 */
var UndoableSetValue = /** @class */ (function (_super) {
    __extends(UndoableSetValue, _super);
    function UndoableSetValue(target, key, value) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.key = key;
        _this.value = value;
        return _this;
    }
    UndoableSetValue.prototype.createDelegatedAction = function () {
        if (Array.isArray(this.target)) {
            switch (this.key) {
                case 'length': {
                    return new arrays_1.UndoableArrayResize(this.target, this.value);
                }
                case '-': {
                    return new arrays_1.UndoablePushItems(this.target, this.value);
                }
                default: {
                    var index = Number(this.key);
                    return isNaN(index)
                        ? undefined
                        : new arrays_1.UndoableSetItemAt(this.target, index, this.value);
                }
            }
        }
        return new objects_1.UndoableSetProperty(this.target, this.key, this.value);
    };
    return UndoableSetValue;
}(actions_1.DelegatingUndoableAction));
exports.UndoableSetValue = UndoableSetValue;
/**
 * Insert an item if targetting an array or sets a value if targetting other objects.
 * @class
 * @extends UndoableAction
 */
var UndoableInsertValue = /** @class */ (function (_super) {
    __extends(UndoableInsertValue, _super);
    function UndoableInsertValue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UndoableInsertValue.prototype.createDelegatedAction = function () {
        if (Array.isArray(this.target)) {
            if (this.key === '-') {
                return new arrays_1.UndoablePushItems(this.target, this.value);
            }
            var index = Number(this.key);
            if (isNaN(index))
                return;
            return new arrays_1.UndoableSplice(this.target, index, 0, this.value);
        }
        return new objects_1.UndoableSetProperty(this.target, this.key, this.value);
    };
    return UndoableInsertValue;
}(UndoableSetValue));
exports.UndoableInsertValue = UndoableInsertValue;
/**
 * Creates a clone of the provided object at the new destination.
 * @class
 * @extends UndoableAction
 */
var UndoableCopyValue = /** @class */ (function (_super) {
    __extends(UndoableCopyValue, _super);
    function UndoableCopyValue(from, to) {
        var value = from.target[from.key];
        var clonedValue = structuredClone(value);
        return _super.call(this, to.target, to.key, clonedValue) || this;
    }
    return UndoableCopyValue;
}(UndoableSetValue));
exports.UndoableCopyValue = UndoableCopyValue;
/**
 * Moves a property or item from one object to another.
 * @class
 * @extends DelegatingUndoableAction
 */
var UndoableTransferValue = /** @class */ (function (_super) {
    __extends(UndoableTransferValue, _super);
    function UndoableTransferValue(from, to) {
        var _this = _super.call(this) || this;
        _this.from = from;
        _this.to = to;
        return _this;
    }
    UndoableTransferValue.prototype.createDelegatedAction = function () {
        if (Array.isArray(this.from.target) && Array.isArray(this.to.target)) {
            var fromIndex = this.from.key === '-'
                ? this.from.target.length
                : Number(this.from.key);
            var toIndex = this.to.key === '-'
                ? this.to.target.length
                : Number(this.to.key);
            if (!isNaN(fromIndex) && !isNaN(toIndex)) {
                return new arrays_1.UndoableTransferItem({ source: this.from.target, index: fromIndex }, { source: this.to.target, index: toIndex });
            }
        }
        return new actions_1.UndoableActionSequence([
            new UndoableDeleteValue(this.from.target, this.from.key),
            new UndoableSetValue(this.to.target, this.to.key, this.from.target[this.from.key])
        ]);
    };
    return UndoableTransferValue;
}(actions_1.DelegatingUndoableAction));
exports.UndoableTransferValue = UndoableTransferValue;
/**
  * Tries to reduce a nested property path to a simple property reference.
  * @function
  * @param {AnyObject} source - top-level container of the target value
  * @param {ValidKey[]} path - key/index chain to get to the target value
  * @returns {PropertyReference | undefined}
  */
function reducePropertyPath(source, path) {
    var maxIndex = path.length - 1;
    if (maxIndex < 0)
        return;
    var target = source;
    for (var i = 0; i < maxIndex; i++) {
        var key_1 = path[i];
        var keyValue = target[key_1];
        if (typeof keyValue === 'object' && keyValue != null) {
            target = keyValue;
        }
        else
            return;
    }
    var key = path[maxIndex];
    return { target: target, key: key };
}
exports.reducePropertyPath = reducePropertyPath;
/**
 * Sets a nested value of the provided object
 * @class
 * @extends DelegatingUndoableAction
 */
var UndoableDeleteNestedValue = /** @class */ (function (_super) {
    __extends(UndoableDeleteNestedValue, _super);
    function UndoableDeleteNestedValue(target, path) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.path = path;
        return _this;
    }
    UndoableDeleteNestedValue.prototype.createDelegatedAction = function () {
        var prop = reducePropertyPath(this.target, this.path);
        if (prop != null) {
            return new UndoableDeleteValue(prop.target, prop.key);
        }
    };
    return UndoableDeleteNestedValue;
}(actions_1.DelegatingUndoableAction));
exports.UndoableDeleteNestedValue = UndoableDeleteNestedValue;
/**
 * Reduces an attempt to set a nested property down to more direct value assignment.
 * @function
 * @param {AnyObject} source - top-level container for the target property
 * @param {ValidKey[]} path - steps to reach the target container
 * @param {any} value - value to assigned
 * @param {boolean} populate - whether objects should be created if traversing to the target container fails
 * @returns {SetValueRequest | undefined}
 */
function createSetNestedValueRequest(source, path, value, populate) {
    var _a;
    if (populate === void 0) { populate = false; }
    var maxIndex = path.length - 1;
    if (maxIndex < 0)
        return;
    var target = source;
    for (var i = 0; i < maxIndex; i++) {
        var key_2 = path[i];
        var keyValue = target[key_2];
        if (typeof keyValue === 'object' && keyValue != null) {
            target = keyValue;
        }
        else if (populate) {
            var wrappedValue = value;
            for (var j = maxIndex; j > i; j--) {
                var wrapKey = path[j];
                wrappedValue = typeof wrapKey === 'number'
                    ? [wrappedValue]
                    : (_a = {}, _a[wrapKey] = wrappedValue, _a);
            }
            return { target: target, key: key_2, value: wrappedValue };
        }
        else
            return;
    }
    var key = path[maxIndex];
    return { target: target, key: key, value: value };
}
exports.createSetNestedValueRequest = createSetNestedValueRequest;
/**
 * Sets a nested value of the provided object
 * @class
 * @extends DelegatingUndoableAction
 */
var UndoableSetNestedValue = /** @class */ (function (_super) {
    __extends(UndoableSetNestedValue, _super);
    function UndoableSetNestedValue(target, path, value, populate) {
        if (populate === void 0) { populate = false; }
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.path = path;
        _this.value = value;
        _this.populate = populate;
        return _this;
    }
    UndoableSetNestedValue.prototype.createDelegatedAction = function () {
        var request = createSetNestedValueRequest(this.target, this.path, this.value, this.populate);
        if (request != null) {
            return new UndoableSetValue(request.target, request.key, request.value);
        }
    };
    return UndoableSetNestedValue;
}(actions_1.DelegatingUndoableAction));
exports.UndoableSetNestedValue = UndoableSetNestedValue;
/**
 * Inserts a value into a nested array or sets the value of a nested object.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - action to be applied after resolving pathing
 */
var UndoableInsertNestedValue = /** @class */ (function (_super) {
    __extends(UndoableInsertNestedValue, _super);
    function UndoableInsertNestedValue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UndoableInsertNestedValue.prototype.createDelegatedAction = function () {
        var request = createSetNestedValueRequest(this.target, this.path, this.value, this.populate);
        if (request != null) {
            return new UndoableInsertValue(request.target, request.key, request.value);
        }
    };
    return UndoableInsertNestedValue;
}(UndoableSetNestedValue));
exports.UndoableInsertNestedValue = UndoableInsertNestedValue;
/**
 * Converts a path string to an array of keys and indices.
 * @function
 * @param {string} path - text to be parsed
 * @param {string} separator - substring used to break up the provided text
 * @returns {Array<CommonKey>}
 */
function parsePathString(path, separator) {
    if (separator === void 0) { separator = '.'; }
    var segments = path.split(separator);
    var steps = segments.map(function (key) {
        if (key === '')
            return key;
        var index = Number(key);
        return isNaN(index) ? key : index;
    });
    return steps;
}
exports.parsePathString = parsePathString;
