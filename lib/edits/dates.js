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
exports.UndoableDateHandler = exports.UndoableSetUTCSeconds = exports.UndoableSetUTCMonth = exports.UndoableSetUTCMinutes = exports.UndoableSetUTCMilliseconds = exports.UndoableSetUTCHours = exports.UndoableSetUTCFullYear = exports.UndoableSetUTCDayOfMonth = exports.UndoableSetDateTimestamp = exports.UndoableSetSeconds = exports.UndoableSetMonth = exports.UndoableSetMinutes = exports.UndoableSetMilliseconds = exports.UndoableSetHours = exports.UndoableSetFullYear = exports.UndoableSetDayOfMonth = void 0;
var proxies_1 = require("./proxies");
/**
 * Undoable action for changing a date's day of the month.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target day of month
 * @property {number} previousValue - previous day of month
 */
var UndoableSetDayOfMonth = /** @class */ (function () {
    function UndoableSetDayOfMonth(target, value) {
        this.target = target;
        this.value = value;
        this.previousValue = target.getDate();
    }
    UndoableSetDayOfMonth.prototype.redo = function () {
        this.target.setDate(this.value);
    };
    UndoableSetDayOfMonth.prototype.undo = function () {
        this.target.setDate(this.previousValue);
    };
    return UndoableSetDayOfMonth;
}());
exports.UndoableSetDayOfMonth = UndoableSetDayOfMonth;
/**
 * Undoable action for an array's setFullYear method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
var UndoableSetFullYear = /** @class */ (function () {
    function UndoableSetFullYear(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.target = target;
        this.values = params;
        this.previousValues = [
            target.getFullYear(),
            target.getMonth(),
            target.getDate()
        ];
    }
    UndoableSetFullYear.prototype.redo = function () {
        var _a;
        (_a = this.target).setFullYear.apply(_a, this.values);
    };
    UndoableSetFullYear.prototype.undo = function () {
        var _a;
        (_a = this.target).setFullYear.apply(_a, this.previousValues);
    };
    return UndoableSetFullYear;
}());
exports.UndoableSetFullYear = UndoableSetFullYear;
/**
 * Undoable action for an array's setHours method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
var UndoableSetHours = /** @class */ (function () {
    function UndoableSetHours(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.target = target;
        this.values = params;
        this.previousValues = [
            target.getHours(),
            target.getMinutes(),
            target.getSeconds(),
            target.getMilliseconds()
        ];
    }
    UndoableSetHours.prototype.redo = function () {
        var _a;
        (_a = this.target).setHours.apply(_a, this.values);
    };
    UndoableSetHours.prototype.undo = function () {
        var _a;
        (_a = this.target).setHours.apply(_a, this.previousValues);
    };
    return UndoableSetHours;
}());
exports.UndoableSetHours = UndoableSetHours;
/**
 * Undoable action for changing a date's milliseconds.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target milliseconds
 * @property {number} previousValue - previous milliseconds
 */
var UndoableSetMilliseconds = /** @class */ (function () {
    function UndoableSetMilliseconds(target, value) {
        this.target = target;
        this.value = value;
        this.previousValue = target.getMilliseconds();
    }
    UndoableSetMilliseconds.prototype.redo = function () {
        this.target.setMilliseconds(this.value);
    };
    UndoableSetMilliseconds.prototype.undo = function () {
        this.target.setMilliseconds(this.previousValue);
    };
    return UndoableSetMilliseconds;
}());
exports.UndoableSetMilliseconds = UndoableSetMilliseconds;
/**
 * Undoable action for an array's setMinutes method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
var UndoableSetMinutes = /** @class */ (function () {
    function UndoableSetMinutes(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.target = target;
        this.values = params;
        this.previousValues = [
            target.getMinutes(),
            target.getSeconds(),
            target.getMilliseconds()
        ];
    }
    UndoableSetMinutes.prototype.redo = function () {
        var _a;
        (_a = this.target).setMinutes.apply(_a, this.values);
    };
    UndoableSetMinutes.prototype.undo = function () {
        var _a;
        (_a = this.target).setMinutes.apply(_a, this.previousValues);
    };
    return UndoableSetMinutes;
}());
exports.UndoableSetMinutes = UndoableSetMinutes;
/**
 * Undoable action for an array's setMonth method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
var UndoableSetMonth = /** @class */ (function () {
    function UndoableSetMonth(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.target = target;
        this.values = params;
        this.previousValues = [
            target.getMonth(),
            target.getDate()
        ];
    }
    UndoableSetMonth.prototype.redo = function () {
        var _a;
        (_a = this.target).setMonth.apply(_a, this.values);
    };
    UndoableSetMonth.prototype.undo = function () {
        var _a;
        (_a = this.target).setMonth.apply(_a, this.previousValues);
    };
    return UndoableSetMonth;
}());
exports.UndoableSetMonth = UndoableSetMonth;
/**
 * Undoable action for an array's setSeconds method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
var UndoableSetSeconds = /** @class */ (function () {
    function UndoableSetSeconds(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.target = target;
        this.values = params;
        this.previousValues = [
            target.getSeconds(),
            target.getMilliseconds()
        ];
    }
    UndoableSetSeconds.prototype.redo = function () {
        var _a;
        (_a = this.target).setSeconds.apply(_a, this.values);
    };
    UndoableSetSeconds.prototype.undo = function () {
        var _a;
        (_a = this.target).setSeconds.apply(_a, this.previousValues);
    };
    return UndoableSetSeconds;
}());
exports.UndoableSetSeconds = UndoableSetSeconds;
/**
 * Undoable action for changing a date's timestamp.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target timestamp
 * @property {number} previousValue - previous timestamp
 */
var UndoableSetDateTimestamp = /** @class */ (function () {
    function UndoableSetDateTimestamp(target, value) {
        this.target = target;
        this.value = value;
        this.previousValue = target.getTime();
    }
    UndoableSetDateTimestamp.prototype.redo = function () {
        this.target.setTime(this.value);
    };
    UndoableSetDateTimestamp.prototype.undo = function () {
        this.target.setTime(this.previousValue);
    };
    return UndoableSetDateTimestamp;
}());
exports.UndoableSetDateTimestamp = UndoableSetDateTimestamp;
/**
 * Undoable action for changing a date's UTC day of the month.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target day of month
 * @property {number} previousValue - previous day of month
 */
var UndoableSetUTCDayOfMonth = /** @class */ (function () {
    function UndoableSetUTCDayOfMonth(target, value) {
        this.target = target;
        this.value = value;
        this.previousValue = target.getUTCDate();
    }
    UndoableSetUTCDayOfMonth.prototype.redo = function () {
        this.target.setUTCDate(this.value);
    };
    UndoableSetUTCDayOfMonth.prototype.undo = function () {
        this.target.setUTCDate(this.previousValue);
    };
    return UndoableSetUTCDayOfMonth;
}());
exports.UndoableSetUTCDayOfMonth = UndoableSetUTCDayOfMonth;
/**
 * Undoable action for an array's setUTCFullYear method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
var UndoableSetUTCFullYear = /** @class */ (function () {
    function UndoableSetUTCFullYear(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.target = target;
        this.values = params;
        this.previousValues = [
            target.getUTCFullYear(),
            target.getUTCMonth(),
            target.getUTCDate()
        ];
    }
    UndoableSetUTCFullYear.prototype.redo = function () {
        var _a;
        (_a = this.target).setUTCFullYear.apply(_a, this.values);
    };
    UndoableSetUTCFullYear.prototype.undo = function () {
        var _a;
        (_a = this.target).setUTCFullYear.apply(_a, this.previousValues);
    };
    return UndoableSetUTCFullYear;
}());
exports.UndoableSetUTCFullYear = UndoableSetUTCFullYear;
/**
 * Undoable action for an array's setUTCHours method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
var UndoableSetUTCHours = /** @class */ (function () {
    function UndoableSetUTCHours(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.target = target;
        this.values = params;
        this.previousValues = [
            target.getUTCHours(),
            target.getUTCMinutes(),
            target.getUTCSeconds(),
            target.getUTCMilliseconds()
        ];
    }
    UndoableSetUTCHours.prototype.redo = function () {
        var _a;
        (_a = this.target).setUTCHours.apply(_a, this.values);
    };
    UndoableSetUTCHours.prototype.undo = function () {
        var _a;
        (_a = this.target).setUTCHours.apply(_a, this.previousValues);
    };
    return UndoableSetUTCHours;
}());
exports.UndoableSetUTCHours = UndoableSetUTCHours;
/**
 * Undoable action for changing a date's UTC milliseconds.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target milliseconds
 * @property {number} previousValue - previous milliseconds
 */
var UndoableSetUTCMilliseconds = /** @class */ (function () {
    function UndoableSetUTCMilliseconds(target, value) {
        this.target = target;
        this.value = value;
        this.previousValue = target.getUTCMilliseconds();
    }
    UndoableSetUTCMilliseconds.prototype.redo = function () {
        this.target.setUTCMilliseconds(this.value);
    };
    UndoableSetUTCMilliseconds.prototype.undo = function () {
        this.target.setUTCMilliseconds(this.previousValue);
    };
    return UndoableSetUTCMilliseconds;
}());
exports.UndoableSetUTCMilliseconds = UndoableSetUTCMilliseconds;
/**
 * Undoable action for an array's setUTCMinutes method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
var UndoableSetUTCMinutes = /** @class */ (function () {
    function UndoableSetUTCMinutes(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.target = target;
        this.values = params;
        this.previousValues = [
            target.getUTCMinutes(),
            target.getUTCSeconds(),
            target.getUTCMilliseconds()
        ];
    }
    UndoableSetUTCMinutes.prototype.redo = function () {
        var _a;
        (_a = this.target).setUTCMinutes.apply(_a, this.values);
    };
    UndoableSetUTCMinutes.prototype.undo = function () {
        var _a;
        (_a = this.target).setUTCMinutes.apply(_a, this.previousValues);
    };
    return UndoableSetUTCMinutes;
}());
exports.UndoableSetUTCMinutes = UndoableSetUTCMinutes;
/**
 * Undoable action for an array's setUTCMonth method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
var UndoableSetUTCMonth = /** @class */ (function () {
    function UndoableSetUTCMonth(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.target = target;
        this.values = params;
        this.previousValues = [
            target.getUTCMonth(),
            target.getUTCDate()
        ];
    }
    UndoableSetUTCMonth.prototype.redo = function () {
        var _a;
        (_a = this.target).setUTCMonth.apply(_a, this.values);
    };
    UndoableSetUTCMonth.prototype.undo = function () {
        var _a;
        (_a = this.target).setUTCMonth.apply(_a, this.previousValues);
    };
    return UndoableSetUTCMonth;
}());
exports.UndoableSetUTCMonth = UndoableSetUTCMonth;
/**
 * Undoable action for an array's setSeconds method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
var UndoableSetUTCSeconds = /** @class */ (function () {
    function UndoableSetUTCSeconds(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.target = target;
        this.values = params;
        this.previousValues = [
            target.getUTCSeconds(),
            target.getUTCMilliseconds()
        ];
    }
    UndoableSetUTCSeconds.prototype.redo = function () {
        var _a;
        (_a = this.target).setUTCSeconds.apply(_a, this.values);
    };
    UndoableSetUTCSeconds.prototype.undo = function () {
        var _a;
        (_a = this.target).setUTCSeconds.apply(_a, this.previousValues);
    };
    return UndoableSetUTCSeconds;
}());
exports.UndoableSetUTCSeconds = UndoableSetUTCSeconds;
/**
 * Proxy handler with undoable action reporting for dates.
 * @class
 * @extends UndoableProxyHandler<Date>
 */
var UndoableDateHandler = /** @class */ (function (_super) {
    __extends(UndoableDateHandler, _super);
    function UndoableDateHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UndoableDateHandler.prototype.get = function (target, property) {
        if (this.onChange != null) {
            var onChange_1 = this.onChange;
            switch (property) {
                case 'setDate': {
                    return function (value) {
                        onChange_1(new UndoableSetDayOfMonth(target, value));
                        return target.setDate(value);
                    };
                }
                case 'setFullYear': {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        onChange_1(new (UndoableSetFullYear.bind.apply(UndoableSetFullYear, __spreadArray([void 0, target], args, false)))());
                        return target.setFullYear.apply(target, args);
                    };
                }
                case 'setHours': {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        onChange_1(new (UndoableSetHours.bind.apply(UndoableSetHours, __spreadArray([void 0, target], args, false)))());
                        return target.setHours.apply(target, args);
                    };
                }
                case 'setMilliseconds': {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        onChange_1(new (UndoableSetMilliseconds.bind.apply(UndoableSetMilliseconds, __spreadArray([void 0, target], args, false)))());
                        return target.setMilliseconds.apply(target, args);
                    };
                }
                case 'setMinutes': {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        onChange_1(new (UndoableSetMinutes.bind.apply(UndoableSetMinutes, __spreadArray([void 0, target], args, false)))());
                        return target.setMinutes.apply(target, args);
                    };
                }
                case 'setMonth': {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        onChange_1(new (UndoableSetMonth.bind.apply(UndoableSetMonth, __spreadArray([void 0, target], args, false)))());
                        return target.setMonth.apply(target, args);
                    };
                }
                case 'setSeconds': {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        onChange_1(new (UndoableSetSeconds.bind.apply(UndoableSetSeconds, __spreadArray([void 0, target], args, false)))());
                        return target.setSeconds.apply(target, args);
                    };
                }
                case 'setTime': {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        onChange_1(new (UndoableSetDateTimestamp.bind.apply(UndoableSetDateTimestamp, __spreadArray([void 0, target], args, false)))());
                        return target.setTime.apply(target, args);
                    };
                }
                case 'setUTCDate': {
                    return function (value) {
                        onChange_1(new UndoableSetUTCDayOfMonth(target, value));
                        return target.setUTCDate(value);
                    };
                }
                case 'setUTCFullYear': {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        onChange_1(new (UndoableSetUTCFullYear.bind.apply(UndoableSetUTCFullYear, __spreadArray([void 0, target], args, false)))());
                        return target.setUTCFullYear.apply(target, args);
                    };
                }
                case 'setUTCHours': {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        onChange_1(new (UndoableSetUTCHours.bind.apply(UndoableSetUTCHours, __spreadArray([void 0, target], args, false)))());
                        return target.setUTCHours.apply(target, args);
                    };
                }
                case 'setUTCMilliseconds': {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        onChange_1(new (UndoableSetUTCMilliseconds.bind.apply(UndoableSetUTCMilliseconds, __spreadArray([void 0, target], args, false)))());
                        return target.setUTCMilliseconds.apply(target, args);
                    };
                }
                case 'setUTCMinutes': {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        onChange_1(new (UndoableSetUTCMinutes.bind.apply(UndoableSetUTCMinutes, __spreadArray([void 0, target], args, false)))());
                        return target.setUTCMinutes.apply(target, args);
                    };
                }
                case 'setUTCMonth': {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        onChange_1(new (UndoableSetUTCMonth.bind.apply(UndoableSetUTCMonth, __spreadArray([void 0, target], args, false)))());
                        return target.setUTCMonth.apply(target, args);
                    };
                }
                case 'setUTCSeconds': {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        onChange_1(new (UndoableSetUTCSeconds.bind.apply(UndoableSetUTCSeconds, __spreadArray([void 0, target], args, false)))());
                        return target.setUTCSeconds.apply(target, args);
                    };
                }
            }
        }
        return _super.prototype.get.call(this, target, property);
    };
    return UndoableDateHandler;
}(proxies_1.UndoableProxyHandler));
exports.UndoableDateHandler = UndoableDateHandler;
