import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsIndex from "./components/SpotsIndex";
import SpotShow from "./components/SpotShow/SpotShow";
import CreateOrEditSpotForm from "./components/CreateSpotForm";
import ManageSpots from "./components/ManageSpots/ManageSpots";
import { getAllSpots } from "./store/spots";
import NotFoundForm from "./components/notFoundForm/notFoundForm";
import EditSpot from "./components/EditSpot.js";
import RedirectComponent from "./RedirectComponent";

const App = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(getAllSpots())
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, []);

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
            <Route path="/spots/current">
              <ManageSpots />
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
            <Route path="/unauthorized"></Route>
            <Route path="/not-found">
              <NotFoundForm />
            </Route>
            <Route>
              <RedirectComponent/>
            </Route>
          </Switch>
        )}
      </div>
    </div>
  );
}

export default App;
