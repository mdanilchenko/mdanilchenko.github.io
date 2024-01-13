export default class StoreProvider {
    constructor() {}

    save(key, value) {
        if (typeof value === 'object' && value !== null) {
            localStorage.setItem(key, JSON.stringify(value));
        }

        localStorage.setItem(key, value);
    }

    getObject(key) {
        const value = localStorage.getItem(key);

        if (typeof value !== undefined) {
            return JSON.parse(value);
        }
    }

    getArray(key) {
        const value = localStorage.getItem(key);

        if (typeof value !== undefined) {
            return JSON.parse(value);
        }
    }

    getString(key) {
        return localStorage.getItem(key);
    }

    getInt(key) {
        return parseInt(localStorage.getItem(key));
    }

    getFloat(key) {
        return parseFloat(localStorage.getItem(key));
    }
}