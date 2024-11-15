import {
  type UndoableAction,
  type UndoableActionCallback
} from './actions'
import {
  UndoableProxyHandler,
  ClassedUndoableProxyFactory,
  type MaybeArray,
  type ProxyFactory
} from './proxies'

/**
 * UndoableAction for adding an item to a set.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Set<T>} target - set to be modified
 * @property {T} value - value to be added
 * @property {boolean} existingItem - cached check for if the item is already in the set
 */
export class UndoableAddSetItem<T = any> implements UndoableAction {
  readonly target: Set<T>
  readonly value: T
  readonly existingItem: boolean

  constructor (
    target: Set<T>,
    value: T
  ) {
    this.target = target
    this.value = value
    this.existingItem = target.has(value)
  }

  redo (): void {
    this.target.add(this.value)
  }

  undo (): void {
    if (!this.existingItem) {
      this.target.delete(this.value)
    }
  }
}

/**
 * UndoableAction for clearing a set.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Set<T>} target - set to be modified
 * @property {Set<T>} cache - values prior to clear
 */
export class UndoableClearSet<T = any> implements UndoableAction {
  readonly target: Set<T>
  readonly cache: Set<T>

  constructor (
    target: Set<T>
  ) {
    this.target = target
    this.cache = new Set<T>(target)
  }

  redo (): void {
    this.target.clear()
  }

  undo (): void {
    this.cache.forEach(value => this.target.add(value))
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
export class UndoableDeleteSetItem<T = any> implements UndoableAction {
  readonly target: Set<T>
  readonly value: T
  readonly existingItem: boolean

  constructor (
    target: Set<T>,
    value: T
  ) {
    this.target = target
    this.value = value
    this.existingItem = target.has(value)
  }

  redo (): void {
    this.target.delete(this.value)
  }

  undo (): void {
    if (this.existingItem) {
      this.target.add(this.value)
    }
  }
}

/**
 * Proxy handler with undoable action reporting for sets.
 * @class
 * @extends UndoableProxyHandler<UntypedRecord>
 */
export class UndoableSetHandler<T = any> extends UndoableProxyHandler<Set<T>> {
  constructor (
    actionCallbacks: MaybeArray<UndoableActionCallback>,
    proxyFactory?: ProxyFactory | boolean
  ) {
    super(
      actionCallbacks,
      proxyFactory,
      {
        add: (target: Set<T>) => {
          return (value: T) => {
            this.onChange(
              new UndoableAddSetItem(target, value)
            )
            const result = target.add(value)
            return new Proxy(result, this)
          }
        },
        clear: (target: Set<T>) => {
          return () => {
            this.onChange(
              new UndoableClearSet(target)
            )
            target.clear()
          }
        },
        delete: (target: Set<T>) => {
          return (value: T) => {
            this.onChange(
              new UndoableDeleteSetItem(target, value)
            )
            return target.delete(value)
          }
        }
      }
    )
  }
}

ClassedUndoableProxyFactory.defaultHandlerClasses.set(Set.prototype, UndoableSetHandler)
