import React, { useState, useEffect, useMemo } from 'react';
import { FaCubes, FaBoxOpen, FaWarehouse, FaSpinner, FaTimesCircle, FaClock } from 'react-icons/fa';
import './CardRow.css';

const iconStyle = {
  fontSize: '1.5rem',
  marginRight: 8,
  verticalAlign: 'middle',
};
const ROW_HEIGHT = '48px'; // Match CardRow height
const fontFamily = "'Montserrat', 'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif";

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
  <div
    className="card cardrow-card"
    style={{
      background: theme === 'dark' ? '#2c2f36' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#2c2f36',
      height: ROW_HEIGHT,
      minHeight: ROW_HEIGHT,
      minWidth: '220px',
      borderRadius: '6px',
      marginTop: '27px',
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
      fontFamily,
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
        fontFamily,
      }}
    >
      {icon}
      <h4
        className="card-title"
        style={{
          fontWeight: 600,
          fontSize: '1rem',
          letterSpacing: 0.5,
          margin: 0,
          textAlign: 'left',
          // Change color based on theme for better contrast
          color:
            theme === 'dark'
              ? (title === 'Total'
                  ? '#00e4d3'
                  : title === 'Spare'
                    ? '#4ade80'
                    : '#facc15')
              : (title === 'Total'
                  ? '#1976d2'
                  : title === 'Spare'
                    ? '#22c55e'
                    : '#eab308'),
          transition: 'color 0.3s',
          fontFamily,
        }}
      >
        {title}
      </h4>
    </div>
    <div
      className="card-details"
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        fontSize: '1rem',
        alignItems: 'center',
        justifyContent: 'flex-end',
        fontFamily,
      }}
    >
      <div
        title="In Progress"
        style={{
          display: 'flex',
          alignItems: 'center',
          color: '#007bff',
          cursor: 'pointer',
        }}
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
      </div>
      <div
        title="Fail"
        style={{
          display: 'flex',
          alignItems: 'center',
          color: '#dc3545',
          cursor: 'pointer',
        }}
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
      </div>
      <div
        title="Delay"
        style={{
          display: 'flex',
          alignItems: 'center',
          color: '#ffc107',
          cursor: 'pointer',
        }}
        onClick={e => {
          e.stopPropagation();
          onStatusClick('Y');
        }}
      >
        <FaClock style={iconStyle} />
        <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
          {loading ? '-' : delay}
        </span>
      </div>
    </div>
  </div>
);

// --- Main CardRow ---
const CardRow = ({ theme = 'light', onCardTableRequest }) => {
  const [cardData, setCardData] = useState([
    { title: 'Total', inProgress: '-', fail: '-', delay: '-' },
    { title: 'Spare', inProgress: '-', fail: '-', delay: '-' },
    { title: 'Material', inProgress: '-', fail: '-', delay: '-' },
  ]);

  useEffect(() => {
    const updateCounts = () => {
      const materialCounts = JSON.parse(localStorage.getItem('materialCounts') || '{"inprogress":"-","fail":"-","delay":"-"}');
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
          title: 'Spare',
          inProgress: dmsCounts.inprogress,
          fail: dmsCounts.fail,
          delay: dmsCounts.delay,
        },
        {
          title: 'Material',
          inProgress: materialCounts.inprogress,
          fail: materialCounts.fail,
          delay: materialCounts.delay,
        },
      ]);
    };
    updateCounts();
    const interval = setInterval(updateCounts, 1000);
    return () => clearInterval(interval);
  }, []);

  const icons = [
    <FaCubes style={iconStyle} color="#007bff" />, // Total
    <FaBoxOpen style={iconStyle} color="#28a745" />, // Spare
    <FaWarehouse style={iconStyle} color="#ffc107" />, // Material
  ];

  // Map card title to chartKey for ChartSection.js
  const cardToChartKey = {
    Total: 'total',
    Spare: 'spare',
    Material: 'material',
  };

  return (
    <div
      className="card-row cardrow-row"
      style={{
        display: 'flex',
        gap: '16px',
        margin: '0 auto',
        justifyContent: 'center',
        alignItems: 'center',
        height: ROW_HEIGHT,
        minHeight: ROW_HEIGHT,
        background: theme === 'dark' ? '#1e1e2f' : '#f9f9f9',
        borderRadius: '6px',
        padding: '4px 12px',
        fontFamily,
      }}
    >
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
            if (onCardTableRequest) onCardTableRequest({ chartKey: cardToChartKey[item.title], status: null });
          }}
          onStatusClick={(status) => {
            if (onCardTableRequest) onCardTableRequest({ chartKey: cardToChartKey[item.title], status });
          }}
          isActive={false}
        />
      ))}
    </div>
  );
};

export default CardRow;

/* Add this to CardRow.css:

.cardrow-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}
*/
