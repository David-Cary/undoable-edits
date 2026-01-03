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
 * UndoableAction for clearing a map.
 * @template K, V
 * @class
 * @extends UndoableCallback
 */
export class UndoableClearMap<K = any, V = any>
  extends UndoableCallback<Map<K, V>, Map<K, V>, typeof Map.prototype.clear> {
  constructor (
    target: Map<K, V>
  ) {
    super(target, target.clear, [])
  }

  initialize (): void {
    this._initializedData = new Map<K, V>(this.target)
  }

  undo (): void {
    if (this._initializedData != null) {
      this._initializedData.forEach((value, key) => this.target.set(key, value))
    }
  }
}

/**
 * UndoableAction for removing an item to a map.
 * @template T
 * @class
 * @extends UndoableCallback
 * @property {Map<K, V>} target - map to be modified
 * @property {K} key - key of entry to be removed
 */
export class UndoableDeleteMapItem<K = any, V = any>
  extends UndoableCallback<Map<K, V>, Map<K, V>, typeof Map.prototype.delete> {
  constructor (
    target: Map<K, V>,
    key: K
  ) {
    super(target, target.delete, [key])
  }

  initialize (): void {
    this._initializedData = new Map<K, V>()
    const [key] = this.values
    const value = this.target.get(key)
    if (value !== undefined) this._initializedData.set(key, value)
  }

  undo (): void {
    if (this._initializedData != null) {
      const [key] = this.values
      const value = this._initializedData.get(key)
      if (value !== undefined) this.target.set(key, value)
    }
  }
}

/**
 * UndoableAction for setting a map value.
 * @template T
 * @class
 * @extends UndoableCallback
 */
export class UndoableSetMapValue<K = any, V = any>
  extends UndoableCallback<Map<K, V>, Map<K, V>, typeof Map.prototype.set> {
  constructor (
    target: Map<K, V>,
    ...params: Parameters<typeof Map.prototype.set>
  ) {
    super(target, target.set, params)
  }

  initialize (): void {
    this._initializedData = new Map<K, V>()
    const [key] = this.values
    const value = this.target.get(key)
    if (value !== undefined) this._initializedData.set(key, value)
  }

  undo (): void {
    if (this._initializedData != null) {
      const [key] = this.values
      const value = this._initializedData.get(key)
      if (value !== undefined) {
        this.target.set(key, value)
      } else {
        this.target.delete(key)
      }
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
            return this.applyChange(
              new UndoableClearMap(target)
            )
          }
        },
        delete: (target: Map<K, V>) => {
          return (key: K) => {
            return this.applyChange(
              new UndoableDeleteMapItem(target, key)
            )
          }
        },
        set: (target: Map<K, V>) => {
          return (key: K, value: V) => {
            return this.applyChange(
              new UndoableSetMapValue(target, key, value)
            )
          }
        }
      }
    )
  }
}

ClassedUndoableProxyFactory.defaultHandlerClasses.set(Map.prototype, UndoableMapHandler)
