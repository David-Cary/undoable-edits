import {
  UndoableAction,
  UndoableAssignProperties,
  UndoableSetProperty,
  UndoableSetPropertyDefaults,
  UndoableDeleteProperty,
  UndoableRenameProperty,
  UndoableCopyPropertyFrom,
  UndoableRecordHandler,
  UndoableTransformation,
  unwrapProxyTarget,
  applyUndoableActionVia,
  APPLY_UNDOABLE_ACTION,
  PROXY_TARGET,
  PROXY_HANDLER
} from "../src/index"

interface Coords {
  x: number
  y: number
  z: number
}

describe("UndoableSetProperty", () => {
  const target: Partial<Coords> = {}
  const init = new UndoableSetProperty(
    target,
    'x',
    1
  )
  let update: UndoableSetProperty 
  describe("redo", () => {
    test("should create property as needed", () => {
      init.redo()
      expect(target.x).toBe(1)
    })
    test("should overwrite existing property", () => {
      update = new UndoableSetProperty(
        target,
        'x',
        2
      )
      expect(update.priorProperty).toBe(true)
      update.redo()
      expect(target.x).toBe(2)
    })
  })
  describe("undo", () => {
    test("should revert the value", () => {
      update.undo()
      expect(target.x).toBe(1)
    })
    test("should remove added property", () => {
      init.undo()
      expect(target).not.toHaveProperty('x')
    })
  })
})

describe("UndoableAssignProperties", () => {
  const target: Partial<Coords> = { x: 1, y: 1 }
  const action = new UndoableAssignProperties(
    target,
    { x: 2, z: 0 }
  )
  describe("redo", () => {
    test("should overwrite target properties", () => {
      action.redo()
      expect(target).toEqual({ x: 2, y: 1, z: 0 })
    })
  })
  describe("undo", () => {
    test("should revert to prior values", () => {
      action.undo()
      expect(target).toEqual({ x: 1, y: 1 })
      expect(target['z']).toBe(undefined)
    })
  })
})

describe("UndoableSetPropertyDefaults", () => {
  const target: Partial<Coords> = { x: 1, y: 1 }
  const action = new UndoableSetPropertyDefaults(
    target,
    { x: 2, z: 0 }
  )
  describe("redo", () => {
    test("should supply property defaults", () => {
      action.redo()
      expect(target).toEqual({ x: 1, y: 1, z: 0 })
    })
  })
  describe("undo", () => {
    test("should revert to prior state", () => {
      action.undo()
      expect(target).toEqual({ x: 1, y: 1 })
      expect(target['z']).toBe(undefined)
    })
  })
})

describe("UndoableDeleteProperty", () => {
  const target: Partial<Coords> = { x: 1 }
  const action = new UndoableDeleteProperty(
    target,
    'x'
  )
  describe("redo", () => {
    test("should remove the target property", () => {
      action.redo()
      expect(target).not.toHaveProperty('x')
    })
  })
  describe("undo", () => {
    test("should restore the removed property", () => {
      action.undo()
      expect(target.x).toBe(1)
    })
  })
})

describe("UndoableRenameProperty", () => {
  const target: Partial<Coords> = { x: 1, y: 2 }
  const rename = new UndoableRenameProperty(
    target,
    'x',
    'z'
  )
  describe("redo", () => {
    test("should change to new property", () => {
      rename.redo()
      expect(target).toEqual({ y: 2, z: 1 })
    })
  })
  describe("undo", () => {
    test("if value is overwritten, restore it", () => {
      const overwrite = new UndoableRenameProperty(
        target,
        'z',
        'y'
      )
      overwrite.redo()
      expect(target).toEqual({ y: 1 })
      overwrite.undo()
      expect(target).toEqual({ y: 2, z: 1 })
    })
    test("should change back to previous value", () => {
      rename.undo()
      expect(target).toEqual({ x: 1, y: 2 })
    })
  })
})

describe("UndoableRecordHandler", () => {
  const capturedActions: UndoableAction[] = []
  const captureAction = (action: UndoableAction) => capturedActions.push(action)
  const handler = new UndoableRecordHandler(captureAction)
  const coords: Partial<Coords> = {}
  const coordProxy = new Proxy(coords, handler)
  test("should report property assignment", () => {
    capturedActions.length = 0
    coordProxy.x = 2
    expect(coords.x).toBe(2)
    expect(capturedActions).toMatchObject([
      {
        key: 'x',
        previousValue: undefined,
        nextValue: 2
      }
    ])
  })
  test("should report property deletion", () => {
    capturedActions.length = 0
    delete coordProxy.x
    expect(coords).not.toHaveProperty('x')
    expect(capturedActions.length).toBe(1)
    expect(capturedActions).toMatchObject([
      {
        key: 'x',
        previousValue: 2
      }
    ])
  })
  test("should allow access to the original array via symbol", () => {
    expect(coordProxy[PROXY_TARGET]).toBe(coords)
  })
  test("should allow access to the handler via symbol", () => {
    expect(coordProxy[PROXY_HANDLER]).toBe(handler)
  })
  test("should allow for property rename via symbol", () => {
    coordProxy.x = 1
    capturedActions.length = 0
    expect(APPLY_UNDOABLE_ACTION in coordProxy).toBe(true)
    coordProxy[APPLY_UNDOABLE_ACTION](
      new UndoableRenameProperty(
        coordProxy[PROXY_TARGET],
        'x',
        'y'
      )
    )
    expect(coords).not.toHaveProperty('x')
    expect(coords.y).toBe(1)
    expect(capturedActions).toMatchObject([
      {
        previousKey: 'x',
        nextKey: 'y'
      }
    ])
  })
  test("should allow for property copy via utility functions", () => {
    coordProxy.x = 1
    capturedActions.length = 0
    applyUndoableActionVia(
      coordProxy,
      new UndoableCopyPropertyFrom(
        unwrapProxyTarget(coordProxy),
        'x',
        { x: 2 }
      )
    )
    expect(coords.x).toBe(2)
    expect(capturedActions).toMatchObject([
      {
        key: 'x'
      }
    ])
  })
  test("should allow deleting copied property", () => {
    coordProxy.x = 1
    capturedActions.length = 0
    applyUndoableActionVia(
      coordProxy,
      new UndoableCopyPropertyFrom(
        unwrapProxyTarget(coordProxy),
        'x',
        {}
      )
    )
    expect(coords).not.toHaveProperty('x')
    expect(capturedActions).toMatchObject([
      {
        key: 'x'
      }
    ])
  })
  const deepHandler = new UndoableRecordHandler(captureAction, true)
  test("if deep should report nested changes", () => {
    capturedActions.length = 0
    const proxy = new Proxy(
      {
        digits: [1, 2]
      },
      deepHandler
    )
    proxy.digits[0] = 0
    expect(proxy.digits[0]).toBe(0)
    expect(capturedActions).toMatchObject([
      {
        index: 0,
        previousValue: 1,
        nextValue: 0
      }
    ])
  })
  test("deep handlers should report date changes", () => {
    capturedActions.length = 0
    const proxy = new Proxy(
      {
        date: new Date()
      },
      deepHandler
    )
    proxy.date.setFullYear(1999)
    expect(proxy.date.getFullYear()).toBe(1999)
    expect(capturedActions).toMatchObject([
      {
        values: [1999]
      }
    ])
  })
  test("deep handlers should report set changes", () => {
    capturedActions.length = 0
    const proxy = new Proxy(
      {
        values: new Set<number>()
      },
      deepHandler
    )
    proxy.values.add(1)
    expect(proxy.values.has(1)).toBe(true)
    expect(capturedActions).toMatchObject([
      {
        value: 1
      }
    ])
  })
  test("deep handlers should report map changes", () => {
    capturedActions.length = 0
    const proxy = new Proxy(
      {
        values: new Map<string, number>()
      },
      deepHandler
    )
    proxy.values.set('x', 1)
    expect(proxy.values.get('x')).toBe(1)
    expect(capturedActions).toMatchObject([
      {
        key: 'x',
        nextValue: 1
      }
    ])
  })
})

describe("UndoableTransformation", () => {
  const capturedActions: UndoableAction[] = []
  const captureAction = (action: UndoableAction) => capturedActions.push(action)
  const handler = new UndoableRecordHandler(captureAction)
  const coords: Partial<Coords> = { x: 1, y: 2}
  const coordProxy = new Proxy(coords, handler)
  const action = new UndoableTransformation(
    coordProxy,
    (value: Partial<Coords>) => {
      const t = value.x
      value.x = value.y
      value.y = t
    }
  )
  describe("redo", () => {
    test("should pack multiple sub actions into a single action", () => {
      applyUndoableActionVia(coordProxy, action)
      expect(coords).toEqual({ x: 2, y: 1 })
      expect(capturedActions.length).toBe(1)
      expect(action.steps.length).toBe(2)
    })
  })
  describe("undo", () => {
    test("should revert target's state", () => {
      action.undo()
      expect(coords).toEqual({ x: 1, y: 2 })
    })
  })
})
