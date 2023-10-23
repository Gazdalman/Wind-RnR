import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Logo from "./components/Logo/Logo";
import SpotsIndex from "./components/SpotsIndex";
import SpotShow from "./components/SpotShow/SpotShow";

const App = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
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
            <Route path="/spots/:spotId">
              <SpotShow />
            </Route>
          </Switch>
        )}
      </div>
    </div>
  );
}

export default App;
