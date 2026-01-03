import {
  type UndoableActionCallback,
  UndoableSetViaFunction
} from './actions'
import {
  UndoableProxyHandler,
  type MaybeIterable,
  type ProxyFactory,
  ClassedUndoableProxyFactory
} from './proxies'

/**
 * Undoable action for changing a date's day of the month.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetDayOfMonth extends UndoableSetViaFunction<Date, typeof Date.prototype.setDate> {
  constructor (
    target: Date,
    value: number
  ) {
    super(
      target,
      target.setDate,
      (target: Date) => [target.getDate()],
      [value]
    )
  }
}

/**
 * Undoable action for an array's setFullYear method.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetFullYear extends UndoableSetViaFunction<Date, typeof Date.prototype.setFullYear> {
  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setFullYear>
  ) {
    super(
      target,
      target.setFullYear,
      (target: Date) => [
        target.getFullYear(),
        target.getMonth(),
        target.getDate()
      ],
      params
    )
  }
}

/**
 * Undoable action for an array's setHours method.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetHours extends UndoableSetViaFunction<Date, typeof Date.prototype.setHours> {
  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setHours>
  ) {
    super(
      target,
      target.setHours,
      (target: Date) => [
        target.getHours(),
        target.getMinutes(),
        target.getSeconds(),
        target.getMilliseconds()
      ],
      params
    )
  }
}

/**
 * Undoable action for changing a date's milliseconds.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetMilliseconds extends UndoableSetViaFunction<Date, typeof Date.prototype.setMilliseconds> {
  constructor (
    target: Date,
    value: number
  ) {
    super(
      target,
      target.setMilliseconds,
      (target: Date) => [target.getMilliseconds()],
      [value]
    )
  }
}

/**
 * Undoable action for an array's setMinutes method.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetMinutes extends UndoableSetViaFunction<Date, typeof Date.prototype.setMinutes> {
  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setMinutes>
  ) {
    super(
      target,
      target.setMinutes,
      (target: Date) => [
        target.getMinutes(),
        target.getSeconds(),
        target.getMilliseconds()
      ],
      params
    )
  }
}

/**
 * Undoable action for an array's setMonth method.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetMonth extends UndoableSetViaFunction<Date, typeof Date.prototype.setMonth> {
  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setMonth>
  ) {
    super(
      target,
      target.setMonth,
      (target: Date) => [
        target.getMonth(),
        target.getDate()
      ],
      params
    )
  }
}

/**
 * Undoable action for an array's setSeconds method.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetSeconds extends UndoableSetViaFunction<Date, typeof Date.prototype.setSeconds> {
  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setSeconds>
  ) {
    super(
      target,
      target.setSeconds,
      (target: Date) => [
        target.getSeconds(),
        target.getMilliseconds()
      ],
      params
    )
  }
}

/**
 * Undoable action for changing a date's timestamp.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetDateTimestamp extends UndoableSetViaFunction<Date, typeof Date.prototype.setTime> {
  constructor (
    target: Date,
    value: number
  ) {
    super(
      target,
      target.setTime,
      (target: Date) => [target.getTime()],
      [value]
    )
  }
}

/**
 * Undoable action for changing a date's UTC day of the month.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetUTCDayOfMonth extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCDate> {
  constructor (
    target: Date,
    value: number
  ) {
    super(
      target,
      target.setUTCDate,
      (target: Date) => [target.getUTCDate()],
      [value]
    )
  }
}

/**
 * Undoable action for an array's setUTCFullYear method.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetUTCFullYear extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCFullYear> {
  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setUTCFullYear>
  ) {
    super(
      target,
      target.setUTCFullYear,
      (target: Date) => [
        target.getUTCFullYear(),
        target.getUTCMonth(),
        target.getUTCDate()
      ],
      params
    )
  }
}

/**
 * Undoable action for an array's setUTCHours method.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetUTCHours extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCHours> {
  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setUTCHours>
  ) {
    super(
      target,
      target.setUTCHours,
      (target: Date) => [
        target.getUTCHours(),
        target.getUTCMinutes(),
        target.getUTCSeconds(),
        target.getUTCMilliseconds()
      ],
      params
    )
  }
}

/**
 * Undoable action for changing a date's UTC milliseconds.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetUTCMilliseconds extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCMilliseconds> {
  constructor (
    target: Date,
    value: number
  ) {
    super(
      target,
      target.setUTCMilliseconds,
      (target: Date) => [target.getUTCMilliseconds()],
      [value]
    )
  }
}

/**
 * Undoable action for an array's setUTCMinutes method.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetUTCMinutes extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCMinutes> {
  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setUTCMinutes>
  ) {
    super(
      target,
      target.setUTCMinutes,
      (target: Date) => [
        target.getUTCMinutes(),
        target.getUTCSeconds(),
        target.getUTCMilliseconds()
      ],
      params
    )
  }
}

/**
 * Undoable action for an array's setUTCMonth method.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetUTCMonth extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCMonth> {
  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setUTCMonth>
  ) {
    super(
      target,
      target.setUTCMonth,
      (target: Date) => [
        target.getUTCMonth(),
        target.getUTCDate()
      ],
      params
    )
  }
}

/**
 * Undoable action for an array's setSeconds method.
 * @class
 * @extends UndoableSetViaFunction
 */
export class UndoableSetUTCSeconds extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCSeconds> {
  constructor (
    target: Date,
    ...params: Parameters<typeof Date.prototype.setUTCSeconds>
  ) {
    super(
      target,
      target.setUTCSeconds,
      (target: Date) => [
        target.getUTCSeconds(),
        target.getUTCMilliseconds()
      ],
      params
    )
  }
}

/**
 * Proxy handler with undoable action reporting for dates.
 * @class
 * @extends UndoableProxyHandler<Date>
 */
export class UndoableDateHandler extends UndoableProxyHandler<Date> {
  constructor (
    actionCallbacks: MaybeIterable<UndoableActionCallback>,
    proxyFactory?: ProxyFactory | boolean
  ) {
    super(
      actionCallbacks,
      proxyFactory,
      {
        setDate: (target: Date) => {
          return (value: number) => {
            return this.applyChange(
              new UndoableSetDayOfMonth(target, value)
            )
          }
        },
        setFullYear: (target: Date) => {
          return (...args: Parameters<typeof Date.prototype.setFullYear>) => {
            return this.applyChange(
              new UndoableSetFullYear(target, ...args)
            )
          }
        },
        setHours: (target: Date) => {
          return (...args: Parameters<typeof Date.prototype.setHours>) => {
            return this.applyChange(
              new UndoableSetHours(target, ...args)
            )
          }
        },
        setMilliseconds: (target: Date) => {
          return (...args: Parameters<typeof Date.prototype.setMilliseconds>) => {
            return this.applyChange(
              new UndoableSetMilliseconds(target, ...args)
            )
          }
        },
        setMinutes: (target: Date) => {
          return (...args: Parameters<typeof Date.prototype.setMinutes>) => {
            return this.applyChange(
              new UndoableSetMinutes(target, ...args)
            )
          }
        },
        setMonth: (target: Date) => {
          return (...args: Parameters<typeof Date.prototype.setMonth>) => {
            return this.applyChange(
              new UndoableSetMonth(target, ...args)
            )
          }
        },
        setSeconds: (target: Date) => {
          return (...args: Parameters<typeof Date.prototype.setSeconds>) => {
            return this.applyChange(
              new UndoableSetSeconds(target, ...args)
            )
          }
        },
        setTime: (target: Date) => {
          return (...args: Parameters<typeof Date.prototype.setTime>) => {
            return this.applyChange(
              new UndoableSetDateTimestamp(target, ...args)
            )
          }
        },
        setUTCDate: (target: Date) => {
          return (value: number) => {
            return this.applyChange(
              new UndoableSetUTCDayOfMonth(target, value)
            )
          }
        },
        setUTCFullYear: (target: Date) => {
          return (...args: Parameters<typeof Date.prototype.setUTCFullYear>) => {
            return this.applyChange(
              new UndoableSetUTCFullYear(target, ...args)
            )
          }
        },
        setUTCHours: (target: Date) => {
          return (...args: Parameters<typeof Date.prototype.setUTCHours>) => {
            return this.applyChange(
              new UndoableSetUTCHours(target, ...args)
            )
          }
        },
        setUTCMilliseconds: (target: Date) => {
          return (...args: Parameters<typeof Date.prototype.setUTCMilliseconds>) => {
            return this.applyChange(
              new UndoableSetUTCMilliseconds(target, ...args)
            )
          }
        },
        setUTCMinutes: (target: Date) => {
          return (...args: Parameters<typeof Date.prototype.setUTCMinutes>) => {
            return this.applyChange(
              new UndoableSetUTCMinutes(target, ...args)
            )
          }
        },
        setUTCMonth: (target: Date) => {
          return (...args: Parameters<typeof Date.prototype.setUTCMonth>) => {
            return this.applyChange(
              new UndoableSetUTCMonth(target, ...args)
            )
          }
        },
        setUTCSeconds: (target: Date) => {
          return (...args: Parameters<typeof Date.prototype.setUTCSeconds>) => {
            return this.applyChange(
              new UndoableSetUTCSeconds(target, ...args)
            )
          }
        }
      }
    )
  }
}

ClassedUndoableProxyFactory.defaultHandlerClasses.set(Date.prototype, UndoableDateHandler)
