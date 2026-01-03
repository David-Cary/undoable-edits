/**
 * Interface for undo manager commands
 * @interface
 * @property {() => void} redo - callback for applying the command's effects
 * @property {() => void} undo - callback for rolling back the command's effects
 */
export interface UndoableAction<Returns = any> {
  initialize?: () => void
  apply: () => Returns
  redo: () => void
  undo: () => void
}

export type ValidKey = string | number | symbol

/**
 * Typing for plain old javascript object.
 * @type
 */
export type UntypedObject = Record<ValidKey, any>

/**
 * Allows references to either objects or arrays.
 * @type
 */
export type AnyObject = UntypedObject | any[]

/**
 * Allows references to functions where we don't care about the parameters or return value.
 * @type
 */
export type AnyFunction = (...args: any[]) => any

/**
 * This is an abstract class that supports being able to revert a passed in callback function.
 * @class
 * @implements UndoableAction
 * @property {TargetType} target - context callback should be applied to
 * @property {CallbackType} callback - function to be called
 * @property {Parameters<CallbackType>} values - arguments to be used in callback
 */
export class UndoableCallback<
  InitType = any,
  TargetType extends object = AnyObject,
  CallbackType extends AnyFunction = AnyFunction
> implements UndoableAction<ReturnType<CallbackType>> {
  readonly target: TargetType
  readonly callback: CallbackType
  readonly values: Parameters<CallbackType>
  protected _initializedData?: InitType

  get initializedData (): InitType | undefined {
    return this._initializedData
  }

  constructor (
    target: TargetType,
    callback: CallbackType,
    values: Parameters<CallbackType>
  ) {
    this.target = target
    this.callback = callback
    this.values = values
  }

  apply (): ReturnType<CallbackType> {
    if (this._initializedData == null) this.initialize()
    return this.callback.apply(this.target, this.values)
  }

  initialize (): void {
    this._initializedData = {} as any
  }

  redo (): void {
    if (this._initializedData == null) this.initialize()
    this.callback.apply(this.target, this.values)
  }

  undo (): void {}
}

/**
 * This covers actions that can be done and undone through a setter function.
 * @class
 * @extends UndoableCallback
 * @property {(target: TargetType) => Parameters<CallbackType>} getReversionParams - passed in property for extracting the values that have to be passed into the setter to undo this action
 */
export class UndoableSetViaFunction<
  TargetType extends object = AnyObject,
  CallbackType extends AnyFunction = AnyFunction
> extends UndoableCallback<Parameters<CallbackType>, TargetType, CallbackType> {
  readonly getReversionParams: (target: TargetType) => Parameters<CallbackType>

  constructor (
    target: TargetType,
    setter: CallbackType,
    getter: (target: TargetType) => Parameters<CallbackType>,
    values: Parameters<CallbackType>
  ) {
    super(target, setter, values)
    this.getReversionParams = getter
  }

  initialize (): void {
    this._initializedData = this.getReversionParams(this.target)
  }

  undo (): void {
    if (this._initializedData != null) {
      this.callback.apply(this.target, this._initializedData)
    }
  }
}

/**
 * Combines multiple actions into a single action, to be executed in the the provided order.
 * @class
 * @property {UndoableAction[]} steps - subactions to be performed
 */
export class UndoableActionSequence implements UndoableAction {
  readonly steps: UndoableAction[]

  constructor (
    steps: UndoableAction[]
  ) {
    this.steps = steps
  }

  apply (): void {
    for (const step of this.steps) {
      step.apply()
    }
  }

  redo (): void {
    for (const step of this.steps) {
      step.redo()
    }
  }

  undo (): void {
    for (let i = this.steps.length - 1; i >= 0; i--) {
      this.steps[i].undo()
    }
  }
}

/**
 * Abstract class for actions that apply different sub-actions based on the context.
 * @class
 * @extends UndoableAction
 */
export class DelegatingUndoableAction implements UndoableAction {
  protected _delegate?: UndoableAction

  /**
   * Creates a more specific sub-action based on the main action's context.
   * @function
   * @returns {UndoableAction | undefined}
   */
  createDelegatedAction (): UndoableAction | undefined {
    return undefined
  }

  initialize (): void {
    if (this._delegate == null) {
      this._delegate = this.createDelegatedAction()
    }
  }

  apply (): any {
    this.initialize()
    return this._delegate?.apply()
  }

  redo (): void {
    this.initialize()
    this._delegate?.redo()
  }

  undo (): void {
    this.initialize()
    this._delegate?.undo()
  }
}

/**
 * Basic callback for processing undoable actions.
 * @type
 */
export type UndoableActionCallback = (action: UndoableAction) => void

/**
 * Stores a value within an object.
 * @interface
 * @property {T} value - value being stored
 */
export interface ValueWrapper<T = any> {
  value: T
}
