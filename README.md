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

As of 1.2.0, you create `UndoableTransformation` actions by providing a target and a callback to be peformed on that target.  Said action will apply that callback and generate a list of subactions for that callback when redo is called.  That subaction list will then be used by the undo function of the action.  This gives the benefit of the above action sequence action, letting you trade having to manually specify steps for the overhead of a nested proxy to generate those for you.

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
 - `actionCallbacks`: Each time the object is modified via proxy the resulting undoable action or actions will get passed on to this function.
 - `proxyFactory`: Lets you provide an `ProxyFactory` for wrapping property values and returns in their own proxies.  If "true" is passed in this will create a `ClassedUndoableProxyFactory` for the handler.
 - `propertyGetters`: Lets you provide a map that specifies the callback function the proxy's get function will use for key properties.
 
Prior to version 1.2.0, the 1st parameter could only be a single action, the 2nd could only be a boolean, and there was no 3rd parameter.

Prior to 1.1.0 the constructor accepted an `arrayHandler` property in place of a proxy factory.

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

### Other Proxies

The library currently provided proxy handlers for arrays (UndoableArrayHandler), dates (UndoableDateHandler), maps (UndoableMapHandler), and sets (UndoableSetHandler).  Each of these work much like the above `UndoableRecordHandler`.  Prior to 1.2.0 they took an optional property handler factory in place of the `deep` parameter, but that has since been standardized.

Should you create your own UndoableProxyHandler subclass to deal with a particular type of object you ensure it's supported by default in all new classed proxy factories like so:
```
ClassedUndoableProxyFactory.defaultHandlerClasses.set(Set.prototype, UndoableSetHandler)
```

That associates the new class with the target prototype.  When a new classed proxy factory is asked to create a proxy it will them use the provided class on any object with the provided prototype in it's prototype chain.

As of 1.2.0 you can also call that class's `createProxyUsing` static function to generate a proxy with needing to provide a matching handler, like so:
```
const actions: UndoableAction[] = []
const proxy = ClassedUndoableProxyFactory.createProxyUsing(
  source,
  (action) => { actions.push(action) }
)    
```

## Action Tracks

Version 1.2.0 adds the `UndoableActionTrack` class.  These maintain a history of performed and undone action, allowing you to undo the last change or redo the last undone change.

To use this track, simply call `add` when a new action is performed, `undo` when you want to roll back that action, and `redo` if you want to reverse said roll back and reapply the change.  You can also use `clear` to wipe the track's action history.

If you want to automate adding those changes for an object, you can use the `PropertyChangeTracker` class.  That will create a proxy for the target object and add any changes reported by that proxy to the tracker's action track.

Here's an example of how you might use that:
```
const coord = { x: 0, y: 0 }
const tracker = new PropertyChangeTracker(coord)
tracker.proxy.x = 1
tracker.track.undo()
```

Note that as of 1.2.3 property change trackers have been made a subclass of `UndoableProxyListener`.  Said listeners let you specify a callback to be attached to the proxy handlers action callbacks set.  Changing either the proxy or callback will clean up the old connect and attach the new callback to the new proxy.