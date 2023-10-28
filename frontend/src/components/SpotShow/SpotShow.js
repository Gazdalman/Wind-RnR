import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { getOneSpot } from "../../store/spots"
import CallOutBox from "./CallOutBox"
import ReviewArea from "./ReviewArea"
import "./SpotShow.css"

const SpotShow = () => {
  const [previewImage, setPreviewImage] = useState({ url: "https://cdn.drawception.com/images/panels/2017/5-21/pKkCMdsbbp-1.png" });
  const [isLoaded, setIsLoaded] = useState(false);
  const [revAvg, setRevAvg] = useState(0);
  const [numReviews, setNumReviews] = useState(0)
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots.requestedSpot);

  let count = 0

  useEffect(() => {
    setIsLoaded(true)
    dispatch(getOneSpot(spotId))
  }, [dispatch, spotId])

  useEffect(() => {
    if (spot && spot.SpotImages.length > 0) setPreviewImage({ ...(spot.SpotImages.find(image => image.preview === true)) })
  }, [spot])


  return spot && isLoaded ? (
    <div id="spot-show">
      <h1 id="spot-name">{spot.name}</h1>
      <h3>{spot.city}, {spot.state}, {spot.country}</h3>
      <div id="spot-images-container">
        <img id="preview-image" src={previewImage.url} alt={`Spot ${spot.id}`} />
        <span id="none-prev">
          {spot.SpotImages.length > 0 && spot.SpotImages.map(image => (
            image.id !== previewImage.id ? (
              <img className="spot-img" id={`img-${count++}`} key={image.id} src={image.url} alt={`Spot ${image.id}`} />
            ) : null
          ))}
        </span>

      </div>
      <h2 id="spot-owner">Hosted by {spot.Owner.firstName} {spot.Owner.lastName !== 'N/A' ? spot.Owner.lastName : ' '}</h2>
      <div id="spot-details-lower">
        <p id="spot-description">{spot.description}</p>
        <CallOutBox numReviews={numReviews} avgRating={revAvg.toFixed(1)} spot={spot} />
      </div>
      <ReviewArea setRevAvg={setRevAvg} numRevs={setNumReviews} revAvg={revAvg} spot={spot} />
    </div>
  ) : (
    <div className="not-found">
      <h1>404: Page Not Found</h1>
      <h3>We tried though `\_(*_*)_/`</h3>
    </div>
  )
}

export default SpotShow
