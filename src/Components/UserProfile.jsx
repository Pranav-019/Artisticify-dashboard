import React from 'react';
import { Button } from '.';
import { useStateContext } from '../Contexts/ContextProvider';

const UserProfile = ({ onLogout }) => {
  const { currentColor } = useStateContext();

  const handleLogout = () => {
    // Simply clear all the authentication and theme data from localStorage
    localStorage.clear();
    
    // Call the onLogout function to update the parent state (App.js)
    onLogout(); // Prop passed from App.js to update authentication state
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="mt-5">
      </div>
    </div>
  );
};

export default UserProfile;
