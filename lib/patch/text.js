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
exports.UndoableApplyDiffTuples = exports.getDiffText = exports.createTextPatchFromDiffTuples = exports.UndoableTextPatch = exports.PatchedTextSequence = exports.getTextPatchChanges = exports.applyTextPatch = void 0;
var deep_1 = require("../edits/deep");
/**
  * Applies a text patch array to the provided text.
  * @function
  * @param {string} source - string to be modified
  * @param {TextPatch} patch - patch to be applied
  * @returns {string}
  */
function applyTextPatch(source, patch) {
    var result = '';
    var index = 0;
    for (var _i = 0, patch_1 = patch; _i < patch_1.length; _i++) {
        var step = patch_1[_i];
        if (typeof step === 'number') {
            var nextIndex = index + step;
            result += source.substring(index, nextIndex);
            index = nextIndex;
        }
        else {
            index += step[0];
            result += step[1];
        }
    }
    if (index < source.length) {
        result += source.substring(index);
    }
    return result;
}
exports.applyTextPatch = applyTextPatch;
/**
  * Gets the text change array for applying the provided text patch.
  * @function
  * @param {string} source - string to be modified
  * @param {TextPatch} patch - patch to be applied
  * @returns {TextChanges}
  */
function getTextPatchChanges(source, patch) {
    var results = [];
    var index = 0;
    for (var _i = 0, patch_2 = patch; _i < patch_2.length; _i++) {
        var step = patch_2[_i];
        var nextIndex = void 0;
        if (typeof step === 'number') {
            nextIndex = index + step;
            results.push(source.substring(index, nextIndex));
        }
        else {
            nextIndex = index + step[0];
            results.push([
                source.substring(index, nextIndex),
                step[1]
            ]);
        }
        index = nextIndex;
    }
    if (index < source.length) {
        results.push(source.substring(index));
    }
    return results;
}
exports.getTextPatchChanges = getTextPatchChanges;
/**
 * This is a simple utility class for getting the original or patched text from a list with text change tuples.
 * @class
 * @property {TextChanges} segments - array of text changes to be evaluated
 */
var PatchedTextSequence = /** @class */ (function () {
    function PatchedTextSequence(segments) {
        if (segments === void 0) { segments = []; }
        this.segments = segments;
    }
    Object.defineProperty(PatchedTextSequence.prototype, "originalText", {
        get: function () {
            return this.collapseSegments(this.segments, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PatchedTextSequence.prototype, "patchedText", {
        get: function () {
            return this.collapseSegments(this.segments, 1);
        },
        enumerable: false,
        configurable: true
    });
    PatchedTextSequence.prototype.collapseSegments = function (segments, index) {
        var _a;
        var result = '';
        for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
            var segment = segments_1[_i];
            result += typeof segment === 'string'
                ? segment
                : (_a = segment[index]) !== null && _a !== void 0 ? _a : '';
        }
        return result;
    };
    PatchedTextSequence.fromPatch = function (source, patch) {
        var changes = getTextPatchChanges(source, patch);
        return new PatchedTextSequence(changes);
    };
    return PatchedTextSequence;
}());
exports.PatchedTextSequence = PatchedTextSequence;
/**
 * Replaces sections of a string with the provided substrings.
 * @class
 * @extends UndoableSetValue
 */
var UndoableTextPatch = /** @class */ (function (_super) {
    __extends(UndoableTextPatch, _super);
    function UndoableTextPatch(target, key, patch) {
        var value;
        if (Array.isArray(target)) {
            var index = Number(key);
            if (!isNaN(index))
                value = target[index];
        }
        else
            value = target[key];
        if (typeof value === 'string') {
            value = applyTextPatch(value, patch);
        }
        return _super.call(this, target, key, value) || this;
    }
    return UndoableTextPatch;
}(deep_1.UndoableSetValue));
exports.UndoableTextPatch = UndoableTextPatch;
/**
  * Converts an array of opcode/text pairs to a text patch.
  * @function
  * @param {DiffTuple[]} diff - array to be converted
  * @param {any} unchangedKey - opcode that indicates unchanged text
  * @param {any} removedKey - opcode that indicates text to be removed
  * @param {any} addedKey - opcode that indicates text to be added
  * @returns {TextPatch}
  */
function createTextPatchFromDiffTuples(diff, unchangedKey, removedKey, addedKey) {
    if (unchangedKey === void 0) { unchangedKey = 0; }
    if (removedKey === void 0) { removedKey = -1; }
    if (addedKey === void 0) { addedKey = 1; }
    var patch = [];
    var skipCount = 0;
    var pendingDeletion;
    var pendingAddition;
    for (var _i = 0, diff_1 = diff; _i < diff_1.length; _i++) {
        var item = diff_1[_i];
        var code = item[0];
        if (code === unchangedKey) {
            if (pendingDeletion != null || pendingAddition != null) {
                patch.push([pendingDeletion !== null && pendingDeletion !== void 0 ? pendingDeletion : 0, pendingAddition !== null && pendingAddition !== void 0 ? pendingAddition : '']);
                pendingDeletion = undefined;
                pendingAddition = undefined;
                skipCount = item[1].length;
            }
            else {
                skipCount += item[1].length;
            }
        }
        else {
            if (skipCount > 0) {
                patch.push(skipCount);
                skipCount = 0;
            }
            if (code === removedKey) {
                var textLength = item[1].length;
                pendingDeletion = pendingDeletion != null
                    ? pendingDeletion + textLength
                    : textLength;
            }
            else if (code === addedKey) {
                var text = item[1];
                pendingAddition = pendingAddition != null
                    ? pendingAddition + text
                    : text;
            }
        }
    }
    if (pendingDeletion != null || pendingAddition != null) {
        patch.push([pendingDeletion !== null && pendingDeletion !== void 0 ? pendingDeletion : 0, pendingAddition !== null && pendingAddition !== void 0 ? pendingAddition : '']);
    }
    return patch;
}
exports.createTextPatchFromDiffTuples = createTextPatchFromDiffTuples;
/**
  * Joins a subset of the text in an array of opcode/text pairs.
  * This can be used to get the original text by excluding additions.
  * Alternately, you can get the modified text by excluding removals.
  * @function
  * @param {DiffTuple[]} diff - array to be parsed
  * @param {any} exclude - opcode for values to be skipped
  * @returns {string}
  */
function getDiffText(diff, exclude) {
    var result = '';
    for (var _i = 0, diff_2 = diff; _i < diff_2.length; _i++) {
        var item = diff_2[_i];
        if (item[0] !== exclude)
            result += item[1];
    }
    return result;
}
exports.getDiffText = getDiffText;
/**
 * Switches between versions of the target text based on the provided diff array.
 * @class
 * @extends UndoableSetValue
 */
var UndoableApplyDiffTuples = /** @class */ (function (_super) {
    __extends(UndoableApplyDiffTuples, _super);
    function UndoableApplyDiffTuples(target, key, diff, removedKey) {
        if (removedKey === void 0) { removedKey = -1; }
        var value = getDiffText(diff, removedKey);
        return _super.call(this, target, key, value) || this;
    }
    return UndoableApplyDiffTuples;
}(deep_1.UndoableSetValue));
exports.UndoableApplyDiffTuples = UndoableApplyDiffTuples;
