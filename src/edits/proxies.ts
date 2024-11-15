import {
  type UndoableAction,
  type UndoableActionCallback,
  UndoableActionSequence
} from './actions'

export type ValidKey = string | number | symbol

export const PROXY_HANDLER = Symbol('Proxy_handler')

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

export interface ProxyFactory<T extends object = object> {
  /**
   * Creates a proxy handler for a given object.
   * @function
   * @param {object} value - object to be evaluated
   * @returns {ProxyHandler<object> | undefined}
   */
  getProxyFor: (value: T) => T
}

export type GetPropertyOf<T extends object = object, V = any> = (target: T) => V

/**
 * Adds special access properties for undoable actions to a proxy handler.
 * @template T
 * @class
 * @extends ProxyHandler<T>
 * @property {UndoableActionCallback[]} actionCallbacks - callbacks to be applied when the proxy target changes
 * @property {ProxyFactory | undefined} proxyFactory - allows generating proxies for property values and returns
 * @property {Record<ValidKey, GetPropertyOf<T>>} propertyGetters - allows specifying proxy getter callbacks for key properties
 */
export class UndoableProxyHandler<T extends object = object> implements ProxyHandler<T> {
  readonly actionCallbacks: UndoableActionCallback[]
  proxyFactory?: ProxyFactory
  propertyGetters: Record<ValidKey, GetPropertyOf<T>>

  constructor (
    actionCallbacks: MaybeArray<UndoableActionCallback>,
    proxyFactory?: ProxyFactory | boolean,
    propertyGetters: Record<ValidKey, GetPropertyOf<T>> = {}
  ) {
    this.actionCallbacks = Array.isArray(actionCallbacks) ? actionCallbacks : [actionCallbacks]
    this.proxyFactory = typeof proxyFactory === 'boolean'
      ? (proxyFactory ? new ClassedUndoableProxyFactory(actionCallbacks) : undefined)
      : proxyFactory
    this.propertyGetters = propertyGetters
  }

  /**
   * Applies out action callbacks to the provided change.
   * @function
   * @param {UndoableAction} change - action to be executed
   * @returns {boolean}
   */
  onChange (
    change: UndoableAction
  ): void {
    for (const callback of this.actionCallbacks) {
      callback(change)
    }
  }

  /**
   * Applies the provided action's effects and triggers the corresponding callbacks.
   * @function
   * @param {UndoableAction} change - action to be executed
   * @returns {boolean}
   */
  applyChange (
    change: UndoableAction
  ): boolean {
    this.onChange(change)
    change.redo()
    return true
  }

  get (
    target: T,
    property: ValidKey
  ): any {
    const getValue = this.propertyGetters[property]
    if (getValue != null) {
      return getValue(target)
    }
    if (property === APPLY_UNDOABLE_ACTION) {
      return (action: UndoableAction) => this.applyChange(action)
    }
    if (property === PROXY_TARGET) {
      return target
    }
    if (property === PROXY_HANDLER) {
      return this
    }
    const value = Reflect.get(target, property)
    if (typeof value === 'function' && target != null) {
      return value.bind(target)
    }
    return this.getProxiedValue(value)
  }

  /**
   * Tries to wrap the value in a proxy.
   * If the value isn't an object or there's no proxy factory, the value itself is returned.
   * @function
   * @param {any} value - value to be wrapped
   * @returns {any}
   */
  getProxiedValue (
    value: any
  ): any {
    if (this.proxyFactory != null && typeof value === 'object' && value != null) {
      return this.proxyFactory.getProxyFor(value)
    }
    return value
  }

  has (
    target: T,
    property: ValidKey
  ): boolean {
    const symbols: ValidKey[] = [APPLY_UNDOABLE_ACTION, PROXY_TARGET, PROXY_HANDLER]
    if (symbols.includes(property)) {
      return true
    }
    return Reflect.has(target, property)
  }
}

/**
 * Typing for plain old javascript object.
 * @type
 */
export type UntypedObject = Record<ValidKey, any>

/**
 * Generic for either a lone value or array of values of the same type.
 * @type
 */
export type MaybeArray<T> = T[] | T

/**
 * Covers references to classes that use a callback list and proxy factory in their constructor.
 * @type
 */
export type UndoableProxyHandlerClass = new (
  actionCallbacks: MaybeArray<UndoableActionCallback>,
  proxyFactory: ProxyFactory
) => ProxyHandler<object>

/**
 * Produces proxies with undoable action support based on the prototype chain of the target value.
 * @class
 * @property {UndoableActionCallback[]} actionCallbacks - callbacks to be applied when the proxy target changes
 * @property {Map<UntypedObject, UndoableProxyHandlerClass>} handlerClasses - map of handler classes by target prototype
 * @property {Map<UntypedObject, ProxyHandler<object>>} handlers - map of cached handlers by target prototype
 */
export class ClassedUndoableProxyFactory implements ProxyFactory<object> {
  readonly actionCallbacks: UndoableActionCallback[]
  handlerClasses: Map<UntypedObject, UndoableProxyHandlerClass>
  handlers = new Map<UntypedObject, ProxyHandler<object>>()

  /**
   * Provides default values for the handlerClasses of new ClassedUndoableProxyFactory instances.
   * @static
   */
  static defaultHandlerClasses = new Map<UntypedObject, UndoableProxyHandlerClass>()

  constructor (
    actionCallbacks: MaybeArray<UndoableActionCallback>,
    handlerClasses = ClassedUndoableProxyFactory.defaultHandlerClasses
  ) {
    this.actionCallbacks = Array.isArray(actionCallbacks) ? actionCallbacks : [actionCallbacks]
    this.handlerClasses = handlerClasses
  }

  getProxyFor (
    value: object
  ): UndoableProxy {
    const handler = this.getProxyHandlerFor(value)
    return new Proxy(value, handler) as UndoableProxy
  }

  /**
   * Provides a proxy handler for a given object.
   * If the value isn't an object or there's no proxy factory, the value itself is returned.
   * @function
   * @param {object} value - value handler should be generated for
   * @returns {ProxyHandler<object>}
   */
  getProxyHandlerFor (
    value: object
  ): ProxyHandler<object> {
    let proto = Object.getPrototypeOf(value)
    while (proto != null) {
      const cachedHandler = this.handlers.get(proto)
      if (cachedHandler != null) return cachedHandler
      const HandlerClass = this.handlerClasses.get(proto)
      if (HandlerClass != null) {
        const handler = new HandlerClass(this.actionCallbacks, this)
        this.handlers.set(proto, handler)
        return handler
      }
      proto = Object.getPrototypeOf(proto)
    }
    return new UndoableProxyHandler(this.actionCallbacks, this)
  }

  /**
   * Generates an UndoableProxy with it's own factory based on the target's protoype chain.
   * @static
   * @function
   * @param {object} value - value to be proxied
   * @param {MaybeArray<UndoableActionCallback>} actionCallbacks - callbacks to be used on value change
   * @param {Map<UntypedObject, UndoableProxyHandlerClass>} handlerClasses - map of handler classes by target prototype
   * @returns {UndoableProxy}
   */
  static createProxyUsing (
    value: object,
    actionCallbacks: MaybeArray<UndoableActionCallback>,
    handlerClasses = ClassedUndoableProxyFactory.defaultHandlerClasses
  ): UndoableProxy {
    const handlerFactory = new ClassedUndoableProxyFactory(actionCallbacks, handlerClasses)
    const proxy = handlerFactory.getProxyFor(value)
    return proxy
  }
}

/**
 * Adds special access properties for undoable actions to a proxy.
 * @template T
 * @type
 * @property {T} PROXY_TARGET - returns the proxy's target
 * @property {UndoableActionCallback} APPLY_UNDOABLE_ACTION - returns a copy of the handler's applyChange method
 */
export type UndoableProxy<T extends object = object> = T & {
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
 * Accesses the proxy target if provided an UndoableProxy.
 * @template T
 * @function
 * @param {T} source - object be evaluated
 * @returns {T}
 */
export function unwrapProxyTarget<T extends object> (
  source: T
): T {
  return PROXY_TARGET in source
    ? (source as UndoableProxy<T>)[PROXY_TARGET]
    : source
}

/**
 * Tries to apply an UndoableAction through the callback of the provided UndoableProxy.
 * @template T
 * @function
 * @param {T} context - source of the target callback
 * @param {UndoableAction} action - action to be applied
 */
export function applyUndoableActionVia<T extends object> (
  context: T,
  action: UndoableAction
): void {
  APPLY_UNDOABLE_ACTION in context
    ? (context as UndoableProxy<T>)[APPLY_UNDOABLE_ACTION](action)
    : action.redo()
}

/**
 * Allows treating a value modifying callback as a single action.
 * @class
 * @property {UndoableProxy<T>} proxy - proxy wrapper for the value to be transformed
 * @property {(value: T) => void} transform - callback to be executed
 */
export class UndoableTransformation<T extends object = object> extends UndoableActionSequence {
  readonly proxy: UndoableProxy<T>
  readonly transform: (value: T) => void

  constructor (
    target: T,
    transform: (value: T) => void,
    handlerClasses?: Map<UntypedObject, UndoableProxyHandlerClass>
  ) {
    super([])
    const unwrappedTarget = unwrapProxyTarget(target)
    const handlerFactory = new ClassedUndoableProxyFactory(
      (action) => { this.steps.push(action) },
      handlerClasses
    )
    this.proxy = handlerFactory.getProxyFor(unwrappedTarget) as UndoableProxy<T>
    this.transform = transform
  }

  redo (): void {
    this.steps.length = 0
    this.transform(this.proxy)
  }

  /**
   * Applies a callback to the target value, triggering the target's action callbacks
   * if it's an undoable proxy.
   * @static
   * @function
   * @param {object} target - value to be transformed
   * @param {(value: object) => void} transform - callbacks to be used
   */
  static applyTransformTo (
    target: object,
    transform: (value: object) => void
  ): void {
    if (APPLY_UNDOABLE_ACTION in target) {
      const action = new UndoableTransformation(target, transform)
      applyUndoableActionVia(target, action)
    } else {
      transform(target)
    }
  }
}
