import React, { useMemo, useEffect, useState } from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import {
  FaCubes,
  FaBoxOpen,
  FaWarehouse,
  FaSpinner,
  FaTimesCircle,
  FaClock,
  FaChartPie,
  FaUserTie // Add this icon for DMS (Dealer Management System)
} from 'react-icons/fa';
import Lottie from 'lottie-react';
import loadingLottie from './animations/Animation - 1748514902518.json';
import allClearLottie from './animations/Animation - 1750180652701.json'; // <-- Add this import
import error404Lottie from './animations/Error 404.json';
import { motion, AnimatePresence } from 'framer-motion';
import dmsJson from './dms-irn.json'; // <-- Import the local DMS JSON

// --- CardRow logic inlined here ---
const iconStyle = {
  fontSize: '1.5rem',
  marginRight: 8,
  verticalAlign: 'middle',
};
const ROW_HEIGHT = '48px';

const LiveDot = () => (
  <span
    style={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: '#28a745',
      marginLeft: 6,
      marginRight: 2,
      verticalAlign: 'middle',
      boxShadow: '0 0 4px #28a745',
      animation: 'pulse 1.2s infinite alternate',
    }}
  />
);

const AnimatedCard = (props) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 30, scale: 0.95 }}
    whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(0,228,211,0.18)" }}
    transition={{ type: "spring", stiffness: 180, damping: 18 }}
    style={props.style}
    className={props.className}
    tabIndex={props.tabIndex}
    onClick={props.onClick}
  >
    {props.children}
  </motion.div>
);

const Card = ({
  title,
  inProgress,
  fail,
  delay,
  theme,
  icon,
  loading,
  onCardClick,
  onStatusClick,
  isActive,
}) => (
  <AnimatedCard
    className="card cardrow-card"
    style={{
      background: theme === 'dark' ? '#2c2f36' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#2c2f36',
      height: ROW_HEIGHT,
      minHeight: ROW_HEIGHT,
      minWidth: '220px',
      // maxWidth: '340px', // Fix width for all cards
      width: '100%',     // Make all cards stretch to container width
      borderRadius: '6px',
      marginTop: 4,
      marginBottom: 4,
      boxShadow:
        theme === 'dark'
          ? '0 2px 6px rgba(0,0,0,0.5)'
          : '0 2px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 16px',
      transition: 'transform 0.3s, box-shadow 0.3s',
      border: isActive ? '2px solid #00e4d3' : undefined,
      cursor: 'pointer',
      boxSizing: 'border-box'
    }}
    tabIndex={0}
    onClick={onCardClick}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
      }}
    >
      {icon}
      <motion.h4
        className="card-title"
        style={{
          fontWeight: 600,
          fontSize: '1rem',
          letterSpacing: 0.5,
          margin: 0,
          textAlign: 'left',
          color:
            theme === 'dark'
              ? (title === 'Total'
                  ? '#00e4d3'
                  : title === 'Spares'
                    ? 'green'
                    : '#facc15')
              : (title === 'Total'
                  ? '#1976d2'
                  : title === 'Spares'
                    ? '#22c55e'
                    : '#eab308'),
          transition: 'color 0.3s',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {title}
      </motion.h4>
    </div>
    <motion.div
      className="card-details"
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        fontSize: '1rem',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.18 }}
    >
      <motion.div
        title="In Progress"
        style={{
          display: 'flex',
          alignItems: 'center',
          color: '#007bff',
          cursor: 'pointer',
        }}
        whileHover={{ scale: 1.12 }}
        onClick={e => {
          e.stopPropagation();
          onStatusClick('G');
        }}
      >
        <FaSpinner style={{ ...iconStyle, animation: 'spin 1.5s linear infinite' }} />
        <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
          {loading ? '-' : inProgress}
        </span>
        <LiveDot />
      </motion.div>
      <motion.div
        title="Fail"
        style={{
          display: 'flex',
          alignItems: 'center',
          color: '#dc3545',
          cursor: 'pointer',
        }}
        whileHover={{ scale: 1.12 }}
        onClick={e => {
          e.stopPropagation();
          onStatusClick('R');
        }}
      >
        <FaTimesCircle style={iconStyle} />
        <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
          {loading ? '-' : fail}
        </span>
        <LiveDot />
      </motion.div>
      <motion.div
        title="Delay"
        style={{
          display: 'flex',
          alignItems: 'center',
          color: '#ffc107',
          cursor: 'pointer',
        }}
        whileHover={{ scale: 1.12 }}
        onClick={e => {
          e.stopPropagation();
          onStatusClick('D');
        }}
      >
        <FaClock style={iconStyle} />
        <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
          {loading ? '-' : delay}
        </span>
      </motion.div>
    </motion.div>
  </AnimatedCard>
);

const ChartSection = ({ theme, colorTheme }) => {
  const isDark = theme === 'dark';
  // Defensive: fallback to a default colorTheme if undefined
  const safeColorTheme = colorTheme || {
    main: '#0074e0',
    accent: '#00e4d3',
    bg: '#e3e8f0',
    darkBg: '#0a1929'
  };

  // Match chart card and chart canvas background to card background for theme
  const CHART_BG_COLOR = isDark ? '#232733' : '#f8fafc';

  // Fetch real-time data from API endpoints
  const [materialData, setMaterialData] = useState([]);
  const [sparesData, setSparesData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [dmsData, setDmsData] = useState([]); // DMS data for display
  const [dmsApiData, setDmsApiData] = useState([]); // DMS data from API (for backend fetch)
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const URL = 'http://localhost:8081/';

  // Counter states for first API call for each data type
  const [materialFetchCount, setMaterialFetchCount] = useState(0);
  const [sparesFetchCount, setSparesFetchCount] = useState(0);
  const [salesFetchCount, setSalesFetchCount] = useState(0);
  const [dmsFetchCount, setDmsFetchCount] = useState(0);

  // DMS pagination state
  const [dmsPage, setDmsPage] = useState(0);
  const dmsPageSize = 20; // Adjust page size as needed

  // Error state for material data fetch
  const [showMaterialError, setShowMaterialError] = useState(false);

  // Fetch material, spares, sales every 5 seconds, each API call is independent and smooth
  useEffect(() => {
    let mounted = true;
    let materialTimeout, sparesTimeout, salesTimeout;

    // Use AbortController to cancel previous fetch if new one starts
    let materialController, sparesController, salesController;

    const fetchMaterial = async () => {
      if (!mounted) return;
      if (materialController) materialController.abort();
      materialController = new AbortController();
      try {
        const res = await fetch(URL + 'api/material-irn', { signal: materialController.signal });
        const data = await res.json();
        if (mounted) {
          setMaterialData(Array.isArray(data) ? data : []);
          setMaterialFetchCount(count => count + 1);
          setShowMaterialError(false);
        }
      } catch (e) {
        if (mounted) {
          setMaterialData([]);
          setShowMaterialError(true);
        }
      }
      materialTimeout = setTimeout(async () => { await fetchMaterial(); }, 5000);
    };

    const fetchSpares = async () => {
      if (!mounted) return;
      if (sparesController) sparesController.abort();
      sparesController = new AbortController();
      try {
        const res = await fetch(URL + 'api/spares-irn', { signal: sparesController.signal });
        const data = await res.json();
        if (mounted) {
          setSparesData(Array.isArray(data) ? data : []);
          setSparesFetchCount(count => count + 1);
        }
      } catch (e) {
        if (mounted) setSparesData([]);
      }
      sparesTimeout = setTimeout(async () => { await fetchSpares(); }, 5000);
    };

    const fetchSales = async () => {
      if (!mounted) return;
      if (salesController) salesController.abort();
      salesController = new AbortController();
      try {
        const res = await fetch(URL + 'api/sales-irn', { signal: salesController.signal });
        const data = await res.json();
        if (mounted) {
          setSalesData(Array.isArray(data) ? data : []);
          setSalesFetchCount(count => count + 1);
        }
      } catch (e) {
        if (mounted) setSalesData([]);
      }
      salesTimeout = setTimeout(async () => { await fetchSales(); }, 5000);
    };

    // Start all fetchs
    (async () => {
      await fetchMaterial();
      await fetchSpares();
      await fetchSales();
    })();

    // Set dataLoaded to true after a short delay for smooth loading
    setTimeout(() => { if (mounted) setDataLoaded(true); }, 600);

    return () => {
      mounted = false;
      clearTimeout(materialTimeout);
      clearTimeout(sparesTimeout);
      clearTimeout(salesTimeout);
      if (materialController) materialController.abort();
      if (sparesController) sparesController.abort();
      if (salesController) salesController.abort();
    };
  }, []);

  // DMS fetch logic: only use dms-irn.json as fallback if first API call is delayed
  useEffect(() => {
    let mounted = true;
    let dmsTimeout;
    let localDmsFetchCount = 0;
    let fallbackTimeout;

    const fetchDms = async () => {
      // Try to fetch from Kafka endpoint first (if available)
      try {
        const kafkaRes = await fetch(URL + 'api/dms-irn-kafka');
        if (kafkaRes.ok) {
          const kafkaData = await kafkaRes.json();
          if (Array.isArray(kafkaData) && kafkaData.length > 0 && mounted) {
            setDmsApiData(kafkaData);
            setDmsFetchCount(count => count + 1);
            // Immediately show Kafka data and clear any fallback
            setDmsData(kafkaData);
            if (fallbackTimeout) clearTimeout(fallbackTimeout);
            return; // Do not wait, do not schedule slow polling
          }
        }
      } catch (e) {
        // Ignore Kafka fetch errors, fallback to normal fetch
      }

      // Fallback: normal DMS fetch
      try {
        const dmsRes = await fetch(URL + 'api/dms-irn');
        const dms = await dmsRes.json();
        const dmsMapped = Array.isArray(dms)
          ? dms.map(item => ({
              ...item,
              COND: item.COND !== undefined ? item.COND : (item.status !== undefined ? item.status : undefined)
            }))
          : [];
        if (mounted) {
          setDmsApiData(dmsMapped);
          setDmsFetchCount(count => count + 1);
          // If we got real data, use it immediately and clear fallback
          if (dmsMapped.length > 0) {
            setDmsData(dmsMapped);
            if (fallbackTimeout) clearTimeout(fallbackTimeout);
          }
        }
      } catch {
        if (mounted) {
          setDmsApiData([]);
        }
      }
      localDmsFetchCount++;
      // First 5 times: every 20 min, after that every 5 sec
      if (localDmsFetchCount < 2) {
        dmsTimeout = setTimeout(fetchDms, 20 * 60 * 1000); // 20 min
      } else {
        dmsTimeout = setTimeout(fetchDms, 5000); // 5 sec
      }
    };

    // On mount: start with empty DMS data, begin API fetch
    if (mounted) {
      setDmsData([]); // Start with empty data
      setDmsApiData([]);
      setDmsFetchCount(0);
      localDmsFetchCount = 0;
      
      // Start fetching immediately
      fetchDms();
      
      // Only show fallback JSON if API takes too long (after 3 seconds)
      fallbackTimeout = setTimeout(() => {
        if (mounted && localDmsFetchCount === 0) {
          // Only use JSON fallback if first API call hasn't completed yet
          console.log('DMS API delayed, using temporary fallback data');
          setDmsData(dmsJson);
        }
      }, 3000); // 3 second delay before showing fallback
    }

    return () => {
      mounted = false;
      clearTimeout(dmsTimeout);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, []);

  // Remove the old effect that automatically switched to API data
  // Now we only use real API data when it's actually received

  // Memoize normalization and counting for performance and correct mapping
  const {
    materialNorm, sparesNorm, salesNorm, dmsNorm,
    materialCounts, sparesCounts, salesCounts, dmsCounts,
    totalCounts
  } = useMemo(() => {
    const normalize = (arr) =>
      arr.map((item) => ({
        ...item,
        COND: item.COND !== undefined ? item.COND : item.Cond,
      }));
    const countStatus = (arr) => ({
      inprogress: arr.filter((i) => i.COND === 'G').length,
      fail: arr.filter((i) => i.COND === 'R').length,
      delay: arr.filter((i) => i.COND === 'D').length, // Only 'D' is Delay
    });

    // Use dmsData for display (sample for first 2 fetches, then API)
    const materialNorm = normalize(Array.isArray(materialData) ? materialData : []);
    const sparesNorm = normalize(Array.isArray(sparesData) ? sparesData : []);
    const salesNorm = normalize(Array.isArray(salesData) ? salesData : []);
    const dmsNorm = normalize(Array.isArray(dmsData) ? dmsData : []);

    const materialCounts = countStatus(materialNorm);
    const sparesCounts = countStatus(sparesNorm);
    const salesCounts = countStatus(salesNorm);
    const dmsCounts = countStatus(dmsNorm);

    const totalCounts = {
      inprogress: materialCounts.inprogress + sparesCounts.inprogress + salesCounts.inprogress + dmsCounts.inprogress,
      fail: materialCounts.fail + sparesCounts.fail + salesCounts.fail + dmsCounts.fail,
      delay: materialCounts.delay + sparesCounts.delay + salesCounts.delay + dmsCounts.delay,
    };

    try {
      localStorage.setItem('materialCounts', JSON.stringify(materialCounts));
      localStorage.setItem('sparesCounts', JSON.stringify(sparesCounts));
      localStorage.setItem('salesCounts', JSON.stringify(salesCounts));
      localStorage.setItem('dmsCounts', JSON.stringify(dmsCounts));
      localStorage.setItem('totalCounts', JSON.stringify(totalCounts));
    } catch (e) {
      console.warn('localStorage setItem failed:', e);
    }
    return {
      materialNorm, sparesNorm, salesNorm, dmsNorm,
      materialCounts, sparesCounts, salesCounts, dmsCounts,
      totalCounts
    };
  }, [materialData, sparesData, salesData, dmsData]);

  // Define pagedDmsNorm AFTER dmsNorm is initialized
  const pagedDmsNorm = useMemo(
    () => dmsNorm.slice(0, (dmsPage + 1) * dmsPageSize),
    [dmsNorm, dmsPage, dmsPageSize]
  );

  // Use safeColorTheme for chart colors (sync with Navbar)
  const createChartData = (counts) => ({
    labels: ['In Progress', 'Fail', 'Delay'],
    datasets: [
      {
        data: [counts.inprogress, counts.fail, counts.delay],
        backgroundColor: isDark
          ? [
              safeColorTheme.accent, // In Progress
              '#EF4444',             // Fail
              '#f59e42'              // Delay (purple for visibility)
            ]
          : [
              safeColorTheme.main,   // In Progress
              '#EF4444',             // Fail
              '#f59e42'              // Delay (purple for visibility)
            ],
        hoverBackgroundColor: isDark
          ? [
              safeColorTheme.main,
              '#FF1744',
              '#c084fc'              // Lighter purple on hover
            ]
          : [
              safeColorTheme.accent,
              '#B71C1C',
              '#c084fc'              // Lighter purple on hover
            ],
        borderWidth: 2,
        borderColor: isDark ? (safeColorTheme.darkBg || '#23272f') : (safeColorTheme.bg || '#ffffff'),
      },
    ],
  });

  // Helper to check if all values are zero or all are '-'
  const isAllZeroOrDash = (counts) =>
    Object.values(counts).every((v) => v === 0 || v === '-' || v === undefined || v === null);

  // Add helper to check if all values are zero
  const isAllZero = (counts) =>
    Object.values(counts).every((v) => v === 0);

  // Chart data for null chart
  const nullChartData = {
    labels: ['Null'],
    datasets: [
      {
        data: [1],
        backgroundColor: [isDark ? '#888888' : '#bdbdbd'],
        hoverBackgroundColor: [isDark ? '#aaaaaa' : '#e0e0e0'],
        borderWidth: 2,
        borderColor: isDark ? '#23272f' : '#ffffff',
      },
    ],
  };

  // Map chart index to COND value
  const statusMap = {
    0: 'G', // In Progress
    1: 'R', // Fail
    2: 'D', // Delay (only D)
  };

  // Chart click handler, now also tracks which chart was clicked
  const handleChartClick = (elems, chartType) => {
    if (!elems || elems.length === 0) {
      setSelectedStatus(null);
      setSelectedChart(null);
      return;
    }
    const idx = elems[0].index;
    setSelectedStatus(statusMap[idx]);
    setSelectedChart(chartType);
  };

  // Chart.js options with onClick handler, pass chartType
  const getChartOptions = (type, chartKey) => ({
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: isDark ? '#ffffff' : '#000000',
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const chartData = tooltipItem.dataset;
            const label = tooltipItem.label;
            const value = chartData.data[tooltipItem.dataIndex];
            const total = chartData.data.reduce((a, b) => a + b, 0);
            const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: type === 'pie' ? undefined : '40%',
    maintainAspectRatio: false,
    responsive: true,
    onClick: (event, elems) => handleChartClick(elems, chartKey),
    animation: {
      duration: 900, // Smooth transition duration (ms)
      easing: 'easeInOutCubic', // Smooth easing
    },
    transitions: {
      show: {
        animations: {
          x: { from: 0 },
          y: { from: 0 }
        }
      },
      hide: {
        animations: {
          x: { to: 0 },
          y: { to: 0 }
        }
      }
    }
  });

  // Filter table data based on selectedStatus and selectedChart
  const getFilteredRows = () => {
    let combined = [];
    if (selectedChart === 'material') {
      combined = materialNorm.map((row) => ({ ...row, __type: 'Material' }));
    } else if (selectedChart === 'Spares') {
      combined = sparesNorm.map((row) => ({ ...row, __type: 'Spares' }));
    } else if (selectedChart === 'Sales') {
      combined = salesNorm.map((row) => ({ ...row, __type: 'Sales' }));
    } else if (selectedChart === 'DMS') {
      combined = pagedDmsNorm.map((row) => ({ ...row, __type: 'DMS' }));
    } else if (selectedChart === 'total') {
      combined = [
        ...materialNorm.map((row) => ({ ...row, __type: 'Material' })),
        ...sparesNorm.map((row) => ({ ...row, __type: 'Spares' })),
        ...salesNorm.map((row) => ({ ...row, __type: 'Sales' })),
        ...pagedDmsNorm.map((row) => ({ ...row, __type: 'DMS' })),
      ];
    } else {
      combined = [
        ...materialNorm.map((row) => ({ ...row, __type: 'Material' })),
        ...sparesNorm.map((row) => ({ ...row, __type: 'Spares' })),
        ...salesNorm.map((row) => ({ ...row, __type: 'Sales' })),
        ...pagedDmsNorm.map((row) => ({ ...row, __type: 'DMS' })),
      ];
    }
    if (!selectedStatus) return combined;
    return combined.filter(row => row.COND === selectedStatus);
  };

  // Use safeColorTheme for card and chart backgrounds
  const renderCard = (title, chartData, type = 'doughnut', isNull = false, chartKey) => {
    // Determine fetchCount for this chartKey
    let fetchCount = 0;
    if (chartKey === 'material') fetchCount = materialFetchCount;
    else if (chartKey === 'Spares') fetchCount = sparesFetchCount;
    else if (chartKey === 'Sales') fetchCount = salesFetchCount;
    else if (chartKey === 'DMS') fetchCount = dmsFetchCount;
    else if (chartKey === 'total') fetchCount = Math.min(materialFetchCount, sparesFetchCount, salesFetchCount, dmsFetchCount);

    const allClear = shouldShowAllClear(isNull || isAllZeroOrDash(chartData.datasets[0].data), fetchCount);

    // If first fetch and data is null/zero, show a chart with null data (not a blank div)
    const showNullChart = (isNull || isAllZeroOrDash(chartData.datasets[0].data)) && fetchCount <= 1;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        whileHover={{ scale: 1.06, boxShadow: "0 8px 32px rgba(25,118,210,0.18)" }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        style={{
          background: CHART_BG_COLOR,
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 340,
          margin: '16px',
          transition: 'transform 0.3s, box-shadow 0.3s',
          position: 'relative'
        }}
        className="chart-card"
      >
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            color: isDark ? '#fff' : '#2c2f36', // Match card text color for theme
            marginBottom: 16,
            fontWeight: 700,
            fontSize: '1.2rem',
          }}
        >
          {title}
        </motion.h3>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 120 }}
          style={{
            width: 220,
            height: 220,
            position: 'relative',
            // Avoid using 'background' shorthand if backgroundClip is set elsewhere
            // background: CHART_BG_COLOR,
            backgroundColor: CHART_BG_COLOR, // Use backgroundColor instead of background
            borderRadius: 110
          }}
          key={JSON.stringify(chartData.data)}
        >
          {/* Chart animation */}
          {!dataLoaded ? null : (
            showNullChart ? (
              type === 'pie'
                ? <MemoPie data={nullChartData} options={getChartOptions(type, chartKey)} />
                : <MemoDoughnut data={nullChartData} options={getChartOptions(type, chartKey)} />
            ) : allClear ? (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: '#10B981',
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: 0.5,
                opacity: 0.95,
                background: 'rgba(16,185,129,0.07)',
                borderRadius: 110,
                border: '2px solid #10B981',
                position: 'relative'
              }}>
                <Lottie
                  animationData={allClearLottie}
                  loop={true}
                  style={{ width: 230, height: 230, marginBottom: 8 }}
                />
              </div>
            ) : (
              type === 'pie'
                ? <MemoPie data={chartData} options={getChartOptions(type, chartKey)} />
                : <MemoDoughnut data={chartData} options={getChartOptions(type, chartKey)} />
            )
          )}
        </motion.div>
      </motion.div>
    );
  };

  // Enhanced renderTable: add "Load More" for DMS chunked data
  const renderTable = () => {
    const filtered = getFilteredRows();
    let columns = [];
    if (filtered.length > 0) {
      columns = Object.keys(filtered[0]).filter((k) => !k.startsWith('__'));
    } else if (selectedChart === 'material' && materialNorm.length > 0) {
      columns = Object.keys(materialNorm[0]).filter((k) => !k.startsWith('__'));
    } else if (selectedChart === 'Spares' && sparesNorm.length > 0) {
      columns = Object.keys(sparesNorm[0]).filter((k) => !k.startsWith('__'));
    } else if (selectedChart === 'Sales' && salesNorm.length > 0) {
      columns = Object.keys(salesNorm[0]).filter((k) => !k.startsWith('__'));
    } else if (selectedChart === 'DMS' && dmsNorm.length > 0) {
      columns = Object.keys(dmsNorm[0]).filter((k) => !k.startsWith('__'));
    } else if (selectedChart === 'total' && (materialNorm.length > 0 || sparesNorm.length > 0 || salesNorm.length > 0 || dmsNorm.length > 0)) {
      columns = [
        ...(materialNorm.length > 0 ? Object.keys(materialNorm[0]) : Object.keys(sparesNorm[0])),
        ...(salesNorm.length > 0 ? Object.keys(salesNorm[0]) : []),
        ...(dmsNorm.length > 0 ? Object.keys(dmsNorm[0]) : [])
      ].filter((k) => !k.startsWith('__'));
    }

    // Remove 'Cond' and 'Count' columns (case-insensitive) from headings and records
    let displayColumns = columns.filter(
      (col) => col.toLowerCase() !== 'cond' && col.toLowerCase() !== 'count'
    );
    // Place 'Status' as the last column only if there are columns to show
    if (displayColumns.length > 0) {
      displayColumns = [...displayColumns, 'Status'];
    }

    let displayRows = filtered.map(row => {
      // Remove both 'Cond', 'COND', 'Count', 'COUNT' keys from each row
      const { Cond, COND, Count, COUNT, ...rest } = row;
      // Calculate status label and color
      let cond = row.COND;
      let statusLabel = '';
      if (cond === 'G') statusLabel = 'In Progress';
      else if (cond === 'R') statusLabel = 'Fail';
      else if (cond === 'D') statusLabel = 'Delay'; // Only D is Delay
      else statusLabel = cond || '';
      return { ...rest, Status: statusLabel, __COND: cond }; // __COND for color
    });

    // Card type color (Total, Spares, Material, DMS, Sales)
    const getTypeTag = (type) => {
      if (type === 'Material') {
        return {
          label: 'Material',
          color: safeColorTheme.main || (isDark ? '#facc15' : '#eab308'),
          bg: isDark ? (safeColorTheme.darkBg || '#3a2e0a') : (safeColorTheme.bg || '#fffbe6')
        };
      }
      if (type === 'Spares') {
        return {
          label: 'Spares',
          color: safeColorTheme.accent || (isDark ? '#4ade80' : '#22c55e'),
          bg: isDark ? (safeColorTheme.darkBg || '#15392b') : (safeColorTheme.bg || '#e6f7ef')
        };
      }
      if (type === 'DMS') {
        return {
          label: 'DMS',
          color: '#4ade80', // teal/green accent for DMS
          bg: isDark ? '#15392b' : '#e6f7ef'
        };
      }
      if (type === 'Sales') {
        return {
          label: 'Sales',
          color: '#7c3aed', // purple accent for Sales
          bg: isDark ? '#312e81' : '#ede9fe'
        };
      }
      // fallback for Total
      return {
        label: 'Total',
        color: safeColorTheme.main || (isDark ? '#00e4d3' : '#1976d2'),
        bg: isDark ? (safeColorTheme.darkBg || '#1e2a2f') : (safeColorTheme.bg || '#e3f0fa')
      };
    };

    // Status color
    const getStatusColor = (cond) => {
      if (cond === 'G') return isDark ? '#10B981' : '#3B82F6';
      if (cond === 'R') return '#EF4444';
      if (cond === 'D') return '#f59e42'; // Use purple for Delay in table too
      return isDark ? '#fff' : '#23272f';
    };

    const getRowBg = (cond, type) => {
      if (cond === 'G') return isDark ? '#173c32' : '#e6f7ef';
      if (cond === 'R') return isDark ? '#3c1a1a' : '#fde8e8';
      if (cond === 'D') return isDark ? '#3b2562' : '#f3e8ff'; // Purple bg for Delay
      // fallback: card type bg
      return getTypeTag(type).bg;
    };

    // Font family for high quality
    const fontFamily = `'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Liberation Sans', sans-serif`;

    return (
      <div style={{
        margin: '32px auto 0 auto',
        background: isDark ? '#23272f' : '#fff',
        borderRadius: 14,
        boxShadow: isDark
          ? '0 4px 24px rgba(0,0,0,0.8)'
          : '0 4px 24px rgba(54,162,235,0.13)',
        padding: 28,
        maxWidth: 1200,
        overflowX: 'auto',
        fontFamily,
      }}>
        <h3 style={{
          color: isDark ? '#00e4d3' : '#1976d2',
          marginBottom: 18,
          fontWeight: 800,
          fontSize: '1.25rem',
          letterSpacing: 0.5,
          fontFamily,
        }}>
          IRN Data
          {selectedStatus === 'G' && ' (In Progress)'}
          {selectedStatus === 'R' && ' (Fail)'}
          {selectedStatus === 'D' && ' (Delay)'}
          {selectedChart === 'material' && ' [Material]'}
          {selectedChart === 'Spares' && ' [Spares]'}
          {selectedChart === 'total' && ' [Total]'}
        </h3>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          fontSize: 15,
          background: 'inherit',
          fontFamily,
        }}>
          <thead>
            <tr>
              <th style={{
                padding: 10,
                borderBottom: isDark ? '2px solid #333' : '2px solid #e0e0e0',
                background: isDark
                  ? 'linear-gradient(90deg, #23272f 70%, #1e2a2f 100%)'
                  : 'linear-gradient(90deg, #e3f0fa 70%, #f5f5f5 100%)',
                color: isDark ? '#00e4d3' : '#1976d2',
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: 0.2,
                fontFamily,
                textTransform: 'uppercase',
                boxShadow: isDark
                  ? '0 2px 8px 0 rgba(0,228,211,0.04)'
                  : '0 2px 8px 0 rgba(25,118,210,0.04)'
              }}>Type</th>
              {displayRows.length > 0 && displayColumns.map((col) => (
                <th key={col} style={{
                  padding: 10,
                  borderBottom: isDark ? '2px solid #333' : '2px solid #e0e0e0',
                  background: isDark
                    ? 'linear-gradient(90deg, #23272f 70%, #1e2a2f 100%)'
                    : 'linear-gradient(90deg, #e3f0fa 70%, #f5f5f5 100%)',
                  color: isDark ? '#00e4d3' : '#1976d2',
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: 0.2,
                  fontFamily,
                  textTransform: 'uppercase',
                  boxShadow: isDark
                    ? '0 2px 8px 0 rgba(0,228,211,0.04)'
                    : '0 2px 8px 0 rgba(25,118,210,0.04)'
                }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.length === 0 ? (
              <tr>
                <td colSpan={displayColumns.length + 1} style={{
                  textAlign: 'center',
                  padding: 48,
                  color: isDark ? '#00e4d3' : '#1976d2',
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily,
                  background: isDark
                    ? 'linear-gradient(90deg, #23272f 60%, #1e1e2f 100%)'
                    : 'linear-gradient(90deg, #f9f9f9 60%, #e3f0fa 100%)',
                  borderRadius: 12,
                  border: isDark
                    ? '2px dashed #00e4d3'
                    : '2px dashed #1976d2',
                  letterSpacing: 0.5,
                  boxShadow: isDark
                    ? '0 2px 12px rgba(0,228,211,0.08)'
                    : '0 2px 12px rgba(25,118,210,0.08)',
                  transition: 'all 0.3s'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    <span role="img" aria-label="No Data" style={{ fontSize: 48 }}>
                      📭
                    </span>
                    <span>
                      No records found!
                    </span>
                    <span style={{
                      fontSize: 15,
                      color: isDark ? '#b3e5e3' : '#1976d2',
                      fontWeight: 400,
                      marginTop: 4
                    }}>
                      Try changing your selection or check back later.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              displayRows.map((row, idx) => {
                const typeTag = getTypeTag(row.__type);
                const cond = row.__COND;
                let statusColor = '';
                if (cond === 'G') statusColor = isDark ? '#10B981' : '#3B82F6';
                else if (cond === 'R') statusColor = '#EF4444';
                else if (cond === 'D') statusColor = '#F59E0B';
                else statusColor = isDark ? '#fff' : '#23272f';
                return (
                  <tr
                    key={idx}
                    style={{
                      background: getRowBg(cond, row.__type),
                      transition: 'background 0.3s',
                    }}
                  >
                    <td style={{
                      padding: 10,
                      borderBottom: '1px solid #e0e0e0',
                      fontWeight: 700,
                      fontFamily,
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 12px',
                        borderRadius: 12,
                        background: typeTag.bg,
                        color: typeTag.color,
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: 0.2,
                        border: `1px solid ${typeTag.color}`,
                        fontFamily,
                      }}>
                        {typeTag.label}
                      </span>
                    </td>
                    {displayColumns.map((col) =>
                      col === 'Status' ? (
                        <td
                          key={col}
                          style={{
                            padding: 10,
                            borderBottom: '1px solid #e0e0e0',
                            fontFamily,
                            textAlign: 'center'
                          }}
                        >
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 12px',
                            borderRadius: 10,
                            background: statusColor + '22',
                            color: statusColor,
                            fontWeight: 700,
                            fontSize: 13.5,
                            letterSpacing: 0.2,
                            border: `1px solid ${statusColor}`,
                            fontFamily,
                            minWidth: 80
                          }}>
                            {row.Status}
                          </span>
                        </td>
                      ) : (
                        <td
                          key={col}
                          style={{
                            padding: 10,
                            borderBottom: '1px solid #e0e0e0',
                            color: (col === 'Actual Error' && cond)
                              ? getStatusColor(cond)
                              : isDark ? '#fff' : '#23272f',
                            fontWeight: 500,
                            fontFamily,
                            fontSize: 14.5,
                            letterSpacing: 0.1,
                            background: undefined,
                          }}
                        >
                          {row[col]}
                        </td>
                      )
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {/* Add Load More button for DMS */}
        {selectedChart === 'DMS' && dmsData.length > pagedDmsNorm.length && (
          <div style={{ textAlign: 'center', margin: '18px 0' }}>
            <button
              style={{
                padding: '10px 28px',
                fontSize: 16,
                borderRadius: 8,
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(25,118,210,0.08)',
                marginTop: 8
              }}
              onClick={() => setDmsPage(dmsPage + 1)}
            >
              Load More DMS Records ({pagedDmsNorm.length} / {dmsData.length})
            </button>
          </div>
        )}
      </div>
    );
  };

  // Handler for CardRow click events
  const handleCardTableRequest = ({ chartKey, status }) => {
    setSelectedChart(chartKey);
    setSelectedStatus(status);
  };

  // Update cardData to 5 cards
  const [cardData, setCardData] = useState([
    { title: 'Total', inProgress: '-', fail: '-', delay: '-' },
    { title: 'Spares', inProgress: '-', fail: '-', delay: '-' },
    { title: 'Material', inProgress: '-', fail: '-', delay: '-' },
    { title: 'DMS', inProgress: '-', fail: '-', delay: '-' },
    { title: 'Sales', inProgress: '-', fail: '-', delay: '-' },
  ]);
  useEffect(() => {
    const updateCounts = () => {
      const materialCounts = JSON.parse(localStorage.getItem('materialCounts') || '{"inprogress":"-","fail":"-","delay":"-"}');
      const sparesCounts = JSON.parse(localStorage.getItem('sparesCounts') || '{"inprogress":"-","fail":"-","delay":"-"}');
      const salesCounts = JSON.parse(localStorage.getItem('salesCounts') || '{"inprogress":"-","fail":"-","delay":"-"}');
      const dmsCounts = JSON.parse(localStorage.getItem('dmsCounts') || '{"inprogress":"-","fail":"-","delay":"-"}');
      const totalCounts = JSON.parse(localStorage.getItem('totalCounts') || '{"inprogress":"-","fail":"-","delay":"-"}');
      setCardData([
        {
          title: 'Total',
          inProgress: totalCounts.inprogress,
          fail: totalCounts.fail,
          delay: totalCounts.delay,
        },
        {
          title: 'Spares',
          inProgress: sparesCounts.inprogress,
          fail: sparesCounts.fail,
          delay: sparesCounts.delay,
        },
        {
          title: 'Material',
          inProgress: materialCounts.inprogress,
          fail: materialCounts.fail,
          delay: materialCounts.delay,
        },
        {
          title: 'DMS',
          inProgress: dmsCounts.inprogress,
          fail: dmsCounts.fail,
          delay: dmsCounts.delay,
        },
        {
          title: 'Sales',
          inProgress: salesCounts.inprogress,
          fail: salesCounts.fail,
          delay: salesCounts.delay,
        },
      ]);
    };
    updateCounts();
    const interval = setInterval(updateCounts, 1000);
    return () => clearInterval(interval);
  }, []);

  // Add icons for 5 cards
  const icons = [
    <FaCubes style={iconStyle} color="#1976d2" />,      // Total (blue)
    <FaBoxOpen style={iconStyle} color="#22c55e" />,    // Spares (green)
    <FaWarehouse style={iconStyle} color="#eab308" />,  // Material (gold/yellow)
    <FaUserTie style={iconStyle} color="#4ade80" />,    // DMS (teal/green)
    <FaChartPie style={iconStyle} color="#7c3aed" />,   // Sales (purple)
  ];

  const cardToChartKey = {
    Total: 'total',
    Spares: 'Spares',
    Material: 'material',
    DMS: 'DMS',
    Sales: 'Sales',
  };

  // Single return for the component
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      style={{
        minHeight: '100vh',
        background: isDark ? '#181c23' : '#f4f6fa',
        margin: -5,
        padding: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <AnimatePresence>
        <motion.div
          key="main-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 120 }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            maxWidth: 1600,
            margin: '4px auto 0 auto',
            gap: 48,
            boxSizing: 'border-box',
            overflow: 'visible',
          }}
        >
          {/* Left: 2x2 grid of doughnut charts in a modern card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: isDark ? '#232733' : '#f8fafc',
              borderRadius: 22,
              boxShadow: isDark
                ? '0 8px 32px rgba(0,0,0,0.32)'
                : '0 8px 32px rgba(54,162,235,0.10)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                columnGap: 32,
                rowGap: -10,
                width: '100%',
                height: '100%',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {renderCard(
                  'Spares',
                  createChartData(sparesCounts),
                  'doughnut',
                  dataLoaded && isAllZero(sparesCounts),
                  'Spares'
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {renderCard(
                  'Material',
                  createChartData(materialCounts),
                  'doughnut',
                  dataLoaded && isAllZero(materialCounts),
                  'material'
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {renderCard(
                  'DMS',
                  createChartData(dmsCounts),
                  'doughnut',
                  dataLoaded && isAllZero(dmsCounts),
                  'DMS'
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {renderCard(
                  'Sales',
                  createChartData(salesCounts),
                  'doughnut',
                  dataLoaded && isAllZero(salesCounts),
                  'Sales'
                )}
              </div>
            </div>
          </div>
          {/* Right: cards and pie chart in a modern card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',

              alignItems: 'center',
              background: isDark ? '#232733' : '#f8fafc',
              borderRadius: 22,
              boxShadow: isDark
                ? '0 8px 32px rgba(0,0,0,0.32)'
                : '0 8px 32px rgba(54,162,235,0.10)',
              padding: '15px 24px 5px 24px',
              minWidth: 380,
              maxWidth: 380,
              justifyContent: 'flex-start'
            }}
          >
            {/* All cards in one div */}
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              alignItems: 'center',
            }}>
              {cardData.map((item, idx) => (
                <Card
                  key={idx}
                  title={item.title}
                  inProgress={item.inProgress}
                  fail={item.fail}
                  delay={item.delay}
                  theme={theme}
                  icon={icons[idx]}
                  loading={item.inProgress === '-' && item.fail === '-' && item.delay === '-'}
                  onCardClick={() => {
                    handleCardTableRequest({ chartKey: cardToChartKey[item.title], status: null });
                  }}
                  onStatusClick={(status) => {
                    handleCardTableRequest({ chartKey: cardToChartKey[item.title], status });
                  }}
                  isActive={selectedChart === cardToChartKey[item.title]}
                />
              ))}
            </div>
            {/* Pie chart below the cards div */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {renderCard(
                'Total IRN',
                createChartData(totalCounts),
                'pie',
                dataLoaded && isAllZero(totalCounts),
                'total'
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Table below all */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, type: "spring", stiffness: 120 }}
        style={{
          margin: '40px auto 0 auto',
          maxWidth: 1200,
          width: '100%',
          padding: '0 12px',
          boxSizing: 'border-box'
        }}
      >
        {renderTable()}
      </motion.div>
      {/* Loading overlay */}
      {!dataLoaded && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ 
            opacity: 1, 
            backdropFilter: 'blur(10px)',
            background: [
              'linear-gradient(45deg, #fff, #f0f8ff)',
              'linear-gradient(45deg, #f0f8ff, #e6f3ff)',
              'linear-gradient(45deg, #e6f3ff, #fff)'
            ]
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8,
            backdropFilter: 'blur(0px)',
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          transition={{ 
            duration: 1.2, 
            ease: "easeInOut",
            background: { repeat: Infinity, duration: 3, ease: "linear" }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(45deg, #fff, #f0f8ff)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ 
              scale: 1, 
              rotate: 0, 
              opacity: 1,
              boxShadow: [
                '0 0 0px rgba(0,228,211,0.3)',
                '0 0 50px rgba(0,228,211,0.8)',
                '0 0 100px rgba(0,228,211,0.6)',
                '0 0 50px rgba(0,228,211,0.8)',
                '0 0 0px rgba(0,228,211,0.3)'
              ]
            }}
            transition={{ 
              scale: { duration: 1.5, type: "spring", stiffness: 100, damping: 10 },
              rotate: { duration: 1.5, ease: "easeInOut" },
              opacity: { duration: 1, ease: "easeInOut" },
              boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }}
            style={{
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,248,255,0.8))',
              padding: '40px',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(0,228,211,0.3)',
            }}
          >
            <motion.div
              animate={{ 
                scale: 1.05,
                filter: [
                  'drop-shadow(0 0 20px rgba(0,228,211,0.5))',
                  'drop-shadow(0 0 40px rgba(0,228,211,0.8))',
                  'drop-shadow(0 0 20px rgba(0,228,211,0.5))'
                ]
              }}
              transition={{ 
                scale: { 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  duration: 2, 
                  ease: "easeInOut" 
                },
                filter: { 
                  repeat: Infinity, 
                  duration: 2, 
                  ease: "easeInOut" 
                }
              }}
            >
              <Lottie 
                animationData={loadingLottie} 
                loop={true} 
                style={{ width: 500, height: 500 }} 
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      {/* Material error popup */}
      {showMaterialError && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ 
            opacity: 1, 
            backdropFilter: 'blur(15px)',
            background: [
              'linear-gradient(45deg, #fff, #fff5f5)',
              'linear-gradient(45deg, #fff5f5, #ffebee)',
              'linear-gradient(45deg, #ffebee, #fff)'
            ]
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.5,
            backdropFilter: 'blur(0px)',
            transition: { duration: 1, ease: "easeInOut" }
          }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            background: { repeat: Infinity, duration: 4, ease: "linear" }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(45deg, #fff, #fff5f5)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <motion.div
            initial={{ scale: 0, y: 100, opacity: 0 }}
            animate={{ 
              scale: 1, 
              y: 0, 
              opacity: 1,
              boxShadow: [
                '0 0 0px rgba(239,68,68,0.3)',
                '0 0 60px rgba(239,68,68,0.9)',
                '0 0 120px rgba(239,68,68,0.7)',
                '0 0 60px rgba(239,68,68,0.9)',
                '0 0 0px rgba(239,68,68,0.3)'
              ]
            }}
            transition={{ 
              scale: { duration: 2, type: "spring", stiffness: 80, damping: 8 },
              y: { duration: 1.5, type: "spring", stiffness: 120, damping: 15 },
              opacity: { duration: 1, ease: "easeInOut" },
              boxShadow: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
            }}
            style={{
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,245,245,0.9))',
              padding: '50px',
              backdropFilter: 'blur(25px)',
              border: '3px solid rgba(239,68,68,0.4)',
            }}
          >
            <motion.div
              animate={{ 
                scale: 1.1,
                rotate: 5,
                filter: [
                  'drop-shadow(0 0 25px rgba(239,68,68,0.6))',
                  'drop-shadow(0 0 50px rgba(239,68,68,0.9))',
                  'drop-shadow(0 0 25px rgba(239,68,68,0.6))'
                ]
              }}
              transition={{ 
                scale: { 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  duration: 3, 
                  ease: "easeInOut" 
                },
                rotate: { 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  duration: 2, 
                  ease: "easeInOut" 
                },
                filter: { 
                  repeat: Infinity, 
                  duration: 3, 
                  ease: "easeInOut" 
                }
              }}
            >
              <Lottie 
                animationData={error404Lottie} 
                loop={true} 
                style={{ width: 500, height: 500 }} 
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Helper for allClear: only show clear lottie if fetchCount > 1, otherwise show null
const shouldShowAllClear = (isNull, fetchCount) => {
  if (fetchCount <= 1) return false; // First fetch, show null
  return isNull;
};

const MemoPie = React.memo(Pie);
const MemoDoughnut = React.memo(Doughnut);

export default ChartSection;

/* Add this to your CSS file (e.g., ChartSection.css) for hover effects:

.chart-card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
*/
