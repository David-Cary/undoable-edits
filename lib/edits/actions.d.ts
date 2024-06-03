/**
 * Interface for undo manager commands
 * @interface
 * @property {() => void} redo - callback for applying the command's effects
 * @property {() => void} undo - callback for rolling back the command's effects
 */
export interface UndoableAction {
    redo: () => void;
    undo: () => void;
}
/**
 * Combines multiple actions into a single action, to be executed in the the provided order.
 * @class
 * @property {UndoableAction[]} steps - subactions to be performed
 */
export declare class UndoableActionSequence implements UndoableAction {
    readonly steps: UndoableAction[];
    constructor(steps: UndoableAction[]);
    redo(): void;
    undo(): void;
}
/**
 * Basic callback for processing undoable actions.
 * @type
 */
export type UndoableActionCallback = (action: UndoableAction) => void;
