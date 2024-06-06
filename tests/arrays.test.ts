import {
  UndoableAction,
  UndoableSetItemAt,
  UndoableArrayResize,
  UndoableSplice,
  UndoablePushItems,
  UndoablePopItem,
  UndoableShiftItem,
  UndoableUnshiftItems,
  UndoableCopyWithin,
  UndoableFill,
  UndoableReverse,
  UndoableSort,
  UndoableArrayHandler,
  UndoableActionSequence,
  UndoableTransferItem,
  createUndoableProxy,
  APPLY_UNDOABLE_ACTION,
  PROXY_TARGET
} from "../src/index"

describe("UndoableSetItemAt", () => {
  const target: number[] = [0]
  const action = new UndoableSetItemAt(
    target,
    2,
    1
  )
  describe("redo", () => {
    test("should populate the array", () => {
      action.redo()
      expect(target).toEqual([0, undefined, 1])
    })
  })
  describe("undo", () => {
    test("should reset the array", () => {
      action.undo()
      expect(target).toEqual([0])
    })
  })
})

describe("UndoableArrayResize", () => {
  const target: number[] = [1, 2, 3]
  const trim = new UndoableArrayResize(
    target,
    1
  )
  let expand: UndoableArrayResize
  describe("redo", () => {
    test("should trim items as needed", () => {
      trim.redo()
      expect(target).toEqual([1])
    })
    expand = new UndoableArrayResize(
      target,
      4
    )
    test("should expand to target length", () => {
      expand.redo()
      expect(target).toEqual([1, undefined, undefined, undefined])
    })
  })
  describe("undo", () => {
    test("should undo expansion", () => {
      expand.redo()
      expect(target).toEqual([1])
    })
    test("should restore trimmed items", () => {
      trim.undo()
      expect(target).toEqual([1, 2, 3])
    })
  })
})

describe("UndoableSplice", () => {
  const target: number[] = [1, 2, 3]
  const action = new UndoableSplice(
    target,
    1,
    1,
    4,
    5
  )
  describe("redo", () => {
    test("should delete and insert", () => {
      action.redo()
      expect(target).toEqual([1, 4, 5, 3])
    })
  })
  describe("undo", () => {
    test("should restore deletion and remove insertions", () => {
      action.undo()
      expect(target).toEqual([1, 2, 3])
    })
  })
})

describe("UndoablePushItems", () => {
  const target: number[] = [1, 2]
  const action = new UndoablePushItems(
    target,
    0
  )
  describe("redo", () => {
    test("should append the target item", () => {
      action.redo()
      expect(target).toEqual([1, 2, 0])
    })
  })
  describe("undo", () => {
    test("should remove the value", () => {
      action.undo()
      expect(target).toEqual([1, 2])
    })
  })
})

describe("UndoablePopItem", () => {
  const target: number[] = [1, 2, 3]
  const action = new UndoablePopItem(target)
  describe("redo", () => {
    test("should remove the target item", () => {
      action.redo()
      expect(target).toEqual([1, 2])
    })
  })
  describe("undo", () => {
    test("should restore the value", () => {
      action.undo()
      expect(target).toEqual([1, 2, 3])
    })
  })
})


describe("UndoableUnshiftItems", () => {
  const target: number[] = [1, 2]
  const action = new UndoableUnshiftItems(
    target,
    0
  )
  describe("redo", () => {
    test("should prepend the target item", () => {
      action.redo()
      expect(target).toEqual([0, 1, 2])
    })
  })
  describe("undo", () => {
    test("should remove the value", () => {
      action.undo()
      expect(target).toEqual([1, 2])
    })
  })
})

describe("UndoableShiftItem", () => {
  const target: number[] = [1, 2, 3]
  const action = new UndoableShiftItem(target)
  describe("redo", () => {
    test("should remove the target item", () => {
      action.redo()
      expect(target).toEqual([2, 3])
    })
  })
  describe("undo", () => {
    test("should restore the value", () => {
      action.undo()
      expect(target).toEqual([1, 2, 3])
    })
  })
})

describe("UndoableCopyWithin", () => {
  const target: number[] = [1, 2, 3, 4, 5]
  const action = new UndoableCopyWithin(
    target,
    3,
    1,
    3
  )
  describe("redo", () => {
    test("should paste a copy of the target items", () => {
      action.redo()
      expect(target).toEqual([1, 2, 3, 2, 3])
    })
  })
  describe("undo", () => {
    test("should restore the overwritten values", () => {
      action.undo()
      expect(target).toEqual([1, 2, 3, 4, 5])
    })
  })
})

describe("UndoableFill", () => {
  const target: number[] = [1, 2, 3, 4, 5]
  const action = new UndoableFill(
    target,
    0,
    1,
    3
  )
  describe("redo", () => {
    test("should populate the array", () => {
      action.redo()
      expect(target).toEqual([1, 0, 0, 4, 5])
    })
  })
  describe("undo", () => {
    test("should restore the overwritten values", () => {
      action.undo()
      expect(target).toEqual([1, 2, 3, 4, 5])
    })
  })
})

describe("UndoableReverse", () => {
  const target: number[] = [1, 2, 3]
  const action = new UndoableReverse(target)
  describe("redo", () => {
    test("should put items in reverse order", () => {
      action.redo()
      expect(target).toEqual([3, 2, 1])
    })
  })
  describe("undo", () => {
    test("should return items to original order", () => {
      action.undo()
      expect(target).toEqual([1, 2, 3])
    })
  })
})

describe("UndoableSort", () => {
  const target: number[] = [2, 1, 3]
  const action = new UndoableSort(
    target,
    (a: number, b: number) => a - b
  )
  describe("redo", () => {
    test("should put items in order", () => {
      action.redo()
      expect(target).toEqual([1, 2, 3])
    })
  })
  describe("undo", () => {
    test("should revert to unordered state", () => {
      action.undo()
      expect(target).toEqual([2, 1, 3])
    })
  })
})

describe("UndoableTransferItem", () => {
  const nums = [1, 2, 3, 4, 5]
  const moveAhead = new UndoableTransferItem(
    {
      source: nums,
      index: 1
    },
    {
      source: nums,
      index: 3
    }
  )
  const moveBack = new UndoableTransferItem(
    {
      source: nums,
      index: 2
    },
    {
      source: nums,
      index: 1
    }
  )
  const negBack = new UndoableTransferItem(
    {
      source: nums,
      index: -1
    },
    {
      source: nums,
      index: -2
    }
  )
  const listA = ['a1', 'a2', 'a3']
  const listB = ['b1', 'b2', 'b3']
  const transfer = new UndoableTransferItem(
    {
      source: listA,
      index: 1
    },
    {
      source: listB,
      index: 2
    }
  )
  describe("redo", () => {
    test("should support moving items forward", () => {
      moveAhead.redo()
      expect(nums).toEqual([1, 3, 4, 2, 5])
    })
    test("should support moving items backward", () => {
      moveBack.redo()
      expect(nums).toEqual([1, 4, 3, 2, 5])
    })
    test("should support negative indices", () => {
      negBack.redo()
      expect(nums).toEqual([1, 4, 3, 5, 2])
    })
    test("should transfer between lists", () => {
      transfer.redo()
      expect(listA).toEqual(['a1', 'a3'])
      expect(listB).toEqual(['b1', 'b2', 'a2', 'b3'])
    })
  })
  describe("undo", () => {
    test("should revert negative index move", () => {
      negBack.undo()
      expect(nums).toEqual([1, 4, 3, 2, 5])
    })
    test("should revert backwards move", () => {
      moveBack.undo()
      expect(nums).toEqual([1, 3, 4, 2, 5])
    })
    test("should revert forwards move", () => {
      moveAhead.undo()
      expect(nums).toEqual([1, 2, 3, 4, 5])
    })
    test("should return item to orginal list", () => {
      transfer.undo()
      expect(listA).toEqual(['a1', 'a2', 'a3'])
      expect(listB).toEqual(['b1', 'b2', 'b3'])
    })
  })
})

describe("UndoableRecordHandler", () => {
  const capturedActions: UndoableAction[] = []
  const captureAction = (action: UndoableAction) => capturedActions.push(action)
  const handler = new UndoableArrayHandler(captureAction)
  test("should report indexed changes", () => {
    capturedActions.length = 0
    const proxy = new Proxy([], handler)
    proxy[0] = 1
    expect(capturedActions).toMatchObject([
      {
        index: 0,
        nextValue: 1
      }
    ])
  })
  test("should report length changes", () => {
    capturedActions.length = 0
    const proxy = new Proxy([], handler)
    proxy.length = 1
    expect(capturedActions).toMatchObject([
      {
        length: 1
      }
    ])
  })
  test("should report pushes", () => {
    capturedActions.length = 0
    const proxy = new Proxy([], handler)
    proxy.push(1)
    expect(capturedActions).toMatchObject([
      {
        values: [1]
      }
    ])
    capturedActions[0]?.undo()
    expect(capturedActions.length).toBe(1)
    expect(proxy.length).toBe(0)
  })
  test("should report pops", () => {
    capturedActions.length = 0
    const proxy = new Proxy([1], handler)
    proxy.pop()
    expect(capturedActions.length).toBe(1)
    capturedActions[0]?.undo()
    expect(capturedActions.length).toBe(1)
    expect(proxy.length).toBe(1)
  })
  test("should report unshifts", () => {
    capturedActions.length = 0
    const proxy = new Proxy([], handler)
    proxy.unshift(1)
    expect(capturedActions).toMatchObject([
      {
        values: [1]
      }
    ])
    capturedActions[0]?.undo()
    expect(capturedActions.length).toBe(1)
    expect(proxy.length).toBe(0)
  })
  test("should report splices", () => {
    capturedActions.length = 0
    const proxy = new Proxy([1, 2, 3], handler)
    proxy.splice(1, 2, 4)
    expect(capturedActions).toMatchObject([
      {
        start: 1,
        deletions: [2, 3],
        insertions: [4]
      }
    ])
  })
  test("should report reverse", () => {
    capturedActions.length = 0
    const proxy = new Proxy([1, 2], handler)
    proxy.reverse()
    expect(capturedActions.length).toBe(1)
  })
  test("should report copy within", () => {
    capturedActions.length = 0
    const proxy = new Proxy([1, 2, 3], handler)
    proxy.copyWithin(2, 0)
    expect(capturedActions).toMatchObject([
      {
        destination: 2,
        start: 0
      }
    ])
  })
  test("should report fill", () => {
    capturedActions.length = 0
    const proxy = new Proxy([1, 2], handler)
    proxy.fill(0, 1)
    expect(capturedActions).toMatchObject([
      {
        value: 0,
        start: 1
      }
    ])
  })
  test("should report reverse", () => {
    capturedActions.length = 0
    const proxy = new Proxy([1, 2], handler)
    proxy.reverse()
    expect(capturedActions.length).toBe(1)
  })
  test("should allow access to the original array via symbol", () => {
    const nums = [1]
    const proxy = createUndoableProxy(nums, handler)
    expect(proxy[PROXY_TARGET]).toBe(nums)
  })
  test("should allow custom changes via symbol", () => {
    capturedActions.length = 0
    const proxy = createUndoableProxy([1], handler)
    const target = proxy[PROXY_TARGET]
    proxy[APPLY_UNDOABLE_ACTION](
      new UndoableActionSequence([
          new UndoablePushItems(target, 0),
          new UndoableUnshiftItems(target, 0),
      ])
    )
    expect(capturedActions).toMatchObject([
      {
        steps: [
          {
            values: [0]
          },
          {
            values: [0]
          }
        ]
      }
    ])
    expect(proxy).toEqual([0, 1, 0])
    capturedActions[0]?.undo()
    expect(proxy).toEqual([1])
  })
})