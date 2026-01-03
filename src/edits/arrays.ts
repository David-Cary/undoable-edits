import {
  type ValidKey,
  type UndoableAction,
  type UndoableActionCallback,
  UndoableCallback,
  type ValueWrapper
} from './actions'
import {
  type MaybeIterable,
  type ProxyFactory,
  ClassedUndoableProxyFactory,
  UndoableProxyHandler
} from './proxies'

/**
 * Undoable action for changing an array's length.
 * @class
 * @extends UndoableAction
 * @property {T[]} target - array to be modified
 * @property {number} length - desired length for the target array
 * @property {number} originalLength - cached length of array prior to change
 * @property {any[} trimmed - cached values removed by resizing
 */
export class UndoableArrayResize<T = any> implements UndoableAction {
  protected _initialized = false
  readonly target: T[]
  readonly length: number
  protected _originalLength = 0
  protected _trimmed: T[] = []

  constructor (
    target: T[],
    length: number
  ) {
    this.target = target
    this.length = length
  }

  initialize (): void {
    this._originalLength = this.target.length
    this._trimmed = this.target.slice(this.length)
    this._initialized = true
  }

  apply (): number {
    if (!this._initialized) this.initialize()
    this.target.length = this.length
    return this.target.length
  }

  redo (): void {
    if (!this._initialized) this.initialize()
    this.target.length = this.length
  }

  undo (): void {
    if (this._initialized) {
      this.target.length = this._originalLength
      for (let i = 0; i < this._trimmed.length; i++) {
        this.target[this.length + i] = this._trimmed[i]
      }
    }
  }
}

/**
 * Undoable action for an array's copyWithin method.
 * @class
 * @extends UndoableCallback
 */
export class UndoableCopyWithin<T = any> extends UndoableCallback<T[], T[], typeof Array.prototype.copyWithin> {
  constructor (
    target: T[],
    ...params: Parameters<typeof Array.prototype.copyWithin>
  ) {
    super(target, target.copyWithin, params)
  }

  initialize (): void {
    const [destination, start, end] = this.values
    let destinationEnd: number | undefined
    if (end != null) {
      destinationEnd = end >= 0
        ? destination + end - start
        : end
    }
    this._initializedData = this.target.slice(destination, destinationEnd)
  }

  undo (): void {
    const [destination] = this.values
    if (this._initializedData != null) {
      this.target.splice(
        destination,
        this._initializedData.length,
        ...this._initializedData
      )
    }
  }
}

/**
 * Undoable action for an array's fill method.
 * @class
 * @extends UndoableCallback
 */
export class UndoableFill<T = any> extends UndoableCallback<T[], T[], typeof Array.prototype.fill> {
  constructor (
    target: T[],
    ...params: Parameters<typeof Array.prototype.fill>
  ) {
    super(target, target.fill, params)
  }

  initialize (): void {
    const [, start, end] = this.values
    this._initializedData = this.target.slice(start, end)
  }

  undo (): void {
    const [, start] = this.values
    if (this._initializedData != null) {
      this.target.splice(
        start ?? 0,
        this._initializedData.length,
        ...this._initializedData
      )
    }
  }
}

/**
 * Undoable action for an array's pop method.
 * @class
 * @extends UndoableCallback
 */
export class UndoablePopItem<T = any> extends UndoableCallback<ValueWrapper, T[], typeof Array.prototype.pop> {
  constructor (
    target: T[]
  ) {
    super(target, target.pop, [])
  }

  initialize (): void {
    this._initializedData = { value: this.target[this.target.length - 1] }
  }

  undo (): void {
    if (this._initializedData != null) {
      this.target.push(this._initializedData.value)
    }
  }
}

/**
 * Undoable action for an array's push method.
 * @class
 * @extends UndoableCallback
 */
export class UndoablePushItems<T = any> extends UndoableCallback<any, T[], typeof Array.prototype.push> {
  constructor (
    target: T[],
    ...values: T[]
  ) {
    super(target, target.push, values)
  }

  undo (): void {
    if (this._initializedData != null) {
      const index = this.target.length - this.values.length
      this.target.splice(index)
    }
  }
}

/**
 * Undoable action for an array's reverse method.
 * @class
 * @extends UndoableCallback
 */
export class UndoableReverse<T = any> extends UndoableCallback<boolean, T[], typeof Array.prototype.reverse> {
  constructor (
    target: any[]
  ) {
    super(target, target.reverse, [])
  }

  initialize (): void {
    this._initializedData = true
  }

  undo (): void {
    if (this._initializedData === true) {
      this.target.reverse()
    }
  }
}

/**
 * Undoable action for setting the array element at a given index.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {number} index - position for the target value
 * @property {any} previousValue - cached value before assignment
 * @property {any} nextValue - value to be assigned
 * @property {number} priorLength - cached length of array before assignment
 */
export class UndoableSetItemAt<T = any> implements UndoableAction {
  readonly target: T []
  readonly index: number
  protected _initializedData?: { value: T, length: number }
  readonly nextValue: T
  protected _priorLength = 0

  constructor (
    target: T[],
    index: number,
    nextValue: any
  ) {
    this.target = target
    this.index = index
    this.nextValue = nextValue
  }

  initialize (): void {
    this._initializedData = {
      value: this.target[this.index],
      length: this.target.length
    }
  }

  apply (): boolean {
    if (this._initializedData == null) this.initialize()
    this.target[this.index] = this.nextValue
    return true
  }

  redo (): void {
    if (this._initializedData == null) this.initialize()
    this.target[this.index] = this.nextValue
  }

  undo (): void {
    if (this._initializedData != null) {
      this.target[this.index] = this._initializedData.value
      this.target.length = this._initializedData.length
    }
  }
}

/**
 * Undoable action for an array's shift method.
 * @class
 * @extends UndoableCallback
 */
export class UndoableShiftItem<T = any> extends UndoableCallback<ValueWrapper, T[], typeof Array.prototype.shift> {
  constructor (
    target: T[]
  ) {
    super(target, target.shift, [])
  }

  initialize (): void {
    this._initializedData = { value: this.target[0] }
  }

  undo (): void {
    if (this._initializedData != null) {
      this.target.unshift(this._initializedData.value)
    }
  }
}

/**
 * Undoable action for an array's sort method.
 * @class
 * @extends UndoableCallback
 */
export class UndoableSort<T = any> extends UndoableCallback<T[], T[], typeof Array.prototype.sort> {
  constructor (
    target: T[],
    ...params: Parameters<typeof Array.prototype.sort>
  ) {
    super(target, target.sort, params)
  }

  initialize (): void {
    this._initializedData = this.target.slice()
  }

  undo (): void {
    if (this._initializedData != null) {
      this.target.splice(
        0,
        this._initializedData.length,
        ...this._initializedData
      )
    }
  }
}

/**
 * Undoable action for an array's splice method.
 * @class
 * @extends UndoableCallback
 */
export class UndoableSplice<T = any>
  extends UndoableCallback<Parameters<typeof Array.prototype.splice>, T[], typeof Array.prototype.splice> {
  constructor (
    target: T[],
    ...params: Parameters<typeof Array.prototype.splice>
  ) {
    super(target, target.splice, params)
  }

  initialize (): void {
    const [start, deleteCount, ...items] = this.values
    const end = start + deleteCount
    const deletions = this.target.slice(start, end)
    this._initializedData = [
      start,
      items.length,
      ...deletions
    ]
  }

  undo (): void {
    if (this._initializedData != null) {
      this.target.splice.apply(this.target, this._initializedData)
    }
  }
}

/**
 * References a particular position with a given array.
 * @template T
 * @interface
 * @property {T[]} source - owner of the target element
 * @property {number} index - position of the target position within the array
 */
export interface ArrayElementReference<T = any> {
  source: T[]
  index: number
}

/**
 * Moves an element from one array to a given position in another array.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {ArrayElementReference<T>} from - position of element to be moved
 * @property {ArrayElementReference<T>} to - destination of the target element
 */
export class UndoableTransferItem<T = any> implements UndoableAction {
  readonly from: ArrayElementReference<T>
  readonly to: ArrayElementReference<T>
  protected _initializedData: any[] = []

  constructor (
    from: ArrayElementReference<T>,
    to: ArrayElementReference<T>
  ) {
    this.from = from
    this.to = to
  }

  apply (): ArrayElementReference<T> | undefined {
    if (this._initializedData.length < 1) this.initialize()
    if (this._initializedData.length > 0) {
      this.transferItem(this.from, this.to)
      return { ...this.to }
    }
  }

  initialize (): void {
    this._initializedData = []
    const length = this.from.source.length
    if (this.from.index >= length || this.from.index < -length) return
    const targetValue = this.from.source.at(this.from.index)
    this._initializedData.push(targetValue)
  }

  redo (): void {
    if (this._initializedData.length < 1) this.initialize()
    if (this._initializedData.length > 0) {
      this.transferItem(this.from, this.to)
    }
  }

  undo (): void {
    if (this._initializedData.length > 0) {
      this.transferItem(this.to, this.from)
    }
  }

  /**
   * Helper function for moving element from one array to another.
   * @function
   * @property {ArrayElementReference<T>} from - position of element to be moved
   * @property {ArrayElementReference<T>} to - destination of the target element
   */
  transferItem (
    from: ArrayElementReference<T>,
    to: ArrayElementReference<T>
  ): void {
    const values = from.source.splice(from.index, 1)
    const toIndex = to.index >= 0
      ? to.index
      : Math.max(0, to.source.length + 1 + to.index)
    to.source.splice(toIndex, 0, values[0])
  }
}

/**
 * Undoable action for an array's unshift method.
 * @class
 * @extends UndoableCallback
 */
export class UndoableUnshiftItems<T = any> extends UndoableCallback<any, T[], typeof Array.prototype.unshift> {
  constructor (
    target: T[],
    ...values: any[]
  ) {
    super(target, target.unshift, values)
  }

  undo (): void {
    if (this._initializedData != null) {
      this.target.splice(0, this.values.length)
    }
  }
}

/**
 * Proxy handler with undoable action reporting for arrays.
 * @class
 * @extends UndoableProxyHandler<T[]>
 */
export class UndoableArrayHandler<T = any> extends UndoableProxyHandler<T[]> {
  constructor (
    actionCallbacks: MaybeIterable<UndoableActionCallback>,
    proxyFactory?: ProxyFactory | boolean
  ) {
    super(
      actionCallbacks,
      proxyFactory,
      {
        at: (target: T[]) => {
          return (index: number) => {
            const value = target.at(index)
            return this.getProxiedValue(value)
          }
        },
        copyWithin: (target: T[]) => {
          return (destination: number, start: number, end?: number) => {
            const value = this.applyChange(
              new UndoableCopyWithin(target, destination, start, end)
            )
            return new Proxy(value, this)
          }
        },
        fill: (target: T[]) => {
          return (value: T, start: number, end?: number) => {
            const result = this.applyChange(
              new UndoableFill(target, value, start, end)
            )
            return new Proxy(result, this)
          }
        },
        pop: (target: T[]) => {
          return (...items: T[]) => {
            const item = this.applyChange(
              new UndoablePopItem(target)
            )
            return this.getProxiedValue(item)
          }
        },
        push: (target: T[]) => {
          return (...items: T[]) => {
            return this.applyChange(
              new UndoablePushItems(target, ...items)
            )
          }
        },
        reverse: (target: T[]) => {
          return () => {
            const value = this.applyChange(
              new UndoableReverse(target)
            )
            return new Proxy(value, this)
          }
        },
        shift: (target: T[]) => {
          return (...items: T[]) => {
            const item = this.applyChange(
              new UndoableShiftItem(target)
            )
            return this.getProxiedValue(item)
          }
        },
        splice: (target: T[]) => {
          return (start: number, deleteCount: number, ...items: T[]) => {
            const value = this.applyChange(
              new UndoableSplice(target, start, deleteCount, ...items)
            )
            return new Proxy(value, this)
          }
        },
        unshift: (target: T[]) => {
          return (...items: T[]) => {
            return this.applyChange(
              new UndoableUnshiftItems(target, ...items)
            )
          }
        }
      }
    )
  }

  set (
    target: T[],
    property: ValidKey,
    value: any
  ): boolean {
    if (property === 'length') {
      this.applyChange(
        new UndoableArrayResize(target, value)
      )
      return true
    }
    const index = Number(property)
    if (isNaN(index)) {
      return Reflect.set(target, property, value)
    }
    this.applyChange(
      new UndoableSetItemAt(target, index, value)
    )
    return true
  }
}

ClassedUndoableProxyFactory.defaultHandlerClasses.set(Array.prototype, UndoableArrayHandler)
