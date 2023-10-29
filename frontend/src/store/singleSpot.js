import { csrfFetch } from "./csrf";

const GET_ONE = 'spot/getOneSpot';

const getOne = (spot) => {
  return {
    type: GET_ONE,
    spot
  }
}

export const getOneSpot = (spotId) => async dispatch => {
  const res = await fetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spot = await res.json();
    await dispatch(getOne(spot));
    return spot;
  }

  return { broken: 'nope'}
};
