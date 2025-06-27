export function isFunction<T>(value: T | ((prev: T) => T)): value is (prev: T) => T {
    return typeof value === 'function';
}

export function tryParseJSON<T>(value: string): T | null {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

export function isSerializable(value: any): boolean {
    try {
        JSON.stringify(value);
        return true;
    } catch {
        return false;
    }
}
