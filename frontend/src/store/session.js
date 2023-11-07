import { csrfFetch } from "./csrf";

const SET_USER = 'session/setUser';
const UNSET_USER = 'session/unsetUser';

const setUser = (user) => {
  return {
    type: SET_USER,
    user
  }
}

const unsetUser = () => {
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
  })

  if (res.ok) {
    const user = await res.json();
    dispatch(setUser(user));
    return user;
  }
  return res.json()
};

export const restoreUser = () => async dispatch => {
  const res = await csrfFetch('/api/session');

  if (res.ok) {
    const user = await res.json();
    dispatch(setUser(user));
    return res;
  }
}

export const signUpUser = (payload) => async dispatch => {
  const res = await csrfFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      addDates: true
    })
  })

  if (res.ok) {
   const user = await res.json();
   dispatch(setUser(user));
   return user;
  }
}

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(unsetUser());
  return response;
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
