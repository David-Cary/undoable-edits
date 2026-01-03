import {
  type ValidKey,
  type UndoableAction,
  type UntypedObject,
  type ValueWrapper
} from './actions'
import {
  UndoableProxyHandler,
  ClassedUndoableProxyFactory
} from './proxies'

/**
 * Sets multiple properties to the provided key values.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {Record<string, any>} source - object properties should be drawn from
 */
export class UndoableAssignProperties implements UndoableAction {
  readonly target: UntypedObject
  readonly source: UntypedObject
  protected _initializedData?: UntypedObject

  constructor (
    target: UntypedObject,
    source: UntypedObject
  ) {
    this.target = target
    this.source = source
  }

  initialize (): void {
    this._initializedData = {}
    for (const key in this.source) {
      if (key in this.target) {
        this._initializedData[key] = this.target[key]
      }
    }
  }

  apply (): UntypedObject {
    if (this._initializedData == null) this.initialize()
    for (const key in this.source) {
      this.target[key] = this.source[key]
    }
    return this.target
  }

  redo (): void {
    this.apply()
  }

  undo (): void {
    if (this._initializedData != null) {
      for (const key in this.source) {
        if (key in this._initializedData) {
          this.target[key] = this._initializedData[key]
        } else {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete this.target[key]
        }
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
 */
export class UndoableCopyPropertyFrom implements UndoableAction {
  readonly target: UntypedObject
  readonly source: UntypedObject
  readonly key: ValidKey
  protected _initializedData?: UntypedObject

  constructor (
    target: UntypedObject,
    key: ValidKey,
    source: UntypedObject
  ) {
    this.target = target
    this.source = source
    this.key = key
  }

  initialize (): void {
    this._initializedData = {}
    if (this.key in this.target) {
      this._initializedData[this.key] = this.target[this.key]
    }
  }

  apply (): any {
    if (this._initializedData == null) this.initialize()
    if (this.key in this.source) {
      const value = this.source[this.key]
      this.target[this.key] = value
      return value
    }
    if (this.key in this.target) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.target[this.key]
    }
  }

  redo (): void {
    if (this._initializedData == null) this.initialize()
    if (this.key in this.source) {
      this.target[this.key] = this.source[this.key]
    } else if (this.key in this.target) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.target[this.key]
    }
  }

  undo (): void {
    if (this._initializedData != null) {
      if (this.key in this._initializedData) {
        this.target[this.key] = this._initializedData[this.key]
      } else if (this.key in this.target) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.target[this.key]
      }
    }
  }
}

/**
 * Remove a property from the target object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {string} key - property to be removed
 */
export class UndoableDeleteProperty implements UndoableAction {
  readonly target: Record<string, any>
  readonly key: string
  protected _initializedData?: ValueWrapper

  constructor (
    target: Record<string, any>,
    key: string
  ) {
    this.target = target
    this.key = key
  }

  initialize (): void {
    this._initializedData = { value: this.target[this.key] }
  }

  apply (): boolean {
    if (this._initializedData == null) this.initialize()
    if (this.key in this.target) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      return delete this.target[this.key]
    }
    return false
  }

  redo (): void {
    this.apply()
  }

  undo (): void {
    if (this._initializedData != null) {
      this.target[this.key] = this._initializedData.value
    }
  }
}

/**
 * Sets a specific property value for a given object.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {ValidKey} key - property to be modified
 * @property {any} nextValue - value to be assigned
 */
export class UndoableSetProperty implements UndoableAction {
  readonly target: UntypedObject
  readonly key: ValidKey
  readonly nextValue: any
  protected _initializedData?: UntypedObject

  constructor (
    target: UntypedObject,
    key: ValidKey,
    nextValue: any
  ) {
    this.target = target
    this.key = key
    this.nextValue = nextValue
  }

  initialize (): void {
    this._initializedData = {}
    if (this.key in this.target) {
      this._initializedData[this.key] = this.target[this.key]
    }
  }

  apply (): any {
    if (this._initializedData == null) this.initialize()
    this.target[this.key] = this.nextValue
    return true
  }

  redo (): void {
    this.apply()
  }

  undo (): void {
    if (this._initializedData != null) {
      if (this.key in this._initializedData) {
        this.target[this.key] = this._initializedData[this.key]
      } else if (this.key in this.target) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.target[this.key]
      }
    }
  }
}

/**
 * Sets default values for the provided properties.
 * @class
 * @extends UndoableAction
 * @property {Record<string, any>} target - object to be modified
 * @property {Record<string, any>} source - object properties should be drawn from
 */
export class UndoableSetPropertyDefaults implements UndoableAction {
  readonly target: UntypedObject
  readonly source: UntypedObject
  protected _initializedData?: UntypedObject

  constructor (
    target: UntypedObject,
    source: UntypedObject
  ) {
    this.target = target
    this.source = source
  }

  initialize (): void {
    this._initializedData = { ...this.target }
  }

  apply (): boolean {
    if (this._initializedData == null) this.initialize()
    for (const key in this.source) {
      if (key in this.target) continue
      this.target[key] = this.source[key]
    }
    return true
  }

  redo (): void {
    this.apply()
  }

  undo (): void {
    if (this._initializedData != null) {
      for (const key in this.target) {
        if (key in this._initializedData) continue
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
 */
export class UndoableRenameProperty implements UndoableAction {
  readonly target: Record<string, any>
  readonly previousKey: string
  readonly nextKey: string
  protected _initializedData?: UntypedObject

  constructor (
    target: Record<string, any>,
    previousKey: string,
    nextKey: string
  ) {
    this.target = target
    this.previousKey = previousKey
    this.nextKey = nextKey
  }

  initialize (): void {
    this._initializedData = {}
    if (this.previousKey in this.target) {
      this._initializedData[this.previousKey] = this.target[this.previousKey]
    }
    if (this.nextKey in this.target) {
      this._initializedData[this.nextKey] = this.target[this.nextKey]
    }
  }

  apply (): any {
    if (this._initializedData == null) this.initialize()
    if (this.previousKey in this.target) {
      const value = this.target[this.previousKey]
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.target[this.previousKey]
      this.target[this.nextKey] = value
      return value
    }
    if (this.nextKey in this.target) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.target[this.nextKey]
    }
  }

  redo (): void {
    this.apply()
  }

  undo (): void {
    if (this._initializedData != null) {
      if (this.previousKey in this._initializedData) {
        this.target[this.previousKey] = this._initializedData[this.previousKey]
      }
      if (this.nextKey in this._initializedData) {
        this.target[this.nextKey] = this._initializedData[this.nextKey]
      } else if (this.nextKey in this.target) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.target[this.nextKey]
      }
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
