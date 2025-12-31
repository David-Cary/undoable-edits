import {
  type UndoableAction,
  UndoableActionSequence
} from './actions'
import {
  UndoableArrayResize,
  UndoablePopItem,
  UndoablePushItems,
  UndoableSetItemAt,
  UndoableSplice,
  UndoableTransferItem
} from './arrays'
import {
  UndoableDeleteProperty,
  UndoableSetProperty
} from './objects'
import {
  type ValidKey,
  type UntypedObject
} from './proxies'

export type AnyObject = UntypedObject | any[]
export type CommonKey = string | number

/**
 * Sets the target value or array item by the provided key/index.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
export class UndoableDeleteValue implements UndoableAction {
  readonly delegate?: UndoableAction

  constructor (
    target: AnyObject,
    key: ValidKey
  ) {
    this.delegate = this.createDelegatedAction(target, key)
  }

  /**
   * Creates a more specific delete action based on whether the target is an array.
   * @function
   * @param {AnyObject} target - reference object for the target action
   * @param {ValidKey} key - target property name or index
   * @returns {UndoableAction | undefined}
   */
  createDelegatedAction (
    target: AnyObject,
    key: ValidKey
  ): UndoableAction | undefined {
    if (Array.isArray(target)) {
      if (key === '-') return new UndoablePopItem(target)
      const index = Number(key)
      if (isNaN(index)) return
      return new UndoableSplice(target, index, 1)
    }
    return new UndoableDeleteProperty(target, String(key))
  }

  redo (): void {
    this.delegate?.redo()
  }

  undo (): void {
    this.delegate?.undo()
  }
}

/**
 * Sets the target value or array item by the provided key/index.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
export class UndoableSetValue implements UndoableAction {
  readonly delegate?: UndoableAction

  constructor (
    target: AnyObject,
    key: ValidKey,
    nextValue: any
  ) {
    this.delegate = this.createDelegatedAction(target, key, nextValue)
  }

  /**
   * Creates a more specific setter action based on whether the target is an array.
   * @function
   * @param {AnyObject} target - reference object for the target action
   * @param {ValidKey} key - target property name or index
   * @param {any} value - value to be assigned
   * @returns {UndoableAction | undefined}
   */
  createDelegatedAction (
    target: AnyObject,
    key: ValidKey,
    value: any
  ): UndoableAction | undefined {
    if (Array.isArray(target)) {
      switch (key) {
        case 'length': {
          return new UndoableArrayResize(target, value)
        }
        case '-': {
          return new UndoablePushItems(target, value)
        }
        default: {
          const index = Number(key)
          return isNaN(index)
            ? undefined
            : new UndoableSetItemAt(target, index, value)
        }
      }
    }
    return new UndoableSetProperty(target, key, value)
  }

  redo (): void {
    this.delegate?.redo()
  }

  undo (): void {
    this.delegate?.undo()
  }
}

/**
 * Insert an item if targetting an array or sets a value if targetting other objects.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
export class UndoableInsertValue extends UndoableSetValue {
  createDelegatedAction (
    target: AnyObject,
    key: ValidKey,
    value: any
  ): UndoableAction | undefined {
    if (Array.isArray(target)) {
      if (key === '-') {
        return new UndoablePushItems(target, value)
      }
      const index = Number(key)
      if (isNaN(index)) return
      return new UndoableSplice(target, index, 0, value)
    }
    return new UndoableSetProperty(target, key, value)
  }
}

export interface PropertyReference {
  target: AnyObject
  key: ValidKey
}

/**
 * Creates a clone of the provided object at the new destination.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
export class UndoableCopyValue extends UndoableSetValue {
  constructor (
    from: PropertyReference,
    to: PropertyReference
  ) {
    const value = (from.target as UntypedObject)[from.key]
    const clonedValue = structuredClone(value)
    super(to.target, to.key, clonedValue)
  }
}

/**
 * Moves a property or item from one object to another.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - specific sub-action to be applied based on context
 */
export class UndoableTransferValue implements UndoableAction {
  readonly delegate: UndoableAction

  constructor (
    from: PropertyReference,
    to: PropertyReference
  ) {
    this.delegate = this.createDelegatedAction(from, to)
  }

  /**
   * Creates a more specific transfer action based on whether the target is an array.
   * @function
   * @param {PropertyReference} from - provider of the target value
   * @param {PropertyReference} to - recipient of the target value
   * @returns {UndoableAction | undefined}
   */
  createDelegatedAction (
    from: PropertyReference,
    to: PropertyReference
  ): UndoableAction {
    if (Array.isArray(from.target) && Array.isArray(to.target)) {
      const fromIndex = from.key === '-' ? from.target.length : Number(from.key)
      const toIndex = to.key === '-' ? to.target.length : Number(to.key)
      if (!isNaN(fromIndex) && !isNaN(toIndex)) {
        return new UndoableTransferItem(
          { source: from.target, index: fromIndex },
          { source: to.target, index: toIndex }
        )
      }
    }
    return new UndoableActionSequence([
      new UndoableDeleteValue(from.target, from.key),
      new UndoableSetValue(
        to.target,
        to.key,
        (from.target as UntypedObject)[from.key]
      )
    ])
  }

  redo (): void {
    this.delegate.redo()
  }

  undo (): void {
    this.delegate.undo()
  }
}

/**
  * Tries to reduce a nested property path to a simple property reference.
  * @function
  * @param {AnyObject} source - top-level container of the target value
  * @param {ValidKey[]} path - key/index chain to get to the target value
  * @returns {PropertyReference | undefined}
  */
export function reducePropertyPath (
  source: AnyObject,
  path: ValidKey[]
): PropertyReference | undefined {
  const maxIndex = path.length - 1
  if (maxIndex < 0) return
  let target = source as UntypedObject
  for (let i = 0; i < maxIndex; i++) {
    const key = path[i]
    const keyValue = target[key]
    if (typeof keyValue === 'object' && keyValue != null) {
      target = keyValue
    } else return
  }
  const key = path[maxIndex]
  return { target, key }
}

/**
 * Sets a nested value of the provided object
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - action to be applied after resolving pathing
 */
export class UndoableDeleteNestedValue implements UndoableAction {
  readonly delegate?: UndoableAction

  constructor (
    target: AnyObject,
    path: ValidKey[]
  ) {
    const prop = reducePropertyPath(target, path)
    if (prop != null) {
      this.delegate = this.createDelegatedAction(prop)
    }
  }

  /**
   * Creates a more specific delete action based on the reduced property path.
   * @function
   * @param {PropertyReference} prop - reference to the target value
   * @returns {UndoableAction | undefined}
   */
  createDelegatedAction (
    prop: PropertyReference
  ): UndoableAction {
    return new UndoableDeleteValue(prop.target, prop.key)
  }

  redo (): void {
    this.delegate?.redo()
  }

  undo (): void {
    this.delegate?.undo()
  }
}

export interface SetValueRequest extends PropertyReference {
  value: any
}

/**
 * Reduces an attempt to set a nested property down to more direct value assignment.
 * @function
 * @param {AnyObject} source - top-level container for the target property
 * @param {ValidKey[]} path - steps to reach the target container
 * @param {any} value - value to assigned
 * @param {boolean} populate - whether objects should be created if traversing to the target container fails
 * @returns {SetValueRequest | undefined}
 */
export function createSetNestedValueRequest (
  source: AnyObject,
  path: ValidKey[],
  value: any,
  populate = false
): SetValueRequest | undefined {
  const maxIndex = path.length - 1
  if (maxIndex < 0) return
  let target = source as UntypedObject
  for (let i = 0; i < maxIndex; i++) {
    const key = path[i]
    const keyValue = target[key]
    if (typeof keyValue === 'object' && keyValue != null) {
      target = keyValue
    } else if (populate) {
      let wrappedValue = value
      for (let j = maxIndex; j > i; j--) {
        const wrapKey = path[j]
        wrappedValue = typeof wrapKey === 'number'
          ? [wrappedValue]
          : { [wrapKey]: wrappedValue }
      }
      return { target, key, value: wrappedValue }
    } else return
  }
  const key = path[maxIndex]
  return { target, key, value }
}

/**
 * Sets a nested value of the provided object
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - action to be applied after resolving pathing
 */
export class UndoableSetNestedValue implements UndoableAction {
  readonly delegate?: UndoableAction

  constructor (
    target: AnyObject,
    path: ValidKey[],
    value: any,
    populate = false
  ) {
    const request = createSetNestedValueRequest(target, path, value, populate)
    if (request != null) {
      this.delegate = this.createDelegatedAction(request)
    }
  }

  /**
   * Creates a more specific setter action based on the reduced property path.
   * @function
   * @param {SetValueRequest} request - reference to the target property and value to be assigned
   * @returns {UndoableAction | undefined}
   */
  createDelegatedAction (
    request: SetValueRequest
  ): UndoableAction {
    return new UndoableSetValue(request.target, request.key, request.value)
  }

  redo (): void {
    this.delegate?.redo()
  }

  undo (): void {
    this.delegate?.undo()
  }
}

/**
 * Inserts a value into a nested array or sets the value of a nested object.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - action to be applied after resolving pathing
 */
export class UndoableInsertNestedValue extends UndoableSetNestedValue {
  createDelegatedAction (
    request: SetValueRequest
  ): UndoableAction {
    return new UndoableInsertValue(request.target, request.key, request.value)
  }
}

/**
 * Converts a path string to an array of keys and indices.
 * @function
 * @param {string} path - text to be parsed
 * @param {string} separator - substring used to break up the provided text
 * @returns {Array<CommonKey>}
 */
export function parsePathString (
  path: string,
  separator = '.'
): CommonKey[] {
  const segments = path.split(separator)
  const steps = segments.map(key => {
    if (key === '') return key
    const index = Number(key)
    return isNaN(index) ? key : index
  })
  return steps
}
