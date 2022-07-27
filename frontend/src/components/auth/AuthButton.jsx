import React, { useContext, useEffect, useState } from "react";
import { TaskContext } from "../../context/TaskContext";
import AuthForm from "./AuthForm";
import Popup from "../Popup";
import { CtxVar } from "../../context/constants";


const AuthButton = () => {

    const { user } = useContext(TaskContext);
    const [visibility, setVisibility] = useState(false);

    useEffect(() => setVisibility(false), [user]);

    const isAdmin = user.role === CtxVar.USER_ROLE_ADMIN;
    return (
        <div id="top-login" className={`dropdown`}>
            <a className={`btn small${isAdmin ? " red" : ""}`}
               onClick={_ => setVisibility(true)} title={user.email}
            >
                {user.name ? user.name : "Auth"}
            </a>
            <Popup visibility={visibility} onCancel={_ => setVisibility(false)} className="login-popup">
                <AuthForm/>
            </Popup>
        </div>
    );
}

export default AuthButton;
