import {
  type UndoableAction
} from './actions'
import {
  UndoableProxyHandler,
  type ValidKey
} from './proxies'

/**
 * Undoable action for changing a date's day of the month.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target day of month
 * @property {number} previousValue - previous day of month
 */
export class UndoableSetDayOfMonth implements UndoableAction {
  readonly target: Date
  readonly value: number
  readonly previousValue: number

  constructor (
    target: Date,
    value: number
  ) {
    this.target = target
    this.value = value
    this.previousValue = target.getDate()
  }

  redo (): void {
    this.target.setDate(this.value)
  }

  undo (): void {
    this.target.setDate(this.previousValue)
  }
}

/**
 * Undoable action for an array's setFullYear method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export class UndoableSetFullYear implements UndoableAction {
  readonly target: Date
  readonly values: Parameters<typeof Date.prototype.setFullYear>
  readonly previousValues: Parameters<typeof Date.prototype.setFullYear>

  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setFullYear>
  ) {
    this.target = target
    this.values = params
    this.previousValues = [
      target.getFullYear(),
      target.getMonth(),
      target.getDate()
    ]
  }

  redo (): void {
    this.target.setFullYear(...this.values)
  }

  undo (): void {
    this.target.setFullYear(...this.previousValues)
  }
}

/**
 * Undoable action for an array's setHours method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export class UndoableSetHours implements UndoableAction {
  readonly target: Date
  readonly values: Parameters<typeof Date.prototype.setHours>
  readonly previousValues: Parameters<typeof Date.prototype.setHours>

  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setHours>
  ) {
    this.target = target
    this.values = params
    this.previousValues = [
      target.getHours(),
      target.getMinutes(),
      target.getSeconds(),
      target.getMilliseconds()
    ]
  }

  redo (): void {
    this.target.setHours(...this.values)
  }

  undo (): void {
    this.target.setHours(...this.previousValues)
  }
}

/**
 * Undoable action for changing a date's milliseconds.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target milliseconds
 * @property {number} previousValue - previous milliseconds
 */
export class UndoableSetMilliseconds implements UndoableAction {
  readonly target: Date
  readonly value: number
  readonly previousValue: number

  constructor (
    target: Date,
    value: number
  ) {
    this.target = target
    this.value = value
    this.previousValue = target.getMilliseconds()
  }

  redo (): void {
    this.target.setMilliseconds(this.value)
  }

  undo (): void {
    this.target.setMilliseconds(this.previousValue)
  }
}

/**
 * Undoable action for an array's setMinutes method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export class UndoableSetMinutes implements UndoableAction {
  readonly target: Date
  readonly values: Parameters<typeof Date.prototype.setMinutes>
  readonly previousValues: Parameters<typeof Date.prototype.setMinutes>

  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setMinutes>
  ) {
    this.target = target
    this.values = params
    this.previousValues = [
      target.getMinutes(),
      target.getSeconds(),
      target.getMilliseconds()
    ]
  }

  redo (): void {
    this.target.setMinutes(...this.values)
  }

  undo (): void {
    this.target.setMinutes(...this.previousValues)
  }
}

/**
 * Undoable action for an array's setMonth method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export class UndoableSetMonth implements UndoableAction {
  readonly target: Date
  readonly values: Parameters<typeof Date.prototype.setMonth>
  readonly previousValues: Parameters<typeof Date.prototype.setMonth>

  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setMonth>
  ) {
    this.target = target
    this.values = params
    this.previousValues = [
      target.getMonth(),
      target.getDate()
    ]
  }

  redo (): void {
    this.target.setMonth(...this.values)
  }

  undo (): void {
    this.target.setMonth(...this.previousValues)
  }
}

/**
 * Undoable action for an array's setSeconds method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export class UndoableSetSeconds implements UndoableAction {
  readonly target: Date
  readonly values: Parameters<typeof Date.prototype.setSeconds>
  readonly previousValues: Parameters<typeof Date.prototype.setSeconds>

  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setSeconds>
  ) {
    this.target = target
    this.values = params
    this.previousValues = [
      target.getSeconds(),
      target.getMilliseconds()
    ]
  }

  redo (): void {
    this.target.setSeconds(...this.values)
  }

  undo (): void {
    this.target.setSeconds(...this.previousValues)
  }
}

/**
 * Undoable action for changing a date's timestamp.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target timestamp
 * @property {number} previousValue - previous timestamp
 */
export class UndoableSetDateTimestamp implements UndoableAction {
  readonly target: Date
  readonly value: number
  readonly previousValue: number

  constructor (
    target: Date,
    value: number
  ) {
    this.target = target
    this.value = value
    this.previousValue = target.getTime()
  }

  redo (): void {
    this.target.setTime(this.value)
  }

  undo (): void {
    this.target.setTime(this.previousValue)
  }
}

/**
 * Undoable action for changing a date's UTC day of the month.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target day of month
 * @property {number} previousValue - previous day of month
 */
export class UndoableSetUTCDayOfMonth implements UndoableAction {
  readonly target: Date
  readonly value: number
  readonly previousValue: number

  constructor (
    target: Date,
    value: number
  ) {
    this.target = target
    this.value = value
    this.previousValue = target.getUTCDate()
  }

  redo (): void {
    this.target.setUTCDate(this.value)
  }

  undo (): void {
    this.target.setUTCDate(this.previousValue)
  }
}

/**
 * Undoable action for an array's setUTCFullYear method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export class UndoableSetUTCFullYear implements UndoableAction {
  readonly target: Date
  readonly values: Parameters<typeof Date.prototype.setUTCFullYear>
  readonly previousValues: Parameters<typeof Date.prototype.setUTCFullYear>

  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setUTCFullYear>
  ) {
    this.target = target
    this.values = params
    this.previousValues = [
      target.getUTCFullYear(),
      target.getUTCMonth(),
      target.getUTCDate()
    ]
  }

  redo (): void {
    this.target.setUTCFullYear(...this.values)
  }

  undo (): void {
    this.target.setUTCFullYear(...this.previousValues)
  }
}

/**
 * Undoable action for an array's setUTCHours method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export class UndoableSetUTCHours implements UndoableAction {
  readonly target: Date
  readonly values: Parameters<typeof Date.prototype.setUTCHours>
  readonly previousValues: Parameters<typeof Date.prototype.setUTCHours>

  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setUTCHours>
  ) {
    this.target = target
    this.values = params
    this.previousValues = [
      target.getUTCHours(),
      target.getUTCMinutes(),
      target.getUTCSeconds(),
      target.getUTCMilliseconds()
    ]
  }

  redo (): void {
    this.target.setUTCHours(...this.values)
  }

  undo (): void {
    this.target.setUTCHours(...this.previousValues)
  }
}

/**
 * Undoable action for changing a date's UTC milliseconds.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target milliseconds
 * @property {number} previousValue - previous milliseconds
 */
export class UndoableSetUTCMilliseconds implements UndoableAction {
  readonly target: Date
  readonly value: number
  readonly previousValue: number

  constructor (
    target: Date,
    value: number
  ) {
    this.target = target
    this.value = value
    this.previousValue = target.getUTCMilliseconds()
  }

  redo (): void {
    this.target.setUTCMilliseconds(this.value)
  }

  undo (): void {
    this.target.setUTCMilliseconds(this.previousValue)
  }
}

/**
 * Undoable action for an array's setUTCMinutes method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export class UndoableSetUTCMinutes implements UndoableAction {
  readonly target: Date
  readonly values: Parameters<typeof Date.prototype.setUTCMinutes>
  readonly previousValues: Parameters<typeof Date.prototype.setUTCMinutes>

  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setUTCMinutes>
  ) {
    this.target = target
    this.values = params
    this.previousValues = [
      target.getUTCMinutes(),
      target.getUTCSeconds(),
      target.getUTCMilliseconds()
    ]
  }

  redo (): void {
    this.target.setUTCMinutes(...this.values)
  }

  undo (): void {
    this.target.setUTCMinutes(...this.previousValues)
  }
}

/**
 * Undoable action for an array's setUTCMonth method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export class UndoableSetUTCMonth implements UndoableAction {
  readonly target: Date
  readonly values: Parameters<typeof Date.prototype.setUTCMonth>
  readonly previousValues: Parameters<typeof Date.prototype.setUTCMonth>

  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setUTCMonth>
  ) {
    this.target = target
    this.values = params
    this.previousValues = [
      target.getUTCMonth(),
      target.getUTCDate()
    ]
  }

  redo (): void {
    this.target.setUTCMonth(...this.values)
  }

  undo (): void {
    this.target.setUTCMonth(...this.previousValues)
  }
}

/**
 * Undoable action for an array's setSeconds method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export class UndoableSetUTCSeconds implements UndoableAction {
  readonly target: Date
  readonly values: Parameters<typeof Date.prototype.setUTCSeconds>
  readonly previousValues: Parameters<typeof Date.prototype.setUTCSeconds>

  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setUTCSeconds>
  ) {
    this.target = target
    this.values = params
    this.previousValues = [
      target.getUTCSeconds(),
      target.getUTCMilliseconds()
    ]
  }

  redo (): void {
    this.target.setUTCSeconds(...this.values)
  }

  undo (): void {
    this.target.setUTCSeconds(...this.previousValues)
  }
}

/**
 * Proxy handler with undoable action reporting for dates.
 * @class
 * @extends UndoableProxyHandler<Date>
 */
export class UndoableDateHandler extends UndoableProxyHandler<Date> {
  get (
    target: Date,
    property: ValidKey
  ): any {
    if (this.onChange != null) {
      const onChange = this.onChange
      switch (property) {
        case 'setDate': {
          return (value: number) => {
            onChange(
              new UndoableSetDayOfMonth(target, value)
            )
            return target.setDate(value)
          }
        }
        case 'setFullYear': {
          return (...args: Parameters<typeof Date.prototype.setFullYear>) => {
            onChange(
              new UndoableSetFullYear(target, ...args)
            )
            return target.setFullYear(...args)
          }
        }
        case 'setHours': {
          return (...args: Parameters<typeof Date.prototype.setHours>) => {
            onChange(
              new UndoableSetHours(target, ...args)
            )
            return target.setHours(...args)
          }
        }
        case 'setMilliseconds': {
          return (...args: Parameters<typeof Date.prototype.setMilliseconds>) => {
            onChange(
              new UndoableSetMilliseconds(target, ...args)
            )
            return target.setMilliseconds(...args)
          }
        }
        case 'setMinutes': {
          return (...args: Parameters<typeof Date.prototype.setMinutes>) => {
            onChange(
              new UndoableSetMinutes(target, ...args)
            )
            return target.setMinutes(...args)
          }
        }
        case 'setMonth': {
          return (...args: Parameters<typeof Date.prototype.setMonth>) => {
            onChange(
              new UndoableSetMonth(target, ...args)
            )
            return target.setMonth(...args)
          }
        }
        case 'setSeconds': {
          return (...args: Parameters<typeof Date.prototype.setSeconds>) => {
            onChange(
              new UndoableSetSeconds(target, ...args)
            )
            return target.setSeconds(...args)
          }
        }
        case 'setTime': {
          return (...args: Parameters<typeof Date.prototype.setTime>) => {
            onChange(
              new UndoableSetDateTimestamp(target, ...args)
            )
            return target.setTime(...args)
          }
        }
        case 'setUTCDate': {
          return (value: number) => {
            onChange(
              new UndoableSetUTCDayOfMonth(target, value)
            )
            return target.setUTCDate(value)
          }
        }
        case 'setUTCFullYear': {
          return (...args: Parameters<typeof Date.prototype.setUTCFullYear>) => {
            onChange(
              new UndoableSetUTCFullYear(target, ...args)
            )
            return target.setUTCFullYear(...args)
          }
        }
        case 'setUTCHours': {
          return (...args: Parameters<typeof Date.prototype.setUTCHours>) => {
            onChange(
              new UndoableSetUTCHours(target, ...args)
            )
            return target.setUTCHours(...args)
          }
        }
        case 'setUTCMilliseconds': {
          return (...args: Parameters<typeof Date.prototype.setUTCMilliseconds>) => {
            onChange(
              new UndoableSetUTCMilliseconds(target, ...args)
            )
            return target.setUTCMilliseconds(...args)
          }
        }
        case 'setUTCMinutes': {
          return (...args: Parameters<typeof Date.prototype.setUTCMinutes>) => {
            onChange(
              new UndoableSetUTCMinutes(target, ...args)
            )
            return target.setUTCMinutes(...args)
          }
        }
        case 'setUTCMonth': {
          return (...args: Parameters<typeof Date.prototype.setUTCMonth>) => {
            onChange(
              new UndoableSetUTCMonth(target, ...args)
            )
            return target.setUTCMonth(...args)
          }
        }
        case 'setUTCSeconds': {
          return (...args: Parameters<typeof Date.prototype.setUTCSeconds>) => {
            onChange(
              new UndoableSetUTCSeconds(target, ...args)
            )
            return target.setUTCSeconds(...args)
          }
        }
      }
    }
    return super.get(target, property)
  }
}
