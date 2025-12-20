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
exports.PropertyChangeTracker = exports.UndoableActionTrack = void 0;
var proxies_1 = require("./proxies");
/**
 * Stores a sequence of performed and undone actions.
 * @class
 * @property {UndoableAction[]} appliedActions - array of executed or redone actions
 * @property {UndoableAction[]} undoneActions - array of undone actions
 * @property {number} limit - maximum number of undoable actions stored
 */
var UndoableActionTrack = /** @class */ (function () {
    function UndoableActionTrack(limit) {
        if (limit === void 0) { limit = Number.POSITIVE_INFINITY; }
        this.appliedActions = [];
        this.undoneActions = [];
        this._limit = limit;
    }
    Object.defineProperty(UndoableActionTrack.prototype, "limit", {
        get: function () {
            return this._limit;
        },
        set: function (value) {
            this._limit = value;
            if (this.appliedActions.length > value) {
                var start = this.appliedActions.length - value;
                this.appliedActions = this.appliedActions.slice(start);
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds the provided action the applied actions list.
     * Note that this also clears the undone actions history.
     * @function
     * @param {object} target - value to be transformed
     */
    UndoableActionTrack.prototype.add = function (action) {
        this.appliedActions.push(action);
        if (this.appliedActions.length > this.limit) {
            this.appliedActions.shift();
        }
        this.undoneActions.length = 0;
    };
    /**
     * Empties both action lists.
     * @function
     */
    UndoableActionTrack.prototype.clear = function () {
        this.appliedActions.length = 0;
        this.undoneActions.length = 0;
    };
    /**
     * Executes the most recently undone action moves it to the applied list.
     * @function
     */
    UndoableActionTrack.prototype.redo = function () {
        var action = this.undoneActions.shift();
        if (action != null) {
            action.redo();
            this.appliedActions.push(action);
        }
    };
    /**
     * Undoes the last action applied and moves it to the undone list.
     * @function
     */
    UndoableActionTrack.prototype.undo = function () {
        var action = this.appliedActions.pop();
        if (action != null) {
            action.undo();
            this.undoneActions.unshift(action);
        }
    };
    return UndoableActionTrack;
}());
exports.UndoableActionTrack = UndoableActionTrack;
/**
 * Sets an UndoableActionTrack to react to changes in the target object's value.
 * @class
 * @template T
 * @property {UndoableProxy<T>} proxy - proxy wrapper for the target value to catch value changes
 * @property {UndoableActionTrack} track - handles tracking changes as well and undoing and redoing them
 */
var PropertyChangeTracker = /** @class */ (function (_super) {
    __extends(PropertyChangeTracker, _super);
    function PropertyChangeTracker(source, track, handlerClasses) {
        if (track === void 0) { track = new UndoableActionTrack(); }
        var _this = this;
        var callback = function (action) { _this.track.add(action); };
        _this = _super.call(this, callback, source, handlerClasses) || this;
        _this.track = track;
        return _this;
    }
    return PropertyChangeTracker;
}(proxies_1.UndoableProxyListener));
exports.PropertyChangeTracker = PropertyChangeTracker;
