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