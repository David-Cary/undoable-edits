import {
  type UndoableActionCallback,
  UndoableCallback
} from './actions'
import {
  UndoableProxyHandler,
  ClassedUndoableProxyFactory,
  type MaybeIterable,
  type ProxyFactory
} from './proxies'

/**
 * UndoableAction for adding an item to a set.
 * @template T
 * @class
 * @extends UndoableCallback
 */
export class UndoableAddSetItem<T = any>
  extends UndoableCallback<boolean, Set<T>, typeof Set.prototype.add> {
  constructor (
    target: Set<T>,
    ...params: Parameters<typeof Set.prototype.add>
  ) {
    super(target, target.add, params)
  }

  initialize (): void {
    const [value] = this.values
    this._initializedData = this.target.has(value)
  }

  undo (): void {
    if (this._initializedData === false) {
      const [value] = this.values
      this.target.delete(value)
    }
  }
}

/**
 * UndoableAction for clearing a set.
 * @template T
 * @class
 * @extends UndoableCallback
 */
export class UndoableClearSet<T = any>
  extends UndoableCallback<Set<T>, Set<T>, typeof Set.prototype.clear> {
  constructor (
    target: Set<T>
  ) {
    super(target, target.clear, [])
  }

  initialize (): void {
    this._initializedData = new Set<T>(this.target)
  }

  undo (): void {
    if (this._initializedData != null) {
      this._initializedData.forEach(value => this.target.add(value))
    }
  }
}

/**
 * UndoableAction for removing an item to a set.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Set<T>} target - set to be modified
 * @property {T} value - value to be removed
 * @property {boolean} existingItem - cached check for if the item is already in the set
 */
export class UndoableDeleteSetItem<T = any>
  extends UndoableCallback<any, Set<T>, typeof Set.prototype.delete> {
  constructor (
    target: Set<T>,
    value: T
  ) {
    super(target, target.delete, [value])
  }

  undo (): void {
    const [value] = this.values
    this.target.add(value)
  }
}

/**
 * Proxy handler with undoable action reporting for sets.
 * @class
 * @extends UndoableProxyHandler<UntypedRecord>
 */
export class UndoableSetHandler<T = any> extends UndoableProxyHandler<Set<T>> {
  constructor (
    actionCallbacks: MaybeIterable<UndoableActionCallback>,
    proxyFactory?: ProxyFactory | boolean
  ) {
    super(
      actionCallbacks,
      proxyFactory,
      {
        add: (target: Set<T>) => {
          return (value: T) => {
            const result = this.applyChange(
              new UndoableAddSetItem(target, value)
            )
            return new Proxy(result, this)
          }
        },
        clear: (target: Set<T>) => {
          return () => {
            return this.applyChange(
              new UndoableClearSet(target)
            )
          }
        },
        delete: (target: Set<T>) => {
          return (value: T) => {
            return this.applyChange(
              new UndoableDeleteSetItem(target, value)
            )
          }
        }
      }
    )
  }
}

ClassedUndoableProxyFactory.defaultHandlerClasses.set(Set.prototype, UndoableSetHandler)
