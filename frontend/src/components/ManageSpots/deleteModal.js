import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpotThunk } from "../../store/spots";

const DeleteModal = ({spot}) => {
  const dispatch = useDispatch();
  const {closeModal} = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(deleteSpotThunk(spot.id))
    closeModal()
  }
  return (
    <>
    <h1>nananana</h1>
    <form onSubmit={e => handleSubmit(e)}>
      <p id="delete-text">Are you sure you want to remove this spot from your listings?</p>
      <button type="submit" id="confirm-delete">Yes</button>
      <button type="button" onClick={() => closeModal()} id="cancel-delete">No</button>
    </form>
    </>
  )
}

export default DeleteModal
