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
exports.UndoableJSONPatch = exports.DEFAULT_JSON_PATCH_OPS_TO_ACTIONS = exports.parseJSONPatchPath = void 0;
var actions_1 = require("../edits/actions");
var deep_1 = require("../edits/deep");
/**
  * Converts a JSONPatch path property to an array of keys and indices.
  * @function
  * @param {string | CommonKey[]} path - path string/array to be evaluated.
  * @returns {CommonKey | undefined}
  */
function parseJSONPatchPath(path) {
    if (typeof path === 'string') {
        var steps = (0, deep_1.parsePathString)(path, '/');
        if (steps[0] === '')
            steps.shift();
        return steps;
    }
    return path;
}
exports.parseJSONPatchPath = parseJSONPatchPath;
exports.DEFAULT_JSON_PATCH_OPS_TO_ACTIONS = {
    add: function (target, step) {
        var path = parseJSONPatchPath(step.path);
        return new deep_1.UndoableInsertNestedValue(target, path, step.value, true);
    },
    copy: function (target, step) {
        if (step.from != null) {
            var from = (0, deep_1.reducePropertyPath)(target, parseJSONPatchPath(step.from));
            var to = (0, deep_1.reducePropertyPath)(target, parseJSONPatchPath(step.path));
            if (from != null && to != null) {
                return new deep_1.UndoableCopyValue(from, to);
            }
        }
    },
    move: function (target, step) {
        if (step.from != null) {
            var from = (0, deep_1.reducePropertyPath)(target, parseJSONPatchPath(step.from));
            var to = (0, deep_1.reducePropertyPath)(target, parseJSONPatchPath(step.path));
            if (from != null && to != null) {
                return new deep_1.UndoableTransferValue(from, to);
            }
        }
    },
    remove: function (target, step) {
        var path = parseJSONPatchPath(step.path);
        return new deep_1.UndoableDeleteNestedValue(target, path);
    },
    replace: function (target, step) {
        var path = parseJSONPatchPath(step.path);
        return new deep_1.UndoableSetNestedValue(target, path, step.value, true);
    }
};
/**
 * Applies the provided JSON patch to the target object.
 * @class
 * @extends UndoableActionSequence
 */
var UndoableJSONPatch = /** @class */ (function (_super) {
    __extends(UndoableJSONPatch, _super);
    function UndoableJSONPatch(target, patch, stepParsers) {
        if (stepParsers === void 0) { stepParsers = exports.DEFAULT_JSON_PATCH_OPS_TO_ACTIONS; }
        var _this = _super.call(this, []) || this;
        for (var _i = 0, patch_1 = patch; _i < patch_1.length; _i++) {
            var step = patch_1[_i];
            var parse = stepParsers[step.op];
            if (parse != null) {
                var action = parse(target, step);
                if (action != null)
                    _this.steps.push(action);
            }
        }
        return _this;
    }
    return UndoableJSONPatch;
}(actions_1.UndoableActionSequence));
exports.UndoableJSONPatch = UndoableJSONPatch;
