import { useDispatch } from "react-redux"
import { useParams, useHistory } from "react-router-dom";

const BookingForm = ({spotId}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  console.log(spotId);

  return (
    <div id="booking-form-div">
      <h1>Book This Spot</h1>
      <form>
        
      </form>
    </div>
  )

}

export default BookingForm;
