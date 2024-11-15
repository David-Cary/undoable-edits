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
exports.UndoableRecordHandler = exports.UndoableRenameProperty = exports.UndoableSetProperty = exports.UndoableDeleteProperty = exports.UndoableCopyPropertyFrom = void 0;
var proxies_1 = require("./proxies");
/**
 * Duplicates the property of a source object, deleting if said property is absent.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {Record<string, any>} source - object property should be drawn from
 * @property {ValidKey} key - property to be modified
 * @property {any} previousValue - cached value of the removed property
 * @property {boolean} priorProperty - cached check for if the property already existed
 */
var UndoableCopyPropertyFrom = /** @class */ (function () {
    function UndoableCopyPropertyFrom(target, key, source) {
        this.target = target;
        this.source = source;
        this.key = key;
        this.previousValue = target[key];
        this.priorProperty = key in target;
    }
    UndoableCopyPropertyFrom.prototype.redo = function () {
        if (this.key in this.source) {
            this.target[this.key] = this.source[this.key];
        }
        else if (this.key in this.target) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.target[this.key];
        }
    };
    UndoableCopyPropertyFrom.prototype.undo = function () {
        if (!this.priorProperty && this.key in this.target) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.target[this.key];
        }
        else {
            this.target[this.key] = this.previousValue;
        }
    };
    return UndoableCopyPropertyFrom;
}());
exports.UndoableCopyPropertyFrom = UndoableCopyPropertyFrom;
/**
 * Remove a property from the target object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {string} key - property to be removed
 * @property {any} previousValue - cached value of the removed property
 */
var UndoableDeleteProperty = /** @class */ (function () {
    function UndoableDeleteProperty(target, key) {
        this.target = target;
        this.key = key;
        this.previousValue = target[key];
    }
    UndoableDeleteProperty.prototype.redo = function () {
        if (this.key in this.target) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.target[this.key];
        }
    };
    UndoableDeleteProperty.prototype.undo = function () {
        this.target[this.key] = this.previousValue;
    };
    return UndoableDeleteProperty;
}());
exports.UndoableDeleteProperty = UndoableDeleteProperty;
/**
 * Sets a specific property value for a given object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {ValidKey} key - property to be modified
 * @property {any} previousValue - cached value of the removed property
 * @property {any} nextValue - value to be assigned
 * @property {boolean} priorProperty - cached check for if the property already existed
 */
var UndoableSetProperty = /** @class */ (function () {
    function UndoableSetProperty(target, key, nextValue) {
        this.target = target;
        this.key = key;
        this.previousValue = target[key];
        this.nextValue = nextValue;
        this.priorProperty = key in target;
    }
    UndoableSetProperty.prototype.redo = function () {
        this.target[this.key] = this.nextValue;
    };
    UndoableSetProperty.prototype.undo = function () {
        if (!this.priorProperty && this.key in this.target) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.target[this.key];
        }
        else {
            this.target[this.key] = this.previousValue;
        }
    };
    return UndoableSetProperty;
}());
exports.UndoableSetProperty = UndoableSetProperty;
/**
 * Changes a given property value to a new property within the same object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {string} previousKey - property to be replaced
 * @property {string} nextKey - property the value should be move to
 * @property {any} value - cached value of the target property
 * @property {any} displacedValue - cached value overwriten by moving the target value
 * @property {boolean} overwritesProperty - cached check for if target property name was already in use
 */
var UndoableRenameProperty = /** @class */ (function () {
    function UndoableRenameProperty(target, previousKey, nextKey) {
        this.target = target;
        this.previousKey = previousKey;
        this.nextKey = nextKey;
        this.value = target[previousKey];
        this.displacedValue = target[nextKey];
        this.overwritesProperty = nextKey in target;
    }
    UndoableRenameProperty.prototype.redo = function () {
        if (this.previousKey in this.target) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.target[this.previousKey];
        }
        this.target[this.nextKey] = this.value;
    };
    UndoableRenameProperty.prototype.undo = function () {
        this.target[this.previousKey] = this.value;
        if (this.overwritesProperty) {
            this.target[this.nextKey] = this.displacedValue;
        }
        else if (this.nextKey in this.target) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.target[this.nextKey];
        }
    };
    return UndoableRenameProperty;
}());
exports.UndoableRenameProperty = UndoableRenameProperty;
/**
 * Proxy handler with undoable action reporting for plain old javascript objects.
 * @class
 * @extends DefaultedUndoableProxyHandler<UntypedObject>
 * @property {boolean} deep - if true, any object property value will be wrapped in a proxy
 */
var UndoableRecordHandler = /** @class */ (function (_super) {
    __extends(UndoableRecordHandler, _super);
    function UndoableRecordHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UndoableRecordHandler.prototype.deleteProperty = function (target, property) {
        return this.applyChange(new UndoableDeleteProperty(target, property));
    };
    UndoableRecordHandler.prototype.set = function (target, property, value) {
        return this.applyChange(new UndoableSetProperty(target, property, value));
    };
    return UndoableRecordHandler;
}(proxies_1.UndoableProxyHandler));
exports.UndoableRecordHandler = UndoableRecordHandler;
proxies_1.ClassedUndoableProxyFactory.defaultHandlerClasses.set(Object.prototype, UndoableRecordHandler);
