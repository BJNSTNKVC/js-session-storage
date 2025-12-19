export class WritingKey extends Event {
    /**
     * The key of the event.
     *
     * @type { string }
     */
    readonly #key: string;

    /**
     * The value of the key.
     *
     * @type { string }
     */
    readonly #value: string;

    /**
     * Create a new Writing Key Event instance.
     *
     * @param { string } key
     * @param { string } value
     */
    constructor(key: string, value: any) {
        super('session-storage:writing');

        this.#key = key;
        this.#value = value;
    }

    /**
     * Get the key of the event.
     *
     * @return { string }
     */
    get key(): string {
        return this.#key;
    }

    /**
     * Get the value of the key.
     *
     * @return { * }
     */
    get value(): any {
        return this.#value;
    }
}