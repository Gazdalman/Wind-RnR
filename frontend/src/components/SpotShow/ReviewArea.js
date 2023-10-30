import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import ReviewCreateEditForm from "../ReviewCreateEditForm/ReviewCreateEditForm";
import { useState } from "react";
import DeleteModal from "../ManageSpots/deleteModal";

const ReviewArea = ({ spot, setRevAvg, revAvg, numRevs }) => {
  const [userReviewed, setUserReviewed] = useState(false);
  const revs = useSelector(state => state.reviews);
  // eslint-disable-next-line
  const reviews = (revs && revs.length > 0 ? [...revs] : [])
  const user = useSelector(state => state.session.user);
  const numReviews = [...Object.values(reviews)].length;
  const dispatch = useDispatch();

  let sortedReviews;

  numRevs(numReviews)

  const setDate = (date) => {
    const parts = Date(date).split(' ')
    return `${parts[1]} ${parts[3]}`
  }

  useEffect(() => {
    dispatch(getSpotReviews(spot.id))
  }, [dispatch, spot.id])

  useEffect(() => {
    if (reviews.length > 0 && user) {
      const userReview = reviews.filter(review => review.userId === user.id);
      if (userReview[0]) setUserReviewed(true);
      const totalStars = reviews.reduce((accumulator, review) => accumulator + review.stars, 0);
      setRevAvg(totalStars / reviews.length);
    } else if (reviews.length > 0) {
      const totalStars = reviews.reduce((accumulator, review) => accumulator + review.stars, 0);
      setRevAvg(totalStars / reviews.length);
    }

  }, [reviews, user, setRevAvg])

  if (numReviews > 0) {
    const compareByDate = (a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    };

    sortedReviews = Object.values(reviews).sort(compareByDate);
  }
  return numReviews > 0 ? (
    <div>
      <div className="review-area-header">
        <span>
          <i className="fa-solid fa-star">
            <span>{revAvg.toFixed(1)}</span></i>
        </span>
        <span><i className="fa-solid fa-clover fa-2xs separator" /><span id="num-reviews">{numReviews} {numReviews > 1  ? 'Reviews' : "Review"}</span></span>
      </div>
      <div className="post-button">
        {(user && user.id !== spot.ownerId && !userReviewed) &&
          <OpenModalButton
            modalClasses={["review-form-button"]}
            modalComponent={<ReviewCreateEditForm spot={spot} />}
            buttonText={"Post a Review"}
          />}
      </div>
      {sortedReviews.map(review => (
        <div key={review.id} className="review">
          <h3 >{review.User.firstName}</h3>
          <h4 id="rev-date">{setDate(review.createdAt)}</h4>
          <p>{review.review}</p>
          {user ? (user.id === review.userId || user.username === "TheManager") && <div className="review-buttons">
            <OpenModalButton
              onButtonClick={() => dispatch(getSpotReviews(spot.id))}
              modalClasses={["review-delete-button"]}
              modalComponent=
              {<DeleteModal
                method={setUserReviewed}
                type={"review"}
                review={review} />}
              buttonText={"Delete"}
            />
          </div> : null}
        </div>

      ))}
    </div>
  ) : (
    <>
      <span className="review-area-header">
        < i
          className="fa-solid fa-star"
          style={{ color: "#f55757" }} />
        NEW
      </span>
      <div className="post-button">
        {(user && user.id !== spot.ownerId) &&
          <OpenModalButton
          modalClasses={['create-review-button']}
            modalComponent={<ReviewCreateEditForm spot={spot} />}
            buttonText={"Post a Review"}
          />}
      </div>
      {(!user || user.id === spot.ownerId) ?
        <h2>No reviews... yet!</h2> : <h2>Be the first to review this spot!</h2>}
    </>
  )
}

export default ReviewArea;
