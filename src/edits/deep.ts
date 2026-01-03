import {
  type AnyObject,
  DelegatingUndoableAction,
  type UndoableAction,
  UndoableActionSequence,
  type UntypedObject,
  type ValidKey
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

export type CommonKey = string | number

/**
 * Sets the target value or array item by the provided key/index.
 * @class
 * @extends UndoableAction
 */
export class UndoableDeleteValue extends DelegatingUndoableAction {
  target: AnyObject
  key: ValidKey

  constructor (
    target: AnyObject,
    key: ValidKey
  ) {
    super()
    this.target = target
    this.key = key
  }

  createDelegatedAction (): UndoableAction | undefined {
    if (Array.isArray(this.target)) {
      if (this.key === '-') return new UndoablePopItem(this.target)
      const index = Number(this.key)
      if (isNaN(index)) return
      return new UndoableSplice(this.target, index, 1)
    }
    return new UndoableDeleteProperty(this.target, String(this.key))
  }
}

/**
 * Sets the target value or array item by the provided key/index.
 * @class
 * @extends DelegatingUndoableAction
 */
export class UndoableSetValue extends DelegatingUndoableAction {
  target: AnyObject
  key: ValidKey
  value: any

  constructor (
    target: AnyObject,
    key: ValidKey,
    value: any
  ) {
    super()
    this.target = target
    this.key = key
    this.value = value
  }

  createDelegatedAction (): UndoableAction | undefined {
    if (Array.isArray(this.target)) {
      switch (this.key) {
        case 'length': {
          return new UndoableArrayResize(this.target, this.value)
        }
        case '-': {
          return new UndoablePushItems(this.target, this.value)
        }
        default: {
          const index = Number(this.key)
          return isNaN(index)
            ? undefined
            : new UndoableSetItemAt(this.target, index, this.value)
        }
      }
    }
    return new UndoableSetProperty(this.target, this.key, this.value)
  }
}

/**
 * Insert an item if targetting an array or sets a value if targetting other objects.
 * @class
 * @extends UndoableAction
 */
export class UndoableInsertValue extends UndoableSetValue {
  createDelegatedAction (): UndoableAction | undefined {
    if (Array.isArray(this.target)) {
      if (this.key === '-') {
        return new UndoablePushItems(this.target, this.value)
      }
      const index = Number(this.key)
      if (isNaN(index)) return
      return new UndoableSplice(this.target, index, 0, this.value)
    }
    return new UndoableSetProperty(this.target, this.key, this.value)
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
 * @extends DelegatingUndoableAction
 */
export class UndoableTransferValue extends DelegatingUndoableAction {
  from: PropertyReference
  to: PropertyReference

  constructor (
    from: PropertyReference,
    to: PropertyReference
  ) {
    super()
    this.from = from
    this.to = to
  }

  createDelegatedAction (): UndoableAction | undefined {
    if (Array.isArray(this.from.target) && Array.isArray(this.to.target)) {
      const fromIndex = this.from.key === '-'
        ? this.from.target.length
        : Number(this.from.key)
      const toIndex = this.to.key === '-'
        ? this.to.target.length
        : Number(this.to.key)
      if (!isNaN(fromIndex) && !isNaN(toIndex)) {
        return new UndoableTransferItem(
          { source: this.from.target, index: fromIndex },
          { source: this.to.target, index: toIndex }
        )
      }
    }
    return new UndoableActionSequence([
      new UndoableDeleteValue(this.from.target, this.from.key),
      new UndoableSetValue(
        this.to.target,
        this.to.key,
        (this.from.target as UntypedObject)[this.from.key]
      )
    ])
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
 * @extends DelegatingUndoableAction
 */
export class UndoableDeleteNestedValue extends DelegatingUndoableAction {
  target: AnyObject
  path: ValidKey[]

  constructor (
    target: AnyObject,
    path: ValidKey[]
  ) {
    super()
    this.target = target
    this.path = path
  }

  createDelegatedAction (): UndoableAction | undefined {
    const prop = reducePropertyPath(this.target, this.path)
    if (prop != null) {
      return new UndoableDeleteValue(prop.target, prop.key)
    }
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
 * @extends DelegatingUndoableAction
 */
export class UndoableSetNestedValue extends DelegatingUndoableAction {
  target: AnyObject
  path: ValidKey[]
  value: any
  populate: boolean

  constructor (
    target: AnyObject,
    path: ValidKey[],
    value: any,
    populate = false
  ) {
    super()
    this.target = target
    this.path = path
    this.value = value
    this.populate = populate
  }

  createDelegatedAction (): UndoableAction | undefined {
    const request = createSetNestedValueRequest(this.target, this.path, this.value, this.populate)
    if (request != null) {
      return new UndoableSetValue(request.target, request.key, request.value)
    }
  }
}

/**
 * Inserts a value into a nested array or sets the value of a nested object.
 * @class
 * @extends UndoableAction
 * @property {UndoableAction} delegate - action to be applied after resolving pathing
 */
export class UndoableInsertNestedValue extends UndoableSetNestedValue {
  createDelegatedAction (): UndoableAction | undefined {
    const request = createSetNestedValueRequest(this.target, this.path, this.value, this.populate)
    if (request != null) {
      return new UndoableInsertValue(request.target, request.key, request.value)
    }
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
