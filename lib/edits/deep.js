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
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
var UndoableDeleteValue = /** @class */ (function () {
    function UndoableDeleteValue(target, key) {
        this.delegate = this.createDelegatedAction(target, key);
    }
    /**
     * Creates a more specific delete action based on whether the target is an array.
     * @function
     * @param {AnyObject} target - reference object for the target action
     * @param {ValidKey} key - target property name or index
     * @returns {UndoableAction | undefined}
     */
    UndoableDeleteValue.prototype.createDelegatedAction = function (target, key) {
        if (Array.isArray(target)) {
            var index = Number(key);
            if (isNaN(index))
                return;
            return new arrays_1.UndoableSplice(target, index, 1);
        }
        return new objects_1.UndoableDeleteProperty(target, String(key));
    };
    UndoableDeleteValue.prototype.redo = function () {
        var _a;
        (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.redo();
    };
    UndoableDeleteValue.prototype.undo = function () {
        var _a;
        (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.undo();
    };
    return UndoableDeleteValue;
}());
exports.UndoableDeleteValue = UndoableDeleteValue;
/**
 * Sets the target value or array item by the provided key/index.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
var UndoableSetValue = /** @class */ (function () {
    function UndoableSetValue(target, key, nextValue) {
        this.delegate = this.createDelegatedAction(target, key, nextValue);
    }
    /**
     * Creates a more specific setter action based on whether the target is an array.
     * @function
     * @param {AnyObject} target - reference object for the target action
     * @param {ValidKey} key - target property name or index
     * @param {any} value - value to be assigned
     * @returns {UndoableAction | undefined}
     */
    UndoableSetValue.prototype.createDelegatedAction = function (target, key, value) {
        if (Array.isArray(target)) {
            var index = Number(key);
            if (isNaN(index)) {
                return key === 'length'
                    ? new arrays_1.UndoableArrayResize(target, value)
                    : undefined;
            }
            return new arrays_1.UndoableSetItemAt(target, index, value);
        }
        return new objects_1.UndoableSetProperty(target, key, value);
    };
    UndoableSetValue.prototype.redo = function () {
        var _a;
        (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.redo();
    };
    UndoableSetValue.prototype.undo = function () {
        var _a;
        (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.undo();
    };
    return UndoableSetValue;
}());
exports.UndoableSetValue = UndoableSetValue;
/**
 * Insert an item if targetting an array or sets a value if targetting other objects.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
var UndoableInsertValue = /** @class */ (function (_super) {
    __extends(UndoableInsertValue, _super);
    function UndoableInsertValue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UndoableInsertValue.prototype.createDelegatedAction = function (target, key, value) {
        if (Array.isArray(target)) {
            var index = Number(key);
            if (isNaN(index))
                return;
            return new arrays_1.UndoableSplice(target, index, 0, value);
        }
        return new objects_1.UndoableSetProperty(target, key, value);
    };
    return UndoableInsertValue;
}(UndoableSetValue));
exports.UndoableInsertValue = UndoableInsertValue;
/**
 * Creates a clone of the provided object at the new destination.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
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
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
var UndoableTransferValue = /** @class */ (function () {
    function UndoableTransferValue(from, to) {
        this.delegate = this.createDelegatedAction(from, to);
    }
    /**
     * Creates a more specific transfer action based on whether the target is an array.
     * @function
     * @param {PropertyReference} from - provider of the target value
     * @param {PropertyReference} to - recipient of the target value
     * @returns {UndoableAction | undefined}
     */
    UndoableTransferValue.prototype.createDelegatedAction = function (from, to) {
        if (Array.isArray(from.target) && Array.isArray(to.target)) {
            var fromIndex = Number(from.key);
            var toIndex = Number(to.key);
            if (!isNaN(fromIndex) && !isNaN(toIndex)) {
                return new arrays_1.UndoableTransferItem({ source: from.target, index: fromIndex }, { source: to.target, index: toIndex });
            }
        }
        return new actions_1.UndoableActionSequence([
            new UndoableDeleteValue(from.target, from.key),
            new UndoableSetValue(to.target, to.key, from.target[from.key])
        ]);
    };
    UndoableTransferValue.prototype.redo = function () {
        this.delegate.redo();
    };
    UndoableTransferValue.prototype.undo = function () {
        this.delegate.undo();
    };
    return UndoableTransferValue;
}());
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
 * @extends UndoableAction
 * @property {UndoableAction} delegate - action to be applied after resolving pathing
 */
var UndoableDeleteNestedValue = /** @class */ (function () {
    function UndoableDeleteNestedValue(target, path) {
        var prop = reducePropertyPath(target, path);
        if (prop != null) {
            this.delegate = this.createDelegatedAction(prop);
        }
    }
    /**
     * Creates a more specific delete action based on the reduced property path.
     * @function
     * @param {PropertyReference} prop - reference to the target value
     * @returns {UndoableAction | undefined}
     */
    UndoableDeleteNestedValue.prototype.createDelegatedAction = function (prop) {
        return new UndoableDeleteValue(prop.target, prop.key);
    };
    UndoableDeleteNestedValue.prototype.redo = function () {
        var _a;
        (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.redo();
    };
    UndoableDeleteNestedValue.prototype.undo = function () {
        var _a;
        (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.undo();
    };
    return UndoableDeleteNestedValue;
}());
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
 * @extends UndoableAction
 * @property {UndoableAction} delegate - action to be applied after resolving pathing
 */
var UndoableSetNestedValue = /** @class */ (function () {
    function UndoableSetNestedValue(target, path, value, populate) {
        if (populate === void 0) { populate = false; }
        var request = createSetNestedValueRequest(target, path, value, populate);
        if (request != null) {
            this.delegate = this.createDelegatedAction(request);
        }
    }
    /**
     * Creates a more specific setter action based on the reduced property path.
     * @function
     * @param {SetValueRequest} request - reference to the target property and value to be assigned
     * @returns {UndoableAction | undefined}
     */
    UndoableSetNestedValue.prototype.createDelegatedAction = function (request) {
        return new UndoableSetValue(request.target, request.key, request.value);
    };
    UndoableSetNestedValue.prototype.redo = function () {
        var _a;
        (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.redo();
    };
    UndoableSetNestedValue.prototype.undo = function () {
        var _a;
        (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.undo();
    };
    return UndoableSetNestedValue;
}());
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
    UndoableInsertNestedValue.prototype.createDelegatedAction = function (request) {
        return new UndoableInsertValue(request.target, request.key, request.value);
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
