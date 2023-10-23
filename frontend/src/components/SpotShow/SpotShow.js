import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useEffect, useState } from "react"
import { getOneSpot } from "../../store/spots"

const SpotShow = () => {
  const [previewImage, setPreviewImage] = useState(null);

  const dispatch = useDispatch()
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots.requestedSpot)

  useEffect(() => {
    dispatch(getOneSpot(spotId))
  }, [dispatch])

  useEffect(() => {
    if (spot)
      setPreviewImage({ ...(spot.SpotImages.find(image => image.preview == true)) })
  }, [spot])


  return !spot || !previewImage ? null : (
    <div id="spot-show">
      <h1>{spot.name}</h1>
      <img src={previewImage.url} />
      {spot.SpotImages.map(image => (
        image.id !== previewImage.id ? (
          <img key={image.id} src={image.url} alt={`Image ${image.id}`} />
        ) : null
      ))}

    </div>
  )
}

export default SpotShow
