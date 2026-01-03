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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndoableRecordHandler = exports.UndoableRenameProperty = exports.UndoableSetPropertyDefaults = exports.UndoableSetProperty = exports.UndoableDeleteProperty = exports.UndoableCopyPropertyFrom = exports.UndoableAssignProperties = void 0;
var proxies_1 = require("./proxies");
/**
 * Sets multiple properties to the provided key values.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {Record<string, any>} source - object properties should be drawn from
 */
var UndoableAssignProperties = /** @class */ (function () {
    function UndoableAssignProperties(target, source) {
        this.target = target;
        this.source = source;
    }
    UndoableAssignProperties.prototype.initialize = function () {
        this._initializedData = {};
        for (var key in this.source) {
            if (key in this.target) {
                this._initializedData[key] = this.target[key];
            }
        }
    };
    UndoableAssignProperties.prototype.apply = function () {
        if (this._initializedData == null)
            this.initialize();
        for (var key in this.source) {
            this.target[key] = this.source[key];
        }
        return this.target;
    };
    UndoableAssignProperties.prototype.redo = function () {
        this.apply();
    };
    UndoableAssignProperties.prototype.undo = function () {
        if (this._initializedData != null) {
            for (var key in this.source) {
                if (key in this._initializedData) {
                    this.target[key] = this._initializedData[key];
                }
                else {
                    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                    delete this.target[key];
                }
            }
        }
    };
    return UndoableAssignProperties;
}());
exports.UndoableAssignProperties = UndoableAssignProperties;
/**
 * Duplicates the property of a source object, deleting if said property is absent.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {Record<string, any>} source - object property should be drawn from
 * @property {ValidKey} key - property to be modified
 */
var UndoableCopyPropertyFrom = /** @class */ (function () {
    function UndoableCopyPropertyFrom(target, key, source) {
        this.target = target;
        this.source = source;
        this.key = key;
    }
    UndoableCopyPropertyFrom.prototype.initialize = function () {
        this._initializedData = {};
        if (this.key in this.target) {
            this._initializedData[this.key] = this.target[this.key];
        }
    };
    UndoableCopyPropertyFrom.prototype.apply = function () {
        if (this._initializedData == null)
            this.initialize();
        if (this.key in this.source) {
            var value = this.source[this.key];
            this.target[this.key] = value;
            return value;
        }
        if (this.key in this.target) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.target[this.key];
        }
    };
    UndoableCopyPropertyFrom.prototype.redo = function () {
        if (this._initializedData == null)
            this.initialize();
        if (this.key in this.source) {
            this.target[this.key] = this.source[this.key];
        }
        else if (this.key in this.target) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.target[this.key];
        }
    };
    UndoableCopyPropertyFrom.prototype.undo = function () {
        if (this._initializedData != null) {
            if (this.key in this._initializedData) {
                this.target[this.key] = this._initializedData[this.key];
            }
            else if (this.key in this.target) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete this.target[this.key];
            }
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
 */
var UndoableDeleteProperty = /** @class */ (function () {
    function UndoableDeleteProperty(target, key) {
        this.target = target;
        this.key = key;
    }
    UndoableDeleteProperty.prototype.initialize = function () {
        this._initializedData = { value: this.target[this.key] };
    };
    UndoableDeleteProperty.prototype.apply = function () {
        if (this._initializedData == null)
            this.initialize();
        if (this.key in this.target) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            return delete this.target[this.key];
        }
        return false;
    };
    UndoableDeleteProperty.prototype.redo = function () {
        this.apply();
    };
    UndoableDeleteProperty.prototype.undo = function () {
        if (this._initializedData != null) {
            this.target[this.key] = this._initializedData.value;
        }
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
 * @property {any} nextValue - value to be assigned
 */
var UndoableSetProperty = /** @class */ (function () {
    function UndoableSetProperty(target, key, nextValue) {
        this.target = target;
        this.key = key;
        this.nextValue = nextValue;
    }
    UndoableSetProperty.prototype.initialize = function () {
        this._initializedData = {};
        if (this.key in this.target) {
            this._initializedData[this.key] = this.target[this.key];
        }
    };
    UndoableSetProperty.prototype.apply = function () {
        if (this._initializedData == null)
            this.initialize();
        this.target[this.key] = this.nextValue;
        return true;
    };
    UndoableSetProperty.prototype.redo = function () {
        this.apply();
    };
    UndoableSetProperty.prototype.undo = function () {
        if (this._initializedData != null) {
            if (this.key in this._initializedData) {
                this.target[this.key] = this._initializedData[this.key];
            }
            else if (this.key in this.target) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete this.target[this.key];
            }
        }
    };
    return UndoableSetProperty;
}());
exports.UndoableSetProperty = UndoableSetProperty;
/**
 * Sets default values for the provided properties.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {Record<string, any>} source - object properties should be drawn from
 */
var UndoableSetPropertyDefaults = /** @class */ (function () {
    function UndoableSetPropertyDefaults(target, source) {
        this.target = target;
        this.source = source;
    }
    UndoableSetPropertyDefaults.prototype.initialize = function () {
        this._initializedData = __assign({}, this.target);
    };
    UndoableSetPropertyDefaults.prototype.apply = function () {
        if (this._initializedData == null)
            this.initialize();
        for (var key in this.source) {
            if (key in this.target)
                continue;
            this.target[key] = this.source[key];
        }
        return true;
    };
    UndoableSetPropertyDefaults.prototype.redo = function () {
        this.apply();
    };
    UndoableSetPropertyDefaults.prototype.undo = function () {
        if (this._initializedData != null) {
            for (var key in this.target) {
                if (key in this._initializedData)
                    continue;
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete this.target[key];
            }
        }
    };
    return UndoableSetPropertyDefaults;
}());
exports.UndoableSetPropertyDefaults = UndoableSetPropertyDefaults;
/**
 * Changes a given property value to a new property within the same object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {string} previousKey - property to be replaced
 * @property {string} nextKey - property the value should be move to
 */
var UndoableRenameProperty = /** @class */ (function () {
    function UndoableRenameProperty(target, previousKey, nextKey) {
        this.target = target;
        this.previousKey = previousKey;
        this.nextKey = nextKey;
    }
    UndoableRenameProperty.prototype.initialize = function () {
        this._initializedData = {};
        if (this.previousKey in this.target) {
            this._initializedData[this.previousKey] = this.target[this.previousKey];
        }
        if (this.nextKey in this.target) {
            this._initializedData[this.nextKey] = this.target[this.nextKey];
        }
    };
    UndoableRenameProperty.prototype.apply = function () {
        if (this._initializedData == null)
            this.initialize();
        if (this.previousKey in this.target) {
            var value = this.target[this.previousKey];
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.target[this.previousKey];
            this.target[this.nextKey] = value;
            return value;
        }
        if (this.nextKey in this.target) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.target[this.nextKey];
        }
    };
    UndoableRenameProperty.prototype.redo = function () {
        this.apply();
    };
    UndoableRenameProperty.prototype.undo = function () {
        if (this._initializedData != null) {
            if (this.previousKey in this._initializedData) {
                this.target[this.previousKey] = this._initializedData[this.previousKey];
            }
            if (this.nextKey in this._initializedData) {
                this.target[this.nextKey] = this._initializedData[this.nextKey];
            }
            else if (this.nextKey in this.target) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete this.target[this.nextKey];
            }
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
