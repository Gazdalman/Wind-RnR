import { csrfFetch } from "./csrf";

const POPULATE_SPOTS = 'spot/populateSpots';
const ADD_IMAGES = 'spot/images'
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
  const res = await csrfFetch('/api/spots');

  if (res.ok) {
    const spots = await res.json();
    dispatch(populateSpots(spots))
    return spots
  }
}

export const editSpot = (spot, spotId, images) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...spot
    }),
    user: {
      id: spot.ownerId
    }
  })

  if (res.ok) {
    const spot = await res.json()
    const newImagesPromise = await csrfFetch(`/api/spots/${spot.id}/images`, {
      method: 'PUT',
      body: JSON.stringify({
        images
      }),
      user: {
        id: spot.ownerId
      }
    })
    const allImages = newImagesPromise.json()

    return allImages
  }

  return res.json();
}

export const createSpot = (spot) => async dispatch => {
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify({
      ...spot
    }),
    user: {
      id: spot.ownerId
    }
  });

  if (res.ok) {
    const spot = await res.json();
    dispatch(changeSpots(spot))
    return spot
  }

  return res.json()
}

export const addImages = (spotId, images) => async dispatch => {
  await images.forEach(image => {
    csrfFetch(`/api/spots/${spotId}/images`, {
      method: 'POST',
      body: JSON.stringify({
        ...image
      })
    })
  })
  return null
}

export const deleteSpotThunk = (spotId, userId) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
    user: {
      id: userId
    }
  });
  dispatch(deleteSpot(spotId))
  return res
}

let newState
// let allSpots
const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case POPULATE_SPOTS:
      newState = {};
      action.spots.Spots.forEach(spot => {
        newState[spot.id] = spot;
      });
      // allSpots = {...newState}
      return newState;
      
    case CHANGE_SPOTS:
      newState = { ...state, [action.spot.id]: action.spot }
      return newState

    case ADD_IMAGES:
      return { ...state }

    case DELETE_SPOT:
      newState = { ...state }
      delete newState[action.spotId]
      return newState

    default:
      return state
  }
}

export default spotsReducer;
