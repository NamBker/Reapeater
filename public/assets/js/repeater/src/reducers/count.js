
const initialState = 0;
export const count = (state = initialState, action) => {
    if (action.count) {
        return action.count;
    }
    return state;
};
