import { WritingKey } from '../../src/main';

describe('WritingKey', (): void => {
    const key: string = '$key';
    const value: string = '$value';
    const event: WritingKey = new WritingKey(key, value);

    test('is an instance of Event', (): void => {
        expect(event).toBeInstanceOf(Event);
    });

    test('has the correct event type', (): void => {
        expect(event.type).toBe('session-storage:writing');
    });

    test('contains the key that is being written', (): void => {
        expect(event.key).toBe(key);
    });

    test('contains the value that is being written', (): void => {
        expect(event.value).toBe(value);
    });

    test('handles different value types correctly', (): void => {
        const values: any[] = ['string', 123, true, { key: 'value' }, [1, 2, 3], null, undefined];

        values.forEach((value: any) => {
            const event: WritingKey = new WritingKey(key, value);

            expect(event.value).toBe(value);
        });
    });
});