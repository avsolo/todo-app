import { Action } from "./constants";


const userReducer = (state, action) => {
    switch (action.type) {
        case Action.LOGIN_USER: {
            return action.data;
        }

        case Action.LOGOUT_USER: {
            return {user: null, email: null, role: null};
        }

        case Action.SET_USER: {
            return action.data
        }

        default: {
            return state;
        }
    }
}

export default userReducer;