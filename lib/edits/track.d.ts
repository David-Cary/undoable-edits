import { type UndoableAction } from './actions';
import { type UntypedObject, type UndoableProxyHandlerClass, UndoableProxyListener } from './proxies';
/**
 * Stores a sequence of performed and undone actions.
 * @class
 * @property {UndoableAction[]} appliedActions - array of executed or redone actions
 * @property {UndoableAction[]} undoneActions - array of undone actions
 * @property {number} limit - maximum number of undoable actions stored
 */
export declare class UndoableActionTrack {
    appliedActions: UndoableAction[];
    undoneActions: UndoableAction[];
    protected _limit: number;
    get limit(): number;
    set limit(value: number);
    constructor(limit?: number);
    /**
     * Adds the provided action the applied actions list.
     * Note that this also clears the undone actions history.
     * @function
     * @param {object} target - value to be transformed
     */
    add(action: UndoableAction): void;
    /**
     * Empties both action lists.
     * @function
     */
    clear(): void;
    /**
     * Executes the most recently undone action moves it to the applied list.
     * @function
     */
    redo(): void;
    /**
     * Undoes the last action applied and moves it to the undone list.
     * @function
     */
    undo(): void;
}
/**
 * Sets an UndoableActionTrack to react to changes in the target object's value.
 * @class
 * @template T
 * @property {UndoableProxy<T>} proxy - proxy wrapper for the target value to catch value changes
 * @property {UndoableActionTrack} track - handles tracking changes as well and undoing and redoing them
 */
export declare class PropertyChangeTracker<T extends object> extends UndoableProxyListener<T> {
    track: UndoableActionTrack;
    constructor(source: T, track?: UndoableActionTrack, handlerClasses?: Map<UntypedObject, UndoableProxyHandlerClass>);
}
