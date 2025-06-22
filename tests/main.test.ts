// @ts-nocheck
require('../src/main');

class Storage {
    /**
     * Create a new Storage object.
     */
    constructor() {
        this.store = {};
    }

    /**
     * Returns an integer representing the number of data items stored in the Storage object.
     *
     * @return { number }
     */
    get length(): number {
        return Object.keys(this.store).length;
    }

    /**
     * When passed a key name, will return that key's value.
     *
     * @param { string } keyName
     * @return { any }
     */
    getItem(keyName: string): string {
        return this.store[keyName] || null;
    }

    /**
     * When passed a key name and value, will add that key to the storage, or update that key's value if it already exists.
     *
     * @param { string } keyName
     * @param { string } keyValue
     */
    setItem(keyName: string, keyValue: string) {
        this.store[keyName] = keyValue;
    }

    /**
     * When passed a key name, will remove that key from the storage.
     *
     * @param { string } keyName
     */
    removeItem(keyName: string) {
        delete this.store[keyName];
    }

    /**
     * When invoked, will empty all keys out of the storage.
     */
    clear() {
        this.store = {};
    }
}

const _global: any = global;

_global.sessionStorage = new Storage;

beforeEach((): void => {
    sessionStorage.clear();
});

describe('SessionStorage.set', (): void => {
    test('sets the key to the Storage object', (): void => {
        SessionStorage.set('$key', '$value');

        const item: SessionStorageItem = JSON.parse(sessionStorage.getItem('$key'));

        expect(item.data).toEqual('$value');
    });

    test('sets the key with a function value to the Storage object', (): void => {
        SessionStorage.set('$key', (): string => '$value');

        const item: SessionStorageItem = JSON.parse(sessionStorage.getItem('$key'));

        expect(item.data).toEqual('$value');
    });
});

describe('SessionStorage.get', (): void => {
    test('returns the value for a key in Storage', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        expect(SessionStorage.get(key)).toEqual(value);
    });

    test('returns fallback value if key does not exist in Storage', (): void => {
        const key: string = '$key';
        const fallback: string = 'fallback';

        expect(SessionStorage.get(key, fallback)).toEqual(fallback);
    });

    test('returns fallback function result if key does not exist in Storage', (): void => {
        const key: string = '$key';

        expect(SessionStorage.get(key, (): string => 'fallback')).toEqual('fallback');
    });

    test('returns null if key does not exist and no fallback is provided', (): void => {
        const key: string = '$key';

        expect(SessionStorage.get(key)).toEqual(null);
    });
});

describe('SessionStorage.remember', (): void => {
    test('returns the value for a key in Storage', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        expect(SessionStorage.remember(key, (): string => 'fallback')).toEqual(value);
    });

    test('stores and returns the result of the callback if key does not exist', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        expect(SessionStorage.remember(key, (): string => value)).toEqual(value);
        expect(SessionStorage.get(key)).toEqual(value);
    });
});

describe('SessionStorage.all', (): void => {
    test('retrieves all items from the Storage object', (): void => {
        const key1: string = '$key1';
        const value1: string = '$value1';

        SessionStorage.set(key1, value1);

        const key2: string = '$key2';
        const value2: string = '$value2';

        SessionStorage.set(key2, value2);

        const items: object = SessionStorage.all();

        expect(items[key1]).toEqual(value1);
        expect(items[key2]).toEqual(value2);
    });

    test('retrieves an empty object if Storage is empty', (): void => {
        sessionStorage.clear();

        const items: object = SessionStorage.all();

        expect(items).toEqual({});
    });
});

describe('SessionStorage.remove', (): void => {
    test('removes the key from Storage', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);
        SessionStorage.remove(key);

        expect(SessionStorage.get(key)).toEqual(null);
    });

    test('does nothing if the key does not exist in Storage', (): void => {
        const key: string = '$key';

        SessionStorage.remove(key);

        expect(SessionStorage.get(key)).toEqual(null);
    });
});

describe('SessionStorage.clear', (): void => {
    test('clears all keys from Storage', (): void => {
        const key1: string = '$key1';
        const value1: string = '$value1';

        SessionStorage.set(key1, value1);

        const key2: string = '$key2';
        const value2: string = '$value2';

        SessionStorage.set(key2, value2);

        SessionStorage.clear();

        expect(sessionStorage.getItem(key1)).toEqual(null);
        expect(sessionStorage.getItem(key2)).toEqual(null);
    });

    test('does nothing if Storage is already empty', (): void => {
        sessionStorage.clear();
        SessionStorage.clear();

        expect(sessionStorage.length).toBe(0);
    });
});

describe('SessionStorage.has', (): void => {
    test('returns true if the key exists in Storage', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        expect(SessionStorage.has(key)).toEqual(true);
    });

    test('returns false if the key does not exist in Storage', (): void => {
        const key: string = '$key';

        expect(SessionStorage.has(key)).toEqual(false);
    });

    test('returns false for an empty Storage', (): void => {
        SessionStorage.clear();

        const key: string = '$key';

        expect(SessionStorage.has(key)).toEqual(false);
    });
});

describe('SessionStorage.hasAny', (): void => {
    test('returns true if at least one of the keys exists in Storage', (): void => {
        const key1: string = '$key1';
        const value1: string = '$value1';

        SessionStorage.set(key1, value1);

        const key2: string = '$key2';
        const value2: string = '$value2';

        SessionStorage.set(key2, value2);

        expect(SessionStorage.hasAny([key1, key2])).toEqual(true);
    });

    test('returns false if none of the keys exist in Storage', (): void => {
        const key1: string = '$key1';
        const key2: string = '$key2';

        expect(SessionStorage.hasAny([key1, key2])).toEqual(false);
    });

    test('returns true if at least one of the keys exists in Storage when provided as individual arguments', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        expect(SessionStorage.hasAny([key, 'anotherKey'])).toEqual(true);
    });

    test('returns false if none of the keys exist in Storage when provided as individual arguments', (): void => {
        const key1: string = '$key1';
        const key2: string = '$key2';

        expect(SessionStorage.hasAny(key1, key2)).toEqual(false);
    });
});

describe('SessionStorage.isEmpty', (): void => {
    test('returns true if Storage is empty', (): void => {
        SessionStorage.clear();

        expect(SessionStorage.isEmpty()).toEqual(true);
    });

    test('returns false if Storage has items', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        expect(SessionStorage.isEmpty()).toEqual(false);
    });
});

describe('SessionStorage.isNotEmpty', (): void => {
    test('returns true if Storage has items', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        expect(SessionStorage.isNotEmpty()).toEqual(true);
    });

    test('returns false if Storage is empty', (): void => {
        SessionStorage.clear();

        expect(SessionStorage.isNotEmpty()).toEqual(false);
    });
});

describe('SessionStorage.keys', (): void => {
    test('retrieves all keys from Storage', (): void => {
        const key1: string = '$key1';
        const value1: string = '$value1';

        SessionStorage.set(key1, value1);

        const key2: string = '$key2';
        const value2: string = '$value2';

        SessionStorage.set(key2, value2);

        const keys: string[] = SessionStorage.keys();

        expect(keys).toContain(key1);
        expect(keys).toContain(key2);

        expect(keys.length).toBe(2);
    });

    test('returns an empty array if Storage is empty', (): void => {
        SessionStorage.clear();

        expect(SessionStorage.keys()).toEqual([]);
    });
});

describe('SessionStorage.count', (): void => {
    test('returns the total number of items in Storage', (): void => {
        const key1: string = '$key1';
        const value1: string = '$value1';

        SessionStorage.set(key1, value1);

        const key2: string = '$key2';
        const value2: string = '$value2';

        SessionStorage.set(key2, value2);

        expect(SessionStorage.count()).toBe(2);
    });

    test('returns 0 if Storage is empty', (): void => {
        SessionStorage.clear();

        expect(SessionStorage.count()).toBe(0);
    });
});

describe('SessionStorage.dump', (): void => {
    it('logs the stored item to the console', (): void => {
        const $console: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> = jest.spyOn(console, 'log').mockImplementation();

        SessionStorage.set('$key', '$value');
        SessionStorage.dump('$key');

        expect($console).toHaveBeenCalledWith('$value');

        $console.mockRestore();
    });
});