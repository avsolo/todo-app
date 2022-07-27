import React from "react";


const TabBlock = (props) => {

    return (
        <div className="tab-toggle-block">
            <a id="tab-login" onClick={_ => props.setLoginTab(true)}
               className={props.isLoginTab ? "active" : "disabled"}
            >
                Login
            </a>
            <small className="mid-gray">&nbsp;&nbsp;or&nbsp;&nbsp;</small>
            <a id="tab-set-user" onClick={_ => props.setLoginTab(false)}
               className={props.isLoginTab ? "disabled" : "active"}
            >
                Set&nbsp;name
            </a>
        </div>
    );
}

export default TabBlock;