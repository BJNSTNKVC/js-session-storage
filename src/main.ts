class SessionStorage {
    static set(key: string, value: any): void {
        const item: SessionStorageItem = {
            data: value instanceof Function ? value() : value,
        };

        sessionStorage.setItem(key, JSON.stringify(item));
    }

    /**
     * Get the key from the Storage object.
     *
     * @param { string } key String containing the name of the key you want to create.
     * @param { string | Function | null } fallback String containing the fallback value.
     *
     * @return { * }
     */
    static get(key: string, fallback: string | Function | null = null): any {
        const storageItem: string | null = sessionStorage.getItem(key);

        if (storageItem === null) {
            return fallback instanceof Function ? fallback() : fallback ?? null;
        }

        try {
            const item: SessionStorageItem = JSON.parse(storageItem);

            return item.data ?? item;
        } catch (error) {
            return storageItem;
        }
    }

    /**
     * Get the key from the Storage, or execute the given callback and store the result.
     *
     * @param { string } key String containing the name of the key you want to create.
     * @param { Function } callback Function you want to execute.
     *
     * @return { any }
     */
    static remember(key: string, callback: Function): any {
        const item: string | null = SessionStorage.get(key);

        if (item === null) {
            SessionStorage.set(key, callback);
        }

        return item ?? SessionStorage.get(key);
    }

    /**
     * Retrieves all items from the Storage object.
     *
     * @return { object }
     */
    static all(): object {
        const storage: object | any = { ...sessionStorage };

        for (const item in storage) {
            storage[item] = SessionStorage.get(item);
        }

        return storage;
    }

    /**
     * Remove the key from the Storage object.
     *
     * @param { string } key String containing the name of the key you want to delete.
     */
    static remove(key: string): void {
        sessionStorage.removeItem(key);
    }

    /**
     * Clear all keys stored in a given Storage object.
     */
    static clear(): void {
        sessionStorage.clear();
    }

    /**
     * Determine if the key exists in the Storage object.
     *
     * @param { string } key String containing the name of the key you want to check against
     *
     * @return { boolean }
     */
    static has(key: string): boolean {
        return !!SessionStorage.get(key);
    }

    /**
     * Determine if any of the keys exists in the Storage object.
     *
     * @param { string | array } keys String containing the name of the key you want to check against
     *
     * @return { boolean }
     */
    static hasAny(keys: string | string[]): boolean {
        keys = keys instanceof Array ? keys : [...arguments];

        return keys.filter((key: string) => SessionStorage.has(key)).length > 0;
    }

    /**
     * Determine if the Storage object is empty.
     *
     * @return { boolean }
     */
    static isEmpty(): boolean {
        return Object.keys(SessionStorage.all()).length === 0;
    }

    /**
     * Determine if the Storage object is not empty.
     *
     * @return { boolean }
     */
    static isNotEmpty(): boolean {
        return !SessionStorage.isEmpty();
    }

    /**
     * Retrieves all keys from the Storage object.
     *
     * @return { array }
     */
    static keys(): string[] {
        return Object.keys(sessionStorage);
    }

    /**
     * Returns the total number of items in the Storage object.
     *
     * @return { number }
     */
    static count(): number {
        return sessionStorage.length;
    }

    /**
     * Dump the key from the Storage object.
     *
     * @param { string } key String containing the name of the key you want to dump.
     */
    static dump(key: string): void {
        console.log(SessionStorage.get(key));
    }
}

if (typeof exports != 'undefined') {
    module.exports.SessionStorage = SessionStorage;
}

// Hack to test this code, global is not available in the browser.
if (typeof global !== 'undefined') {
    const _global: any = global;

    _global.SessionStorage = SessionStorage;
}