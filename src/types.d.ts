type SessionStorageItem = {
    data: any,
};

export class SessionStorage {
    static set(key: string, value: any): void;
    static get(key: string, fallback?: string | Function | null): any;
    static remember(key: string, callback: Function): any;
    static all(): object;
    static remove(key: string): void;
    static clear(): void;
    static has(key: string): boolean;
    static hasAny(keys: string | string[]): boolean;
    static isEmpty(): boolean;
    static isNotEmpty(): boolean;
    static keys(): string[];
    static count(): number;
    static dump(key: string): void;
}
