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
var actions_1 = require("./actions");
var proxies_1 = require("./proxies");
/**
 * Undoable action for changing a date's day of the month.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetDayOfMonth = /** @class */ (function (_super) {
    __extends(UndoableSetDayOfMonth, _super);
    function UndoableSetDayOfMonth(target, value) {
        return _super.call(this, target, target.setDate, function (target) { return [target.getDate()]; }, [value]) || this;
    }
    return UndoableSetDayOfMonth;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetDayOfMonth = UndoableSetDayOfMonth;
/**
 * Undoable action for an array's setFullYear method.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetFullYear = /** @class */ (function (_super) {
    __extends(UndoableSetFullYear, _super);
    function UndoableSetFullYear(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.setFullYear, function (target) { return [
            target.getFullYear(),
            target.getMonth(),
            target.getDate()
        ]; }, params) || this;
    }
    return UndoableSetFullYear;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetFullYear = UndoableSetFullYear;
/**
 * Undoable action for an array's setHours method.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetHours = /** @class */ (function (_super) {
    __extends(UndoableSetHours, _super);
    function UndoableSetHours(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.setHours, function (target) { return [
            target.getHours(),
            target.getMinutes(),
            target.getSeconds(),
            target.getMilliseconds()
        ]; }, params) || this;
    }
    return UndoableSetHours;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetHours = UndoableSetHours;
/**
 * Undoable action for changing a date's milliseconds.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetMilliseconds = /** @class */ (function (_super) {
    __extends(UndoableSetMilliseconds, _super);
    function UndoableSetMilliseconds(target, value) {
        return _super.call(this, target, target.setMilliseconds, function (target) { return [target.getMilliseconds()]; }, [value]) || this;
    }
    return UndoableSetMilliseconds;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetMilliseconds = UndoableSetMilliseconds;
/**
 * Undoable action for an array's setMinutes method.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetMinutes = /** @class */ (function (_super) {
    __extends(UndoableSetMinutes, _super);
    function UndoableSetMinutes(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.setMinutes, function (target) { return [
            target.getMinutes(),
            target.getSeconds(),
            target.getMilliseconds()
        ]; }, params) || this;
    }
    return UndoableSetMinutes;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetMinutes = UndoableSetMinutes;
/**
 * Undoable action for an array's setMonth method.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetMonth = /** @class */ (function (_super) {
    __extends(UndoableSetMonth, _super);
    function UndoableSetMonth(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.setMonth, function (target) { return [
            target.getMonth(),
            target.getDate()
        ]; }, params) || this;
    }
    return UndoableSetMonth;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetMonth = UndoableSetMonth;
/**
 * Undoable action for an array's setSeconds method.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetSeconds = /** @class */ (function (_super) {
    __extends(UndoableSetSeconds, _super);
    function UndoableSetSeconds(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.setSeconds, function (target) { return [
            target.getSeconds(),
            target.getMilliseconds()
        ]; }, params) || this;
    }
    return UndoableSetSeconds;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetSeconds = UndoableSetSeconds;
/**
 * Undoable action for changing a date's timestamp.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetDateTimestamp = /** @class */ (function (_super) {
    __extends(UndoableSetDateTimestamp, _super);
    function UndoableSetDateTimestamp(target, value) {
        return _super.call(this, target, target.setTime, function (target) { return [target.getTime()]; }, [value]) || this;
    }
    return UndoableSetDateTimestamp;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetDateTimestamp = UndoableSetDateTimestamp;
/**
 * Undoable action for changing a date's UTC day of the month.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetUTCDayOfMonth = /** @class */ (function (_super) {
    __extends(UndoableSetUTCDayOfMonth, _super);
    function UndoableSetUTCDayOfMonth(target, value) {
        return _super.call(this, target, target.setUTCDate, function (target) { return [target.getUTCDate()]; }, [value]) || this;
    }
    return UndoableSetUTCDayOfMonth;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetUTCDayOfMonth = UndoableSetUTCDayOfMonth;
/**
 * Undoable action for an array's setUTCFullYear method.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetUTCFullYear = /** @class */ (function (_super) {
    __extends(UndoableSetUTCFullYear, _super);
    function UndoableSetUTCFullYear(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.setUTCFullYear, function (target) { return [
            target.getUTCFullYear(),
            target.getUTCMonth(),
            target.getUTCDate()
        ]; }, params) || this;
    }
    return UndoableSetUTCFullYear;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetUTCFullYear = UndoableSetUTCFullYear;
/**
 * Undoable action for an array's setUTCHours method.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetUTCHours = /** @class */ (function (_super) {
    __extends(UndoableSetUTCHours, _super);
    function UndoableSetUTCHours(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.setUTCHours, function (target) { return [
            target.getUTCHours(),
            target.getUTCMinutes(),
            target.getUTCSeconds(),
            target.getUTCMilliseconds()
        ]; }, params) || this;
    }
    return UndoableSetUTCHours;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetUTCHours = UndoableSetUTCHours;
/**
 * Undoable action for changing a date's UTC milliseconds.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetUTCMilliseconds = /** @class */ (function (_super) {
    __extends(UndoableSetUTCMilliseconds, _super);
    function UndoableSetUTCMilliseconds(target, value) {
        return _super.call(this, target, target.setUTCMilliseconds, function (target) { return [target.getUTCMilliseconds()]; }, [value]) || this;
    }
    return UndoableSetUTCMilliseconds;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetUTCMilliseconds = UndoableSetUTCMilliseconds;
/**
 * Undoable action for an array's setUTCMinutes method.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetUTCMinutes = /** @class */ (function (_super) {
    __extends(UndoableSetUTCMinutes, _super);
    function UndoableSetUTCMinutes(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.setUTCMinutes, function (target) { return [
            target.getUTCMinutes(),
            target.getUTCSeconds(),
            target.getUTCMilliseconds()
        ]; }, params) || this;
    }
    return UndoableSetUTCMinutes;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetUTCMinutes = UndoableSetUTCMinutes;
/**
 * Undoable action for an array's setUTCMonth method.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetUTCMonth = /** @class */ (function (_super) {
    __extends(UndoableSetUTCMonth, _super);
    function UndoableSetUTCMonth(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.setUTCMonth, function (target) { return [
            target.getUTCMonth(),
            target.getUTCDate()
        ]; }, params) || this;
    }
    return UndoableSetUTCMonth;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetUTCMonth = UndoableSetUTCMonth;
/**
 * Undoable action for an array's setSeconds method.
 * @class
 * @extends UndoableSetViaFunction
 */
var UndoableSetUTCSeconds = /** @class */ (function (_super) {
    __extends(UndoableSetUTCSeconds, _super);
    function UndoableSetUTCSeconds(target) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.call(this, target, target.setUTCSeconds, function (target) { return [
            target.getUTCSeconds(),
            target.getUTCMilliseconds()
        ]; }, params) || this;
    }
    return UndoableSetUTCSeconds;
}(actions_1.UndoableSetViaFunction));
exports.UndoableSetUTCSeconds = UndoableSetUTCSeconds;
/**
 * Proxy handler with undoable action reporting for dates.
 * @class
 * @extends UndoableProxyHandler<Date>
 */
var UndoableDateHandler = /** @class */ (function (_super) {
    __extends(UndoableDateHandler, _super);
    function UndoableDateHandler(actionCallbacks, proxyFactory) {
        var _this = _super.call(this, actionCallbacks, proxyFactory, {
            setDate: function (target) {
                return function (value) {
                    return _this.applyChange(new UndoableSetDayOfMonth(target, value));
                };
            },
            setFullYear: function (target) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableSetFullYear.bind.apply(UndoableSetFullYear, __spreadArray([void 0, target], args, false)))());
                };
            },
            setHours: function (target) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableSetHours.bind.apply(UndoableSetHours, __spreadArray([void 0, target], args, false)))());
                };
            },
            setMilliseconds: function (target) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableSetMilliseconds.bind.apply(UndoableSetMilliseconds, __spreadArray([void 0, target], args, false)))());
                };
            },
            setMinutes: function (target) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableSetMinutes.bind.apply(UndoableSetMinutes, __spreadArray([void 0, target], args, false)))());
                };
            },
            setMonth: function (target) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableSetMonth.bind.apply(UndoableSetMonth, __spreadArray([void 0, target], args, false)))());
                };
            },
            setSeconds: function (target) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableSetSeconds.bind.apply(UndoableSetSeconds, __spreadArray([void 0, target], args, false)))());
                };
            },
            setTime: function (target) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableSetDateTimestamp.bind.apply(UndoableSetDateTimestamp, __spreadArray([void 0, target], args, false)))());
                };
            },
            setUTCDate: function (target) {
                return function (value) {
                    return _this.applyChange(new UndoableSetUTCDayOfMonth(target, value));
                };
            },
            setUTCFullYear: function (target) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableSetUTCFullYear.bind.apply(UndoableSetUTCFullYear, __spreadArray([void 0, target], args, false)))());
                };
            },
            setUTCHours: function (target) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableSetUTCHours.bind.apply(UndoableSetUTCHours, __spreadArray([void 0, target], args, false)))());
                };
            },
            setUTCMilliseconds: function (target) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableSetUTCMilliseconds.bind.apply(UndoableSetUTCMilliseconds, __spreadArray([void 0, target], args, false)))());
                };
            },
            setUTCMinutes: function (target) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableSetUTCMinutes.bind.apply(UndoableSetUTCMinutes, __spreadArray([void 0, target], args, false)))());
                };
            },
            setUTCMonth: function (target) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableSetUTCMonth.bind.apply(UndoableSetUTCMonth, __spreadArray([void 0, target], args, false)))());
                };
            },
            setUTCSeconds: function (target) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.applyChange(new (UndoableSetUTCSeconds.bind.apply(UndoableSetUTCSeconds, __spreadArray([void 0, target], args, false)))());
                };
            }
        }) || this;
        return _this;
    }
    return UndoableDateHandler;
}(proxies_1.UndoableProxyHandler));
exports.UndoableDateHandler = UndoableDateHandler;
proxies_1.ClassedUndoableProxyFactory.defaultHandlerClasses.set(Date.prototype, UndoableDateHandler);
