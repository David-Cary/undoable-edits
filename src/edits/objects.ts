import {
  type UndoableAction,
  type UndoableActionCallback
} from './actions'
import {
  UndoableProxyHandler,
  ClassedProxyHandlerFactory,
  type ValidKey
} from './proxies'
import { UndoableArrayHandler } from './arrays'
import { UndoableDateHandler } from './dates'
import { UndoableSetHandler } from './sets'
import { UndoableMapHandler } from './maps'

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
  readonly target: Record<ValidKey, any>
  readonly source: Record<ValidKey, any>
  readonly key: ValidKey
  readonly previousValue: any
  readonly priorProperty: boolean

  constructor (
    target: Record<ValidKey, any>,
    key: ValidKey,
    source: Record<ValidKey, any>
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
  readonly target: Record<ValidKey, any>
  readonly key: ValidKey
  readonly previousValue: any
  readonly nextValue: any
  readonly priorProperty: boolean

  constructor (
    target: Record<ValidKey, any>,
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
 * Typing for plain old javascript object.
 * @type
 */
export type UntypedRecord = Record<ValidKey, any>

/**
 * Proxy handler with undoable action reporting for plain old javascript objects.
 * @class
 * @extends UndoableProxyHandler<UntypedRecord>
 * @property {boolean} deep - if true, any object property value will be wrapped in a proxy
 */
export class UndoableRecordHandler extends UndoableProxyHandler<UntypedRecord> {
  constructor (
    onChange?: UndoableActionCallback,
    deep = false
  ) {
    super(onChange)
    if (deep) {
      const factory = new ClassedProxyHandlerFactory([], this)
      factory.classes.push(
        {
          class: Array,
          value: new UndoableArrayHandler(onChange, factory)
        },
        {
          class: Date,
          value: new UndoableDateHandler(onChange)
        },
        {
          class: Map,
          value: new UndoableMapHandler(onChange, factory)
        },
        {
          class: Set,
          value: new UndoableSetHandler(onChange, factory)
        }
      )
      this.propertyHandlerFactory = factory
    }
  }

  deleteProperty (
    target: UntypedRecord,
    property: string
  ): boolean {
    return this.applyChange(
      new UndoableDeleteProperty(target, property)
    )
  }

  set (
    target: UntypedRecord,
    property: ValidKey,
    value: any
  ): boolean {
    return this.applyChange(
      new UndoableSetProperty(target, property, value)
    )
  }
}
