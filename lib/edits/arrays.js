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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndoableArrayHandler = exports.UndoableUnshiftItems = exports.UndoableTransferItem = exports.UndoableSplice = exports.UndoableSort = exports.UndoableShiftItem = exports.UndoableSetItemAt = exports.UndoableReverse = exports.UndoablePushItems = exports.UndoablePopItem = exports.UndoableFill = exports.UndoableCopyWithin = exports.UndoableArrayResize = void 0;
var actions_1 = require("./actions");
var proxies_1 = require("./proxies");
/**
 * Undoable action for changing an array's length.
 * @class
 * @extends UndoableAction
 * @property {T[]} target - array to be modified
 * @property {number} length - desired length for the target array
 * @property {number} originalLength - cached length of array prior to change
 * @property {any[} trimmed - cached values removed by resizing
 */
var UndoableArrayResize = /** @class */ (function () {
    function UndoableArrayResize(target, length) {
        this._initialized = false;
        this._originalLength = 0;
        this._trimmed = [];
        this.target = target;
        this.length = length;
    }
    UndoableArrayResize.prototype.initialize = function () {
        this._originalLength = this.target.length;
        this._trimmed = this.target.slice(this.length);
        this._initialized = true;
    };
    UndoableArrayResize.prototype.apply = function () {
        if (!this._initialized)
            this.initialize();
        this.target.length = this.length;
        return this.target.length;
    };
    UndoableArrayResize.prototype.redo = function () {
        if (!this._initialized)
            this.initialize();
        this.target.length = this.length;
    };
    UndoableArrayResize.prototype.undo = function () {
        if (this._initialized) {
            this.target.length = this._originalLength;
            for (var i = 0; i < this._trimmed.length; i++) {
                this.target[this.length + i] = this._trimmed[i];
            }
        }
    };
    return UndoableArrayResize;
}());
exports.UndoableArrayResize = UndoableArrayResize;
/**
 * Undoable action for an array's copyWithin method.
 * @class
 * @extends UndoableCallback
 */
var UndoableCopyWithin = /** @class */ (function (_super) {
    __extends(UndoableCopyWithin, _super);
    function UndoableCopyWithin(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.copyWithin, params) || this;
    }
    UndoableCopyWithin.prototype.initialize = function () {
        var _a = this.values, destination = _a[0], start = _a[1], end = _a[2];
        var destinationEnd;
        if (end != null) {
            destinationEnd = end >= 0
                ? destination + end - start
                : end;
        }
        this._initializedData = this.target.slice(destination, destinationEnd);
    };
    UndoableCopyWithin.prototype.undo = function () {
        var _a;
        var destination = this.values[0];
        if (this._initializedData != null) {
            (_a = this.target).splice.apply(_a, __spreadArray([destination,
                this._initializedData.length], this._initializedData, false));
        }
    };
    return UndoableCopyWithin;
}(actions_1.UndoableCallback));
exports.UndoableCopyWithin = UndoableCopyWithin;
/**
 * Undoable action for an array's fill method.
 * @class
 * @extends UndoableCallback
 */
var UndoableFill = /** @class */ (function (_super) {
    __extends(UndoableFill, _super);
    function UndoableFill(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.fill, params) || this;
    }
    UndoableFill.prototype.initialize = function () {
        var _a = this.values, start = _a[1], end = _a[2];
        this._initializedData = this.target.slice(start, end);
    };
    UndoableFill.prototype.undo = function () {
        var _a;
        var _b = this.values, start = _b[1];
        if (this._initializedData != null) {
            (_a = this.target).splice.apply(_a, __spreadArray([start !== null && start !== void 0 ? start : 0, this._initializedData.length], this._initializedData, false));
        }
    };
    return UndoableFill;
}(actions_1.UndoableCallback));
exports.UndoableFill = UndoableFill;
/**
 * Undoable action for an array's pop method.
 * @class
 * @extends UndoableCallback
 */
var UndoablePopItem = /** @class */ (function (_super) {
    __extends(UndoablePopItem, _super);
    function UndoablePopItem(target) {
        return _super.call(this, target, target.pop, []) || this;
    }
    UndoablePopItem.prototype.initialize = function () {
        this._initializedData = { value: this.target[this.target.length - 1] };
    };
    UndoablePopItem.prototype.undo = function () {
        if (this._initializedData != null) {
            this.target.push(this._initializedData.value);
        }
    };
    return UndoablePopItem;
}(actions_1.UndoableCallback));
exports.UndoablePopItem = UndoablePopItem;
/**
 * Undoable action for an array's push method.
 * @class
 * @extends UndoableCallback
 */
var UndoablePushItems = /** @class */ (function (_super) {
    __extends(UndoablePushItems, _super);
    function UndoablePushItems(target) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.push, values) || this;
    }
    UndoablePushItems.prototype.undo = function () {
        if (this._initializedData != null) {
            var index = this.target.length - this.values.length;
            this.target.splice(index);
        }
    };
    return UndoablePushItems;
}(actions_1.UndoableCallback));
exports.UndoablePushItems = UndoablePushItems;
/**
 * Undoable action for an array's reverse method.
 * @class
 * @extends UndoableCallback
 */
var UndoableReverse = /** @class */ (function (_super) {
    __extends(UndoableReverse, _super);
    function UndoableReverse(target) {
        return _super.call(this, target, target.reverse, []) || this;
    }
    UndoableReverse.prototype.initialize = function () {
        this._initializedData = true;
    };
    UndoableReverse.prototype.undo = function () {
        if (this._initializedData === true) {
            this.target.reverse();
        }
    };
    return UndoableReverse;
}(actions_1.UndoableCallback));
exports.UndoableReverse = UndoableReverse;
/**
 * Undoable action for setting the array element at a given index.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {number} index - position for the target value
 * @property {any} previousValue - cached value before assignment
 * @property {any} nextValue - value to be assigned
 * @property {number} priorLength - cached length of array before assignment
 */
var UndoableSetItemAt = /** @class */ (function () {
    function UndoableSetItemAt(target, index, nextValue) {
        this._priorLength = 0;
        this.target = target;
        this.index = index;
        this.nextValue = nextValue;
    }
    UndoableSetItemAt.prototype.initialize = function () {
        this._initializedData = {
            value: this.target[this.index],
            length: this.target.length
        };
    };
    UndoableSetItemAt.prototype.apply = function () {
        if (this._initializedData == null)
            this.initialize();
        this.target[this.index] = this.nextValue;
        return true;
    };
    UndoableSetItemAt.prototype.redo = function () {
        if (this._initializedData == null)
            this.initialize();
        this.target[this.index] = this.nextValue;
    };
    UndoableSetItemAt.prototype.undo = function () {
        if (this._initializedData != null) {
            this.target[this.index] = this._initializedData.value;
            this.target.length = this._initializedData.length;
        }
    };
    return UndoableSetItemAt;
}());
exports.UndoableSetItemAt = UndoableSetItemAt;
/**
 * Undoable action for an array's shift method.
 * @class
 * @extends UndoableCallback
 */
var UndoableShiftItem = /** @class */ (function (_super) {
    __extends(UndoableShiftItem, _super);
    function UndoableShiftItem(target) {
        return _super.call(this, target, target.shift, []) || this;
    }
    UndoableShiftItem.prototype.initialize = function () {
        this._initializedData = { value: this.target[0] };
    };
    UndoableShiftItem.prototype.undo = function () {
        if (this._initializedData != null) {
            this.target.unshift(this._initializedData.value);
        }
    };
    return UndoableShiftItem;
}(actions_1.UndoableCallback));
exports.UndoableShiftItem = UndoableShiftItem;
/**
 * Undoable action for an array's sort method.
 * @class
 * @extends UndoableCallback
 */
var UndoableSort = /** @class */ (function (_super) {
    __extends(UndoableSort, _super);
    function UndoableSort(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.sort, params) || this;
    }
    UndoableSort.prototype.initialize = function () {
        this._initializedData = this.target.slice();
    };
    UndoableSort.prototype.undo = function () {
        var _a;
        if (this._initializedData != null) {
            (_a = this.target).splice.apply(_a, __spreadArray([0,
                this._initializedData.length], this._initializedData, false));
        }
    };
    return UndoableSort;
}(actions_1.UndoableCallback));
exports.UndoableSort = UndoableSort;
/**
 * Undoable action for an array's splice method.
 * @class
 * @extends UndoableCallback
 */
var UndoableSplice = /** @class */ (function (_super) {
    __extends(UndoableSplice, _super);
    function UndoableSplice(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.splice, params) || this;
    }
    UndoableSplice.prototype.initialize = function () {
        var _a = this.values, start = _a[0], deleteCount = _a[1], items = _a.slice(2);
        var end = start + deleteCount;
        var deletions = this.target.slice(start, end);
        this._initializedData = __spreadArray([
            start,
            items.length
        ], deletions, true);
    };
    UndoableSplice.prototype.undo = function () {
        if (this._initializedData != null) {
            this.target.splice.apply(this.target, this._initializedData);
        }
    };
    return UndoableSplice;
}(actions_1.UndoableCallback));
exports.UndoableSplice = UndoableSplice;
/**
 * Moves an element from one array to a given position in another array.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {ArrayElementReference<T>} from - position of element to be moved
 * @property {ArrayElementReference<T>} to - destination of the target element
 */
var UndoableTransferItem = /** @class */ (function () {
    function UndoableTransferItem(from, to) {
        this._initializedData = [];
        this.from = from;
        this.to = to;
    }
    UndoableTransferItem.prototype.apply = function () {
        if (this._initializedData.length < 1)
            this.initialize();
        if (this._initializedData.length > 0) {
            this.transferItem(this.from, this.to);
            return __assign({}, this.to);
        }
    };
    UndoableTransferItem.prototype.initialize = function () {
        this._initializedData = [];
        var length = this.from.source.length;
        if (this.from.index >= length || this.from.index < -length)
            return;
        var targetValue = this.from.source.at(this.from.index);
        this._initializedData.push(targetValue);
    };
    UndoableTransferItem.prototype.redo = function () {
        if (this._initializedData.length < 1)
            this.initialize();
        if (this._initializedData.length > 0) {
            this.transferItem(this.from, this.to);
        }
    };
    UndoableTransferItem.prototype.undo = function () {
        if (this._initializedData.length > 0) {
            this.transferItem(this.to, this.from);
        }
    };
    /**
     * Helper function for moving element from one array to another.
     * @function
     * @property {ArrayElementReference<T>} from - position of element to be moved
     * @property {ArrayElementReference<T>} to - destination of the target element
     */
    UndoableTransferItem.prototype.transferItem = function (from, to) {
        var values = from.source.splice(from.index, 1);
        var toIndex = to.index >= 0
            ? to.index
            : Math.max(0, to.source.length + 1 + to.index);
        to.source.splice(toIndex, 0, values[0]);
    };
    return UndoableTransferItem;
}());
exports.UndoableTransferItem = UndoableTransferItem;
/**
 * Undoable action for an array's unshift method.
 * @class
 * @extends UndoableCallback
 */
var UndoableUnshiftItems = /** @class */ (function (_super) {
    __extends(UndoableUnshiftItems, _super);
    function UndoableUnshiftItems(target) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.unshift, values) || this;
    }
    UndoableUnshiftItems.prototype.undo = function () {
        if (this._initializedData != null) {
            this.target.splice(0, this.values.length);
        }
    };
    return UndoableUnshiftItems;
}(actions_1.UndoableCallback));
exports.UndoableUnshiftItems = UndoableUnshiftItems;
/**
 * Proxy handler with undoable action reporting for arrays.
 * @class
 * @extends UndoableProxyHandler<T[]>
 */
var UndoableArrayHandler = /** @class */ (function (_super) {
    __extends(UndoableArrayHandler, _super);
    function UndoableArrayHandler(actionCallbacks, proxyFactory) {
        var _this = _super.call(this, actionCallbacks, proxyFactory, {
            at: function (target) {
                return function (index) {
                    var value = target.at(index);
                    return _this.getProxiedValue(value);
                };
            },
            copyWithin: function (target) {
                return function (destination, start, end) {
                    var value = _this.applyChange(new UndoableCopyWithin(target, destination, start, end));
                    return new Proxy(value, _this);
                };
            },
            fill: function (target) {
                return function (value, start, end) {
                    var result = _this.applyChange(new UndoableFill(target, value, start, end));
                    return new Proxy(result, _this);
                };
            },
            pop: function (target) {
                return function () {
                    var items = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        items[_i] = arguments[_i];
                    }
                    var item = _this.applyChange(new UndoablePopItem(target));
                    return _this.getProxiedValue(item);
                };
            },
            push: function (target) {
                return function () {
                    var items = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        items[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoablePushItems.bind.apply(UndoablePushItems, __spreadArray([void 0, target], items, false)))());
                };
            },
            reverse: function (target) {
                return function () {
                    var value = _this.applyChange(new UndoableReverse(target));
                    return new Proxy(value, _this);
                };
            },
            shift: function (target) {
                return function () {
                    var items = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        items[_i] = arguments[_i];
                    }
                    var item = _this.applyChange(new UndoableShiftItem(target));
                    return _this.getProxiedValue(item);
                };
            },
            splice: function (target) {
                return function (start, deleteCount) {
                    var items = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        items[_i - 2] = arguments[_i];
                    }
                    var value = _this.applyChange(new (UndoableSplice.bind.apply(UndoableSplice, __spreadArray([void 0, target, start, deleteCount], items, false)))());
                    return new Proxy(value, _this);
                };
            },
            unshift: function (target) {
                return function () {
                    var items = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        items[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableUnshiftItems.bind.apply(UndoableUnshiftItems, __spreadArray([void 0, target], items, false)))());
                };
            }
        }) || this;
        return _this;
    }
    UndoableArrayHandler.prototype.set = function (target, property, value) {
        if (property === 'length') {
            this.applyChange(new UndoableArrayResize(target, value));
            return true;
        }
        var index = Number(property);
        if (isNaN(index)) {
            return Reflect.set(target, property, value);
        }
        this.applyChange(new UndoableSetItemAt(target, index, value));
        return true;
    };
    return UndoableArrayHandler;
}(proxies_1.UndoableProxyHandler));
exports.UndoableArrayHandler = UndoableArrayHandler;
proxies_1.ClassedUndoableProxyFactory.defaultHandlerClasses.set(Array.prototype, UndoableArrayHandler);
