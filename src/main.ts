export type SessionStorageItem = {
    data: any,
};

export class SessionStorage {
    /**
     * Current Storage instance.
     *
     * @type { Storage }
     */
    static #storage: Storage = sessionStorage;

    /**
     * Set the key to the Storage object.
     *
     * @param { string } key String containing the name of the key you want to create.
     * @param { * } value String containing the value of the key you want to create.
     */
    static set(key: string, value: any): void {
        const item: SessionStorageItem = {
            data: typeof value === 'function' ? value() : value,
        };

        this.#storage.setItem(key, JSON.stringify(item));
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
        const storageItem: string | null = this.#storage.getItem(key);

        if (storageItem === null) {
            return typeof fallback === 'function' ? fallback() : fallback;
        }

        try {
            const item: SessionStorageItem = JSON.parse(storageItem);

            return item.data ?? item;
        } catch {
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
        const item: string | null = this.get(key);

        if (item === null) {
            this.set(key, callback);
        }

        return item ?? this.get(key);
    }

    /**
     * Retrieves all items from the Storage object.
     *
     * @return { { key: string, value: any }[] }
     */
    static all(): { key: string, value: any }[] {
        return this.keys().map((key: string): { key: string, value: any } => {
            return { key, value: this.get(key) };
        });
    }

    /**
     * Remove the key from the Storage object.
     *
     * @param { string } key String containing the name of the key you want to delete.
     */
    static remove(key: string): void {
        this.#storage.removeItem(key);
    }

    /**
     * Clear all keys stored in a given Storage object.
     */
    static clear(): void {
        this.#storage.clear();
    }

    /**
     * Determine if the key exists in the Storage object.
     *
     * @param { string } key String containing the name of the key you want to check against
     *
     * @return { boolean }
     */
    static has(key: string): boolean {
        return !!this.get(key);
    }

    /**
     * Determine if any of the keys exists in the Storage object.
     *
     * @param { string | string[] } keys String containing the name of the key you want to check against
     *
     * @return { boolean }
     */
    static hasAny(...keys: [string | string[]] | string[]): boolean {
        if (keys.length === 1) {
            if (Array.isArray(keys[0])) {
                keys = keys[0];
            } else {
                keys = [keys[0]];
            }
        }

        return keys.some((key: string): boolean => this.has(key));
    }

    /**
     * Determine if the Storage object is empty.
     *
     * @return { boolean }
     */
    static isEmpty(): boolean {
        return this.#storage.length === 0;
    }

    /**
     * Determine if the Storage object is not empty.
     *
     * @return { boolean }
     */
    static isNotEmpty(): boolean {
        return !this.isEmpty();
    }

    /**
     * Retrieves all keys from the Storage object.
     *
     * @return { string[] }
     */
    static keys(): string[] {
        return Object.keys(this.#storage);
    }

    /**
     * Returns the total number of items in the Storage object.
     *
     * @return { number }
     */
    static count(): number {
        return this.#storage.length;
    }

    /**
     * Dump the key from the Storage object.
     *
     * @param { string } key String containing the name of the key you want to dump.
     */
    static dump(key: string): void {
        console.log(this.get(key));
    }


    /**
     * Replace the Session Storage instance with a fake.
     *
     * @return { void }
     */
    static fake(): void {
        this.#storage = new SessionStorageFake();
    }

    /**
     * Restore the Session Storage instance.
     *
     * @return { void }
     */
    static restore(): void {
        this.#storage = sessionStorage;
    }

    /**
     * Determines whether a "fake" has been set as the Session Storage instance.
     *
     * @return { boolean }
     */
    static isFake(): boolean {
        return this.#storage instanceof SessionStorageFake;
    }
}

export class SessionStorageFake implements Storage {
    /**
     * Storage property.
     *
     * @type { string }
     */
    [key: string]: any;

    /**
     * Returns an integer representing the number of data items stored in the Storage object.
     *
     * @return { number }
     */
    get length(): number {
        return Object.keys(this).length;
    }

    /**
     * When passed a key name, will return that key's value.
     *
     * @param { string } keyName
     *
     * @return { any }
     */
    getItem(keyName: string): string {
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
    setItem(keyName: string, keyValue: string): void {
        this[keyName] = keyValue;
    }

    /**
     * When passed a key name, will remove that key from the storage.
     *
     * @param { string } keyName
     *
     * @return { void }
     */
    removeItem(keyName: string): void {
        delete this[keyName];
    }

    /**
     * When invoked, will empty all keys out of the storage.
     *
     * @return { void }
     */
    clear(): void {
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
    key(index: number): string | null {
        return Object.keys(this)[index] ?? null;
    }
}

if (typeof window !== 'undefined') {
    (window as any).SessionStorage = SessionStorage;
    (window as any).SessionStorageFake = SessionStorageFake;
}

if (typeof global !== 'undefined') {
    (global as any).SessionStorage = SessionStorage;
    (global as any).SessionStorageFake = SessionStorageFake;
}