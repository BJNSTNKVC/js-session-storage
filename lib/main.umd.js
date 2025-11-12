(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SessionStorage = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }

    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var _a, _SessionStorage_storage;
    class SessionStorage {
        /**
         * Set the key to the Storage object.
         *
         * @param { string } key String containing the name of the key you want to create.
         * @param { * } value String containing the value of the key you want to create.
         */
        static set(key, value) {
            const item = {
                data: typeof value === 'function' ? value() : value,
            };
            __classPrivateFieldGet(this, _a, "f", _SessionStorage_storage).setItem(key, JSON.stringify(item));
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
            var _b;
            const storageItem = __classPrivateFieldGet(this, _a, "f", _SessionStorage_storage).getItem(key);
            if (storageItem === null) {
                return typeof fallback === 'function' ? fallback() : fallback;
            }
            try {
                const item = JSON.parse(storageItem);
                return (_b = item.data) !== null && _b !== void 0 ? _b : item;
            }
            catch (_c) {
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
            const item = this.get(key);
            if (item === null) {
                this.set(key, callback);
            }
            return item !== null && item !== void 0 ? item : this.get(key);
        }
        /**
         * Retrieves all items from the Storage object.
         *
         * @return { { key: string, value: any }[] }
         */
        static all() {
            return this.keys().map((key) => {
                return { key, value: this.get(key) };
            });
        }
        /**
         * Remove the key from the Storage object.
         *
         * @param { string } key String containing the name of the key you want to delete.
         */
        static remove(key) {
            __classPrivateFieldGet(this, _a, "f", _SessionStorage_storage).removeItem(key);
        }
        /**
         * Clear all keys stored in a given Storage object.
         */
        static clear() {
            __classPrivateFieldGet(this, _a, "f", _SessionStorage_storage).clear();
        }
        /**
         * Determine if the key exists in the Storage object.
         *
         * @param { string } key String containing the name of the key you want to check against
         *
         * @return { boolean }
         */
        static has(key) {
            return !!this.get(key);
        }
        /**
         * Determine if any of the keys exists in the Storage object.
         *
         * @param { string | string[] } keys String containing the name of the key you want to check against
         *
         * @return { boolean }
         */
        static hasAny(...keys) {
            if (keys.length === 1) {
                if (Array.isArray(keys[0])) {
                    keys = keys[0];
                }
                else {
                    keys = [keys[0]];
                }
            }
            return keys.some((key) => this.has(key));
        }
        /**
         * Determine if the Storage object is empty.
         *
         * @return { boolean }
         */
        static isEmpty() {
            return __classPrivateFieldGet(this, _a, "f", _SessionStorage_storage).length === 0;
        }
        /**
         * Determine if the Storage object is not empty.
         *
         * @return { boolean }
         */
        static isNotEmpty() {
            return !this.isEmpty();
        }
        /**
         * Retrieves all keys from the Storage object.
         *
         * @return { string[] }
         */
        static keys() {
            return Object.keys(__classPrivateFieldGet(this, _a, "f", _SessionStorage_storage));
        }
        /**
         * Returns the total number of items in the Storage object.
         *
         * @return { number }
         */
        static count() {
            return __classPrivateFieldGet(this, _a, "f", _SessionStorage_storage).length;
        }
        /**
         * Dump the key from the Storage object.
         *
         * @param { string } key String containing the name of the key you want to dump.
         */
        static dump(key) {
            console.log(this.get(key));
        }
        /**
         * Replace the Session Storage instance with a fake.
         *
         * @return { void }
         */
        static fake() {
            __classPrivateFieldSet(this, _a, new SessionStorageFake(), "f", _SessionStorage_storage);
        }
        /**
         * Restore the Session Storage instance.
         *
         * @return { void }
         */
        static restore() {
            __classPrivateFieldSet(this, _a, sessionStorage, "f", _SessionStorage_storage);
        }
        /**
         * Determines whether a "fake" has been set as the Session Storage instance.
         *
         * @return { boolean }
         */
        static isFake() {
            return __classPrivateFieldGet(this, _a, "f", _SessionStorage_storage) instanceof SessionStorageFake;
        }
    }
    _a = SessionStorage;
    /**
     * Current Storage instance.
     *
     * @type { Storage }
     */
    _SessionStorage_storage = { value: sessionStorage };
    class SessionStorageFake {
        /**
         * Returns an integer representing the number of data items stored in the Storage object.
         *
         * @return { number }
         */
        get length() {
            return Object.keys(this).length;
        }
        /**
         * When passed a key name, will return that key's value.
         *
         * @param { string } keyName
         *
         * @return { any }
         */
        getItem(keyName) {
            return this[keyName] || null;
        }
        /**
         * When passed a key name and value, will add that key to the storage, or update that key's value if it already exists.
         *
         * @param { string } keyName
         * @param { string } keyValue
         *
         * @return { void }
         */
        setItem(keyName, keyValue) {
            this[keyName] = keyValue;
        }
        /**
         * When passed a key name, will remove that key from the storage.
         *
         * @param { string } keyName
         *
         * @return { void }
         */
        removeItem(keyName) {
            delete this[keyName];
        }
        /**
         * When invoked, will empty all keys out of the storage.
         *
         * @return { void }
         */
        clear() {
            for (const key of Object.keys(this)) {
                delete this[key];
            }
        }
        /**
         * When passed a number n, returns the name of the nth key in a given Storage object.
         *
         * @param { number } index
         *
         * @return { string | null }
         */
        key(index) {
            var _b;
            return (_b = Object.keys(this)[index]) !== null && _b !== void 0 ? _b : null;
        }
    }
    if (typeof window !== 'undefined') {
        window.SessionStorage = SessionStorage;
        window.SessionStorageFake = SessionStorageFake;
    }
    if (typeof global !== 'undefined') {
        global.SessionStorage = SessionStorage;
        global.SessionStorageFake = SessionStorageFake;
    }

    exports.SessionStorage = SessionStorage;
    exports.SessionStorageFake = SessionStorageFake;

}));
//# sourceMappingURL=main.umd.js.map
