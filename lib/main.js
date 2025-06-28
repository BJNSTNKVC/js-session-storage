class SessionStorage {
    static set(key, value) {
        const item = {
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
    static get(key, fallback = null) {
        var _a;
        const storageItem = sessionStorage.getItem(key);
        if (storageItem === null) {
            return fallback instanceof Function ? fallback() : fallback !== null && fallback !== void 0 ? fallback : null;
        }
        try {
            const item = JSON.parse(storageItem);
            return (_a = item.data) !== null && _a !== void 0 ? _a : item;
        }
        catch (error) {
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
    static remember(key, callback) {
        const item = SessionStorage.get(key);
        if (item === null) {
            SessionStorage.set(key, callback);
        }
        return item !== null && item !== void 0 ? item : SessionStorage.get(key);
    }
    /**
     * Retrieves all items from the Storage object.
     *
     * @return { object }
     */
    static all() {
        const storage = Object.assign({}, sessionStorage);
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
    static remove(key) {
        sessionStorage.removeItem(key);
    }
    /**
     * Clear all keys stored in a given Storage object.
     */
    static clear() {
        sessionStorage.clear();
    }
    /**
     * Determine if the key exists in the Storage object.
     *
     * @param { string } key String containing the name of the key you want to check against
     *
     * @return { boolean }
     */
    static has(key) {
        return !!SessionStorage.get(key);
    }
    /**
     * Determine if any of the keys exists in the Storage object.
     *
     * @param { string | array } keys String containing the name of the key you want to check against
     *
     * @return { boolean }
     */
    static hasAny(keys) {
        keys = keys instanceof Array ? keys : [...arguments];
        return keys.filter((key) => SessionStorage.has(key)).length > 0;
    }
    /**
     * Determine if the Storage object is empty.
     *
     * @return { boolean }
     */
    static isEmpty() {
        return Object.keys(SessionStorage.all()).length === 0;
    }
    /**
     * Determine if the Storage object is not empty.
     *
     * @return { boolean }
     */
    static isNotEmpty() {
        return !SessionStorage.isEmpty();
    }
    /**
     * Retrieves all keys from the Storage object.
     *
     * @return { array }
     */
    static keys() {
        return Object.keys(sessionStorage);
    }
    /**
     * Returns the total number of items in the Storage object.
     *
     * @return { number }
     */
    static count() {
        return sessionStorage.length;
    }
    /**
     * Dump the key from the Storage object.
     *
     * @param { string } key String containing the name of the key you want to dump.
     */
    static dump(key) {
        console.log(SessionStorage.get(key));
    }
}
if (typeof exports != 'undefined') {
    module.exports.SessionStorage = SessionStorage;
}
// Hack to test this code, global is not available in the browser.
if (typeof global !== 'undefined') {
    const _global = global;
    _global.SessionStorage = SessionStorage;
}
export {};
//# sourceMappingURL=main.js.map