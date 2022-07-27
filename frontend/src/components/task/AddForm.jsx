import React, { useContext, useEffect, useState } from 'react'
import { TaskContext } from '../../context/TaskContext';
import { Action } from '../../context/constants';
import api from "../../lib/api";
import Note from "../Note";
import cfg from "../../../config/app.conf";


const AddForm = () => {
    const { user, dispatch } = useContext(TaskContext);

    const [isError, setError] = useState("");
    const [isSuccess, setSuccess] = useState("");
    const [currentValue, setCurrentValue] = useState("");
    const [flash, setFlash] = useState(0);

    const setSE = (_success, _error) => {
        setSuccess(_success);
        setError(_error);
        if (_success) {
            if (flash)
                clearTimeout(flash);
            setFlash(setTimeout(() => setSuccess(""), cfg.FLASH_TIMEOUT_MS));
        }
    }

    useEffect(() => {
        // setSuccess("");

    }, [currentValue])

    const submitHandler = (e) => {
        e.preventDefault();
        const s = e.target.current.value.trim();
        if (!s) {
            setSE("", "Summary can't be empty");
            return;
        } else if (!user.name) {
            setSE("", "User name can't be empty");
            return;
        }

        api.create({summary: s, isChecked: false})
            .then(r => dispatch({ type: Action.ADD_TASK, data: r.data, meta: r.meta, reload: true }))
            .then(_ => {
                setCurrentValue("");
                setSE("Created ...", "");
            })
            .catch(e => {
                if (e?.details) {
                    let res = [];
                    Object.entries(e.details).map(([k, v]) => res.push(`${k}: ${v}`));
                    setSE("", res.join('; '));
                } else {
                    setSE("", e?.message);
                }
            });
    }

    let placeholder;
    if (isSuccess)
        placeholder = isSuccess;
    else
        placeholder = "Add new ...";
    return (
        <div id="top-input" className={`${isError ? "fail" : ""} ${isSuccess ? "success" : ""}`}>
            <form onSubmit={submitHandler}>
                <input type="text" placeholder={placeholder}
                       name="current" value={currentValue} className="big"
                       onChange={(e) => { setCurrentValue(e.target.value); setSE("", "")}}
                />
            </form>
            <Note onError={isError}/>
        </div>
    );
}

export default AddForm;
