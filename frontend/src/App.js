import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginFormPage from "./components/LoginFormPage/index.js";

function App() {
  return (
    <div>
      <Switch>
        <Route exact path='/'>
          <h1>Hello from App</h1>
        </Route>
        <Route path='/login'>
          <LoginFormPage />
        </Route>
      </Switch>
    </div>

  );
}

export default App;
