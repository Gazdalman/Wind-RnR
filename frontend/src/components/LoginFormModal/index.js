import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";
import { useHistory } from "react-router-dom";


function LoginFormModal() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const signInDemoUser = () => {
    setCredential('asta@user.io');
    setPassword('password')
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.setUserThunk({ credential, password }))
      .then(() => {
        history.push("/")
        closeModal()
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data) {
          setErrors( {...data});
        }
      });
  };

  return (
    <div className="login-div">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.message && (
          <p>Provided credentials are incorrect.</p>
        )}
        <button
          id="log-in-button"
          disabled={credential.length < 4 || password.length < 6}
          type="submit">Log In</button>
        <button
          id="demo-user-button"
          type="submit"
          onClick={signInDemoUser}>Demo User</button>
      </form>
      <OpenModalMenuItem
      name="banana"
        modalComponent={<SignupFormModal />}
        itemText="... or Sign Up Here"
      />
    </div>
  );
}

export default LoginFormModal;
