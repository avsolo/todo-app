import Input from "../Input";
import {i18n} from "../../context/i18n";
import React from "react";


const LoginBlock = (props) => {
    return (
        <div className="input-group">
            <label htmlFor="password" className={props.failCss('password')}>
                {i18n("password")}
                {props.isError?.password ? <span className="fail">{` ${props.isError?.password}`}</span> : ""}
            </label>
            <input type="password" name="password" placeholder=""
                   autoComplete="" className={props.failCss('password')}
            />
        </div>
    );
}

export default LoginBlock;