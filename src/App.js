import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import axios from 'axios';

import { Navbar, Footer, Sidebar, ThemeSettings } from './Components';
import {
  Ecommerce,
  Orders,
  Calendar,
  DigitalMarketing,
  Stacked,
  Pyramid,
  Customers,
  Kanban,
  Line,
  Area,
  Bar,
  Pie,
  Financial,
  ColorPicker,
  ColorMapping
} from './Pages';
import './App.css';
import Crm from './Pages/Crm';
import Packages from './Pages/Packages';
import OurWork from './Pages/ourWork';
import Newsletter from './Pages/newsLetter';
import { useStateContext } from './Contexts/ContextProvider';
import Design from './Pages/Design';
import Quotation from './Pages/Quotation';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    JSON.parse(localStorage.getItem('isAuthenticated')) || false
  );

  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, [setCurrentColor, setCurrentMode]);

  // Handle logout by clearing authentication data
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('colorMode');
    localStorage.removeItem('themeMode');
  };

  // Handle login by setting authentication data
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', true);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (sessionStorage.getItem('isTabClosed')) {
        handleLogout();
      }
    };

    // Set flag when the page is being closed
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('isTabClosed', 'true');
    });

    if (!sessionStorage.getItem('isTabClosed')) {
      sessionStorage.setItem('isTabClosed', 'false');
    }

    // Cleanup event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      sessionStorage.removeItem('isTabClosed');
    };
  }, []);

  // If the user is not authenticated, show the login form
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Otherwise, show the main application dashboard
  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
          <TooltipComponent content="Settings" position="Top">
            <button
              type="button"
              onClick={() => setThemeSettings(true)}
              style={{ background: currentColor, borderRadius: '50%' }}
              className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
        {activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        )}
        <div
          className={
            activeMenu
              ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
              : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
          }
        >
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar onLogout={handleLogout} />
          </div>
          <div>
            {themeSettings && <ThemeSettings />}
            <Routes>
              {/* Default route to Ecommerce (revenue) page */}
              <Route path="/revenue" element={<Ecommerce />} />
              {/* pages */}
              <Route path="/orders" element={<Orders />} />
              <Route path="/digitalmarketing" element={<DigitalMarketing />} />
              <Route path="/design" element={<Customers />} />
              <Route path="/crm" element={<Crm />} />
              <Route path="/Packages" element={<Packages />} />
              <Route path="/Our-Work" element={<OurWork />} />
              <Route path="/design-drop" element={<Design/>} />
              <Route path="/NewsLetter" element={<Newsletter />} />
              <Route path="/Quotation" element={<Quotation />} />
              {/* apps */}
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/color-picker" element={<ColorPicker />} />
              {/* charts */}
              <Route path="/line" element={<Line />} />
              <Route path="/area" element={<Area />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/financial" element={<Financial />} />
              <Route path="/color-mapping" element={<ColorMapping />} />
              <Route path="/pyramid" element={<Pyramid />} />
              <Route path="/stacked" element={<Stacked />} />
              {/* Redirect to revenue if no matching route */}
              <Route path="*" element={<Navigate to="/revenue" />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userId && password) {
      try {
        const response = await axios.post(
          `https://artisticify-backend.vercel.app/api/users/getUser/${userId}`,
          { password }
        );
        if (response.data) {
          onLogin(); // Call onLogin when successful login
        }
      } catch (err) {
        if (err.response) {
          setError(err.response.data.error); // Show error message from backend
        } else {
          setError('An unexpected error occurred');
        }
      }
    } else {
      alert('Please enter both userId and password');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-xs">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-4">Artisticify Dashboard</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your user ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
