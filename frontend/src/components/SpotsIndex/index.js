import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { getAllSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import './SpotsIndex.css';
import { states } from "../../Data/states";

const SpotsIndex = () => {
  const spots = useSelector(state => state.spots)
  const spotsArr = Object.values(spots)
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  const abbreviate = (state) => {
    const parts = state.split(" ");
    if (states[state]) return states[states];

    if (parts.length > 1) {
      let abbr = "";
      parts.forEach(part => {
        abbr+= part[0];
      });

      return abbr
    }

    return `${state[0].toUpperCase()}${state[1].toUpperCase()}`
  }

  useEffect(() => {
    dispatch(getAllSpots())
      .then(() => {
        setIsLoaded(true);
      });
  }, [dispatch])

  return isLoaded ? (
    <div className="spot-index">
      {spotsArr.map(spot => (
        <div className="spot-card" key={spot.id}>
          <NavLink to={`/spots/${spot.id}`}>
            <div className="image-container">
              <img className="spot-image" src={spot.previewImage} />
              <span class="image-tooltip">{spot.name}</span>
            </div>
            <div id="spot-info-upper">
              <span>{spot.city}, {`${abbreviate(spot.state)}`}</span>
              <span id="reviews"><i className="fa-solid fa-clover" style={{ color: "#f55757" }} />{spot.avgRating ? spot.avgRating : "NEW"}</span>
            </div>
            <div id="spot-info-lower"><span id='price'>${spot.price}</span>/night</div>
          </NavLink>
        </div>
      ))}
    </div>

  ) : null;
}

export default SpotsIndex;
