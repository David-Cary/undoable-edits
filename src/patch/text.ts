import {
  type AnyObject,
  UndoableSetValue
} from '../edits/deep'
import {
  type ValidKey
} from '../edits/proxies'

export type TextPatchStep = [number, string]
export type TextPatch = Array<number | TextPatchStep>

/**
  * Applies a text patch array to the provided text.
  * @function
  * @param {string} source - string to be modified
  * @param {TextPatch} patch - patch to be applied
  * @returns {string}
  */
export function applyTextPatch (
  source: string,
  patch: TextPatch
): string {
  let result = ''
  let index = 0
  for (const step of patch) {
    if (typeof step === 'number') {
      const nextIndex = index + step
      result += source.substring(index, nextIndex)
      index = nextIndex
    } else {
      index += step[0]
      result += step[1]
    }
  }
  if (index < source.length) {
    result += source.substring(index)
  }
  return result
}

export type TextChangeTuple = [string, string]
export type TextChanges = Array<string | TextChangeTuple>

/**
  * Gets the text change array for applying the provided text patch.
  * @function
  * @param {string} source - string to be modified
  * @param {TextPatch} patch - patch to be applied
  * @returns {TextChanges}
  */
export function getTextPatchChanges (
  source: string,
  patch: TextPatch
): TextChanges {
  const results: TextChanges = []
  let index = 0
  for (const step of patch) {
    let nextIndex: number
    if (typeof step === 'number') {
      nextIndex = index + step
      results.push(source.substring(index, nextIndex))
    } else {
      nextIndex = index + step[0]
      results.push([
        source.substring(index, nextIndex),
        step[1]
      ])
    }
    index = nextIndex
  }
  if (index < source.length) {
    results.push(source.substring(index))
  }
  return results
}

/**
 * This is a simple utility class for getting the original or patched text from a list with text change tuples.
 * @class
 * @property {TextChanges} segments - array of text changes to be evaluated
 */
export class PatchedTextSequence {
  segments: TextChanges

  get originalText (): string {
    return this.collapseSegments(this.segments, 0)
  }

  get patchedText (): string {
    return this.collapseSegments(this.segments, 1)
  }

  constructor (
    segments: TextChanges = []
  ) {
    this.segments = segments
  }

  collapseSegments (
    segments: Array<string | TextChangeTuple>,
    index: number
  ): string {
    let result = ''
    for (const segment of segments) {
      result += typeof segment === 'string'
        ? segment
        : segment[index] ?? ''
    }
    return result
  }

  static fromPatch (
    source: string,
    patch: TextPatch
  ): PatchedTextSequence {
    const changes = getTextPatchChanges(source, patch)
    return new PatchedTextSequence(changes)
  }
}

/**
 * Replaces sections of a string with the provided substrings.
 * @class
 * @extends UndoableSetValue
 */
export class UndoableTextPatch extends UndoableSetValue {
  constructor (
    target: AnyObject,
    key: ValidKey,
    patch: TextPatch
  ) {
    let value: any
    if (Array.isArray(target)) {
      const index = Number(key)
      if (!isNaN(index)) value = target[index]
    } else value = target[key]
    if (typeof value === 'string') {
      value = applyTextPatch(value, patch)
    }
    super(target, key, value)
  }
}

export type DiffTuple<T = any> = [T, string]

/**
  * Converts an array of opcode/text pairs to a text patch.
  * @function
  * @param {DiffTuple[]} diff - array to be converted
  * @param {any} unchangedKey - opcode that indicates unchanged text
  * @param {any} removedKey - opcode that indicates text to be removed
  * @param {any} addedKey - opcode that indicates text to be added
  * @returns {TextPatch}
  */
export function createTextPatchFromDiffTuples (
  diff: DiffTuple[],
  unchangedKey = 0,
  removedKey = -1,
  addedKey = 1
): TextPatch {
  const patch: TextPatch = []
  let skipCount = 0
  let pendingDeletion: number | undefined
  let pendingAddition: string | undefined
  for (const item of diff) {
    const code = item[0]
    if (code === unchangedKey) {
      if (pendingDeletion != null || pendingAddition != null) {
        patch.push([pendingDeletion ?? 0, pendingAddition ?? ''])
        pendingDeletion = undefined
        pendingAddition = undefined
        skipCount = item[1].length
      } else {
        skipCount += item[1].length
      }
    } else {
      if (skipCount > 0) {
        patch.push(skipCount)
        skipCount = 0
      }
      if (code === removedKey) {
        const textLength = item[1].length
        pendingDeletion = pendingDeletion != null
          ? pendingDeletion + textLength
          : textLength
      } else if (code === addedKey) {
        const text = item[1]
        pendingAddition = pendingAddition != null
          ? pendingAddition + text
          : text
      }
    }
  }
  if (pendingDeletion != null || pendingAddition != null) {
    patch.push([pendingDeletion ?? 0, pendingAddition ?? ''])
  }
  return patch
}

/**
  * Joins a subset of the text in an array of opcode/text pairs.
  * This can be used to get the original text by excluding additions.
  * Alternately, you can get the modified text by excluding removals.
  * @function
  * @param {DiffTuple[]} diff - array to be parsed
  * @param {any} exclude - opcode for values to be skipped
  * @returns {string}
  */
export function getDiffText (
  diff: DiffTuple[],
  exclude: any
): string {
  let result = ''
  for (const item of diff) {
    if (item[0] !== exclude) result += item[1]
  }
  return result
}

/**
 * Switches between versions of the target text based on the provided diff array.
 * @class
 * @extends UndoableSetValue
 */
export class UndoableApplyDiffTuples extends UndoableSetValue {
  constructor (
    target: AnyObject,
    key: ValidKey,
    diff: DiffTuple[],
    removedKey = -1
  ) {
    const value = getDiffText(diff, removedKey)
    super(target, key, value)
  }
}
