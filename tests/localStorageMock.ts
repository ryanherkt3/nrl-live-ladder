const localStorageMock = (() => {
    let store = {} as Storage;

    return {
        getItem: (key: string) => store[key],
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {} as Storage;
        },
        removeItem: (key: string) => {
            delete store[key];
        }
    };
})();

export default localStorageMock;
