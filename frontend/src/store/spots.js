import { csrfFetch } from "./csrf";

const POPULATE_SPOTS = 'spot/populateSpots';
const GET_ONE = 'spot/getOneSpot';
const CHANGE_SPOTS = 'spot/changeSpots';
const DELETE_SPOT = 'spot/deleteSpot';

const populateSpots = (spots) => {
  return {
    type: POPULATE_SPOTS,
    spots
  }
}

const getOne = (spot) => {
  return {
    type: GET_ONE,
    spot
  }
}

const changeSpots = (spot) => {
  return {
    type: CHANGE_SPOTS,
    spot
  }
}

const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId
  }
}

export const getOneSpot = (spotId) => async dispatch => {
  const res = await fetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spot = await res.json();
    dispatch(getOne(spot));
    return spot;
  }

  return res;
};

export const getAllSpots = () => async dispatch => {
  const res = await csrfFetch('/api/spots');

  if (res.ok) {
    const spots = await res.json();
    dispatch(populateSpots(spots))
    return spots
  }
}

let newState
let allSpots;

const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case POPULATE_SPOTS:
      newState = {};
      action.spots.Spots.forEach(spot => {
        newState[spot.id] = spot;
      });
      allSpots = {...newState}
      return newState;

    case GET_ONE:
      newState = { ...state, requestedSpot: { ...action.spot } }
      return newState;

    default:
      return state
  }
}

export default spotsReducer;
