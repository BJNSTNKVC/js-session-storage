export type SessionStorageItem = {
    data: any,
};

export class SessionStorage {
    /**
     * Set the key to the Storage object.
     *
     * @param { string } key String containing the name of the key you want to create.
     * @param { * } value String containing the value of the key you want to create.
     */
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
    static all(): { key: string, value: any }[]  {
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
        return sessionStorage.length === 0;
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
        console.log(this.get(key));
    }
}

if (typeof window !== 'undefined') {
    (window as any).SessionStorage = SessionStorage;
}

if (typeof global !== 'undefined') {
    (global as any).SessionStorage = SessionStorage;
}