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
var proxies_1 = require("./proxies");
/**
 * Undoable action for changing an array's length.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {number} length - desired length for the target array
 * @property {number} originalLength - cached length of array prior to change
 * @property {any[} trimmed - cached values removed by resizing
 */
var UndoableArrayResize = /** @class */ (function () {
    function UndoableArrayResize(target, length) {
        this.target = target;
        this.length = length;
        this.originalLength = target.length;
        this.trimmed = target.slice(length);
    }
    UndoableArrayResize.prototype.redo = function () {
        this.target.length = this.length;
    };
    UndoableArrayResize.prototype.undo = function () {
        var _a;
        this.target.length = this.originalLength;
        (_a = this.target).splice.apply(_a, __spreadArray([this.length,
            0], this.trimmed, false));
    };
    return UndoableArrayResize;
}());
exports.UndoableArrayResize = UndoableArrayResize;
/**
 * Undoable action for an array's copyWithin method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {number} destination - position elements should be copied to
 * @property {number} start - starting position elements should be copied from
 * @property {number | undefined} end - position copy should stop at
 * @property {any[]} overwritten - cached values overwritten by copy
 */
var UndoableCopyWithin = /** @class */ (function () {
    function UndoableCopyWithin(target, destination, start, end) {
        this.destination = destination;
        this.target = target;
        this.start = start;
        var destinationEnd;
        if (end != null) {
            destinationEnd = end >= 0
                ? destination + end - start
                : end;
        }
        this.overwritten = target.slice(destination, destinationEnd);
    }
    UndoableCopyWithin.prototype.redo = function () {
        this.target.copyWithin(this.destination, this.start, this.end);
    };
    UndoableCopyWithin.prototype.undo = function () {
        var _a;
        (_a = this.target).splice.apply(_a, __spreadArray([this.destination,
            this.overwritten.length], this.overwritten, false));
    };
    return UndoableCopyWithin;
}());
exports.UndoableCopyWithin = UndoableCopyWithin;
/**
 * Undoable action for an array's fill method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any} value - value to fill the target positions with
 * @property {number} start - starting position of the fill
 * @property {number | undefined} end - position the fill stops at
 * @property {any[]} overwritten - cached values overwritten by the fill
 */
var UndoableFill = /** @class */ (function () {
    function UndoableFill(target, value, start, end) {
        this.target = target;
        this.value = value;
        this.start = start;
        this.end = end;
        this.overwritten = target.slice(start, end);
    }
    UndoableFill.prototype.redo = function () {
        this.target.fill(this.value, this.start, this.end);
    };
    UndoableFill.prototype.undo = function () {
        var _a;
        (_a = this.target).splice.apply(_a, __spreadArray([this.start,
            this.overwritten.length], this.overwritten, false));
    };
    return UndoableFill;
}());
exports.UndoableFill = UndoableFill;
/**
 * Undoable action for an array's pop method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any} value - cached value to be removed
 */
var UndoablePopItem = /** @class */ (function () {
    function UndoablePopItem(target) {
        this.target = target;
        this.value = target[target.length - 1];
    }
    UndoablePopItem.prototype.redo = function () {
        this.target.pop();
    };
    UndoablePopItem.prototype.undo = function () {
        this.target.push(this.value);
    };
    return UndoablePopItem;
}());
exports.UndoablePopItem = UndoablePopItem;
/**
 * Undoable action for an array's push method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any[]} values - values to be added to the array
 */
var UndoablePushItems = /** @class */ (function () {
    function UndoablePushItems(target) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        this.target = target;
        this.values = values;
    }
    UndoablePushItems.prototype.redo = function () {
        var _a;
        (_a = this.target).push.apply(_a, this.values);
    };
    UndoablePushItems.prototype.undo = function () {
        var index = this.target.length - this.values.length;
        this.target.splice(index);
    };
    return UndoablePushItems;
}());
exports.UndoablePushItems = UndoablePushItems;
/**
 * Undoable action for an array's reverse method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 */
var UndoableReverse = /** @class */ (function () {
    function UndoableReverse(target) {
        this.target = target;
    }
    UndoableReverse.prototype.redo = function () {
        this.target.reverse();
    };
    UndoableReverse.prototype.undo = function () {
        this.target.reverse();
    };
    return UndoableReverse;
}());
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
        this.target = target;
        this.index = index;
        this.previousValue = target[index];
        this.nextValue = nextValue;
        this.priorLength = target.length;
    }
    UndoableSetItemAt.prototype.redo = function () {
        this.target[this.index] = this.nextValue;
    };
    UndoableSetItemAt.prototype.undo = function () {
        this.target[this.index] = this.previousValue;
        this.target.length = this.priorLength;
    };
    return UndoableSetItemAt;
}());
exports.UndoableSetItemAt = UndoableSetItemAt;
/**
 * Undoable action for an array's shift method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any} value - cached value to be removed
 */
var UndoableShiftItem = /** @class */ (function () {
    function UndoableShiftItem(target) {
        this.target = target;
        this.value = target[0];
    }
    UndoableShiftItem.prototype.redo = function () {
        this.target.shift();
    };
    UndoableShiftItem.prototype.undo = function () {
        this.target.unshift(this.value);
    };
    return UndoableShiftItem;
}());
exports.UndoableShiftItem = UndoableShiftItem;
/**
 * Undoable action for an array's sort method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {((a: any, b: any) => number) | undefined} compare - comparison function to be applied to sort
 * @property {any[]} unsorted - order of the array's contents before the sort
 */
var UndoableSort = /** @class */ (function () {
    function UndoableSort(target, compare) {
        this.target = target;
        this.compare = compare;
        this.unsorted = target.slice();
    }
    UndoableSort.prototype.redo = function () {
        this.target.sort(this.compare);
    };
    UndoableSort.prototype.undo = function () {
        var _a;
        (_a = this.target).splice.apply(_a, __spreadArray([0,
            this.unsorted.length], this.unsorted, false));
    };
    return UndoableSort;
}());
exports.UndoableSort = UndoableSort;
/**
 * Undoable action for an array's splice method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {number} value - position the splice starts at
 * @property {any[]} deletions - values removed by the splice
 * @property {any[]} insertions - values added by the splice
 */
var UndoableSplice = /** @class */ (function () {
    function UndoableSplice(target, start, deleteCount) {
        if (deleteCount === void 0) { deleteCount = 0; }
        var items = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            items[_i - 3] = arguments[_i];
        }
        this.target = target;
        this.start = start;
        this.deletions = target.slice(start, start + deleteCount);
        this.insertions = items;
    }
    UndoableSplice.prototype.redo = function () {
        var _a;
        (_a = this.target).splice.apply(_a, __spreadArray([this.start,
            this.deletions.length], this.insertions, false));
    };
    UndoableSplice.prototype.undo = function () {
        var _a;
        (_a = this.target).splice.apply(_a, __spreadArray([this.start,
            this.insertions.length], this.deletions, false));
    };
    return UndoableSplice;
}());
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
        this.from = from;
        this.to = to;
    }
    UndoableTransferItem.prototype.redo = function () {
        this.transferItem(this.from, this.to);
    };
    UndoableTransferItem.prototype.undo = function () {
        this.transferItem(this.to, this.from);
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
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any[]} values - values to be added to the array
 */
var UndoableUnshiftItems = /** @class */ (function () {
    function UndoableUnshiftItems(target) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        this.target = target;
        this.values = values;
    }
    UndoableUnshiftItems.prototype.redo = function () {
        var _a;
        (_a = this.target).unshift.apply(_a, this.values);
    };
    UndoableUnshiftItems.prototype.undo = function () {
        this.target.splice(0, this.values.length);
    };
    return UndoableUnshiftItems;
}());
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
                    _this.onChange(new UndoableCopyWithin(target, destination, start, end));
                    var value = target.copyWithin(destination, start, end);
                    return new Proxy(value, _this);
                };
            },
            fill: function (target) {
                return function (value, start, end) {
                    _this.onChange(new UndoableFill(target, value, start, end));
                    var result = target.fill(value, start, end);
                    return new Proxy(result, _this);
                };
            },
            pop: function (target) {
                return function () {
                    var items = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        items[_i] = arguments[_i];
                    }
                    _this.onChange(new UndoablePopItem(target));
                    var item = target.pop();
                    return _this.getProxiedValue(item);
                };
            },
            push: function (target) {
                return function () {
                    var items = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        items[_i] = arguments[_i];
                    }
                    _this.onChange(new (UndoablePushItems.bind.apply(UndoablePushItems, __spreadArray([void 0, target], items, false)))());
                    return target.push.apply(target, items);
                };
            },
            reverse: function (target) {
                return function () {
                    _this.onChange(new UndoableReverse(target));
                    var value = target.reverse();
                    return new Proxy(value, _this);
                };
            },
            shift: function (target) {
                return function () {
                    var items = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        items[_i] = arguments[_i];
                    }
                    _this.onChange(new UndoableShiftItem(target));
                    var item = target.shift();
                    return _this.getProxiedValue(item);
                };
            },
            splice: function (target) {
                return function (start, deleteCount) {
                    var items = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        items[_i - 2] = arguments[_i];
                    }
                    _this.onChange(new (UndoableSplice.bind.apply(UndoableSplice, __spreadArray([void 0, target, start, deleteCount], items, false)))());
                    var value = target.splice.apply(target, __spreadArray([start, deleteCount], items, false));
                    return new Proxy(value, _this);
                };
            },
            unshift: function (target) {
                return function () {
                    var items = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        items[_i] = arguments[_i];
                    }
                    _this.onChange(new (UndoableUnshiftItems.bind.apply(UndoableUnshiftItems, __spreadArray([void 0, target], items, false)))());
                    return target.unshift.apply(target, items);
                };
            }
        }) || this;
        return _this;
    }
    UndoableArrayHandler.prototype.set = function (target, property, value) {
        if (property === 'length') {
            return this.applyChange(new UndoableArrayResize(target, value));
        }
        var index = Number(property);
        if (isNaN(index)) {
            return Reflect.set(target, property, value);
        }
        return this.applyChange(new UndoableSetItemAt(target, index, value));
    };
    return UndoableArrayHandler;
}(proxies_1.UndoableProxyHandler));
exports.UndoableArrayHandler = UndoableArrayHandler;
proxies_1.ClassedUndoableProxyFactory.defaultHandlerClasses.set(Array.prototype, UndoableArrayHandler);
