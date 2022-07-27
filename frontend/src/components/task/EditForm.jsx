import React, { useContext, useEffect, useState } from "react";
import { formToDict } from "../../lib/utils";
import { TaskContext } from "../../context/TaskContext";
import { Action, CtxEvent } from "../../context/constants";
import api from "../../lib/api";
import Popup from "../Popup";
import Note from "../Note";
import Input from "../Input";
import {i18n} from "../../context/i18n";


const EditForm = () => {

    const { dispatch, subscribe } = useContext(TaskContext);
    const [data, setData] = useState({});
    const [visibility, setVisibility] = useState(false);
    const [isError, _setError] = useState({});
    const [isValid, setValid] = useState(true);

    const setError = (key, message) => _setError(Object.assign({}, isError, {[key]: message}));

    useEffect(() => {
        setValid( ! Object.entries(isError).some( (pair) => pair[1]) );
    }, [isError]);

    subscribe(CtxEvent.SHOW_TASK_EDIT_FORM, (resp) => {
        setData(Object.assign({}, resp));
        _setError({});
        setVisibility(true);
    });

    const handleSubmit = (ev) => {
        ev.preventDefault();
        let data = formToDict(ev.target, {parseInt: ['id']});
        api.update(data.id, data).then(resp => {
            dispatch({ type: Action.UPDATE_TASK, task: resp})
        }).then(_ => {
            setVisibility(false);
            _setError({});
        }).catch(e => {
            _setError(e?.details ?  e.details : { ...isError, "api": e.message});
        });
    }

    const handleFieldChange = (ev) => {
        setData(prevData => ({...prevData, [ev.target.name]: ev.target.value}));
        setError(ev.target.name, false);
    }

    return ({visibility} &&
        <Popup visibility={visibility} onCancel={_ => setVisibility(false)}>
            <form id="task-edit" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="input-group">
                        <label htmlFor="summary" className={isError?.summary ? "fail" : ""}>
                            {i18n("summary")}
                            {isError?.summary ? <span className="fail">{` ${isError?.summary}`}</span> : ""}
                        </label>
                        <input type="text" name="summary" value={data?.summary || ''}
                               className={`row ${isError?.summary ? "fail" : ''}`} onChange={handleFieldChange}
                        />
                    </div>
                </div>

                <div className="row-flex">
                    {["name", "email"].map(f =>
                        <div className="input-group" key={`_${f}`}>
                            <label htmlFor={f} className={isError?.[f] ? "fail" : ""}>
                                {i18n("summary")}
                                {isError?.[f] ? <span className="fail">{` ${isError?.[f]}`}</span> : ""}
                            </label>
                            <input type="text" name={f} value={data?.[f] || ''}
                                   className={`row ${isError?.[f] ? "fail" : ''}`} onChange={handleFieldChange}
                            />
                        </div>
                    )}
                </div>

                <input type="hidden" name="id" value={data?.id || ''} />
                <Note onError={isError?.api} size="small"/>
                <input type="submit" disabled={!isValid} name="submit" defaultValue="Save"/>
            </form>
        </Popup>
    );
}

export default EditForm;