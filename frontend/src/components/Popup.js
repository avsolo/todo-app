import React from "react";

const Popup = (props) => {

    const ref = React.useRef();

    const clickOutsideHandler = (ev) => {
        if (ref.current === ev.target)
            props.onCancel();
    }

    return (
        <div className={`popup-hover${props.visibility ? "" : " hidden"}`}
             ref={ref} onClick={clickOutsideHandler}
        >
            <div className={`popup-window${props?.className ? " " + props.className : ""}`}>
                {props.children}
                <span className="close-icon" onClick={props.onCancel}>x</span>
            </div>
        </div>
    );
}

export default Popup;