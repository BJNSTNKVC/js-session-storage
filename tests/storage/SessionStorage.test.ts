import {
    KeyForgotFailed,
    KeyForgotten,
    KeyHit,
    KeyMissed,
    KeyWriteFailed,
    KeyWritten,
    SessionStorage,
    type SessionStorageEvent,
    type SessionStorageItem,
    RetrievingKey,
    StorageFlushed,
    StorageFlushing,
    WritingKey, SessionStorageFake
} from '../../src/main';

// @ts-expect-error
const emit: typeof SessionStorage.emit = SessionStorage.emit;

// Returns the first event emitted by the listener from the mock call stack.
const getEventFromMockCalls: (listener: jest.Mock) => SessionStorageEvent[keyof SessionStorageEvent] = (listener: jest.Mock) => listener.mock.calls[0][0];

let events: Map<string, Event> = new Map();

beforeEach((): void => {
    (global as any).sessionStorage = new SessionStorageFake();

    // @ts-expect-error
    SessionStorage.emit = jest.fn((event: Event) => events.set(event.type, event));
});

afterEach((): void => {
    SessionStorage.clear();
    SessionStorage.restore();

    events.clear();
});

describe('SessionStorage.set', (): void => {
    test('sets the key to the Storage object', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        const result: boolean = SessionStorage.set(key, value);

        const item: SessionStorageItem = JSON.parse(sessionStorage.getItem(key) as string) as SessionStorageItem;

        expect(result).toBeTruthy();
        expect(item.data).toEqual(value);
    });

    test('sets the key with a function value to the Storage object', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, (): string => value);

        const item: SessionStorageItem = JSON.parse(sessionStorage.getItem(key) as string) as SessionStorageItem;

        expect(item.data).toEqual(value);
    });

    test('returns false in case value cannot be set', (): void => {
        const key: string = '$key';
        const value: string = 'x'.repeat(5 * 1024 * 1024);
        const result: boolean = SessionStorage.set(key, value);

        expect(result).toBeFalsy();
    });

    test('emits WritingKey event before setting the value', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        const event: WritingKey = events.get('session-storage:writing') as WritingKey;

        expect(events.has('session-storage:writing')).toBeTruthy();
        expect(event).toBeInstanceOf(WritingKey);
        expect(event.key).toBe(key);
        expect(event.value).toBe(value);
    });

    test('emits KeyWritten event after successful set operation', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        const event: KeyWritten = events.get('session-storage:written') as KeyWritten;

        expect(events.has('session-storage:written')).toBeTruthy();
        expect(event).toBeInstanceOf(KeyWritten);
        expect(event.key).toBe(key);
        expect(event.value).toBe(value);
    });

    test('emits KeyWriteFailed event when storage insertion operation fails', (): void => {
        const key: string = '$key';
        const value: string = 'x'.repeat(5 * 1024 * 1024);

        SessionStorage.set(key, value);

        const event: KeyWriteFailed = events.get('session-storage:write-failed') as KeyWriteFailed;

        expect(events.has('session-storage:write-failed')).toBeTruthy();
        expect(event).toBeInstanceOf(KeyWriteFailed);
        expect(event.key).toBe(key);
        expect(event.value).toBe(value);
    });
});

describe('SessionStorage.get', (): void => {
    test('returns the value for a key in Storage', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        expect(SessionStorage.get(key)).toEqual(value);
    });

    test('retrieves values set directly via sessionStorage API', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        sessionStorage.setItem(key, value)

        expect(SessionStorage.get(key)).toEqual(value);
    });

    test('returns fallback value if key does not exist in Storage', (): void => {
        const key: string = '$key';
        const fallback: string = 'fallback';

        expect(SessionStorage.get(key, fallback)).toEqual(fallback);
    });

    test('returns fallback function result if key does not exist in Storage', (): void => {
        expect(SessionStorage.get('$key', (): string => 'fallback')).toEqual('fallback');
    });

    test('returns null if key does not exist and no fallback is provided', (): void => {
        expect(SessionStorage.get('$key')).toEqual(null);
    });

    test('emits RetrievingKey event before getting the value', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        expect(SessionStorage.get(key)).toEqual(value);

        const event: RetrievingKey = events.get('session-storage:retrieving') as RetrievingKey;

        expect(events.has('session-storage:retrieving')).toBeTruthy();
        expect(event).toBeInstanceOf(RetrievingKey);
        expect(event.key).toBe(key);
    });

    test('emits KeyHit event after successful get operation', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        expect(SessionStorage.get(key)).toEqual(value);

        const event: KeyHit = events.get('session-storage:hit') as KeyHit;

        expect(events.has('session-storage:hit')).toBeTruthy();
        expect(event).toBeInstanceOf(KeyHit);
        expect(event.key).toBe(key);
        expect(event.value).toBe(value);
    });

    test('emits KeyMissed event when storage retrieval operation fails', (): void => {
        const key: string = '$key';

        expect(SessionStorage.get(key)).toBeNull();

        const event: KeyMissed = events.get('session-storage:missed') as KeyMissed;

        expect(events.has('session-storage:missed')).toBeTruthy();
        expect(event).toBeInstanceOf(KeyMissed);
        expect(event.key).toBe(key);
    });
});

describe('SessionStorage.remember', (): void => {
    test('returns the value for a key in Storage', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        expect(SessionStorage.remember(key, (): string => 'fallback')).toEqual(value);
    });

    test('returns the value for a key in Storage set directly via sessionStorage API', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        sessionStorage.setItem(key, value)

        expect(SessionStorage.remember(key, (): string => 'fallback')).toEqual(value);
    });

    test('stores and returns the result of the callback if key does not exist', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        expect(SessionStorage.remember(key, (): string => value)).toEqual(value);
        expect(SessionStorage.get(key)).toEqual(value);
    });

    test('stores and returns the result of the callback with an expiry if key does not exist', (): void => {
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

        const items: { key: string, value: any }[] = SessionStorage.all();

        expect((items[0] as { key: string, value: any })).toEqual({ key: key1, value: value1 });
        expect(items[1] as { key: string, value: any }).toEqual({ key: key2, value: value2 });
    });

    test('retrieves an empty object if Storage is empty', (): void => {
        sessionStorage.clear();

        const items: object = SessionStorage.all();

        expect(items).toEqual([]);
    });
});

describe('SessionStorage.remove', (): void => {
    test('removes the key from Storage', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        const result: boolean = SessionStorage.remove(key);

        expect(result).toBeTruthy();
        expect(SessionStorage.get(key)).toEqual(null);
    });

    test('does nothing if the key does not exist in Storage', (): void => {
        const key: string = '$key';

        const result: boolean = SessionStorage.remove(key);

        expect(result).toBeFalsy();
        expect(SessionStorage.get(key)).toEqual(null);
    });

    test('emits KeyForgotten event after successful remove operation', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        SessionStorage.remove(key);

        const event: KeyForgotten = events.get('session-storage:forgot') as KeyForgotten;

        expect(events.has('session-storage:forgot')).toBeTruthy();
        expect(event).toBeInstanceOf(KeyForgotten);
        expect(event.key).toBe(key);
    });

    test('emits KeyForgotFailed event when storage removal operation fails', (): void => {
        const key: string = '$key';

        SessionStorage.remove(key);

        const event: KeyForgotFailed = events.get('session-storage:forgot-failed') as KeyForgotFailed;

        expect(events.has('session-storage:forgot-failed')).toBeTruthy();
        expect(event).toBeInstanceOf(KeyForgotFailed);
        expect(event.key).toBe(key);
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

    test('clears items that have expired', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);
        SessionStorage.clear();

        expect(SessionStorage.get(key)).toEqual(null);
    });

    test('emits StorageFlushing event before clearing all keys from Storage', (): void => {
        const key1: string = '$key1';
        const value1: string = '$value1';

        SessionStorage.set(key1, value1);

        const key2: string = '$key2';
        const value2: string = '$value2';

        SessionStorage.set(key2, value2);

        SessionStorage.clear();

        const event: StorageFlushing = events.get('session-storage:flushing') as StorageFlushing;

        expect(events.has('session-storage:flushing')).toBeTruthy();
        expect(event).toBeInstanceOf(StorageFlushing);
    });

    test('emits StorageFlushed after clearing all keys from Storage', (): void => {
        const key1: string = '$key1';
        const value1: string = '$value1';

        SessionStorage.set(key1, value1);

        const key2: string = '$key2';
        const value2: string = '$value2';

        SessionStorage.set(key2, value2);

        SessionStorage.clear();

        const event: StorageFlushed = events.get('session-storage:flushed') as StorageFlushed;

        expect(events.has('session-storage:flushed')).toBeTruthy();
        expect(event).toBeInstanceOf(StorageFlushed);
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

describe('SessionStorage.missing', (): void => {
    test('returns true if the key does not exist in Storage', (): void => {
        const key: string = '$key';

        expect(SessionStorage.missing(key)).toBeTruthy();
    });

    test('returns false if the key exists in Storage', (): void => {
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        expect(SessionStorage.missing(key)).toBeFalsy();
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


        expect(SessionStorage.hasAny(key, 'anotherKey')).toEqual(true);
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

        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);
        SessionStorage.dump(key);

        expect($console).toHaveBeenCalledWith(value);

        $console.mockRestore();
    });
});

describe('SessionStorage.fake', (): void => {
    test('sets fake as Storage instance', (): void => {
        SessionStorage.fake();

        expect(SessionStorage.isFake()).toBeTruthy();
    });

    test('interacts with fake Storage', (): void => {
        SessionStorage.fake();

        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        expect(SessionStorage.get(key)).toEqual(value);
        expect(SessionStorage.count()).toEqual(1);
        expect(SessionStorage.keys()).toContain(key);

        SessionStorage.clear();

        expect(SessionStorage.count()).toEqual(0);
    });


    test('sets new fake instance on multiple calls', (): void => {
        SessionStorage.fake();

        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        expect(SessionStorage.get(key)).toBe(value);
        expect(SessionStorage.count()).toBe(1);

        SessionStorage.fake();

        expect(SessionStorage.get(key)).toBeNull();
        expect(SessionStorage.count()).toBe(0);
    });
});

describe('SessionStorage.restore', (): void => {
    test('restores Storage instance', (): void => {
        SessionStorage.fake();

        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);

        SessionStorage.restore();

        expect(SessionStorage.isFake()).toBeFalsy();
        expect(SessionStorage.get(key)).toBeNull();
        expect(SessionStorage.count()).toBe(0);
    });
});

describe('SessionStorage.isFake', (): void => {
    test('returns true when fake Storage is set', (): void => {
        SessionStorage.fake();

        expect(SessionStorage.isFake()).toBeTruthy();
    });

    test('returns false when Storage is restored', (): void => {
        SessionStorage.fake();
        SessionStorage.restore();

        expect(SessionStorage.isFake()).toBeFalsy();
    });
});

describe('SessionStorage.listen', (): void => {
    // @ts-expect-error
    beforeEach((): void => SessionStorage.emit = emit);

    test('registers a listener for "retrieving" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';

        SessionStorage.listen('retrieving', listener);
        SessionStorage.get(key);

        const event = getEventFromMockCalls(listener) as RetrievingKey;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(RetrievingKey);
        expect(event.key).toBe(key);
    });

    test('registers a listener for "hit" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.listen('hit', listener);
        SessionStorage.set(key, value);
        SessionStorage.get(key);

        const event: KeyHit = getEventFromMockCalls(listener) as KeyHit;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(KeyHit);
        expect(event.key).toBe(key);
        expect(event.value).toBe(value);
    });

    test('registers a listener for "missed" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';

        SessionStorage.listen('missed', listener);
        SessionStorage.get(key);

        const event: KeyMissed = getEventFromMockCalls(listener) as KeyMissed;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(KeyMissed);
        expect(event.key).toBe(key);
    });

    test('registers a listener for "writing" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.listen('writing', listener);
        SessionStorage.set(key, value);

        const event: WritingKey = getEventFromMockCalls(listener) as WritingKey;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(WritingKey);
        expect(event.key).toBe(key);
        expect(event.value).toBe(value);
    });

    test('registers a listener for "written" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.listen('written', listener);
        SessionStorage.set(key, value);

        const event: KeyWritten = getEventFromMockCalls(listener) as KeyWritten;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(KeyWritten);
        expect(event.key).toBe(key);
        expect(event.value).toBe(value);
    });

    test('registers a listener for "write-failed" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';
        const value: string = 'x'.repeat(5 * 1024 * 1024);

        SessionStorage.listen('write-failed', listener);
        SessionStorage.set(key, value);

        const event: KeyWriteFailed = getEventFromMockCalls(listener) as KeyWriteFailed;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(KeyWriteFailed);
        expect(event.key).toBe(key);
        expect(event.value).toBe(value);
    });

    test('registers a listener for "forgot" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);
        SessionStorage.listen('forgot', listener);
        SessionStorage.remove(key);

        const event: KeyForgotten = getEventFromMockCalls(listener) as KeyForgotten;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(KeyForgotten);
        expect(event.key).toBe(key);
    });

    test('registers a listener for "forgot-failed" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';

        SessionStorage.listen('forgot-failed', listener);
        SessionStorage.remove(key);

        const event: KeyForgotFailed = getEventFromMockCalls(listener) as KeyForgotFailed;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(KeyForgotFailed);
        expect(event.key).toBe(key);
    });

    test('registers a listener for "flushing" event', (): void => {
        const listener: jest.Mock = jest.fn();

        SessionStorage.listen('flushing', listener);
        SessionStorage.clear();

        const event: StorageFlushing = getEventFromMockCalls(listener) as StorageFlushing;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(StorageFlushing);
    });

    test('registers a listener for "flushed" event', (): void => {
        const listener: jest.Mock = jest.fn();

        SessionStorage.listen('flushed', listener);
        SessionStorage.clear();

        const event: StorageFlushed = getEventFromMockCalls(listener) as StorageFlushed;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(StorageFlushed);
    });

    test('registers multiple listeners at once', (): void => {
        const listeners: Record<keyof SessionStorageEvent, jest.Mock> = {
            'retrieving'   : jest.fn(),
            'hit'          : jest.fn(),
            'missed'       : jest.fn(),
            'writing'      : jest.fn(),
            'written'      : jest.fn(),
            'write-failed' : jest.fn(),
            'forgot'       : jest.fn(),
            'forgot-failed': jest.fn(),
            'flushing'     : jest.fn(),
            'flushed'      : jest.fn()
        };

        SessionStorage.listen(listeners);

        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.get(key);

        expect(listeners.retrieving).toHaveBeenCalledTimes(1);
        expect(getEventFromMockCalls(listeners.retrieving)).toBeInstanceOf(RetrievingKey);

        expect(listeners.missed).toHaveBeenCalledTimes(1);
        expect(getEventFromMockCalls(listeners.missed)).toBeInstanceOf(KeyMissed);

        SessionStorage.set(key, value);

        expect(listeners.writing).toHaveBeenCalledTimes(1);
        expect(getEventFromMockCalls(listeners.writing)).toBeInstanceOf(WritingKey);

        expect(listeners.written).toHaveBeenCalledTimes(1);
        expect(getEventFromMockCalls(listeners.written)).toBeInstanceOf(KeyWritten);

        SessionStorage.set(key.repeat(5 * 1024 * 1024), value);

        expect(listeners['write-failed']).toHaveBeenCalledTimes(1);
        expect(getEventFromMockCalls(listeners['write-failed'])).toBeInstanceOf(KeyWriteFailed);

        SessionStorage.get(key);

        expect(listeners.hit).toHaveBeenCalledTimes(1);
        expect(getEventFromMockCalls(listeners.hit)).toBeInstanceOf(KeyHit);

        SessionStorage.remove(key);

        expect(listeners.forgot).toHaveBeenCalledTimes(1);
        expect(getEventFromMockCalls(listeners.forgot)).toBeInstanceOf(KeyForgotten);

        SessionStorage.remove('$key-1');

        expect(listeners['forgot-failed']).toHaveBeenCalledTimes(1);
        expect(getEventFromMockCalls(listeners['forgot-failed'])).toBeInstanceOf(KeyForgotFailed);

        SessionStorage.clear();

        expect(listeners.flushing).toHaveBeenCalledTimes(1);
        expect(getEventFromMockCalls(listeners.flushing)).toBeInstanceOf(StorageFlushing);

        expect(listeners.flushed).toHaveBeenCalledTimes(1);
        expect(getEventFromMockCalls(listeners.flushed)).toBeInstanceOf(StorageFlushed);
    });
});

describe('SessionStorage.onRetrieving', (): void => {
    // @ts-expect-error
    beforeEach((): void => SessionStorage.emit = emit);

    test('registers a listener for "retrieving" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';

        SessionStorage.onRetrieving(listener);
        SessionStorage.get(key);

        const event: RetrievingKey = getEventFromMockCalls(listener) as RetrievingKey;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(RetrievingKey);
        expect(event.key).toBe(key);
    });
});

describe('SessionStorage.onHit', (): void => {
    // @ts-expect-error
    beforeEach((): void => SessionStorage.emit = emit);

    test('registers a listener for "hit" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);
        SessionStorage.onHit(listener);
        SessionStorage.get(key);

        const event: KeyHit = getEventFromMockCalls(listener) as KeyHit;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(KeyHit);
        expect(event.key).toBe(key);
        expect(event.value).toBe(value);
    });
});

describe('SessionStorage.onMissed', (): void => {
    // @ts-expect-error
    beforeEach((): void => SessionStorage.emit = emit);

    test('registers a listener for "missed" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';

        SessionStorage.onMissed(listener);
        SessionStorage.get(key);

        const event: KeyMissed = getEventFromMockCalls(listener) as KeyMissed;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(KeyMissed);
        expect(event.key).toBe(key);
    });
});

describe('SessionStorage.onWriting', (): void => {
    // @ts-expect-error
    beforeEach((): void => SessionStorage.emit = emit);

    test('registers a listener for "writing" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.onWriting(listener);
        SessionStorage.set(key, value);

        const event: WritingKey = getEventFromMockCalls(listener) as WritingKey;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(WritingKey);
        expect(event.key).toBe(key);
        expect(event.value).toBe(value);
    });
});

describe('SessionStorage.onWritten', (): void => {
    // @ts-expect-error
    beforeEach((): void => SessionStorage.emit = emit);

    test('registers a listener for "written" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.onWritten(listener);
        SessionStorage.set(key, value);

        const event: KeyWritten = getEventFromMockCalls(listener) as KeyWritten;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(KeyWritten);
        expect(event.key).toBe(key);
        expect(event.value).toBe(value);
    });
});

describe('SessionStorage.onWriteFailed', (): void => {
    // @ts-expect-error
    beforeEach((): void => SessionStorage.emit = emit);

    test('registers a listener for "write-failed" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';
        const value: string = 'x'.repeat(5 * 1024 * 1024);

        SessionStorage.onWriteFailed(listener);
        SessionStorage.set(key, value);

        const event: KeyWriteFailed = getEventFromMockCalls(listener) as KeyWriteFailed;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(KeyWriteFailed);
        expect(event.key).toBe(key);
        expect(event.value).toBe(value);
    });
});

describe('SessionStorage.onForgot', (): void => {
    // @ts-expect-error
    beforeEach((): void => SessionStorage.emit = emit);

    test('registers a listener for "forgot" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';
        const value: string = '$value';

        SessionStorage.set(key, value);
        SessionStorage.onForgot(listener);
        SessionStorage.remove(key);

        const event: KeyForgotten = getEventFromMockCalls(listener) as KeyForgotten;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(KeyForgotten);
        expect(event.key).toBe(key);
    });
});

describe('SessionStorage.onForgotFailed', (): void => {
    // @ts-expect-error
    beforeEach((): void => SessionStorage.emit = emit);

    test('registers a listener for "forgot-failed" event', (): void => {
        const listener: jest.Mock = jest.fn();
        const key: string = '$key';

        SessionStorage.onForgotFailed(listener);
        SessionStorage.remove(key);

        const event: KeyForgotFailed = getEventFromMockCalls(listener) as KeyForgotFailed;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(KeyForgotFailed);
        expect(event.key).toBe(key);
    });
});

describe('SessionStorage.onFlushing', (): void => {
    // @ts-expect-error
    beforeEach((): void => SessionStorage.emit = emit);

    test('registers a listener for "flushing" event', (): void => {
        const listener: jest.Mock = jest.fn();

        SessionStorage.onFlushing(listener);
        SessionStorage.clear();

        const event: StorageFlushing = getEventFromMockCalls(listener) as StorageFlushing;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(StorageFlushing);
    });
});

describe('SessionStorage.onFlushed', (): void => {
    // @ts-expect-error
    beforeEach((): void => SessionStorage.emit = emit);

    test('registers a listener for "flushed" event', (): void => {
        const listener: jest.Mock = jest.fn();

        SessionStorage.onFlushed(listener);
        SessionStorage.clear();

        const event: StorageFlushed = getEventFromMockCalls(listener) as StorageFlushed;

        expect(listener).toHaveBeenCalledTimes(1);
        expect(event).toBeInstanceOf(StorageFlushed);
    });
});