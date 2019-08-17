import { AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from "../actions/actionsTypes";

const initialState = {
  token: null,
  expire: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SET_TOKEN:
      return {
        ...state,
        token: action.token,
        expire: action.expire
      };

    case AUTH_REMOVE_TOKEN:
      return {
        ...state,
        token: null,
        expire: null
      };

    default:
      return state;
  }
};

export default authReducer;
