import { csrfFetch } from "./csrf";

const GET_ONE = 'spot/getOneSpot';

const getOne = (spot) => {
  return {
    type: GET_ONE,
    spot
  }
}

export const getOneSpot = (spotId) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spot = await res.json();
    await dispatch(getOne(spot));
    return spot;
  }

  return { broken: 'nope'}
};

const singleSpotReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ONE:
    return {...action.spot}

    default:
      return state
  }
}

export default singleSpotReducer;
