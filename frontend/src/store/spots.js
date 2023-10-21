import { csrfFetch } from "./csrf";

const POPULATE_SPOTS = 'spot/populateSpots';
const CHANGE_SPOTS = 'spot/changeSpots';
const DELETE_SPOT = 'spot/deleteSpot';

const populateSpots = (spots) => {
  return {
    type: POPULATE_SPOTS,
    spots
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

export const getAllSpots = () => async dispatch => {
  const res = await fetch('/api/spots');

  if (res.ok) {
    const spots = await res.json();
    dispatch(populateSpots(spots))
    return spots
  }
}

const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case POPULATE_SPOTS:
      const newState = {};
      action.spots.forEach(spot => {
        newState[spot.id] = spot
      });

      return newState;

    default:
      break;
  }
}

export default spotsReducer;
