import {
  type UndoableAction,
  type UndoableActionCallback
} from './actions'

export type ValidKey = string | number | symbol

export const PROXY_TARGET = Symbol('Proxy_target')

export const APPLY_UNDOABLE_ACTION = Symbol('applyUndoableAction')

/**
 * Generates a ProxyHandler for a particular object.
 * @interface
 */
export interface ConditionalProxyHandlerFactory {
  /**
   * Tries to find the proxy for a given object.
   * @function
   * @param {object} value - object to be evaluated
   * @returns {ProxyHandler<object> | undefined}
   */
  getHandlerFor: (value: object) => ProxyHandler<object> | undefined
}

/**
 * Adds special access properties for undoable actions to a proxy handler.
 * @template T
 * @class
 * @extends ProxyHandler<T>
 * @property {UndoableActionCallback | undefined} onChange - callback to be applied when the proxy target changes
 */
export class UndoableProxyHandler<T extends object> implements ProxyHandler<T> {
  readonly onChange?: UndoableActionCallback
  propertyHandlerFactory?: ConditionalProxyHandlerFactory

  constructor (
    onChange?: UndoableActionCallback,
    propertyHandlerFactory?: ConditionalProxyHandlerFactory
  ) {
    this.onChange = onChange
    this.propertyHandlerFactory = propertyHandlerFactory
  }

  /**
   * Applies the provided action's effects and passed that action to our onChange callback.
   * @function
   * @param {UndoableAction} change - action to be executed
   * @returns {boolean}
   */
  applyChange (
    change: UndoableAction
  ): boolean {
    if (this.onChange != null) {
      this.onChange(change)
    }
    change.redo()
    return true
  }

  get (
    target: T,
    property: ValidKey
  ): any {
    if (property === APPLY_UNDOABLE_ACTION) {
      return (action: UndoableAction) => this.applyChange(action)
    }
    if (property === PROXY_TARGET) {
      return target
    }
    const value = Reflect.get(target, property)
    switch (typeof value) {
      case 'function': {
        return value.bind(target)
      }
      case 'object': {
        if (value != null) {
          if (this.propertyHandlerFactory != null) {
            const handler = this.propertyHandlerFactory.getHandlerFor(value)
            if (handler != null) {
              return new Proxy(value, handler)
            }
          }
        }
        break
      }
    }
    return value
  }
}

/**
 * Adds special access properties for undoable actions to a proxy.
 * @template T
 * @type
 * @property {T} PROXY_TARGET - returns the proxy's target
 * @property {UndoableActionCallback} APPLY_UNDOABLE_ACTION - returns a copy of the handler's applyChange method
 */
export type UndoableProxy<T extends object> = T & {
  [PROXY_TARGET]: T
  [APPLY_UNDOABLE_ACTION]: UndoableActionCallback
}

/**
 * Creates a proxy with special access properties for undoable actions.
 * @template T
 * @function
 * @param {T} source - object be proxied
 * @param {UndoableProxyHandler<T>} handler - handler for the target proxy
 * @returns {UndoableProxy<T>}
 */
export function createUndoableProxy<T extends object> (
  source: T,
  handler: UndoableProxyHandler<T>
): UndoableProxy<T> {
  return new Proxy(source, handler) as UndoableProxy<T>
}

/**
 * Associates a class with a particular value.
 * @template T
 * @interface
 * @property {() => void} class - class definition passed to "new" operator
 * @property {T} value - value associated with the class
 */
export interface ClassValue<T = any> {
  class: new () => any
  value: T
}

/**
 * Gets proxy handlers by what the target object is an instance of.
 * @class
 * @extends UndoableProxyHandler<UntypedRecord>
 * @property {Array<ClassValue<ProxyHandler<object>>>} classes - list of handlers by class, in descending priority order
 * @property {ProxyHandler<object>} classes - handler to use if object doesn't match the listed classes
 */
export class ClassedProxyHandlerFactory implements ConditionalProxyHandlerFactory {
  classes: Array<ClassValue<ProxyHandler<object>>>
  defaultHandler?: ProxyHandler<object>

  constructor (
    classes: Array<ClassValue<ProxyHandler<object>>> = [],
    defaultHandler?: ProxyHandler<object>
  ) {
    this.classes = classes
    this.defaultHandler = defaultHandler
  }

  getHandlerFor (
    value: object
  ): ProxyHandler<object> | undefined {
    for (const entry of this.classes) {
      if (value instanceof entry.class) {
        return entry.value
      }
    }
    return this.defaultHandler
  }
}
