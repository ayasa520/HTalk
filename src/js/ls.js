const ls = {
    put: (key, value) => {
        return localStorage.setItem(key, value);
    },
    get: (key) => {
        return localStorage.getItem(key)
    },
    del: (key) => {
        return localStorage.removeItem(key)
    }
}

export default ls