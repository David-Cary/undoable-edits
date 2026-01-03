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
exports.DelegatingUndoableAction = exports.UndoableActionSequence = exports.UndoableSetViaFunction = exports.UndoableCallback = void 0;
/**
 * This is an abstract class that supports being able to revert a passed in callback function.
 * @class
 * @implements UndoableAction
 * @property {TargetType} target - context callback should be applied to
 * @property {CallbackType} callback - function to be called
 * @property {Parameters<CallbackType>} values - arguments to be used in callback
 */
var UndoableCallback = /** @class */ (function () {
    function UndoableCallback(target, callback, values) {
        this.target = target;
        this.callback = callback;
        this.values = values;
    }
    Object.defineProperty(UndoableCallback.prototype, "initializedData", {
        get: function () {
            return this._initializedData;
        },
        enumerable: false,
        configurable: true
    });
    UndoableCallback.prototype.apply = function () {
        if (this._initializedData == null)
            this.initialize();
        return this.callback.apply(this.target, this.values);
    };
    UndoableCallback.prototype.initialize = function () {
        this._initializedData = {};
    };
    UndoableCallback.prototype.redo = function () {
        if (this._initializedData == null)
            this.initialize();
        this.callback.apply(this.target, this.values);
    };
    UndoableCallback.prototype.undo = function () { };
    return UndoableCallback;
}());
exports.UndoableCallback = UndoableCallback;
/**
 * This covers actions that can be done and undone through a setter function.
 * @class
 * @extends UndoableCallback
 * @property {(target: TargetType) => Parameters<CallbackType>} getReversionParams - passed in property for extracting the values that have to be passed into the setter to undo this action
 */
var UndoableSetViaFunction = /** @class */ (function (_super) {
    __extends(UndoableSetViaFunction, _super);
    function UndoableSetViaFunction(target, setter, getter, values) {
        var _this = _super.call(this, target, setter, values) || this;
        _this.getReversionParams = getter;
        return _this;
    }
    UndoableSetViaFunction.prototype.initialize = function () {
        this._initializedData = this.getReversionParams(this.target);
    };
    UndoableSetViaFunction.prototype.undo = function () {
        if (this._initializedData != null) {
            this.callback.apply(this.target, this._initializedData);
        }
    };
    return UndoableSetViaFunction;
}(UndoableCallback));
exports.UndoableSetViaFunction = UndoableSetViaFunction;
/**
 * Combines multiple actions into a single action, to be executed in the the provided order.
 * @class
 * @property {UndoableAction[]} steps - subactions to be performed
 */
var UndoableActionSequence = /** @class */ (function () {
    function UndoableActionSequence(steps) {
        this.steps = steps;
    }
    UndoableActionSequence.prototype.apply = function () {
        for (var _i = 0, _a = this.steps; _i < _a.length; _i++) {
            var step = _a[_i];
            step.apply();
        }
    };
    UndoableActionSequence.prototype.redo = function () {
        for (var _i = 0, _a = this.steps; _i < _a.length; _i++) {
            var step = _a[_i];
            step.redo();
        }
    };
    UndoableActionSequence.prototype.undo = function () {
        for (var i = this.steps.length - 1; i >= 0; i--) {
            this.steps[i].undo();
        }
    };
    return UndoableActionSequence;
}());
exports.UndoableActionSequence = UndoableActionSequence;
/**
 * Abstract class for actions that apply different sub-actions based on the context.
 * @class
 * @extends UndoableAction
 */
var DelegatingUndoableAction = /** @class */ (function () {
    function DelegatingUndoableAction() {
    }
    /**
     * Creates a more specific sub-action based on the main action's context.
     * @function
     * @returns {UndoableAction | undefined}
     */
    DelegatingUndoableAction.prototype.createDelegatedAction = function () {
        return undefined;
    };
    DelegatingUndoableAction.prototype.initialize = function () {
        if (this._delegate == null) {
            this._delegate = this.createDelegatedAction();
        }
    };
    DelegatingUndoableAction.prototype.apply = function () {
        var _a;
        this.initialize();
        return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.apply();
    };
    DelegatingUndoableAction.prototype.redo = function () {
        var _a;
        this.initialize();
        (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.redo();
    };
    DelegatingUndoableAction.prototype.undo = function () {
        var _a;
        this.initialize();
        (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.undo();
    };
    return DelegatingUndoableAction;
}());
exports.DelegatingUndoableAction = DelegatingUndoableAction;
