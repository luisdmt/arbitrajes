import React, { useState, useEffect } from 'react';
    import { Routes, Route, useNavigate } from 'react-router-dom';
    import Login from './components/Login';
    import Register from './components/Register';
    import ArbitrageCalculator from './components/ArbitrageCalculator';
    import ExchangeRateHeader from './components/ExchangeRateHeader';
    import Sidebar from './components/Sidebar';
    import UserProfile from './components/UserProfile';
    import * as localforage from 'localforage';
    import axios from 'axios';
    import { FaBars } from 'react-icons/fa';

    function App() {
      const [user, setUser] = useState(null);
      const [exchangeRate, setExchangeRate] = useState('N/A');
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const [isProfileOpen, setIsProfileOpen] = useState(false);
      const navigate = useNavigate();

      useEffect(() => {
        const checkAuth = async () => {
          const storedUser = await localforage.getItem('user');
          if (storedUser) {
            setUser(storedUser);
            navigate('/calculadora');
          }
        };
        checkAuth();
        fetchExchangeRate();
      }, [navigate]);

      const fetchExchangeRate = async () => {
        try {
          // Using a mock API for demonstration purposes
          const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
          const rate = response.data.rates.VES;
          setExchangeRate(rate.toFixed(2));
        } catch (err) {
          setExchangeRate('N/A');
        }
      };

      const handleLogin = async (loggedInUser) => {
        setUser(loggedInUser);
        await localforage.setItem('user', loggedInUser);
        navigate('/calculadora');
      };

      const handleLogout = async () => {
        setUser(null);
        await localforage.removeItem('user');
        navigate('/');
        setIsSidebarOpen(false);
        setIsProfileOpen(false);
      };

      const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        setIsProfileOpen(false);
      };

      const handleViewUser = () => {
        setIsProfileOpen(true);
        setIsSidebarOpen(false);
      };

      const closeProfile = () => {
        setIsProfileOpen(false);
      };

      return (
        <>
          <ExchangeRateHeader exchangeRate={exchangeRate} />
          {user && (
            <FaBars className="menu-icon" onClick={toggleSidebar} />
          )}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={toggleSidebar}
            user={user}
            onLogout={handleLogout}
            onViewUser={handleViewUser}
          />
          {isProfileOpen && (
            <div className="modal-overlay">
              <UserProfile user={user} onClose={closeProfile} />
            </div>
          )}
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/registro" element={<Register onRegister={handleLogin} />} />
            <Route
              path="/calculadora"
              element={
                user ? (
                  <ArbitrageCalculator onLogout={handleLogout} user={user} exchangeRate={exchangeRate} />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
          </Routes>
        </>
      );
    }

    export default App;
