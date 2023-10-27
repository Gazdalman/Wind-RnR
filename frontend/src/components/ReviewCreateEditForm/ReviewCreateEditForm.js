import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSpotReview } from "../../store/reviews";

const ReviewCreateEditForm = ({ spot }) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [reviewText, setReviewText] = useState("");
  const [activeRating, setActiveRating] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [rating, setRating] = useState(0);
  const [className, setClassName] = useState('');
  const [errors, setErrors] = useState({});

  const onChange = (number) => {
    setRating(parseInt(number));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const review = {
      review: reviewText,
      stars: rating,
      userId: user.id
    }

    await dispatch(addSpotReview(spot.id, review)).then(() =>
      closeModal()
    ).catch(async res => {
      const err = await res.json()
      setErrors({ errors: { ...err } })
    })


  };

  useEffect(() => {
    setDisabled(reviewText.length < 10 || rating <= 0);
    setClassName(disabled ? "disabled" : "ready")
  }, [reviewText, rating, disabled]);

  return errors.errors ? (
    <h1>{errors.errors.message}</h1>
  ) : (
    <div className="create-a-review-modal">
      <form
        onSubmit={e => handleSubmit(e)}>
        <h1>How was your stay?</h1>
        <textarea
          id="review-text"
          rows="8"
          name="review"
          placeholder="Leave your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <div className="rating-input">
          <i
            onMouseOver={() => {
              setActiveRating(1);
            }}
            onMouseLeave={() => {
              setActiveRating(0);
            }}
            onClick={() => {
              setRating(1);
            }}
            className={
              activeRating >= 1 || rating >= 1 ? "fa-solid fa-star" : "fa-regular fa-star"
            }
          />
          <i
            onMouseOver={() => {
              setActiveRating(2);
            }}
            onMouseLeave={() => {
              setActiveRating(0);
            }}
            onClick={() => {
              onChange(2);
            }}
            className={
              (activeRating >= 2 || rating >= 2) ? "fa-solid fa-star" : "fa-regular fa-star"
            }
          />
          <i
            onMouseOver={() => {
              setActiveRating(3);
            }}
            onMouseLeave={() => {
              setActiveRating(0);
            }}
            onClick={() => {
              onChange(3);
            }}
            className={
              activeRating >= 3 || rating >= 3 ? "fa-solid fa-star" : "fa-regular fa-star"
            }
          />
          <i
            onMouseOver={() => {
              setActiveRating(4);
            }}
            onMouseLeave={() => {
              setActiveRating(0);
            }}
            onClick={() => {
              onChange(4);
            }}
            className={
              activeRating >= 4 || rating >= 4 ? "fa-solid fa-star" : "fa-regular fa-star"
            }
          />
          <i
            onMouseOver={() => {
              setActiveRating(5);
            }}
            onMouseLeave={() => {
              setActiveRating(0);
            }}
            onClick={() => {
              onChange(5);
            }}
            className={
              activeRating >= 5 || rating >= 5 ? "fa-solid fa-star" : "fa-regular fa-star"
            }
          />
          <span style={{ fontSize: "15px", marginLeft: "5px" }}>Stars</span>
        </div>
        <button className={className} disabled={disabled}>
          Submit Your Review
        </button>
      </form>

    </div>
  )
}

export default ReviewCreateEditForm
