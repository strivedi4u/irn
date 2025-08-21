import React, { useEffect, useState } from 'react';
import {
  FaChartPie,
  FaBell,
  FaUserCircle,
  FaSun,
  FaMoon,
  FaSyncAlt,
  FaCloudSun,
  FaCloudMoon,
  FaCloudSunRain
} from 'react-icons/fa';
import './Navbar.css';
function getGreetingAndIcon(name) {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      msg: `Good morning, ${name}`,
      icon: <FaCloudSun className="greeting-icon" style={{ color: '#36a2eb' }} />
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      msg: `Good afternoon, ${name}`,
      icon: <FaCloudSunRain className="greeting-icon" style={{ color: '#43a047' }} />
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      msg: `Good evening, ${name}`,
      icon: <FaCloudMoon className="greeting-icon" style={{ color: '#ffb300' }} />
    };
  } else {
    return {
      msg: `Good night, ${name}`,
      icon: <FaMoon className="greeting-icon" style={{ color: '#ffd600' }} />
    };
  }
}
console.log("HI");
const Navbar = ({ theme, toggleTheme, userName }) => {
  const [dateTime, setDateTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [autoTheme, setAutoTheme] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatic theme switching logic
  useEffect(() => {
    if (!autoTheme) return;
    // Use IST (Indian Standard Time)
    const now = new Date();
    const istNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const hour = istNow.getHours();
    console.log("cc", currentTheme, hour);
    if (hour < 9 || hour >= 16) {
      if (currentTheme !== 'dark') {
        setCurrentTheme('dark');
        document.body.className = 'dark-theme';
      }
    } else {
      if (currentTheme !== 'light') {
        setCurrentTheme('light');
        document.body.className = 'light-theme';
      }
    }
  }, [dateTime]);

  // Manual theme toggl
  const handleThemeToggle = () => {
    setAutoTheme(false);
    setCurrentTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.body.className = next === 'dark' ? 'dark-theme' : 'light-theme';
      return next;
    });
    if (typeof toggleTheme === 'function') toggleTheme();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const { msg, icon } = getGreetingAndIcon(userName);
  const isDark = currentTheme === 'dark';

  // Use IST for time and date display
  const timeString = dateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });
  const dateString = dateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  });

  return (
    <nav className={`navbar-pro ${isDark ? 'navbar-darkblue' : 'navbar-lightblue'}`} style={{ borderRadius: 0 }}>
      <div className="navbar-pro-logo">
        <FaChartPie style={{ marginRight: 8, fontSize: 22, color: isDark ? '#00e4d3' : '#0074e0' }} />
        <span className="navbar-pro-title" style={{ color: isDark ? '#00e4d3' : '#0074e0' }}>IRNMonitoring</span>
      </div>
      <div className="navbar-pro-center">
        <span className="navbar-pro-greeting" style={{
          color: isDark ? '#00e4d3' : '#0074e0',
          background: isDark ? 'rgba(0,228,211,0.10)' : 'rgba(0,116,224,0.10)',
          borderRadius: 0 // Remove side round css
        }}>
          {icon}
          <span className="navbar-pro-greeting-text">{msg}</span>
        </span>
      </div>
      <div className="navbar-pro-right">
        <span className="navbar-pro-time" style={{
          color: isDark ? '#00e4d3' : '#0074e0',
          background: isDark ? 'rgba(0,228,211,0.10)' : 'rgba(0,116,224,0.10)'
        }}>
          {timeString} | {dateString}
        </span>
        <button
          className={`navbar-pro-action navbar-pro-refresh${refreshing ? ' refreshing' : ''}`}
          title="Refresh"
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            position: 'relative',
            transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
            transform: refreshing ? 'rotate(360deg) scale(1.2)' : 'none',
            pointerEvents: refreshing ? 'none' : 'auto',
            opacity: refreshing ? 0.7 : 1,
            borderRadius: '50%',
            background: refreshing
              ? (isDark ? 'linear-gradient(135deg,#00e4d340 10%,#23272f 90%)' : 'linear-gradient(135deg,#3B82F660 10%,#fff 90%)')
              : 'transparent',
            boxShadow: refreshing
              ? (isDark ? '0 0 0 6px #00e4d350' : '0 0 0 6px #3B82F650')
              : 'none',
            outline: 'none',
            border: 'none',
            cursor: refreshing ? 'wait' : 'pointer'
          }}
          onMouseEnter={e => {
            if (!refreshing) {
              e.currentTarget.style.background = isDark
                ? 'linear-gradient(135deg, #00e4d3 10%, #23272f 90%)'
                : 'linear-gradient(135deg, #3B82F6 10%, #fff 90%)';
              e.currentTarget.style.boxShadow = isDark
                ? '0 0 0 6px #00e4d344'
                : '0 0 0 6px #3B82F655';
            }
          }}
          onMouseLeave={e => {
            if (!refreshing) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          <FaSyncAlt
            style={{
              color: isDark ? '#00e4d3' : '#0074e0',
              animation: refreshing ? 'spin-refresh 0.6s linear infinite' : 'none'
            }}
          />
          {refreshing && (
            <span
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 14,
                height: 14,
                border: `2px solid ${isDark ? '#00e4d3' : '#0074e0'}`,
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin-refresh 0.6s linear infinite'
              }}
            />
          )}
        </button>
        <button className="navbar-pro-action" title="Notifications">
          <FaBell style={{ color: isDark ? '#00e4d3' : '#0074e0' }} />
          <span className="navbar-pro-action-badge">3</span>
        </button>
        <div className="navbar-pro-user" style={{
          color: isDark ? '#00e4d3' : '#0074e0',
          background: isDark ? 'rgba(0,228,211,0.10)' : 'rgba(0,116,224,0.10)'
        }}>
          <FaUserCircle className="navbar-pro-avatar" style={{ color: '#ffd600' }} />
          <span className="navbar-pro-username">{userName}</span>
        </div>
        <button
          className="navbar-pro-theme-toggle"
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
        >
          <div
            className="theme-toggle-slider"
            style={{
              background: isDark ? '#1a2233' : '#e3e8f0',
              position: 'relative'
            }}
          >
            <div
              className="theme-toggle-knob"
              style={{
                position: 'absolute',
                top: 2,
                left: isDark ? 14 : 2,
                width: 12,
                height: 12,
                background: isDark ? '#00e4d3' : '#fff',
                borderRadius: '50%',
                boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                transition: 'left 0.2s, background 0.2s'
              }}
            />
          </div>
          {isDark
            ? <FaSun size={16} color="#00e4d3" />
            : <FaMoon size={16} color="#0074e0" />}
        </button>
        <button
          className="navbar-pro-theme-toggle"
          style={{ marginLeft: 8, fontSize: 12, padding: '2px 10px', borderRadius: 6, border: 'none', background: isDark ? '#23272f' : '#e3e8f0', color: isDark ? '#00e4d3' : '#0074e0', cursor: 'pointer' }}
          onClick={() => setAutoTheme(at => !at)}
        >
          {autoTheme ? 'Auto Theme: ON' : 'Auto Theme: OFF'}
        </button>
      </div>
      <style>
        {`
          @keyframes spin-refresh {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          .navbar-pro-refresh {
            border-radius: 50% !important;
            background: transparent;
            box-shadow: none;
            outline: none;
            border: none;
          }
          .navbar-pro-refresh:hover:not(:disabled) {
            background: linear-gradient(135deg, #00e4d3 10%, #23272f 90%);
            box-shadow: 0 0 0 6px #00e4d344;
            border-radius: 50% !important;
            transition: box-shadow 0.2s, background 0.2s;
            outline: none;
            border: none;
          }
          .navbar-lightblue .navbar-pro-refresh:hover:not(:disabled) {
            background: linear-gradient(135deg, #3B82F6 10%, #fff 90%);
            box-shadow: 0 0 0 6px #3B82F655;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
