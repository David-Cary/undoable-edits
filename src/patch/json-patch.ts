import {
  type UndoableAction,
  UndoableActionSequence
} from '../edits/actions'
import {
  type AnyObject,
  type CommonKey,
  UndoableCopyValue,
  UndoableDeleteNestedValue,
  UndoableInsertNestedValue,
  UndoableSetNestedValue,
  UndoableTransferValue,
  parsePathString,
  reducePropertyPath
} from '../edits/deep'

export interface JSONPatchStep {
  op: string
  path: string | CommonKey[]
  from?: string | CommonKey[]
  value?: any
}

/**
  * Converts a JSONPatch path property to an array of keys and indices.
  * @function
  * @param {string | CommonKey[]} path - path string/array to be evaluated.
  * @returns {CommonKey | undefined}
  */
export function parseJSONPatchPath (
  path: string | CommonKey[]
): CommonKey[] {
  if (typeof path === 'string') {
    const steps = parsePathString(path, '/')
    if (steps[0] === '') steps.shift()
    return steps
  }
  return path
}

export type JSONPatchToAction = (target: AnyObject, step: JSONPatchStep) => UndoableAction | undefined

export const DEFAULT_JSON_PATCH_OPS_TO_ACTIONS = {
  add: (target: AnyObject, step: JSONPatchStep) => {
    const path = parseJSONPatchPath(step.path)
    return new UndoableInsertNestedValue(target, path, step.value, true)
  },
  copy: (target: AnyObject, step: JSONPatchStep) => {
    if (step.from != null) {
      const from = reducePropertyPath(target, parseJSONPatchPath(step.from))
      const to = reducePropertyPath(target, parseJSONPatchPath(step.path))
      if (from != null && to != null) {
        return new UndoableCopyValue(from, to)
      }
    }
  },
  move: (target: AnyObject, step: JSONPatchStep) => {
    if (step.from != null) {
      const from = reducePropertyPath(target, parseJSONPatchPath(step.from))
      const to = reducePropertyPath(target, parseJSONPatchPath(step.path))
      if (from != null && to != null) {
        return new UndoableTransferValue(from, to)
      }
    }
  },
  remove: (target: AnyObject, step: JSONPatchStep) => {
    const path = parseJSONPatchPath(step.path)
    return new UndoableDeleteNestedValue(target, path)
  },
  replace: (target: AnyObject, step: JSONPatchStep) => {
    const path = parseJSONPatchPath(step.path)
    return new UndoableSetNestedValue(target, path, step.value, true)
  }
}

/**
 * Applies the provided JSON patch to the target object.
 * @class
 * @extends UndoableActionSequence
 */
export class UndoableJSONPatch extends UndoableActionSequence {
  constructor (
    target: AnyObject,
    patch: JSONPatchStep[],
    stepParsers: Record<string, JSONPatchToAction> = DEFAULT_JSON_PATCH_OPS_TO_ACTIONS
  ) {
    super([])
    for (const step of patch) {
      const parse = stepParsers[step.op]
      if (parse != null) {
        const action = parse(target, step)
        if (action != null) this.steps.push(action)
      }
    }
  }
}
