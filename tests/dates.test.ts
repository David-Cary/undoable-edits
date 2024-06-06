import {
  UndoableAction,
  UndoableDateHandler
} from "../src/index"

describe("UndoableDateHandler", () => {
  const capturedActions: UndoableAction[] = []
  const captureAction = (action: UndoableAction) => capturedActions.push(action)
  const handler = new UndoableDateHandler(captureAction)
  const date = new Date()
  const timestamp = date.getTime()
  const dateProxy = new Proxy(date, handler)
  test("should report day of month change", () => {
    capturedActions.length = 0
    dateProxy.setDate(4)
    expect(dateProxy.getDate()).toBe(4)
    expect(capturedActions).toMatchObject([
      {
        value: 4
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report setFullYear", () => {
    capturedActions.length = 0
    dateProxy.setFullYear(1999)
    expect(dateProxy.getFullYear()).toBe(1999)
    expect(capturedActions).toMatchObject([
      {
        values: [1999]
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report setHours", () => {
    capturedActions.length = 0
    dateProxy.setHours(11)
    expect(dateProxy.getHours()).toBe(11)
    expect(capturedActions).toMatchObject([
      {
        values: [11]
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report setMilliseconds", () => {
    capturedActions.length = 0
    dateProxy.setMilliseconds(110)
    expect(dateProxy.getMilliseconds()).toBe(110)
    expect(capturedActions).toMatchObject([
      {
        value: 110
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report setMinutes", () => {
    capturedActions.length = 0
    dateProxy.setMinutes(11)
    expect(dateProxy.getMinutes()).toBe(11)
    expect(capturedActions).toMatchObject([
      {
        values: [11]
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report setMonth", () => {
    capturedActions.length = 0
    dateProxy.setMonth(11)
    expect(dateProxy.getMonth()).toBe(11)
    expect(capturedActions).toMatchObject([
      {
        values: [11]
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report setSeconds", () => {
    capturedActions.length = 0
    dateProxy.setSeconds(11)
    expect(dateProxy.getSeconds()).toBe(11)
    expect(capturedActions).toMatchObject([
      {
        values: [11]
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report setTime", () => {
    capturedActions.length = 0
    dateProxy.setTime(11)
    expect(dateProxy.getTime()).toBe(11)
    expect(capturedActions).toMatchObject([
      {
        value: 11
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report UTC day of month change", () => {
    capturedActions.length = 0
    dateProxy.setUTCDate(4)
    expect(dateProxy.getUTCDate()).toBe(4)
    expect(capturedActions).toMatchObject([
      {
        value: 4
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report setUTCFullYear", () => {
    capturedActions.length = 0
    dateProxy.setUTCFullYear(1999)
    expect(dateProxy.getUTCFullYear()).toBe(1999)
    expect(capturedActions).toMatchObject([
      {
        values: [1999]
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report setUTCHours", () => {
    capturedActions.length = 0
    dateProxy.setUTCHours(11)
    expect(dateProxy.getUTCHours()).toBe(11)
    expect(capturedActions).toMatchObject([
      {
        values: [11]
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report setUTCMilliseconds", () => {
    capturedActions.length = 0
    dateProxy.setUTCMilliseconds(110)
    expect(dateProxy.getUTCMilliseconds()).toBe(110)
    expect(capturedActions).toMatchObject([
      {
        value: 110
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report setUTCMinutes", () => {
    capturedActions.length = 0
    dateProxy.setUTCMinutes(11)
    expect(dateProxy.getUTCMinutes()).toBe(11)
    expect(capturedActions).toMatchObject([
      {
        values: [11]
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report setUTCMonth", () => {
    capturedActions.length = 0
    dateProxy.setUTCMonth(11)
    expect(dateProxy.getUTCMonth()).toBe(11)
    expect(capturedActions).toMatchObject([
      {
        values: [11]
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
  test("should report setUTCSeconds", () => {
    capturedActions.length = 0
    dateProxy.setUTCSeconds(11)
    expect(dateProxy.getUTCSeconds()).toBe(11)
    expect(capturedActions).toMatchObject([
      {
        values: [11]
      }
    ])
    capturedActions[0]?.undo()
    expect(dateProxy.getTime()).toBe(timestamp)
  })
})