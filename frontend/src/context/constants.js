
export const Action = {  // dispatch
    ADD_TASK: 'ADD_TASK',
    TOGGLE_TASK: 'TOGGLE_TASK',
    UPDATE_TASK: 'UPDATE_TASK',
    CHECK_TASK: 'CHECK_TASK',
    REMOVE_TASK: 'REMOVE_TASK',
    FILTER_TASKS: 'FILTER',
    RELOAD_TASKS: 'RELOAD_TASKS',

    SORT_TASKS: 'SORT_TASKS',

    LOGIN_USER: 'LOGIN_USER',
    SET_USER: 'SET_USER',
    GET_USER: 'GET_USER',
    LOGOUT_USER: 'LOGOUT_USER',

    SET_PAGINATION: 'SET_PAGINATION',
    UPDATE_TASK_OPTS: 'UPDATE_TASK_OPTS'
}


export const SortBy = {  // task list sort
    ID: 'id',
    SUMMARY: 'summary',
    IS_CHECKED: 'isChecked',
    NAME: 'name',
    EMAIL: 'email',
}


export const CtxEvent = {  // subscribe, fire
    SHOW_TASK_EDIT_FORM: 'SHOW_TASK_EDIT_FORM'
}


export const CtxVar = {  // values
    USER_ROLE_ADMIN: 'ADMIN'
}


export const Text = {  // Use wth i18n
    ERR_DEFAULT: 'Something went wrong',
    ERR_TASKS_FETCH: 'Unable to get data',

    ERR_USER_GET: "Unable to get user",
    ERR_USER_SET: "Unable to set user",
    ERR_USER_LOGIN: "User is not found",
    ERR_USER_LOGOUT: "Unable to logout",

    EMPTY_TASK_LIST: "No tasks. Press 'Tab' to focus on the input field. After typing press 'Enter'."
}