import React, {createContext, useReducer} from 'react';
import taskReducer from './taskReducer';
import userReducer from "./userReducer";
export const TaskContext = createContext(null);


const TaskContextProvider = (props) => {

    let subscribers = {};

    const subscribe = (event, callback) => {
        if (! (event in subscribers))
            subscribers[event] = [];
        if (subscribers[event].indexOf(callback) === -1)
            subscribers[event].push(callback);
    }

    const fire = (event, data) => {
        if (event in subscribers)
            subscribers[event].map(c => c(data));
    }

    const [tasks, dispatchTasks] = useReducer(taskReducer, {
        data: [],
        meta: {
            count: -1,
            pagination: { limit: 3, offset: 0 },
            sort: {by: 'id', asc: false}
        }
    }, undefined);

    const [user, dispatchUser] = useReducer(userReducer, {
        name: '',
        email: '',
        role: ''
    }, undefined);

    const dispatch = (action) => [dispatchUser, dispatchTasks].forEach(fn => fn(action));

    return (
        <TaskContext.Provider value={{tasks, user, subscribe, fire, dispatch}}>
            {props.children}
        </TaskContext.Provider>
    )
}

export default TaskContextProvider;
