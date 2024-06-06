import { type UndoableAction } from './actions';
import { UndoableProxyHandler, type ValidKey } from './proxies';
/**
 * Undoable action for changing a date's day of the month.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target day of month
 * @property {number} previousValue - previous day of month
 */
export declare class UndoableSetDayOfMonth implements UndoableAction {
    readonly target: Date;
    readonly value: number;
    readonly previousValue: number;
    constructor(target: Date, value: number);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's setFullYear method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export declare class UndoableSetFullYear implements UndoableAction {
    readonly target: Date;
    readonly values: Parameters<typeof Date.prototype.setFullYear>;
    readonly previousValues: Parameters<typeof Date.prototype.setFullYear>;
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setFullYear>);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's setHours method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export declare class UndoableSetHours implements UndoableAction {
    readonly target: Date;
    readonly values: Parameters<typeof Date.prototype.setHours>;
    readonly previousValues: Parameters<typeof Date.prototype.setHours>;
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setHours>);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for changing a date's milliseconds.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target milliseconds
 * @property {number} previousValue - previous milliseconds
 */
export declare class UndoableSetMilliseconds implements UndoableAction {
    readonly target: Date;
    readonly value: number;
    readonly previousValue: number;
    constructor(target: Date, value: number);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's setMinutes method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export declare class UndoableSetMinutes implements UndoableAction {
    readonly target: Date;
    readonly values: Parameters<typeof Date.prototype.setMinutes>;
    readonly previousValues: Parameters<typeof Date.prototype.setMinutes>;
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setMinutes>);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's setMonth method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export declare class UndoableSetMonth implements UndoableAction {
    readonly target: Date;
    readonly values: Parameters<typeof Date.prototype.setMonth>;
    readonly previousValues: Parameters<typeof Date.prototype.setMonth>;
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setMonth>);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's setSeconds method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export declare class UndoableSetSeconds implements UndoableAction {
    readonly target: Date;
    readonly values: Parameters<typeof Date.prototype.setSeconds>;
    readonly previousValues: Parameters<typeof Date.prototype.setSeconds>;
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setSeconds>);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for changing a date's timestamp.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target timestamp
 * @property {number} previousValue - previous timestamp
 */
export declare class UndoableSetDateTimestamp implements UndoableAction {
    readonly target: Date;
    readonly value: number;
    readonly previousValue: number;
    constructor(target: Date, value: number);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for changing a date's UTC day of the month.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target day of month
 * @property {number} previousValue - previous day of month
 */
export declare class UndoableSetUTCDayOfMonth implements UndoableAction {
    readonly target: Date;
    readonly value: number;
    readonly previousValue: number;
    constructor(target: Date, value: number);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's setUTCFullYear method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export declare class UndoableSetUTCFullYear implements UndoableAction {
    readonly target: Date;
    readonly values: Parameters<typeof Date.prototype.setUTCFullYear>;
    readonly previousValues: Parameters<typeof Date.prototype.setUTCFullYear>;
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setUTCFullYear>);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's setUTCHours method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export declare class UndoableSetUTCHours implements UndoableAction {
    readonly target: Date;
    readonly values: Parameters<typeof Date.prototype.setUTCHours>;
    readonly previousValues: Parameters<typeof Date.prototype.setUTCHours>;
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setUTCHours>);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for changing a date's UTC milliseconds.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} value - target milliseconds
 * @property {number} previousValue - previous milliseconds
 */
export declare class UndoableSetUTCMilliseconds implements UndoableAction {
    readonly target: Date;
    readonly value: number;
    readonly previousValue: number;
    constructor(target: Date, value: number);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's setUTCMinutes method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export declare class UndoableSetUTCMinutes implements UndoableAction {
    readonly target: Date;
    readonly values: Parameters<typeof Date.prototype.setUTCMinutes>;
    readonly previousValues: Parameters<typeof Date.prototype.setUTCMinutes>;
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setUTCMinutes>);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's setUTCMonth method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export declare class UndoableSetUTCMonth implements UndoableAction {
    readonly target: Date;
    readonly values: Parameters<typeof Date.prototype.setUTCMonth>;
    readonly previousValues: Parameters<typeof Date.prototype.setUTCMonth>;
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setUTCMonth>);
    redo(): void;
    undo(): void;
}
/**
 * Undoable action for an array's setSeconds method.
 * @class
 * @extends UndoableAction
 * @property {any[]} target - date to be modified
 * @property {number} values - supplied parameters
 * @property {number} previousValue - parameter values prior to change
 */
export declare class UndoableSetUTCSeconds implements UndoableAction {
    readonly target: Date;
    readonly values: Parameters<typeof Date.prototype.setUTCSeconds>;
    readonly previousValues: Parameters<typeof Date.prototype.setUTCSeconds>;
    constructor(target: Date, ...params: Parameters<typeof Date.prototype.setUTCSeconds>);
    redo(): void;
    undo(): void;
}
/**
 * Proxy handler with undoable action reporting for dates.
 * @class
 * @extends UndoableProxyHandler<Date>
 */
export declare class UndoableDateHandler extends UndoableProxyHandler<Date> {
    get(target: Date, property: ValidKey): any;
}
