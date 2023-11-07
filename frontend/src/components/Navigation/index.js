import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='nav-links'>
      <li>
        <NavLink exact to="/">
          <i className="fa-solid fa-wind fa-xs logo">
            <span className='logo-name'>Wind RnR</span>
          </i>
        </NavLink>
      </li>
      {isLoaded && (
        <li className='pb-li'>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
