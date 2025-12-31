import {
  UndoableJSONPatch
} from "../src/index"

describe("UndoableJSONPatch", () => {
  it("should support add operation", () => {
    const target = {
      text: ['a', 'b']
    }
    const action = new UndoableJSONPatch(
      target,
      [{ op: 'add', path: '/text/1', value: '-'}]
    )
    action.redo()
    expect(target.text).toEqual(['a', '-', 'b'])
  })
  it("should append with a key of '-'", () => {
    const target = {
      text: ['a', 'b']
    }
    const action = new UndoableJSONPatch(
      target,
      [{ op: 'add', path: '/text/-', value: 'c'}]
    )
    action.redo()
    expect(target.text).toEqual(['a', 'b', 'c'])
  })
  it("should support copy operation", () => {
    const target = {
      codes: [{id: 1}],
      text: ['a', 'b']
    }
    const action = new UndoableJSONPatch(
      target,
      [{ op: 'copy', from: '/codes/0', path: '/text/2'}]
    )
    action.redo()
    expect(target).toEqual({
      codes: [{id: 1}],
      text: ['a', 'b', {id: 1}]
    })
  })
  it("should support move operation", () => {
    const target = {
      codes: [{id: 1}],
      text: ['a', 'b']
    }
    const action = new UndoableJSONPatch(
      target,
      [{ op: 'move', from: '/codes/0', path: '/text/2'}]
    )
    action.redo()
    expect(target).toEqual({
      codes: [],
      text: ['a', 'b', {id: 1}]
    })
  })
  it("should support remove operation", () => {
    const target = {
      text: ['a', 'b']
    }
    const action = new UndoableJSONPatch(
      target,
      [{ op: 'remove', path: '/text/1', value: '-'}]
    )
    action.redo()
    expect(target.text).toEqual(['a'])
  })
  it("should support replace operation", () => {
    const target = {
      text: ['a', 'b']
    }
    const action = new UndoableJSONPatch(
      target,
      [{ op: 'replace', path: '/text/1', value: 1}]
    )
    action.redo()
    expect(target.text).toEqual(['a', 1])
  })
})