import {
  UndoableCopyValue,
  UndoableDeleteNestedValue,
  UndoableInsertNestedValue,
  UndoableSetNestedValue,
  UndoableTransferValue
} from "../src/index"

describe("UndoableSetNestedValue", () => {
  const target = {
    items: [
      { name: "hat" },
      { name: "tie" }
    ]
  }
  const renameHat = new UndoableSetNestedValue(
    target,
    ['items', 0, 'name'],
    "tophat"
  )
  const replaceTie = new UndoableSetNestedValue(
    target,
    ['items', 1],
    { name: "belt" }
  )
  const populateRing = new UndoableSetNestedValue(
    target,
    ['items', 2, "name"],
    "ring",
    true
  )
  describe("redo", () => {
    test("should apply nested property change", () => {
      renameHat.redo()
      expect(target.items[0].name).toEqual("tophat")
    })
    test("should apply item replacement", () => {
      replaceTie.redo()
      expect(target.items[1].name).toEqual("belt")
    })
    test("should wrap values if populate is true", () => {
      populateRing.redo()
      expect(target.items[2].name).toEqual("ring")
    })
  })
  describe("undo", () => {
    test("should remove populated values", () => {
      populateRing.undo()
      expect(target.items[2]).toEqual(undefined)
    })
    test("should revery item replacement", () => {
      replaceTie.undo()
      expect(target.items[1].name).toEqual("tie")
    })
    test("should revert nested property change", () => {
      renameHat.undo()
      expect(target.items[0].name).toEqual("hat")
    })
  })
})

describe("UndoableInsertNestedValue", () => {
  const target = {
    text: ["a", "b"]
  }
  const injectDash = new UndoableInsertNestedValue(
    target,
    ["text", 1],
    "-"
  )
  describe("redo", () => {
    test("should insert provided text", () => {
      injectDash.redo()
      expect(target.text).toEqual(["a", "-", "b"])
    })
  })
  describe("undo", () => {
    test("should remove injected text", () => {
      injectDash.undo()
      expect(target.text).toEqual(["a", "b"])
    })
  })
})

describe("UndoableDeleteNestedValue", () => {
  const target = {
    color: { r: 200, g: 100 },
    text: ["a", "b"]
  }
  const removeGreen = new UndoableDeleteNestedValue(
    target,
    ["color", "g"]
  )
  const removeText = new UndoableDeleteNestedValue(
    target,
    ["text", 0]
  )
  describe("redo", () => {
    test("should remove target text", () => {
      removeText.redo()
      expect(target.text).toEqual(["b"])
    })
    test("should remove target property", () => {
      removeGreen.redo()
      expect(target.color).not.toHaveProperty('g')
    })
  })
  describe("undo", () => {
    test("should restore removed property", () => {
      removeGreen.undo()
      expect(target.color.g).toEqual(100)
    })
    test("should restore removed text", () => {
      removeText.undo()
      expect(target.text).toEqual(["a", "b"])
    })
  })
})

describe("UndoableCopyValue", () => {
  const letters = ['a', 'b']
  const codes = [
    { code: 1 },
    { code: 2 }
  ]
  const copyCode = new UndoableCopyValue(
    { target: codes, key: 0 },
    { target: letters, key: 2 }
  )
  describe("redo", () => {
    test("should insert copy of target value", () => {
      copyCode.redo()
      expect(letters[2]).toEqual(codes[0])
      expect(letters[2]).not.toBe(codes[0])
    })
  })
  describe("undo", () => {
    test("should remove copy", () => {
      copyCode.undo()
      expect(letters[2]).toBe(undefined)
    })
  })
})

describe("UndoableTransferValue", () => {
  const target = {
    color: { r: 200, g: 100 },
    text: ["a", "b"]
  }
  const swapOrder = new UndoableTransferValue(
    { target: target.text, key: 0 },
    { target: target.text, key: 1 }
  )
  const moveRed = new UndoableTransferValue(
    { target: target.color, key: "r" },
    { target: target.text, key: 2 }
  )
  describe("redo", () => {
    test("should allow repositions in same array", () => {
      swapOrder.redo()
      expect(target.text).toEqual(["b", "a"])
    })
    test("should allow move from object to array", () => {
      moveRed.redo()
      expect(target).toEqual({
        color: { g: 100 },
        text: ["b", "a", 200]
      })
    })
  })
  describe("undo", () => {
    test("should revert move from object to array", () => {
      moveRed.undo()
      expect(target).toEqual({
        color: { r: 200, g: 100 },
        text: ["b", "a"]
      })
    })
    test("should revert item position", () => {
      swapOrder.undo()
      expect(target.text).toEqual(["a", "b"])
    })
  })
})