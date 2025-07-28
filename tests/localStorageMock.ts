// TODO figure out how to mock localStorage - check YT
const localStorageMock = (() => {
    // let store: { [key: string]: string } = {};
    let store = {} as Storage;

    return {
        getItem: (key: string) => store[key],
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        clear: () => {
            // store = {};
            store = {} as Storage;
        },
        removeItem: (key: string) => {
            delete store[key];
        }
    };
})();
// Object.defineProperty(global, 'localStorage', { value: localStorageMock });
export default localStorageMock;
