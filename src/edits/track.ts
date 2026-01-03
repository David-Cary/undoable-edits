import {
  type UndoableAction,
  type UntypedObject
} from './actions'
import {
  type UndoableProxyHandlerClass,
  UndoableProxyListener
} from './proxies'

/**
 * Stores a sequence of performed and undone actions.
 * @class
 * @property {UndoableAction[]} appliedActions - array of executed or redone actions
 * @property {UndoableAction[]} undoneActions - array of undone actions
 * @property {number} limit - maximum number of undoable actions stored
 */
export class UndoableActionTrack {
  appliedActions: UndoableAction[] = []
  undoneActions: UndoableAction[] = []

  protected _limit: number
  get limit (): number {
    return this._limit
  }

  set limit (value: number) {
    this._limit = value
    if (this.appliedActions.length > value) {
      const start = this.appliedActions.length - value
      this.appliedActions = this.appliedActions.slice(start)
    }
  }

  constructor (
    limit = Number.POSITIVE_INFINITY
  ) {
    this._limit = limit
  }

  /**
   * Adds the provided action the applied actions list.
   * Note that this also clears the undone actions history.
   * @function
   * @param {object} target - value to be transformed
   */
  add (action: UndoableAction): void {
    this.appliedActions.push(action)
    if (this.appliedActions.length > this.limit) {
      this.appliedActions.shift()
    }
    this.undoneActions.length = 0
  }

  /**
   * Empties both action lists.
   * @function
   */
  clear (): void {
    this.appliedActions.length = 0
    this.undoneActions.length = 0
  }

  /**
   * Executes the most recently undone action moves it to the applied list.
   * @function
   */
  redo (): void {
    const action = this.undoneActions.shift()
    if (action != null) {
      action.redo()
      this.appliedActions.push(action)
    }
  }

  /**
   * Undoes the last action applied and moves it to the undone list.
   * @function
   */
  undo (): void {
    const action = this.appliedActions.pop()
    if (action != null) {
      action.undo()
      this.undoneActions.unshift(action)
    }
  }
}

/**
 * Sets an UndoableActionTrack to react to changes in the target object's value.
 * @class
 * @template T
 * @property {UndoableProxy<T>} proxy - proxy wrapper for the target value to catch value changes
 * @property {UndoableActionTrack} track - handles tracking changes as well and undoing and redoing them
 */
export class PropertyChangeTracker<T extends object> extends UndoableProxyListener<T> {
  track: UndoableActionTrack

  constructor (
    source: T,
    track = new UndoableActionTrack(),
    handlerClasses?: Map<UntypedObject, UndoableProxyHandlerClass>
  ) {
    const callback = (action: UndoableAction): void => { this.track.add(action) }
    super(callback, source, handlerClasses)
    this.track = track
  }
}
