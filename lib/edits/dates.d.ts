import { type UndoableActionCallback, UndoableSetViaFunction } from './actions';
import { UndoableProxyHandler, type MaybeIterable, type ProxyFactory } from './proxies';
/**
 * Undoable action for changing a date's day of the month.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetDayOfMonth extends UndoableSetViaFunction<Date, typeof Date.prototype.setDate> {
    constructor(target: Date, value: number);
}
/**
 * Undoable action for an array's setFullYear method.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetFullYear extends UndoableSetViaFunction<Date, typeof Date.prototype.setFullYear> {
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setFullYear>);
}
/**
 * Undoable action for an array's setHours method.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetHours extends UndoableSetViaFunction<Date, typeof Date.prototype.setHours> {
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setHours>);
}
/**
 * Undoable action for changing a date's milliseconds.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetMilliseconds extends UndoableSetViaFunction<Date, typeof Date.prototype.setMilliseconds> {
    constructor(target: Date, value: number);
}
/**
 * Undoable action for an array's setMinutes method.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetMinutes extends UndoableSetViaFunction<Date, typeof Date.prototype.setMinutes> {
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setMinutes>);
}
/**
 * Undoable action for an array's setMonth method.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetMonth extends UndoableSetViaFunction<Date, typeof Date.prototype.setMonth> {
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setMonth>);
}
/**
 * Undoable action for an array's setSeconds method.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetSeconds extends UndoableSetViaFunction<Date, typeof Date.prototype.setSeconds> {
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setSeconds>);
}
/**
 * Undoable action for changing a date's timestamp.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetDateTimestamp extends UndoableSetViaFunction<Date, typeof Date.prototype.setTime> {
    constructor(target: Date, value: number);
}
/**
 * Undoable action for changing a date's UTC day of the month.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetUTCDayOfMonth extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCDate> {
    constructor(target: Date, value: number);
}
/**
 * Undoable action for an array's setUTCFullYear method.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetUTCFullYear extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCFullYear> {
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setUTCFullYear>);
}
/**
 * Undoable action for an array's setUTCHours method.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetUTCHours extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCHours> {
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setUTCHours>);
}
/**
 * Undoable action for changing a date's UTC milliseconds.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetUTCMilliseconds extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCMilliseconds> {
    constructor(target: Date, value: number);
}
/**
 * Undoable action for an array's setUTCMinutes method.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetUTCMinutes extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCMinutes> {
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setUTCMinutes>);
}
/**
 * Undoable action for an array's setUTCMonth method.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetUTCMonth extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCMonth> {
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setUTCMonth>);
}
/**
 * Undoable action for an array's setSeconds method.
 * @class
 * @extends UndoableSetViaFunction
 */
export declare class UndoableSetUTCSeconds extends UndoableSetViaFunction<Date, typeof Date.prototype.setUTCSeconds> {
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setUTCSeconds>);
}
/**
 * Proxy handler with undoable action reporting for dates.
 * @class
 * @extends UndoableProxyHandler<Date>
 */
export declare class UndoableDateHandler extends UndoableProxyHandler<Date> {
    constructor(actionCallbacks: MaybeIterable<UndoableActionCallback>, proxyFactory?: ProxyFactory | boolean);
}
