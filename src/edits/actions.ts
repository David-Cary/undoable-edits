/**
 * Interface for undo manager commands
 * @interface
 * @property {() => void} redo - callback for applying the command's effects
 * @property {() => void} undo - callback for rolling back the command's effects
 */
export interface UndoableAction {
  redo: () => void
  undo: () => void
}

/**
 * Combines multiple actions into a single action, to be executed in the the provided order.
 * @class
 * @property {UndoableAction[]} steps - subactions to be performed
 */
export class UndoableActionSequence implements UndoableAction {
  readonly steps: UndoableAction[]

  constructor (
    steps: UndoableAction[]
  ) {
    this.steps = steps
  }

  redo (): void {
    for (const step of this.steps) {
      step.redo()
    }
  }

  undo (): void {
    for (let i = this.steps.length - 1; i >= 0; i--) {
      this.steps[i].undo()
    }
  }
}

/**
 * Basic callback for processing undoable actions.
 * @type
 */
export type UndoableActionCallback = (action: UndoableAction) => void
