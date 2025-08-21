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
  FaCloudSunRain,
  FaSatelliteDish
} from 'react-icons/fa';
import { SiProtonmail, SiGrafana } from "react-icons/si"; // Use Grafana icon for monitoring
import { motion } from 'framer-motion';
import './Navbar.css';

function getGreetingAndIcon(name) {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      msg: `Good Morning, ${name}`,
      icon: <FaCloudSun className="greeting-icon" style={{ color: '#36a2eb' }} />
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      msg: `Good Afternoon, ${name}`,
      icon: <FaCloudSunRain className="greeting-icon" style={{ color: '#43a047' }} />
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      msg: `Good Evening, ${name}`,
      icon: <FaCloudMoon className="greeting-icon" style={{ color: '#ffb300' }} />
    };
  } else {
    return {
      msg: `Good Night, ${name}`,
      icon: <FaMoon className="greeting-icon" style={{ color: '#ffd600' }} />
    };
  }
}

const COLOR_THEMES = [
  {
    key: 'blue',
    name: 'Blue',
    main: '#0074e0',
    accent: '#00e4d3',
    bg: '#e3e8f0',
    darkBg: '#0a1929',
    gradient: 'linear-gradient(90deg, #e3e8f0 60%, #b3e5fc 100%)',
    darkGradient: 'linear-gradient(90deg, #0a1929 70%, #1a2233 100%)'
  },
  {
    key: 'green',
    name: 'Green',
    main: '#22c55e',
    accent: '#4ade80',
    bg: '#e6f7ef',
    darkBg: '#15392b',
    gradient: 'linear-gradient(90deg, #e6f7ef 60%, #bbf7d0 100%)',
    darkGradient: 'linear-gradient(90deg, #15392b 70%, #134e4a 100%)'
  },
  {
    key: 'gold',
    name: 'Gold',
    main: '#eab308',
    accent: '#facc15',
    bg: '#fffbe6',
    darkBg: '#3a2e0a',
    gradient: 'linear-gradient(90deg, #fffbe6 60%, #fde68a 100%)',
    darkGradient: 'linear-gradient(90deg, #3a2e0a 70%, #78350f 100%)'
  },
  {
    key: 'purple',
    name: 'Purple',
    main: '#7c3aed',
    accent: '#a78bfa',
    bg: '#ede9fe',
    darkBg: '#312e81',
    gradient: 'linear-gradient(90deg, #ede9fe 60%, #c7d2fe 100%)',
    darkGradient: 'linear-gradient(90deg, #312e81 70%, #1e293b 100%)'
  }
];

const getLogoColor = (themeKey, isDark) => {
  // Use a modern color palette for the logo/text
  if (themeKey === 'white') return '#222';
  if (themeKey === 'green') return '#22c55e';
  if (themeKey === 'gold') return '#eab308';
  if (themeKey === 'purple') return '#7c3aed';
  // Default: blue
  return isDark ? '#00e4d3' : '#1976d2';
};

const getLogoGradient = (themeKey, isDark) => {
  // Modern gradient for IRN Monitoring text
  if (themeKey === 'white') return 'linear-gradient(90deg,#222,#555)';
  if (themeKey === 'green') return 'linear-gradient(90deg,#22c55e,#4ade80)';
  if (themeKey === 'gold') return 'linear-gradient(90deg,#eab308,#facc15)';
  if (themeKey === 'purple') return 'linear-gradient(90deg,#7c3aed,#a78bfa)';
  // Default: blue
  return isDark
    ? 'linear-gradient(90deg,#00e4d3,#1976d2)'
    : 'linear-gradient(90deg,#1976d2,#00e4d3)';
};

const Navbar = ({
  theme,
  toggleTheme,
  userName,
  colorTheme,
  setColorTheme
}) => {
  const [dateTime, setDateTime] = useState(new Date());
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Manual theme toggle only
  const handleThemeToggle = () => {
    setCurrentTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.body.classList.remove(prev === 'light' ? 'light-theme' : 'dark-theme');
      document.body.classList.add(next === 'dark' ? 'dark-theme' : 'light-theme');
      const root = document.getElementById('root');
      if (root) {
        root.classList.remove(prev === 'light' ? 'light-theme' : 'dark-theme');
        root.classList.add(next === 'dark' ? 'dark-theme' : 'light-theme');
      }
      return next;
    });
    if (typeof toggleTheme === 'function') toggleTheme();
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

  // Defensive: fallback to a default colorTheme if undefined
  const safeColorTheme = colorTheme && colorTheme.accent
    ? colorTheme
    : {
        key: 'blue',
        name: 'Blue',
        main: '#0074e0',
        accent: '#00e4d3',
        bg: '#e3e8f0',
        darkBg: '#0a1929',
        gradient: 'linear-gradient(90deg, #e3e8f0 60%, #b3e5fc 100%)',
        darkGradient: 'linear-gradient(90deg, #0a1929 70%, #1a2233 100%)'
      };

  // Update theme colors on colorTheme or isDark change
  useEffect(() => {
    document.documentElement.style.setProperty('--navbar-main', safeColorTheme.main);
    document.documentElement.style.setProperty('--navbar-accent', safeColorTheme.accent);
    document.documentElement.style.setProperty('--navbar-bg', isDark ? safeColorTheme.darkBg : safeColorTheme.bg);
    document.documentElement.style.setProperty('--navbar-gradient', isDark ? safeColorTheme.darkGradient : safeColorTheme.gradient);
  }, [safeColorTheme, isDark]);

  // Determine logo/text color and gradient
  const logoColor = getLogoColor(safeColorTheme.key, isDark);
  const logoGradient = getLogoGradient(safeColorTheme.key, isDark);

  return (
    <nav
      className={`navbar-pro ${isDark ? 'navbar-darkblue' : 'navbar-lightblue'}`}
      style={{
        background: `var(--navbar-gradient, ${
          isDark ? safeColorTheme.darkGradient : safeColorTheme.gradient
        })`,
        color: `var(--navbar-main, ${safeColorTheme.main})`
      }}
    >
      <motion.div
        className="navbar-pro-logo"
        initial={{ opacity: 0, x: -18, scale: 0.92 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 900,
          letterSpacing: 1.2,
          gap: 8,
          userSelect: 'none'
        }}
      >
        {/* Monitoring logo icon */}
        <motion.span
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{
            rotate: [0, -10, 0, 10, 0],
            scale: [1, 1.08, 1, 1.04, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 2.8,
            ease: "easeInOut"
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            color: logoColor,
            filter: `drop-shadow(0 2px 8px ${logoColor}44)`
          }}
        >
          <SiGrafana
            style={{
              fontSize: 26,
              color: logoColor,
              marginRight: 8,
              filter: `drop-shadow(0 2px 8px ${logoColor}44)`
            }}
          />
        </motion.span>
        {/* Modern IRN Monitoring text with gradient */}
        <motion.span
          className="navbar-pro-title"
          initial={{ opacity: 0, scale: 0.92, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          style={{
            fontWeight: 900,
            fontSize: '1.15rem',
            letterSpacing: '1.5px',
            textTransform: 'none',
            background: logoGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: `drop-shadow(0 2px 8px ${logoColor}44)`,
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'Montserrat', 'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif",
            textShadow: '0 2px 8px #0001, 0 1px 2px #fff'
          }}
        >
          IRN Monitoring
        </motion.span>
      </motion.div>
      <div className="navbar-pro-center">
        <span className="navbar-pro-greeting" style={{
          color: logoColor,
          background: isDark
            ? `${safeColorTheme.accent}22`
            : `${safeColorTheme.main}18`
        }}>
          {icon}
          <span className="navbar-pro-greeting-text">{msg}</span>
        </span>
      </div>
      <div className="navbar-pro-right">
        <span className="navbar-pro-time" style={{
          color: logoColor,
          background: isDark
            ? `${safeColorTheme.accent}22`
            : `${safeColorTheme.main}18`
        }}>
          {timeString} | {dateString}
        </span>
        {/* Color theme selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8 }}>
          {COLOR_THEMES.map((ct) => (
            <button
              key={ct.key}
              title={ct.name}
              onClick={() => setColorTheme(ct)}
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: safeColorTheme.key === ct.key ? `2px solid ${ct.accent}` : '2px solid #eee',
                background: ct.main,
                margin: '0 2px',
                cursor: 'pointer',
                outline: safeColorTheme.key === ct.key ? `2px solid ${ct.accent}` : 'none',
                boxShadow: safeColorTheme.key === ct.key ? `0 0 0 2px ${ct.accent}44` : 'none',
                transition: 'box-shadow 0.2s, border 0.2s'
              }}
            />
          ))}
        </div>
        <button
          className="navbar-pro-action navbar-pro-refresh"
          title="Refresh"
          onClick={() => {
            setRefreshing(true);
            setTimeout(() => {
              window.location.href = "/";
            }, 700);
          }}
          disabled={refreshing}
          style={{
            borderRadius: '50%',
            background: 'transparent',
            transition: 'box-shadow 0.2s, background 0.2s, transform 0.2s',
            outline: 'none',
            border: 'none',
            position: 'relative',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'none',
            cursor: refreshing ? 'wait' : 'pointer',
            opacity: refreshing ? 0.7 : 1,
            pointerEvents: refreshing ? 'none' : 'auto'
          }}
          onMouseEnter={e => {
            if (!refreshing) {
              e.currentTarget.style.background = isDark
                ? 'linear-gradient(135deg, #00e4d3 10%, #23272f 90%)'
                : 'linear-gradient(135deg, #3B82F6 10%, #fff 90%)';
              e.currentTarget.style.boxShadow = isDark
                ? '0 0 0 6px #00e4d344'
                : '0 0 0 6px #3B82F655';
              e.currentTarget.style.transform = 'scale(1.08)';
            }
          }}
          onMouseLeave={e => {
            if (!refreshing) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'none';
            }
          }}
        >
          <FaSyncAlt
            style={{
              color: colorTheme.accent,
              fontSize: 20,
              transition: 'color 0.2s',
              animation: refreshing ? 'spin-refresh 0.7s linear infinite' : 'none'
            }}
          />
        </button>
        {/* <button className="navbar-pro-action" title="Notifications">
          <FaBell style={{ color: isDark ? '#00e4d3' : '#0074e0' }} />
          <span className="navbar-pro-action-badge">3</span>
        </button> */}

        <div className="navbar-pro-user" style={{
          color: logoColor,
          background: isDark
            ? `${colorTheme.accent}22`
            : `${colorTheme.main}18`
        }}>
          <FaUserCircle className="navbar-pro-avatar" style={{ color: '#ffd600' }} />
          <span className="navbar-pro-username">Developed by APPS-1</span>
        </div>
        <button
          className="navbar-pro-theme-toggle"
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
        >
          <div
            className="theme-toggle-slider"
            style={{
              background: isDark ? colorTheme.darkBg : colorTheme.bg,
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
                background: isDark ? colorTheme.accent : '#fff',
                borderRadius: '50%',
                boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                transition: 'left 0.2s, background 0.2s'
              }}
            />
          </div>
          {isDark
            ? <FaSun size={16} color={colorTheme.accent} />
            : <FaMoon size={16} color={colorTheme.main} />}
        </button>
      </div>
      <style>
        {`
          @keyframes spin-refresh {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </nav>
  );
};

export { COLOR_THEMES };
export default Navbar;
