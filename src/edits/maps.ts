import {
  type UndoableAction,
  type UndoableActionCallback
} from './actions'
import {
  UndoableProxyHandler,
  ClassedUndoableProxyFactory,
  type MaybeIterable,
  type ProxyFactory
} from './proxies'

/**
 * UndoableAction for clearing a map.
 * @template K, V
 * @class
 * @extends UndoableAction
 * @property {Map<K, V>} target - map to be modified
 * @property {Set<T>} cache - values prior to clear
 */
export class UndoableClearMap<K = any, V = any> implements UndoableAction {
  readonly target: Map<K, V>
  readonly cache: Map<K, V>

  constructor (
    target: Map<K, V>
  ) {
    this.target = target
    this.cache = new Map<K, V>(target)
  }

  redo (): void {
    this.target.clear()
  }

  undo (): void {
    this.cache.forEach((value, key) => this.target.set(key, value))
  }
}

/**
 * UndoableAction for removing an item to a map.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Map<K, V>} target - map to be modified
 * @property {K} key - key of entry to be removed
 * @property {boolean} existingItem - cached check for if the item is already in the map
 */
export class UndoableDeleteMapItem<K = any, V = any> implements UndoableAction {
  readonly target: Map<K, V>
  readonly key: K
  readonly previousValue?: V
  readonly existingItem: boolean

  constructor (
    target: Map<K, V>,
    key: K
  ) {
    this.target = target
    this.key = key
    this.previousValue = target.get(key)
    this.existingItem = target.has(key)
  }

  redo (): void {
    this.target.delete(this.key)
  }

  undo (): void {
    if (this.existingItem && this.previousValue !== undefined) {
      this.target.set(this.key, this.previousValue)
    }
  }
}

/**
 * UndoableAction for setting a map value.
 * @template T
 * @class
 * @extends UndoableAction
 * @property {Map<K, V>} target - map to be modified
 * @property {K} key - key of target entry
 * @property {V} value - value to be assigned
 * @property {boolean} existingItem - cached check for if the item is already in the map
 */
export class UndoableSetMapValue<K = any, V = any> implements UndoableAction {
  readonly target: Map<K, V>
  readonly key: K
  readonly previousValue?: V
  readonly nextValue: V
  readonly existingItem: boolean

  constructor (
    target: Map<K, V>,
    key: K,
    value: V
  ) {
    this.target = target
    this.key = key
    this.nextValue = value
    this.previousValue = target.get(key)
    this.existingItem = target.has(key)
  }

  redo (): void {
    this.target.set(this.key, this.nextValue)
  }

  undo (): void {
    if (this.existingItem && this.previousValue !== undefined) {
      this.target.set(this.key, this.previousValue)
    } else {
      this.target.delete(this.key)
    }
  }
}

/**
 * Proxy handler with undoable action reporting for sets.
 * @class
 * @extends UndoableProxyHandler<UntypedRecord>
 */
export class UndoableMapHandler<K = any, V = any> extends UndoableProxyHandler<Map<K, V>> {
  constructor (
    actionCallbacks: MaybeIterable<UndoableActionCallback>,
    proxyFactory?: ProxyFactory | boolean
  ) {
    super(
      actionCallbacks,
      proxyFactory,
      {
        clear: (target: Map<K, V>) => {
          return () => {
            this.onChange(
              new UndoableClearMap(target)
            )
            target.clear()
          }
        },
        delete: (target: Map<K, V>) => {
          return (key: K) => {
            this.onChange(
              new UndoableDeleteMapItem(target, key)
            )
            return target.delete(key)
          }
        },
        set: (target: Map<K, V>) => {
          return (key: K, value: V) => {
            this.onChange(
              new UndoableSetMapValue(target, key, value)
            )
            return target.set(key, value)
          }
        }
      }
    )
  }
}

ClassedUndoableProxyFactory.defaultHandlerClasses.set(Map.prototype, UndoableMapHandler)
