import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'review/getReviews';
const DELETE_REVIEW = 'review/deleteReview';

const getReviews = (reviews) => {
  return {
    type: GET_REVIEWS,
    reviews
  }
}

// const deleteReview = (reviewId) => {
//   return {
//     type: ADD_REVIEW,
//     reviewId
//   }
// }

export const getSpotReviews = (spotId) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const reviews = await res.json()
    dispatch(getReviews(reviews))
    return reviews;
  }
}

export const addSpotReview = (spotId, review) => async dispatch => {

    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        ...review
      }),
      user: {
        id: review.userId
      }
    });

    await dispatch(getSpotReviews(spotId))
    return res.json()
}

export const deleteSpotReview = (reviewId, spotId) => async dispatch => {
  await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  });

  dispatch(getSpotReviews(spotId))
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
