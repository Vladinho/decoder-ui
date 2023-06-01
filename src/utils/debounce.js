const debounce = function (func, before = () => {},  timeout = 500){
    let timer;
    return (...args) => {
        before();
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

export default debounce;