export const storeSession = (key, value) => {
    return sessionStorage.setItem(key, value);
}
export const getSession = (key) => {
    return sessionStorage.getItem(key)
}

export const removeSession = (key) => {
    return  sessionStorage.removeItem(key);
}