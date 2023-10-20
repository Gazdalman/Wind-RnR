import { csrfFetch } from "./csrf";

const SET_USER = 'session/setUser';
const UNSET_USER = 'session/unsetUser';

export const setUser = (user) => {
  return {
    type: SET_USER,
    user
  }
}

export const unsetUser = () => {
  return {
    type: UNSET_USER
  }
}

export const setUserThunk = (payload) => async dispatch => {
  const { credential, password } = payload;
  const res = await csrfFetch('/api/session', {
    method: 'POST',
    body:
    JSON.stringify({
      credential,
      password,
      addDates: true
    })
    // payload
  })

  if (res.ok) {
    const user = await res.json();
    console.log(user);
    dispatch(setUser(user));
    return user;
  }

};

const initialState = {user: null}
const sessionReducer = (state = initialState, action)  => {
  switch (action.type) {
    case SET_USER:
      return {...action.user};
    case UNSET_USER:
      return {...state, user: null}
    default:
      return state
  }
}

export default sessionReducer;
