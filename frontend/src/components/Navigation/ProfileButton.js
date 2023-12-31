import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { NavLink, useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/')
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {user &&
        <span id="create-spot-link">
          <NavLink to="/spots/create">
            Create New Spot
          </NavLink>
        </span>}

      <button className="profile-button" onClick={openMenu}>
        <i className="fa-solid fa-bars" style={{ fontSize: "15px" }} />
        <i className="fas fa-user-circle" style={{ fontSize: "15px" }} />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className="user-info">
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li className="spots-link" >
              <NavLink to='/spots/current'>Manage Spots</NavLink>
            </li>
            <li className='modal' onClick={logout}>Log Out</li>
          </div>
        ) : (
          <div className="login-signup">
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
