import {
  type UndoableAction,
  type UndoableActionCallback
} from './actions'
import {
  type ValidKey,
  type MaybeIterable,
  type ProxyFactory,
  ClassedUndoableProxyFactory,
  UndoableProxyHandler
} from './proxies'

/**
 * Undoable action for changing an array's length.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {number} length - desired length for the target array
 * @property {number} originalLength - cached length of array prior to change
 * @property {any[} trimmed - cached values removed by resizing
 */
export class UndoableArrayResize implements UndoableAction {
  readonly target: any[]
  readonly length: number
  readonly originalLength: number
  readonly trimmed: any[]

  constructor (
    target: any[],
    length: number
  ) {
    this.target = target
    this.length = length
    this.originalLength = target.length
    this.trimmed = target.slice(length)
  }

  redo (): void {
    this.target.length = this.length
  }

  undo (): void {
    this.target.length = this.originalLength
    for (let i = 0; i < this.trimmed.length; i++) {
      this.target[this.length + i] = this.trimmed[i]
    }
  }
}

/**
 * Undoable action for an array's copyWithin method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {number} destination - position elements should be copied to
 * @property {number} start - starting position elements should be copied from
 * @property {number | undefined} end - position copy should stop at
 * @property {any[]} overwritten - cached values overwritten by copy
 */
export class UndoableCopyWithin implements UndoableAction {
  readonly target: any[]
  readonly destination: number
  readonly start: number
  readonly end?: number
  readonly overwritten: any[]

  constructor (
    target: any[],
    destination: number,
    start: number,
    end?: number
  ) {
    this.destination = destination
    this.target = target
    this.start = start
    let destinationEnd: number | undefined
    if (end != null) {
      destinationEnd = end >= 0
        ? destination + end - start
        : end
    }
    this.overwritten = target.slice(destination, destinationEnd)
  }

  redo (): void {
    this.target.copyWithin(
      this.destination,
      this.start,
      this.end
    )
  }

  undo (): void {
    this.target.splice(
      this.destination,
      this.overwritten.length,
      ...this.overwritten
    )
  }
}

/**
 * Undoable action for an array's fill method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any} value - value to fill the target positions with
 * @property {number} start - starting position of the fill
 * @property {number | undefined} end - position the fill stops at
 * @property {any[]} overwritten - cached values overwritten by the fill
 */
export class UndoableFill implements UndoableAction {
  readonly target: any[]
  readonly value: any
  readonly start: number
  readonly end?: number
  readonly overwritten: any[]

  constructor (
    target: any[],
    value: any,
    start: number,
    end?: number
  ) {
    this.target = target
    this.value = value
    this.start = start
    this.end = end
    this.overwritten = target.slice(start, end)
  }

  redo (): void {
    this.target.fill(
      this.value,
      this.start,
      this.end
    )
  }

  undo (): void {
    this.target.splice(
      this.start,
      this.overwritten.length,
      ...this.overwritten
    )
  }
}

/**
 * Undoable action for an array's pop method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any} value - cached value to be removed
 */
export class UndoablePopItem implements UndoableAction {
  readonly target: any[]
  readonly value: any

  constructor (
    target: any[]
  ) {
    this.target = target
    this.value = target[target.length - 1]
  }

  redo (): void {
    this.target.pop()
  }

  undo (): void {
    this.target.push(this.value)
  }
}

/**
 * Undoable action for an array's push method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any[]} values - values to be added to the array
 */
export class UndoablePushItems implements UndoableAction {
  readonly target: any[]
  readonly values: any[]

  constructor (
    target: any[],
    ...values: any[]
  ) {
    this.target = target
    this.values = values
  }

  redo (): void {
    this.target.push(...this.values)
  }

  undo (): void {
    const index = this.target.length - this.values.length
    this.target.splice(index)
  }
}

/**
 * Undoable action for an array's reverse method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 */
export class UndoableReverse implements UndoableAction {
  readonly target: any[]

  constructor (
    target: any[]
  ) {
    this.target = target
  }

  redo (): void {
    this.target.reverse()
  }

  undo (): void {
    this.target.reverse()
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
export class UndoableSetItemAt implements UndoableAction {
  readonly target: any[]
  readonly index: number
  readonly previousValue: any
  readonly nextValue: any
  readonly priorLength: number

  constructor (
    target: any[],
    index: number,
    nextValue: any
  ) {
    this.target = target
    this.index = index
    this.previousValue = target[index]
    this.nextValue = nextValue
    this.priorLength = target.length
  }

  redo (): void {
    this.target[this.index] = this.nextValue
  }

  undo (): void {
    this.target[this.index] = this.previousValue
    this.target.length = this.priorLength
  }
}

/**
 * Undoable action for an array's shift method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any} value - cached value to be removed
 */
export class UndoableShiftItem implements UndoableAction {
  readonly target: any[]
  readonly value: any

  constructor (
    target: any[]
  ) {
    this.target = target
    this.value = target[0]
  }

  redo (): void {
    this.target.shift()
  }

  undo (): void {
    this.target.unshift(this.value)
  }
}

/**
 * Undoable action for an array's sort method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {((a: any, b: any) => number) | undefined} compare - comparison function to be applied to sort
 * @property {any[]} unsorted - order of the array's contents before the sort
 */
export class UndoableSort implements UndoableAction {
  readonly target: any[]
  readonly compare?: (a: any, b: any) => number
  readonly unsorted: any[]

  constructor (
    target: any[],
    compare?: (a: any, b: any) => number
  ) {
    this.target = target
    this.compare = compare
    this.unsorted = target.slice()
  }

  redo (): void {
    this.target.sort(this.compare)
  }

  undo (): void {
    this.target.splice(
      0,
      this.unsorted.length,
      ...this.unsorted
    )
  }
}

/**
 * Undoable action for an array's splice method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {number} value - position the splice starts at
 * @property {any[]} deletions - values removed by the splice
 * @property {any[]} insertions - values added by the splice
 */
export class UndoableSplice implements UndoableAction {
  readonly target: any[]
  readonly start: number
  readonly deletions: any[]
  readonly insertions: any[]

  constructor (
    target: any[],
    start: number,
    deleteCount: number = 0,
    ...items: any[]
  ) {
    this.target = target
    this.start = start
    this.deletions = target.slice(start, start + deleteCount)
    this.insertions = items
  }

  redo (): void {
    this.target.splice(
      this.start,
      this.deletions.length,
      ...this.insertions
    )
  }

  undo (): void {
    this.target.splice(
      this.start,
      this.insertions.length,
      ...this.deletions
    )
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

  constructor (
    from: ArrayElementReference<T>,
    to: ArrayElementReference<T>
  ) {
    this.from = from
    this.to = to
  }

  redo (): void {
    this.transferItem(this.from, this.to)
  }

  undo (): void {
    this.transferItem(this.to, this.from)
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
 * @extends UndoableAction
 * @property {any[]} target - array to be modified
 * @property {any[]} values - values to be added to the array
 */
export class UndoableUnshiftItems implements UndoableAction {
  readonly target: any[]
  readonly values: any[]

  constructor (
    target: any[],
    ...values: any[]
  ) {
    this.target = target
    this.values = values
  }

  redo (): void {
    this.target.unshift(...this.values)
  }

  undo (): void {
    this.target.splice(0, this.values.length)
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
            this.onChange(
              new UndoableCopyWithin(target, destination, start, end)
            )
            const value = target.copyWithin(destination, start, end)
            return new Proxy(value, this)
          }
        },
        fill: (target: T[]) => {
          return (value: T, start: number, end?: number) => {
            this.onChange(
              new UndoableFill(target, value, start, end)
            )
            const result = target.fill(value, start, end)
            return new Proxy(result, this)
          }
        },
        pop: (target: T[]) => {
          return (...items: T[]) => {
            this.onChange(
              new UndoablePopItem(target)
            )
            const item = target.pop()
            return this.getProxiedValue(item)
          }
        },
        push: (target: T[]) => {
          return (...items: T[]) => {
            this.onChange(
              new UndoablePushItems(target, ...items)
            )
            return target.push(...items)
          }
        },
        reverse: (target: T[]) => {
          return () => {
            this.onChange(
              new UndoableReverse(target)
            )
            const value = target.reverse()
            return new Proxy(value, this)
          }
        },
        shift: (target: T[]) => {
          return (...items: T[]) => {
            this.onChange(
              new UndoableShiftItem(target)
            )
            const item = target.shift()
            return this.getProxiedValue(item)
          }
        },
        splice: (target: T[]) => {
          return (start: number, deleteCount: number, ...items: T[]) => {
            this.onChange(
              new UndoableSplice(target, start, deleteCount, ...items)
            )
            const value = target.splice(start, deleteCount, ...items)
            return new Proxy(value, this)
          }
        },
        unshift: (target: T[]) => {
          return (...items: T[]) => {
            this.onChange(
              new UndoableUnshiftItems(target, ...items)
            )
            return target.unshift(...items)
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
      return this.applyChange(
        new UndoableArrayResize(target, value)
      )
    }
    const index = Number(property)
    if (isNaN(index)) {
      return Reflect.set(target, property, value)
    }
    return this.applyChange(
      new UndoableSetItemAt(target, index, value)
    )
  }
}

ClassedUndoableProxyFactory.defaultHandlerClasses.set(Array.prototype, UndoableArrayHandler)
