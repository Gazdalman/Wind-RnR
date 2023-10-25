import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotReviews } from "../../store/reviews";

const ReviewArea = ({ spot }) => {
  const reviews = useSelector(state => state.reviews);
  const user = useSelector(state => state.session.user);
  const numReviews = [...Object.values(reviews)].length;
  const dispatch = useDispatch();

  let sortedReviews;

  const setDate = (date) => {
    const parts = Date(date).split(' ')
    return `${parts[1]} ${parts[3]}`
  }

  useEffect(() => {
    dispatch(getSpotReviews(spot.id))
  }, [dispatch, spot.id])

  if (numReviews > 0) {
    const compareByDate = (a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    };

   sortedReviews = Object.values(reviews).sort(compareByDate);
  }

  return numReviews > 0 ? (
    <div>
      <div id="review-area-header">
        <span>
        <i className="fa-solid fa-clover">
        <span>{spot.avgRating}</span></i>
        </span>
        <span><i className="fa-solid fa-diamond fa-2xs separator"/><span>{numReviews} {numReviews > 1 ? 'Reviews' : "Review"}</span></span>
      </div>
      {sortedReviews.map(review => (
        <div key={review.id} className="review">
          <h3 >{review.User.firstName}</h3>
          <h4>{setDate(review.createdAt)}</h4>
          <p>{review.review}</p>
        </div>

      ))}
    </div>
  ) : (
    <>
    {(!user || user.id === spot.ownerId) ?
    <h2>No reviews... yet!</h2> : <h2>Be the first to review this spot!</h2>}
    </>
  )
}

export default ReviewArea;
