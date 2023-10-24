import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { getOneSpot } from "../../store/spots"
import CallOutBox from "./CallOutBox"
import ReviewArea from "./ReviewArea"

const SpotShow = () => {
  const [previewImage, setPreviewImage] = useState({ url: "https://cdn.drawception.com/images/panels/2017/5-21/pKkCMdsbbp-1.png" });

  const dispatch = useDispatch()
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots.requestedSpot)


  useEffect(() => {
    dispatch(getOneSpot(spotId))
  }, [dispatch, spotId])

  useEffect(() => {
    if (spot && spot.SpotImages.length > 0) setPreviewImage({ ...(spot.SpotImages.find(image => image.preview === true)) })
  }, [spot])


  return !spot ? (
    <div className="not-found">
      <h1>404: Page Not Found</h1>
      <h3>We tried though `\_(*_*)_/`</h3>
    </div>
  ) : (
    <div id="spot-show">
      <h1>{spot.name}</h1>
      <h3>{spot.city}, {spot.state}, {spot.country}</h3>
      <img src={previewImage.url} alt={`Spot ${spot.id}`}/>
      {spot.SpotImages.length > 0 && spot.SpotImages.map(image => (
        image.id !== previewImage.id ? (
          <img key={image.id} src={image.url} alt={`Spot ${image.id}`} />
        ) : null
      ))}
      <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName !== 'N/A' ? spot.Owner.lastName : ' '}</h2>
      <br />
      <p>{spot.description}</p>
        <CallOutBox spot={spot}/>
        <ReviewArea spot={spot}/>
    </div>
  )
}

export default SpotShow
