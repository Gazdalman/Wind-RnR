import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import Delete from "./deleteModal";
import { NavLink, useHistory } from "react-router-dom";
import { states } from "../../Data/states";
import DeleteModal from "./deleteModal";
import NotFoundForm from "../notFoundForm/notFoundForm";


const ManageSpots = () => {
  const history = useHistory();
  const user = useSelector(state => state.session.user);
  const spots = useSelector(state => state.spots);
  const userSpots = user ? Object.values(spots).filter(spot => spot.ownerId === user.id) : null;

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

  console.log(userSpots);
  return !user ? (<NotFoundForm/>) : (
    <div>
      <h1>Manage Spots</h1>
      {userSpots.map(spot => (
        <div className="spot-card" key={spot.name}>
          <NavLink to={`/spots/${spot.id}`}>
            <div className="image-container">
              <img className="spot-image" alt={spot.name} src={spot.previewImage} />
              <span className="image-tooltip">{spot.name}</span>
            </div>
            <div id="spot-info-upper">
              <span>{spot.city}, {`${abbreviate(spot.state)}`}</span>
              <span id="reviews"><i className="fa-solid fa-clover" style={{ color: "#f55757" }} />{spot.avgRating ? spot.avgRating : "NEW"}</span>
            </div>
            <div id="spot-info-lower"><span id='price'>${spot.price}</span>/night</div>
          </NavLink>
          <button
          onClick={e => history.push(`/spots/${spot.id}/edit`)}
          className="update-spot-button">Update</button>
          <OpenModalButton
          modalClasses={['delete-spot-button']}
          buttonText="Delete"
          modalComponent={<DeleteModal spot={spot}/>}
           />
        </div>
      ))}
    </div>
  )
}

export default ManageSpots;
