import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignUpForm.css";
import LoginFormModal from "../LoginFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [allFilled, setAllFilled] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signUpUser({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Passwords do not match"
    });
  };

  useEffect(() => {
    const isShortUsername = username.trim().length < 4;
    const isShortPassword = password.trim().length < 6;
    const isEmpty = (field) => field.trim() === "" || field.trim() === '@';
    const isValidEmail = email ? (email.split('@')[1] && email.split('@')[1].includes('.')) : false;
    setAllFilled(
      !isEmpty(email)
      && !isEmpty(username)
      && !isEmpty(firstName)
      && !isEmpty(confirmPassword)
      && !isEmpty(lastName)
      && !isShortUsername
      && !isShortPassword
      && isValidEmail
    );
  }, [email, username, firstName, lastName, password, confirmPassword]);

  return (
    <div id="signup-div">
      <h1>Sign Up</h1>
      <form style={{ width: '100%'}} id="signup-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            placeholder="example@user.io"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p style={{ fontSize: "13px", color: "red", margin: "5px 0 0 0" }}>{errors.email}</p>}
        <label>
          Username
          <input
            placeholder="4 or more characters"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
        First Name
        {errors.firstName && <p style={{ fontSize: "13px", color: "red", margin: "5px 0 0 0" }}>{errors.firstName}</p>}
          <input
            placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
        Last Name
        {errors.lastName && <p>{errors.lastName}</p>}
          <input
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
        Password
        {errors.password && <p style={{ fontSize: "13px", color: "red", margin: "0px 0 0 0" }}>**Password must be at least 6 characters</p>}
          <input
            placeholder="6 or more characters"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          {errors.confirmPassword && (
        <p>{errors.confirmPassword}</p>
      )}
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />
        </label>
        <button
        id="sign-up-button"
          disabled={!allFilled}
          type="submit">Sign Up</button>
      </form>
      <span>Have an account? <OpenModalMenuItem
        modalComponent={<LoginFormModal />}
        itemText="Log In Here"
      /></span>

    </div>
  );
}

export default SignupFormModal;
