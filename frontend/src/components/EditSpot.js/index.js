import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import CreateOrEditSpotForm from "../CreateSpotForm";
import NotFoundForm from "../notFoundForm/notFoundForm";
import { getOneSpot } from "../../store/spots";

const EditSpot = () => {
  const check = async () => {
    const res = await dispatch(getOneSpot(spotId));
    if (res.broken) {
      history.replace("/not-found")
    }
  }
  const history = useHistory();
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const user = useSelector(state => state.session.user);
  const spot = useSelector(state => state.spots.requestedSpot);

  useEffect(() => {
    if (!user) {
      history.replace("/");
      window.alert("Please Log In to manage or create spots")
    }
    check()
  }, [check]);


  return (spot && user) ? (
    <>
      {+user.id === +spot.ownerId || user.username === "TheManager" ? <>
        <CreateOrEditSpotForm type={"edit"} spot={spot} />
      </> : <>
        <h1>403: You are NOT AUTHORIZED MY GUY!!!</h1>
      </>
      }
    </>
  ) : null
}

export default EditSpot;
