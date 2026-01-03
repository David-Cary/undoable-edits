import {
  UndoableAction,
  UndoableMapHandler
} from "../src/index"

describe("UndoableMapHandler", () => {
  const capturedActions: UndoableAction[] = []
  const captureAction = (action: UndoableAction) => capturedActions.push(action)
  const handler = new UndoableMapHandler(captureAction)
  const nums = new Map<string, number>([
    ['x', 1],
    ['y', 2]
  ])
  const proxy = new Proxy(nums, handler)
  test("should report setting values", () => {
    capturedActions.length = 0
    proxy.set('z', 3)
    expect(proxy.get('z')).toBe(3)
    expect(capturedActions).toMatchObject([
      {
        values: ['z', 3]
      }
    ])
    capturedActions[0]?.undo()
    expect(proxy.has('z')).toBe(false)
  })
  test("should report removing items", () => {
    capturedActions.length = 0
    proxy.delete('x')
    expect(proxy.has('x')).toBe(false)
    expect(capturedActions).toMatchObject([
      {
        values: ['x']
      }
    ])
    capturedActions[0]?.undo()
    expect(proxy.has('x')).toBe(true)
  })
  test("should report clearing items", () => {
    capturedActions.length = 0
    proxy.clear()
    expect(proxy.size).toBe(0)
    expect(capturedActions).toMatchObject([
      {
        values: []
      }
    ])
    capturedActions[0]?.undo()
    expect(proxy.size).toBe(2)
  })
})