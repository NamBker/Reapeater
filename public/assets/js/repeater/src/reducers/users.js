import * as types from '../constants/ActionTypes';



const initialState = [];
export const users = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_USER:
            return action.users;
        case types.DELETE_USER:
            var users = state;
            var index = -1;
            users.map((user, i) => {
                if (user.id == action.user.id) {
                    index = i;
                }
            });
            return [...users.slice(0, index), ...users.slice(index + 1)];
        default:
            return state;
    }
};

export const user_count = (state = 0, action) => {
    switch (action.type) {
        case types.RECEIVE_USER:
            return action.user_count;
        default:
            return state;
    }
};
