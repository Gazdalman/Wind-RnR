import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import "./ManageSpots.css"
import { NavLink, useHistory } from "react-router-dom";
import { states } from "../../Data/states";
import DeleteModal from "./deleteModal";
import NotFoundForm from "../notFoundForm/notFoundForm";
import { useEffect } from "react";
import { getAllSpots } from "../../store/spots";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.session.user);
  const spots = useSelector(state => state.spots);
  const managerSpots = user.username === "TheManager" ? Object.values(spots) : null
  const userSpots = user ? Object.values(spots).filter(spot => spot.ownerId === user.id) : null;
  const abbreviate = (state) => {
    const parts = state.split(" ");
    if (states[state]) return states[states];

    if (parts.length > 1) {
      let abbr = "";
      parts.forEach(part => {
        abbr += part[0];
      });

      return abbr
    }

    return `${state[0].toUpperCase()}${state[1].toUpperCase()}`
  }

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch])

  return !user ? (<NotFoundForm />) : (
    <>
      <h1 id="user-spots-title">Manage Spots</h1>
      {user.username !== "TheManager" && !userSpots.length > 0 ?
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <button id="create-spot" style={{ width: "fit-content" }} onClick={() => history.push("/spots/create")}>Create a New Spot</button>
        </div>

        : null}
      <div className="manage-spots">
        {user.username !== "TheManager" ? userSpots.map(spot => (
          <div className="spot-card" key={spot.name}>
            <NavLink to={`/spots/${spot.id}`}>
              <div className="image-container">
                <img className="spot-image" alt={spot.name} src={spot.previewImage} />
                <span className="image-tooltip">{spot.name}</span>
              </div>
              <div id="spot-info-upper">
                <span>{spot.city}, {`${abbreviate(spot.state)}`}</span>
                <span id="reviews"><i className="fa-solid fa-star" style={{ color: "#f55757" }} />{spot.avgRating ? spot.avgRating : "NEW"}</span>
              </div>
              <div id="spot-info-lower"><span id='price'>${spot.price}</span>/night</div>
            </NavLink>

            <div id="spots-manage-buttons">
              <button
                onClick={e => history.push(`/spots/${spot.id}/edit`)}
                className="update-spot-button">Update</button>
              <OpenModalButton
                modalClasses={['delete-spot-button']}
                buttonText="Delete"
                modalComponent={<DeleteModal spot={spot} />}
              />
            </div>

          </div>
        )) : managerSpots.map(spot => (
          <div className="spot-card" key={spot.name}>
            <NavLink to={`/spots/${spot.id}`}>
              <div className="image-container">
                <img className="spot-image" alt={spot.name} src={spot.previewImage} />
                <span className="image-tooltip">{spot.name}</span>
              </div>
              <div id="spot-info-upper">
                <span>{spot.city}, {`${abbreviate(spot.state)}`}</span>
                <span id="reviews"><i className="fa-solid fa-star" style={{ color: "#f55757" }} />{spot.avgRating ? spot.avgRating : "NEW"}</span>
              </div>
              <div id="spot-info-lower"><span id='price'>${spot.price}</span>/night</div>
            </NavLink>

            <div id="spots-manage-buttons">
              <button
                onClick={e => history.push(`/spots/${spot.id}/edit`)}
                className="update-spot-button">Update</button>
              <OpenModalButton
                modalClasses={['delete-spot-button']}
                buttonText="Delete"
                modalComponent={<DeleteModal spot={spot} />}
              />
            </div>

          </div>
        ))}

      </div>
    </>
  )
}

export default ManageSpots;
