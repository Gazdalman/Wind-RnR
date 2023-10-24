import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'review/getReviews'

const getReviews = (reviews) => {
  return {
    type: GET_REVIEWS,
    reviews
  }
}

export const getSpotReviews = (spotId) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const reviews = await res.json()
    dispatch(getReviews(reviews))
    return reviews;
  }
}

let newState;

const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_REVIEWS:
      newState = [...action.reviews.Reviews]
      // action.reviews.Reviews.map(review => {
      //   newState[review.id] = review
      // })
    return newState;

    default:
      return state;
  }
}

export default reviewReducer;
