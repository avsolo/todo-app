import { Action } from "./constants";
import {mergeDict} from "../lib/utils";


const taskReducer = (state, action) => {

    let tasks = state.data;

    const findIndex = (idx) => {
        let taskIndex = tasks.findIndex(t => t.id === idx);
        if (taskIndex === -1)
            console.error("Index not found", idx);
        return taskIndex;
    }

    // const updMeta = (meta) => Object.assign({}, state.meta, meta);
    const updMeta = (meta) => mergeDict({}, state.meta, meta);

    switch (action.type) {
        case Action.ADD_TASK: {
            return { data: state.data,  meta: updMeta(action.meta) };
        }

        case Action.TOGGLE_TASK: {
            tasks[findIndex(action.task.id)].isChecked = action.task.isChecked;
            return { data: [...tasks],  meta: state.meta };
        }

        case Action.UPDATE_TASK: {
            tasks[findIndex(action.task.id)] = action.task;
            return { data: [...tasks],  meta: state.meta };
        }

        case Action.REMOVE_TASK: {
            let _tasks = tasks.filter(el => el.id !== action.id);
            return { data: [_tasks],  meta: state.meta };
        }

        case Action.SORT_TASKS: {
            const _meta = {
                sort: {
                    by: action.by,
                    asc: (action.by === state.meta.sort.by) ? ! state.meta.sort.asc : true
                }
            };
            return { data: state.data,  meta: updMeta(_meta) };
        }

        case Action.RELOAD_TASKS: {
            return { data: action.data,  meta: updMeta(action.meta) };
        }

        case Action.UPDATE_TASK_OPTS: {
            return { data: state.data,  meta: updMeta(action.meta) };
        }

        default: { return state; }
    }
}

export default taskReducer;