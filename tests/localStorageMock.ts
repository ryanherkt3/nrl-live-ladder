const localStorageMock = (() => {
    let store = {} as Storage;

    return {
        getItem: (key: string): string | null => {
            return Object.prototype.hasOwnProperty.call(store, key) ? (store[key] as string) : null;
        },
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        clear: () => {
            store = {} as Storage;
        },
        removeItem: (key: string) => {
            store[key] = undefined as unknown as string;
        }
    };
})();

export default localStorageMock;
