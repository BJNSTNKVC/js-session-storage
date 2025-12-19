# SessionStorage

A class that provides a set of methods for interacting with the browser's session storage.

## Installation & setup

### NPM

You can install the package via npm:

```bash
npm install @bjnstnkvc/session-storage
````

and then import it into your project

```javascript
import { SessionStorage } from '@bjnstnkvc/session-storage';
```

### CDN

You can install the package via jsDelivr CDN:

```html

<script src="https://cdn.jsdelivr.net/npm/@bjnstnkvc/session-storage/lib/main.min.js"></script>
```

## Usage

### set

Set the value for a given key in the Session Storage.

#### Parameters

- **key** - String containing the name of the key.
- **value** - The value to be stored.

#### Example

```javascript
SessionStorage.set('key', 'value'); 
```

### get

Retrieve the value associated with the given key from the Session Storage.

#### Parameters

- **key** - String containing the name of the key.
- **fallback** *(optional)* - The fallback value in case the key does not exist. Defaults to `null`.

#### Example

```javascript
SessionStorage.get('key', 'default');
````

You can also pass a closure as the default value. If the specified item is not found in the Session Storage, the closure
will be executed and its result returned.
This allows you to lazily load default values from other sources:

```javascript
SessionStorage.get('key', () => 'default');
````

### remember

Retrieve the value associated with the given key, or execute the given callback and store the result in the Session
Storage.

#### Parameters

- **key** - String containing the name of the key.
- **fallback** - Function you want to execute.

#### Example

```javascript
SessionStorage.remember('key', () => 'default');
````

### all

Retrieve an array containing all keys and their associated values stored in the Session Storage.

#### Example

```javascript
SessionStorage.all();
```

> **Note:** The `all` method returns an array of objects with `key` and `value` properties (e.g. `[{ key: 'key', value: 'value' }]`)


### remove

Remove the key and its associated value from the Session Storage.

#### Parameters

- **key** - String containing the name of the key to be deleted.

#### Example

```javascript
SessionStorage.remove('key');
```

### clear

Clear all keys and their associated values from the Session Storage.

#### Example

```javascript
SessionStorage.clear();
```

### has

Check if a key exists in the Session Storage.

#### Parameters

- **key** - String containing the name of the key to be checked.

#### Example

```javascript
SessionStorage.has('key');
```

### missing

Check if a key does not exist in the Local Storage.

#### Parameters

- **key** - String containing the name of the key to be checked.

#### Example

```javascript
SessionStorage.missing('key');
```

### hasAny

Check if any of the provided keys exist in the Session Storage.

#### Parameters

- **keys** - String or an array of strings containing the names of the keys to be checked.

#### Example

```javascript
SessionStorage.hasAny(['key1', 'key2']);
```

### isEmpty

Check if the Session Storage is empty.

#### Example

```javascript
SessionStorage.isEmpty();
```

### isNotEmpty

Check if the Session Storage is not empty.

#### Example

```javascript
SessionStorage.isNotEmpty();
```

### keys

Retrieve an array containing all keys stored in the Session Storage.

#### Example

```javascript
SessionStorage.keys();
```

### count

Retrieve the total number of items stored in the Session Storage.

#### Example

```javascript
SessionStorage.count();
```

### dump

Print the value associated with a key to the console.

#### Parameters

- **key** - String containing the name of the key.

#### Example

```javascript
SessionStorage.dump('key');
```


### fake

Replace the Session Storage instance with a fake implementation. This is particularly useful for testing purposes where you want to avoid interacting with the actual browser's Session Storage.

#### Example

```javascript
SessionStorage.fake();
```

### restore

Restore the original Session Storage instance. This is typically used after [fake()](#fake) to return to using the real browser's Session Storage.

#### Example

```javascript
SessionStorage.restore();
```

### isFake

Check if a fake Session Storage instance is currently being used.

#### Example

```javascript
if (SessionStorage.isFake()) {
    // ...
}
```

## Events

In case you would like to execute a callback on Local Storage operation, you may listen for various events dispatched by
the Local Storage.

| Type            | Event           |
|-----------------|-----------------|
| `retrieving`    | RetrievingKey   |
| `hit`           | KeyHit          |
| `missed`        | KeyMissed       |
| `writing`       | WritingKey      |
| `written`       | KeyWritten      |
| `write-failed`  | KeyWriteFailed  |
| `forgot`        | KeyForgotten    |
| `forgot-failed` | KeyForgotFailed |
| `flushing`      | StorageFlushing |
| `flushed`       | StorageFlushed  |

### listen

Register an event listener for one or more storage events.

#### Parameters

- **events** - String or an object of strings containing the type and a callback function.
- **callback** - Function to be executed when the event is dispatched in case an event is passed as a string.

#### Example

```javascript
SessionStorage.listen('retrieving', (event) => {
    console.log(event);
});
```

In case you would like to register multiple events, you can pass an object containing the type and a callback function:

```javascript
SessionStorage.listen({
    'retrieving': (event) => {
        // ...
    },
    'hit': (event) => {
        // ...
    },
    'missed': (event) => {
        // ...
    },
    'writing': (event) => {
        // ...
    },
    'written': (event) => {
        // ...
    },
    'write-failed': (event) => {
        // ...
    },
    'forgot': (event) => {
        // ...
    },
    'forgot-failed': (event) => {
        // ...
    },
    'flushing': (event) => {
        // ...
    },
    'flushed': (event) => {
        // ...
    },
});
```

Conveniently, you can also use the following methods to register event listeners for a specific event:

### onRetrieving

Triggered when a key is about to be retrieved from storage.

```javascript
SessionStorage.onRetrieving((event) => {
  // ...
});
```

### onHit

Triggered when a requested key is found in the storage.

```javascript
SessionStorage.onHit((event) => {
  // ...
});
```

### onMissed

Triggered when a requested key is not found in the storage.

```javascript
SessionStorage.onMissed((event) => {
  // ...
});
```

### onWriting

Triggered when a key is about to be written to storage.

```javascript
SessionStorage.onWriting((event) => {
  // ...
});
```

### onWritten

Triggered after a key has been successfully written to storage.

```javascript
SessionStorage.onWritten((event) => {
  // ...
});
```

### onWriteFailed

Triggered when writing a key to storage fails.

```javascript
SessionStorage.onWriteFailed((event) => {
  // ...
});
```

### onForgot

Triggered when a key is successfully removed from storage.

```javascript
SessionStorage.onForgot((event) => {
  // ...
});
```

### onForgotFailed

Triggered when removing a key from storage fails.

```javascript
SessionStorage.onForgotFailed((event) => {
  // ...
});
```

### onFlushing

Triggered when the storage is about to be cleared.

```javascript
SessionStorage.onFlushing((event) => {
  // ...
});
```

### onFlushed

Triggered after the storage has been successfully cleared.

```javascript
SessionStorage.onFlushed((event) => {
    // ...
});
```
