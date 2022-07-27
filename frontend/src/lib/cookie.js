const cookie = {};


cookie.get = (key) => {
    console.debug("All the cookie:", document.cookie);
    let b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : '';
}


cookie.set = (name, value, options = {}) => {
    options = { path: '/',  ...options };
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (let optKey in options) {
        updatedCookie += "; " + optKey;
        let optValue = options[optKey];
        if (optValue !== true) {
            updatedCookie += "=" + optValue;
        }
    }
    document.cookie = updatedCookie;
}


cookie.delete = (name) => {
    cookie.set(name, "", {
        'max-age': -1
    })
}

export default cookie;