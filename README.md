# Undoable Edits
This library provides support for undoing and redoing certain common object and array changes, including proxies that report and such changes.

# Quickstart
## Installation
You can install this library through npm like so:
```
$ npm install --save undoable-edits
```

## Undoable Actions

Undoable actions provide an "undo" and "redo" function, letting you roll back and apply their effects respectively.  Note that those function have no parameters and return nothing, with the details of the action set in it's constructor.

Note this makes such actions compatible with the [undo manager](https://www.npmjs.com/package/undo-manager) library.

### Object Actions
You can set a property value like so:
```
const target: Record<string, any> = {}
const action = new UndoableSetProperty(
  target,
  'x',
  1
)
action.redo()
```

Should you want to revert to the original value, simply use `action.undo()`.

Deleting properties is similiar, using `UndoableDeleteProperty` with the target object and property to be deleted as the constructor parameters.  Undoing that action will restore the deleted property with the value it had when the property was created.

On the flip side, `UndoableRenameProperty` lets you move a value to a different property and deletes the old property in the process.  The constructor parameters as as per the delete action, with the new property name as the third parameter.  Note that doing so with an existing property will overwrite that value.  Undoing that reverts the value to the original property name, restoring the overwritten value in the process.

Version 1.1.3 adds `UndoableCopyPropertyFrom`, letting you mirror the property of a target object.  This works much like `UndoableSetProperty`, save that it will delete the target property should the source not have said property.

### Array Actions
To set an array element, use `UndoableSetItemAt` instead of `UndoableSetProperty`.  This works much like setting a property, save that it takes an index instead of a key and will revert the arrays length when undone.

If you want to set the length, use `UndoableArrayResize`.  In addition to setting said length, that action will restore any values trimmed by a length reduction when undone.

We're also included undoable versions of array methods that modify said array.  This includes copyWithin (UndoableCopyWithin), fill (UndoableFill), pop (UndoablePopItem), push (UndoablePushItems), reverse (UndoableReverse), shift (UndoableShiftItem), sort (UndoableSort), splice (UndoableSplice), and unshift (UndoableUnshiftItems).  The constructor for each of those uses the same parameters as an the `call` method of the corresponding function.

Should you want support for cut and paste operations, you can use `UndoableTransferItem`.  Doing so takes in pairing of array and index references, like so:
```
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
```

Doing so moves the item at index 1 from list A to index 2 of list B, resulting in `['a1', 'a3']` for list A and `['b1', 'b2', 'a2', 'b3']` for list B.

Note that you can also use this to shift a value forward or backward within an array by using the same array both the source and destination.

### Action Sequences

If you want to package multiple related changes under a single action, you can do so with an `UndoableActionSequence`.  Those take in a list of undoable actions are their sole parameter, executing them in that order on redo.  Undoing the sequence will undo each sub-action in reverse order.  This is especially useful in editors where you might want a single "undo" input to revert multiple changes.

## Proxies

This library also provided proxy support for objects and arrays.  These let will trigger the above actions for you when you modify the target via the proxy.  They also report out said changes so you can capture them for an undo/redo control.

These proxies do have 2 special properties that can be accessed through symbols provided by this library:
 - `PROXY_TARGET` grants you access to the proxied value, letting you unpack it or modify it directly.
 - `APPLY_UNDOABLE_ACTION` execute the redo method of the provided action and send it through the proxies reporting function.

These are usually combined by calling apply undoable action and using the proxy target in said action's constructor.

Alternately, as of version 1.1.3 you can use `unwrapProxyTarget` to get the proxy target and `applyUndoableActionVia` to run an action through the proxy's callback, like so:
```
applyUndoableActionVia(
  coordProxy,
  new UndoableCopyPropertyFrom(
    unwrapProxyTarget(coordProxy),
    'x',
    {}
  )
)
```
This has the added benefit of being able to handle non-proxy objects.  Trying to unwrap a non-proxy simply returns the object and trying to apply via a non-proxy simply triggers the action's redo function.

Note that such proxies can be created by simply creating a new `Proxy` with the appropriate handler, though typescript won't recognize the above properties unless you cast that proxy as an `UndoableProxy`.  `createUndoableProxy` will do that creation and type casting for you, provided you give it an `UndoableProxyHandler` to work with.

### Object Proxies

For non-array objects, use `UndoableRecordHandler` as the proxy handler.  That takes in the following optional constructor parameters:
 - `onChange`: Each time the object is modified via proxy the resulting undoable action will get passed on to this function.
 - `deep`: If set to true attempting to access an object property of the target will result in an undoable proxy of said object.
 
You can use the above special proxy properties to rename the proxied object's properties, like so:
```
const proxy = createUndoableProxy({}, new UndoableRecordHandler())
proxy[APPLY_UNDOABLE_ACTION](
  new UndoableRenameProperty(
    proxy[PROXY_TARGET],
    'x',
    'y'
  )
)
```

Note, prior to 1.1.0 the constructor accepted an `arrayHandler` property.  That has since been replaced by a `propertyHandlerFactory` that gets automatically created if `deep` is set to true.

By default the property handler factory is an instance of `ClassedProxyHandlerFactory` with entries for arrays, dates, maps, and sets.  Should you want support for additional object types you can add those to that factory's `classes` list.

### Other Proxies

The library currently provided proxy handlers for arrays (UndoableArrayHandler), dates (UndoableDateHandler), maps (UndoableMapHandler), and sets (UndoableSetHandler).  Each of these work much like the above `UndoableRecordHandler`, save that they take an optional property handler factory in place of the `deep` parameter.

By default a record handler set to deep proxying will contain an instance of each of the above handlers to deal with the associated value types.
