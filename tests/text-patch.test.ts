import {
  PatchedTextSequence,
  UndoableApplyDiffTuples,
  UndoableTextPatch,
  applyTextPatch,
  createTextPatchFromDiffTuples
} from "../src/index"

describe("applyTextPatch", () => {
  it("should replace the targetted text segments", () => {
    const result = applyTextPatch(
      "can of red paint",
      [7, [3, "blue"]]
    )
    expect(result).toBe("can of blue paint")
  })
})

describe("PatchedTextSequence", () => {
  it("should split replacement segments into string pairs", () => {
    const sequence = PatchedTextSequence.fromPatch(
      "can of red paint",
      [7, [3, "blue"]]
    )
    expect(sequence.segments).toEqual([
      "can of ",
      ["red", "blue"],
      " paint"
    ])
    expect(sequence.originalText).toEqual("can of red paint")
    expect(sequence.patchedText).toEqual("can of blue paint")
  })
})

describe("UndoableTextPatch", () => {
  const target = {
    text: "tree house"
  }
  const nameHouse = new UndoableTextPatch(
    target,
    'text',
    [[1, "T"], 2, [1, "nt's"]]
  )
  describe("redo", () => {
    it("should replace text segments", () => {
      nameHouse.redo()
      expect(target.text).toEqual("Trent's house")
    })
  })
  describe("undo", () => {
    it("should revert to original text", () => {
      nameHouse.undo()
      expect(target.text).toEqual("tree house")
    })
  })
})

describe("createTextPatchFromDiffTuples", () => {
  it("should handle deletions", () => {
    const patch = createTextPatchFromDiffTuples(
      [
        [0, "can of "],
        [-1, "red"],
        [0, "paint"]
      ]
    )
    expect(patch).toEqual([7, [3, ""]])
  })
  it("should handle insertions", () => {
    const patch = createTextPatchFromDiffTuples(
      [
        [0, "can of "],
        [1, "blue"],
        [0, "paint"]
      ]
    )
    expect(patch).toEqual([7, [0, "blue"]])
  })
  it("should handle replacements", () => {
    const patch = createTextPatchFromDiffTuples(
      [
        [0, "can of "],
        [-1, "red"],
        [1, "blue"],
        [0, "paint"]
      ]
    )
    expect(patch).toEqual([7, [3, "blue"]])
  })
  it("should handle changes at end of text", () => {
    const patch = createTextPatchFromDiffTuples(
      [
        [0, "my "],
        [-1, "sock"],
        [1, "shoe"],
      ]
    )
    expect(patch).toEqual([3, [4, "shoe"]])
  })
})

describe("UndoableApplyDiffTuples", () => {
  const target = {
    text: "tree house"
  }
  const nameHouse = new UndoableApplyDiffTuples(
    target,
    'text',
    [[-1, "t"], [1, "T"], [0, "re"], [-1, "e"], [1, "nt's"], [0, " house"]]
  )
  describe("redo", () => {
    it("should replace text segments", () => {
      nameHouse.redo()
      expect(target.text).toEqual("Trent's house")
    })
  })
  describe("undo", () => {
    it("should revert to original text", () => {
      nameHouse.undo()
      expect(target.text).toEqual("tree house")
    })
  })
})