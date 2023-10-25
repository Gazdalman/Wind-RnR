import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsIndex from "./components/SpotsIndex";
import SpotShow from "./components/SpotShow/SpotShow";
import CreateOrEditSpotForm from "./components/CreateSpotForm";
import { getAllSpots } from "./store/spots";
import NotFoundForm from "./components/notFoundForm/notFoundForm";
import EditSpot from "./components/EditSpot.js";

const App = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(getAllSpots())
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div>
      <nav>
        <Navigation isLoaded={isLoaded} />
      </nav>
      <div className="app-div">
        {isLoaded && (
          <Switch>
            <Route exact path="/">
              <SpotsIndex />
            </Route>
            <Route path="/spots/create">
              <CreateOrEditSpotForm type={"create"}/>
            </Route>
            <Route path="/spots/:spotId/edit">
              <EditSpot />
            </Route>
            <Route exact path="/spots/:spotId">
              <SpotShow />
            </Route>
            <Route>
              <NotFoundForm />
            </Route>
          </Switch>
        )}
      </div>
    </div>
  );
}

export default App;
