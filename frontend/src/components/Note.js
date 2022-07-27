import React from 'react'


const Note = (props) => {
    const size = props?.size || "mid";

    let cls, text;
    if (props?.onError) {
        cls = 'fail';
        text = props.onError;
    } else if (props?.onSuccess) {
        cls = 'success'
        text = props.onSuccess;
    } else {
        cls = props?.type || "";
        text = props.text;
    }

    let style = {};
    if (props?.reserveSpace)
        style = { height: '1rem' };
    if (props?.inline)
        style = { display: 'inline-block' };

    return <div className={`note ${cls} ${size}`} style={style}>{text}</div>;
}

export default Note;
