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

  return { broken: 'nope'};
};

export const bookSpot = (spotId, bookingInfo) => async dispatch => {
  const res = await csrfFetch(`api/spots/${spotId}/bookings`, {
    method: 'POST',
    body: JSON.stringify({
      ...bookingInfo
    }),
    user: {
      id: bookingInfo.userId
    }
  });

  if (res.ok) {
    await dispatch(getOneSpot(spotId));
    return 'ok';
  }

  const err = await res.json();
  return err;
}

const singleSpotReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ONE:
    return {...action.spot}

    default:
      return state
  }
}

export default singleSpotReducer;
