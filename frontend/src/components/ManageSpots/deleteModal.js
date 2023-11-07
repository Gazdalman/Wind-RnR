import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpotThunk } from "../../store/spots";
import { deleteSpotReview, getSpotReviews } from "../../store/reviews";
import "./DeleteModal.css"

const DeleteModal = ({ method, review, spot, type }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type !== "review") {
      await dispatch(deleteSpotThunk(spot.id))
    } else {
      await dispatch(deleteSpotReview(review.id, review.spotId))
      await dispatch(getSpotReviews(review.spotId))
      method(false)
    }
    closeModal()
  }

  return (
    <>
     <h1 id="delete-form-title">Confirm Delete</h1>
      <form className="delete-form" onSubmit={e => handleSubmit(e)}>
        <p style={{width: 200}} id="delete-text">{type === "review" ? "Are you sure you want to delete this review?" : "Are you sure you want to remove this spot from your listings?"}</p>
        <button style={{width: 200, height: 45}} type="submit" id="confirm-delete">Yes ({type === "review" ? "Delete Review" : "Delete Spot"})</button>
        <button type="button" style={{marginBottom: "35px", width: 200, height: 45}} onClick={() => closeModal()} id="cancel-delete">No ({type === "review" ? "Keep Review" : "Keep Spot"})</button>
      </form>
    </>
  )
}

export default DeleteModal
