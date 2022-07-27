import React, {useContext, useEffect, useState, useCallback} from 'react';
import { TaskContext } from '../../context/TaskContext';
import { Action, Text } from "../../context/constants";
import api from "../../lib/api";
import Note from "../Note";
import Task from "./Task";


const TaskList = () => {
    const { tasks: { data, meta }, dispatch } = useContext(TaskContext);
    const [updated, setUpdated] = useState(false);
    const [isApiError, setApiError] = useState(false);

    const update = useCallback(() => {
        if (updated) return;
        api.filter({
            sort: `${meta.sort.by}:${meta.sort.asc}`,
            limit: meta.pagination.limit,
            offset: meta.pagination.offset,
        })
            .then(resp => {
                dispatch({type: Action.RELOAD_TASKS, data: resp.data, meta: resp.meta });
                setUpdated(true);
                setApiError(false);
            })
            .catch(e => {
                console.error(e);
                setApiError(true);
            });
    }, [data, meta]);

    useEffect(() => {
        update();
        setUpdated(false);
    });

    let idx = 0;
    return (<>
        <div id="task-list">
            { (! isApiError)
                ? data.map((task) => <Task key={idx++} {...task}/>)
                : <Note type="error" text={Text.ERR_TASKS_FETCH}/>
            }
        </div>
    </>);
}

export default TaskList;