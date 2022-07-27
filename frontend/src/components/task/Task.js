import React, {useContext, useEffect, useState} from 'react';
import { TaskContext } from '../../context/TaskContext';
import { Action, CtxEvent, CtxVar } from '../../context/constants';
import api from "../../lib/api";

const Task = (props) => {

    const css = { isChecked: "checked",  notChecked: "not-checked" };
    const { user: { role }, dispatch, fire } = useContext(TaskContext);
    const [data, setData] = useState(props);

    useEffect(() => setData(props), [props]);

    const handleCheckboxClick = (isChecked) => {
        api.update(data.id, {isChecked: isChecked})
            .then(_ => dispatch({
                type: Action.TOGGLE_TASK,
                task: {id: data.id, isChecked: isChecked}
            }));
    }

    const handleDoubleClick = (ev) => {
        ev.preventDefault();
        fire(CtxEvent.SHOW_TASK_EDIT_FORM, data);
    }

    const canEdit = role === CtxVar.USER_ROLE_ADMIN;
    return (<>
        <div key={data.id} onDoubleClick={canEdit ? handleDoubleClick : (_) => false}
             className={`task ${data?.isChecked ? css.isChecked : css.notChecked}`}
        >
            <input type="checkbox" className="radio"
                   disabled={!(role === CtxVar.USER_ROLE_ADMIN)}
                   checked={data.isChecked ? "checked" : ""}
                   onChange={_ => handleCheckboxClick(! data.isChecked)}
            />
            <div className="content">
                <div className="summary">{data.summary}</div>
                <div className="meta">
                    <small className="id">#{data.id}</small>
                    <small className="user-name">
                        {data?.name || '?'}&nbsp;&lt;{data?.email || '?'}&gt;
                    </small>
                    {data?.updatedBy ? <small className="updated-by">{`Updated by: ${data.updatedBy}`}</small> : ""}
                </div>
            </div>
        </div>
    </>)
}

export default Task;
