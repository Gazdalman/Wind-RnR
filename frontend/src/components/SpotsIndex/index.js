import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { getAllSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import './SpotsIndex.css';

const SpotsIndex = () => {
  const spots = useSelector(state => state.spots)
  const spotsArr = Object.values(spots)
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getAllSpots())
      .then(() => {
        setIsLoaded(true);
      });
  }, [dispatch])

  return isLoaded ? (
    <div>
      <h1>This is all of the spots</h1>
      {spotsArr.map(spot => (
        <div className="spot-card" key={spot.id}>
          <NavLink to={`/spots/${spot.id}`}>
            <img className="spot-image" src={spot.previewImage} />
          </NavLink>
          <span>{spot.city}, {spot.state}</span>
          <span><i className="fa-solid fa-clover" style={{color: "#f55757"}}/>{spot.avgRating}</span>
          <div>${spot.price}/night</div>
        </div>
      ))}
    </div>

  ) : null;
}

export default SpotsIndex;
