import BookingForm from "../BookingForm/BookingForm";
import OpenModalButton from "../OpenModalButton";

const CallOutBox = ({spot, avgRating, numReviews }) => {
  const onClick = () => {
    window.alert("Feature Coming Soon!")
  }

  return (
    <div id="call-out-box">
        <div id="COB-top">
          <span id="per-night">${spot.price}/Night</span>
          <span id="reviews-ratings">
            < i
              className="fa-solid fa-star"
              style={{ color: "#f55757" }} />
            {numReviews < 1 ? "NEW" : avgRating }
            {numReviews > 0 &&
              (
                <>
                  <i className="fa-solid fa-clover fa-2xs separator" />
                  <span>{numReviews} {numReviews > 1 ? "Reviews" : "Review"}</span>
                </>
              )
            }
          </span>
        </div>
        <OpenModalButton
        modalComponent={<BookingForm spotId={spot.id}/>}
        modalClasses={["reserve-button"]}
        buttonText={"Reserve Spot"}
        />
      </div>
  )
}

export default CallOutBox;
