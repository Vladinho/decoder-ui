const debounce = (func, timeout = 1000) => {
    let timer;
    return (...args) => {
        if (!timer) {
            func.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, timeout);
    };
}

export default debounce;