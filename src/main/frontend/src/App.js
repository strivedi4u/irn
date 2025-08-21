import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SpareIRNMonitoring from './components/SpareIRNMonitoring';
import Dashboard from './components/Dashboard';
import Navbar, { COLOR_THEMES } from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import CardRow from './components/CardRow/CardRow';
import ChartSection from './components/ChartSection'; // Ensure ChartSection is imported as default
import './App.css';
import Lottie from 'lottie-react';
import loadingLottie from './components/animations/Animation - 1748514902518.json';

// --- Data Context for sharing API data ---
export const DataContext = createContext();

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

const SkeletonNavbar = () => (
  <div style={{
    height: 56,
    width: '100%',
    background: 'linear-gradient(90deg, #ffffff 60%, #b3e5fc 100%)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    boxSizing: 'border-box',
    borderBottom: '1.5px solid #00e4d3',
    borderRadius: '0 0 16px 16px',
    boxShadow: '0 2px 12px 0 rgba(0, 36, 64, 0.18)',
    marginBottom: 8,
  }}>
    <SkeletonBar width={180} height={28} style={{ marginRight: 24 }} />
    <SkeletonBar width={320} height={28} style={{ flex: 1, marginRight: 24 }} />
    <SkeletonBar width={120} height={28} />
  </div>
);

const SkeletonCardRow = () => (
  <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center', padding: '16px 0' }}>
    {[1, 2, 3].map((_, idx) => (
      <div
        key={idx}
        style={{
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: 16,
          minWidth: 220,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <SkeletonBar width="60%" height={22} style={{ marginBottom: 16 }} />
        <SkeletonBar width="80%" height={18} />
        <SkeletonBar width="70%" height={18} />
      </div>
    ))}
  </div>
);

const SkeletonChartSection = () => (
  <div style={{
    display: 'flex',
    gap: 40,
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f9f9f9',
    padding: '40px 0'
  }}>
    {[1, 2].map((_, idx) => (
      <div
        key={idx}
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(54,162,235,0.10)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 260,
        }}
      >
        <SkeletonBar width="60%" height={24} style={{ marginBottom: 24 }} />
        <SkeletonBar width={180} height={180} style={{ borderRadius: '50%', margin: '0 auto 24px auto' }} />
        <SkeletonBar width="80%" height={18} />
        <SkeletonBar width="70%" height={18} />
      </div>
    ))}
  </div>
);

const SkeletonTable = () => (
  <div style={{
    margin: '24px auto',
    padding: 0,
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 4px 24px 0 rgba(54,162,235,0.07)',
    maxWidth: 900
  }}>
    <div style={{
      padding: '18px 22px',
      borderBottom: '1px solid #e6e6e6',
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: 0.5,
      color: '#14213d'
    }}>
      <SkeletonBar width="30%" height={22} />
    </div>
    <div style={{ overflowX: 'auto', padding: 24 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {Array.from({ length: 6 }).map((_, idx) => (
              <th key={idx}><SkeletonBar width="80px" height={16} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 4 }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: 6 }).map((_, colIdx) => (
                <td key={colIdx}><SkeletonBar width="60px" height={14} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);
  const [duration, setDuration] = useState('All');
  const [refreshCountdown, setRefreshCountdown] = useState(60);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [isRefreshing, setRefreshing] = useState(false);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  // Remove API data state and fetching logic
  // const [materialData, setMaterialData] = useState([]);
  // const [dmsData, setDmsData] = useState([]);
  // const [materialCounts, setMaterialCounts] = useState({ inprogress: 0, fail: 0, delay: 0 });
  // const [dmsCounts, setDmsCounts] = useState({ inprogress: 0, fail: 0, delay: 0 });

  // Add color theme state and safe fallback
  const [colorTheme, setColorTheme] = useState(COLOR_THEMES ? COLOR_THEMES[0] : {
    key: 'blue',
    name: 'Blue',
    main: '#0074e0',
    accent: '#00e4d3',
    bg: '#ffffff',
    darkBg: '#0a1929',
    gradient: 'linear-gradient(90deg, #ffffff 60%,rgb(255, 255, 255) 100%)',
    darkGradient: 'linear-gradient(90deg, #0a1929 70%, #1a2233 100%)'
  });
  const safeColorTheme = colorTheme && colorTheme.accent
    ? colorTheme
    : {
        key: 'blue',
        name: 'Blue',
        main: '#0074e0',
        accent: '#00e4d3',
        bg: '#ffffff',
        darkBg: '#0a1929',
        gradient: 'linear-gradient(90deg, #ffffff 60%,rgb(255, 255, 255) 100%)',
        darkGradient: 'linear-gradient(90deg, #0a1929 70%, #1a2233 100%)'
      };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleFilterPanel = () => {
    setFilterPanelOpen(!isFilterPanelOpen);
  };

  const updateDuration = (value) => {
    setDuration(value);
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastRefreshTime(new Date().toLocaleTimeString());
      setRefreshing(false);
    }, 2000);
  };

  // Toggle theme for chart and table as well
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    // Set body class based on the *next* theme, not the current one
    document.body.className = theme === 'light' ? 'dark-theme' : 'light-theme';
  };

  // Remove fetchApiData and related useEffects
  // const fetchApiData = async () => {
  //   try {
  //     const [materialRes, dmsRes] = await Promise.all([
  //       fetch('http://localhost:8081/api/material-irn'),
  //       fetch('http://localhost:8081/api/dms-irn'),
  //     ]);
  //     const material = await materialRes.json();
  //     const dms = await dmsRes.json();

  //     // Normalize and count statuses
  //     const normalize = (arr) =>
  //       arr.map((item) => ({
  //         ...item,
  //         COND: item.COND !== undefined ? item.COND : item.Cond,
  //       }));

  //     const countStatus = (arr) => ({
  //       inprogress: arr.filter((i) => i.COND === 'G').length,
  //       fail: arr.filter((i) => i.COND === 'R').length,
  //       delay: arr.filter((i) => i.COND === 'Y').length,
  //     });

  //     const materialNorm = normalize(Array.isArray(material) ? material : []);
  //     const dmsNorm = normalize(Array.isArray(dms) ? dms : []);

  //     setMaterialCounts(countStatus(materialNorm));
  //     setDmsCounts(countStatus(dmsNorm));
  //   } catch (e) {
  //     setMaterialCounts({ inprogress: 0, fail: 0, delay: 0 });
  //     setDmsCounts({ inprogress: 0, fail: 0, delay: 0 });
  //   }
  // };

  // useEffect(() => {
  //   setLoading(true);
  //   fetchApiData().then(() => setLoading(false));
  //   const interval = setInterval(fetchApiData, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setRefreshCountdown((prev) => {
  //       if (prev === 1) {
  //         handleManualRefresh();
  //         return 60;
  //       }
  //       return prev - 1;
  //     });
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  // Simulate loading for 10s on first mount
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 3000); // 10 seconds
    return () => clearTimeout(t);
  }, []);

  // Example card data for Total, Spare, Material
  const cardData = [
    { title: 'Total', inProgress: 30, fail: 20, delay: 10 },
    { title: 'Spare', inProgress: 20, fail: 10, delay: 5 },
    { title: 'Material', inProgress: 10, fail: 5, delay: 2 },
  ];

  return (
    <ThemeProvider>
      {/* Remove DataContext.Provider since API data is not managed here */}
      <Router>
        <div className={`app-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
          {loading ? (
            // Advanced Lottie loading bar (fullscreen, centered)
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: theme === 'dark' ? '#181c23' : '#f9f9f9',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <Lottie animationData={loadingLottie} loop={true} style={{ width: 320, height: 320 }} />
            </div>
          ) : (
            <>
              {/* Navbar */}
              <Navbar
                dateTime={new Date()}
                theme={theme}
                toggleTheme={toggleTheme}
                greeting="Welcome"
                userName="APPS"
                icon={null}
                colorTheme={safeColorTheme}
                setColorTheme={setColorTheme}
              />
              {/* Card Row */}
              {/* <div style={{ padding: '16px', background: theme === 'dark' ? '#1e1e2f' : '#f9f9f9' }}>
                <CardRow theme={theme} />
              </div> */}
              {/* Chart Section */}
              <div style={{ padding: '16px', background: theme === 'dark' ? '#1e1e2f' : '#f9f9f9' }}>
                <ChartSection
                  theme={theme}
                  colorTheme={safeColorTheme}
                />
              </div>
              <Routes>
                <Route path="*" element={<Navigate to="/" replace />} />
                {/* <Route path="/data" element={<SpareIRNMonitoring duration={duration} theme={theme} />} />
                */}
                <Route path="/" element={<Dashboard duration={duration} theme={theme} />} />
              </Routes>
            </>
          )}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
