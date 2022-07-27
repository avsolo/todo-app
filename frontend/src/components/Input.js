import React, { useEffect, useState } from "react";
import {i18n} from "../context/i18n";
import Note from "./Note";

const Input = (props) => {
    const [value, setValue] = useState(props ? props?.value : '');

    let opts;
    if (props?.defaultValue)
        opts = {"defaultValue": value};
    else
        opts = {"value": value, onChange: props?.onChange};

    if (props?.type === "password")
        ['autoComplete', 'placeholder'].map(f => opts[f] = "");

    // useEffect(() => setValue(props?.value));

    return (
        <div className="input-group">
            <label htmlFor={props.name} className={props?.onError ? "fail" : ""}>
                {i18n(props.name)}
                {props?.onError ? <span className="fail">{` ${props?.onError}`}</span> : ""}
            </label>
            <input type={props?.type || "text"} name={props.name} value={value || ''}
                   className={`row ${props?.onError ? "fail" : ''}`} {...opts}
            />
        </div>
    );
}

export default Input;
