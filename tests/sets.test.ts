import {
  UndoableAction,
  UndoableSetHandler
} from "../src/index"

describe("UndoableSetHandler", () => {
  const capturedActions: UndoableAction[] = []
  const captureAction = (action: UndoableAction) => capturedActions.push(action)
  const handler = new UndoableSetHandler(captureAction)
  const nums = new Set<number>([1, 2])
  const proxy = new Proxy(nums, handler)
  test("should report adding items", () => {
    capturedActions.length = 0
    proxy.add(3)
    expect(proxy.has(3)).toBe(true)
    expect(capturedActions).toMatchObject([
      {
        value: 3
      }
    ])
    capturedActions[0]?.undo()
    expect(proxy.has(3)).toBe(false)
  })
  test("should report removing items", () => {
    capturedActions.length = 0
    proxy.delete(2)
    expect(proxy.has(2)).toBe(false)
    expect(capturedActions).toMatchObject([
      {
        value: 2
      }
    ])
    capturedActions[0]?.undo()
    expect(proxy.has(2)).toBe(true)
  })
  test("should report clearing items", () => {
    capturedActions.length = 0
    proxy.clear()
    expect(proxy.size).toBe(0)
    expect(capturedActions).toMatchObject([
      {
        target: nums
      }
    ])
    capturedActions[0]?.undo()
    expect(proxy.size).toBe(2)
  })
})