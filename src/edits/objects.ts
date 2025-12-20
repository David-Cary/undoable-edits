import {
  type UndoableAction
} from './actions'
import {
  UndoableProxyHandler,
  ClassedUndoableProxyFactory,
  type ValidKey,
  type UntypedObject
} from './proxies'

/**
 * Sets multiple properties to the provided key values.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {Record<string, any>} source - object properties should be drawn from
 * @property {Record<string, any>} previousValues - cached values of properties prior to change
 */
export class UndoableAssignProperties implements UndoableAction {
  readonly target: UntypedObject
  readonly source: UntypedObject
  readonly previousValues: UntypedObject

  constructor (
    target: UntypedObject,
    source: UntypedObject
  ) {
    this.target = target
    this.source = source
    this.previousValues = {}
    for (const key in source) {
      if (key in target) {
        this.previousValues[key] = target[key]
      }
    }
  }

  redo (): void {
    for (const key in this.source) {
      this.target[key] = this.source[key]
    }
  }

  undo (): void {
    for (const key in this.source) {
      if (key in this.previousValues) {
        this.target[key] = this.previousValues[key]
      } else {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.target[key]
      }
    }
  }
}

/**
 * Duplicates the property of a source object, deleting if said property is absent.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {Record<string, any>} source - object property should be drawn from
 * @property {ValidKey} key - property to be modified
 * @property {any} previousValue - cached value of the removed property
 * @property {boolean} priorProperty - cached check for if the property already existed
 */
export class UndoableCopyPropertyFrom implements UndoableAction {
  readonly target: UntypedObject
  readonly source: UntypedObject
  readonly key: ValidKey
  readonly previousValue: any
  readonly priorProperty: boolean

  constructor (
    target: UntypedObject,
    key: ValidKey,
    source: UntypedObject
  ) {
    this.target = target
    this.source = source
    this.key = key
    this.previousValue = target[key]
    this.priorProperty = key in target
  }

  redo (): void {
    if (this.key in this.source) {
      this.target[this.key] = this.source[this.key]
    } else if (this.key in this.target) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.target[this.key]
    }
  }

  undo (): void {
    if (!this.priorProperty && this.key in this.target) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.target[this.key]
    } else {
      this.target[this.key] = this.previousValue
    }
  }
}

/**
 * Remove a property from the target object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {string} key - property to be removed
 * @property {any} previousValue - cached value of the removed property
 */
export class UndoableDeleteProperty implements UndoableAction {
  readonly target: Record<string, any>
  readonly key: string
  readonly previousValue: any

  constructor (
    target: Record<string, any>,
    key: string
  ) {
    this.target = target
    this.key = key
    this.previousValue = target[key]
  }

  redo (): void {
    if (this.key in this.target) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.target[this.key]
    }
  }

  undo (): void {
    this.target[this.key] = this.previousValue
  }
}

/**
 * Sets a specific property value for a given object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {ValidKey} key - property to be modified
 * @property {any} previousValue - cached value of the removed property
 * @property {any} nextValue - value to be assigned
 * @property {boolean} priorProperty - cached check for if the property already existed
 */
export class UndoableSetProperty implements UndoableAction {
  readonly target: UntypedObject
  readonly key: ValidKey
  readonly previousValue: any
  readonly nextValue: any
  readonly priorProperty: boolean

  constructor (
    target: UntypedObject,
    key: ValidKey,
    nextValue: any
  ) {
    this.target = target
    this.key = key
    this.previousValue = target[key]
    this.nextValue = nextValue
    this.priorProperty = key in target
  }

  redo (): void {
    this.target[this.key] = this.nextValue
  }

  undo (): void {
    if (!this.priorProperty && this.key in this.target) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.target[this.key]
    } else {
      this.target[this.key] = this.previousValue
    }
  }
}

/**
 * Sets default values for the provided properties.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {Record<string, any>} source - object properties should be drawn from
 * @property {string[]} missingKeys - properties not initially defined by the target
 */
export class UndoableSetPropertyDefaults implements UndoableAction {
  readonly target: UntypedObject
  readonly source: UntypedObject
  readonly missingKeys: string[]

  constructor (
    target: UntypedObject,
    source: UntypedObject
  ) {
    this.target = target
    this.source = source
    this.missingKeys = []
    for (const key in source) {
      if (key in target) continue
      this.missingKeys.push(key)
    }
  }

  redo (): void {
    for (const key in this.source) {
      if (key in this.target) continue
      this.target[key] = this.source[key]
    }
  }

  undo (): void {
    for (const key of this.missingKeys) {
      if (key in this.target) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.target[key]
      }
    }
  }
}

/**
 * Changes a given property value to a new property within the same object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {string} previousKey - property to be replaced
 * @property {string} nextKey - property the value should be move to
 * @property {any} value - cached value of the target property
 * @property {any} displacedValue - cached value overwriten by moving the target value
 * @property {boolean} overwritesProperty - cached check for if target property name was already in use
 */
export class UndoableRenameProperty implements UndoableAction {
  readonly target: Record<string, any>
  readonly previousKey: string
  readonly nextKey: string
  readonly value: any
  readonly displacedValue: any
  readonly overwritesProperty: boolean

  constructor (
    target: Record<string, any>,
    previousKey: string,
    nextKey: string
  ) {
    this.target = target
    this.previousKey = previousKey
    this.nextKey = nextKey
    this.value = target[previousKey]
    this.displacedValue = target[nextKey]
    this.overwritesProperty = nextKey in target
  }

  redo (): void {
    if (this.previousKey in this.target) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.target[this.previousKey]
    }
    this.target[this.nextKey] = this.value
  }

  undo (): void {
    this.target[this.previousKey] = this.value
    if (this.overwritesProperty) {
      this.target[this.nextKey] = this.displacedValue
    } else if (this.nextKey in this.target) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.target[this.nextKey]
    }
  }
}

/**
 * Proxy handler with undoable action reporting for plain old javascript objects.
 * @class
 * @extends DefaultedUndoableProxyHandler<UntypedObject>
 * @property {boolean} deep - if true, any object property value will be wrapped in a proxy
 */
export class UndoableRecordHandler extends UndoableProxyHandler<UntypedObject> {
  deleteProperty (
    target: UntypedObject,
    property: string
  ): boolean {
    return this.applyChange(
      new UndoableDeleteProperty(target, property)
    )
  }

  set (
    target: UntypedObject,
    property: ValidKey,
    value: any
  ): boolean {
    return this.applyChange(
      new UndoableSetProperty(target, property, value)
    )
  }
}

ClassedUndoableProxyFactory.defaultHandlerClasses.set(Object.prototype, UndoableRecordHandler)
