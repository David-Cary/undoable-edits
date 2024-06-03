"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndoableActionSequence = void 0;
/**
 * Combines multiple actions into a single action, to be executed in the the provided order.
 * @class
 * @property {UndoableAction[]} steps - subactions to be performed
 */
var UndoableActionSequence = /** @class */ (function () {
    function UndoableActionSequence(steps) {
        this.steps = steps;
    }
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
