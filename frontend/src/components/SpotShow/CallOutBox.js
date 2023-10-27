const CallOutBox = ({spot, avgRating}) => {
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
            {avgRating !== "NaN" ? avgRating : "NEW"}
            {spot.numReviews > 0 &&
              (
                <>
                  <i className="fa-solid fa-clover fa-2xs seperator" />
                  <span>{spot.numReviews} {spot.numReviews > 1 ? "Reviews" : "Review"}</span>
                </>
              )
            }
          </span>
        </div>
        <button
        onClick={onClick}
        id="reserve-button">Reserve</button>
      </div>
  )
}

export default CallOutBox;
