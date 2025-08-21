import React, { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';

import './Dashboard.css';
import { useTheme } from '../context/ThemeContext';

// Skeleton Loader Component
const SkeletonBar = ({ width = '100%', height = 24, style = {} }) => (
  <div
    style={{
      width,
      height,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e7ef 50%, #f0f0f0 75%)',
      borderRadius: 6,
      margin: '8px 0',
      animation: 'skeleton-loading 1.2s infinite linear',
      ...style,
    }}
    className="skeleton-bar"
  />
);

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const [dateTime, setDateTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const userName = "Naveen";
  const isDark = theme === 'dark';

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dashboard-dark', theme === 'dark');
    document.body.classList.toggle('dashboard-light', theme === 'light');
  }, [theme]);

  // Simulate loading for 1s on mount
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  return null;
};

export default Dashboard;