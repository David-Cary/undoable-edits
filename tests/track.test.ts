import {
  UndoableAction,
  UndoableProxy,
  ClassedUndoableProxyFactory,
  UndoableSetProperty,
  PropertyChangeTracker,
  applyUndoableActionVia,
  unwrapProxyTarget
} from "../src/index"

interface Coords {
  x: number
  y: number
  z: number
}

describe("PropertyChangeTracker", () => {
  const coord: Partial<Coords> = { x: 0, y: 0 }
  const tracker = new PropertyChangeTracker(coord)
  test("should support undoing actions", () => {
    if (tracker.proxy) tracker.proxy.x = 1
    expect(coord.x).toBe(1)
    tracker.track.undo()
    expect(coord.x).toBe(0)
  })
  test("should support redoing actions", () => {
    tracker.track.redo()
    expect(coord.x).toBe(1)
  })
  test("should undo the last change", () => {
    if (tracker.proxy) {
      tracker.proxy.x = 2
      tracker.proxy.x = 3
    }
    expect(coord.x).toBe(3)
    tracker.track.undo()
    expect(coord.x).toBe(2)
  })
  test("should should be able to react to proxy actions", () => {
    const capturedActions: UndoableAction[] = []
    const captureAction = (action: UndoableAction) => capturedActions.push(action)
    const coordProxy = ClassedUndoableProxyFactory.createProxyUsing(
      coord,
      captureAction
    ) as UndoableProxy<Record<string, any>>
    const proxyTracker = new PropertyChangeTracker(coordProxy)
    applyUndoableActionVia(
      coordProxy,
      new UndoableSetProperty(
        unwrapProxyTarget(coordProxy),
        'x',
        1
      )
    )
    expect(coord.x).toBe(1)
    expect(proxyTracker.track.appliedActions.length).toBe(1)
    proxyTracker.track.undo()
    expect(coord.x).toBe(2)
  })
})