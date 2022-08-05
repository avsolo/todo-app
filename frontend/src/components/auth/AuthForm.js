import React, { useContext, useEffect, useState } from "react";
import api from "../../lib/api";
import { Action, Text } from "../../context/constants";
import { TaskContext } from "../../context/TaskContext";
import Note from "../Note";
import Input from "../Input";
import {i18n} from "../../context/i18n";
import TabBlock from "./TabBlock";
import LoginBlock from "./LoginBlock";


const AuthForm = () => {

    const { user, dispatch } = useContext(TaskContext);
    const [isLoginTab, setLoginTab] = useState(true);
    const [isError, _setError] = useState({});

    const setErrorOrDefault = (e) => {
        console.error("AuthForm.setErrorOrDefault", e);
        const detail = e?.detail || [];
        if (detail.length > 0) {
            let errors = {}
            for (let d of detail) {
                errors[d?.loc?.[1]] = d.msg;
                _setError(errors);
            }
        } else {
            _setError({"api": e.message});
        }
    }

    useEffect(() => {
        api.getUser()
            .then(resp => dispatch({type: Action.SET_USER, data: resp}))
            .catch(e => setErrorOrDefault(e));
    }, []);

    useEffect(() => _setError({}), [isLoginTab, user]);

    const submitHandler = (ev) => {
        ev.preventDefault();

        const t = ev.target;
        let method, action, data = {name: t.name.value};
        if (isLoginTab) {
            method = 'login';
            data['password'] = t.password.value;
            action = Action.LOGIN_USER;
        } else {
            method = 'setUser';
            data['email'] = t.email.value;
            action = Action.SET_USER;
        }

        api[method](data)
            .then(resp => dispatch({type: action, data: resp}))
            .catch(e => setErrorOrDefault(e));
    }

    const logoutHandler = (ev) => {
        ev.preventDefault();
        api.logout()
            .then(_ => dispatch({type: Action.LOGOUT_USER}))
            .catch(e => setErrorOrDefault(e));
    }

    const registered = !!user.role;
    const note = <Note onError={isError?.api} size="small"/>;
    const failCss = (f) => isError?.[f] ? "fail" : "";
    return (<>
        <div id="login-block" className={registered ? "hidden": ""}>
            <TabBlock isLoginTab={isLoginTab} onClick={setLoginTab} setLoginTab={v => setLoginTab(v)}/>
            <form id="login-form" className={registered ? "hidden" : ""} onSubmit={submitHandler}>
                <div className="row-flex">
                    <Input name="name" defaultValue="" onError={isError?.name}/>
                    {isLoginTab
                        ? <LoginBlock isError={isError} failCss={failCss}/>
                        : <Input name="email" defaultValue="" onError={isError?.email}/>
                    }
                </div>
                {note}
                <input type="submit" name="submit" value={isLoginTab ? "Login" : "Set Name"}/>
                &nbsp;
                <input type="button" name="unset" value="Unset" onClick={logoutHandler}
                       className={`primary ${(!isLoginTab && user?.name) ? "" : "hidden"}`}/>
            </form>
        </div>

        <div id="logout-block" className={registered ? "" : " hidden"}>
            {note}
            <input type="submit" className="primary" value="Log out" onClick={logoutHandler} />
        </div>
    </>);
}

export default AuthForm;