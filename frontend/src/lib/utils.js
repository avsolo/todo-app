export const formToDict = (formArray, opts={}) => {
    let returnArray = {};
    for (let i = 0; i < formArray.length; i++) {
        let name = formArray[i]['name'];
        let value = formArray[i]['value'];
        if ("parseInt" in opts && opts.parseInt.indexOf(name) !== -1)
            value = Number.parseInt(value);
        returnArray[name] = value;
    }
    return returnArray;
}


export function __mergeDict(target, source) {
    for (const [k, v] of Object.entries(source)) {
        if (v !== null && typeof v === `object`) {
            if (target[k] === undefined)
                target[k] = new v.__proto__.constructor();
            __mergeDict(target[k], v);
        } else {
            target[k] = v;
        }
    }
    return target;
}


export function mergeDict(target, ...sources) {
    for (const source of sources)
        target = __mergeDict(target, source);
    return target;
}
