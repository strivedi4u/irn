import React, { useContext, useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';
import './SpareIRNMonitoring.css';
import { DataContext } from '../App';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const SpareIRNMonitoring = ({ theme = 'light' }) => {
  const { materialData, dmsData } = useContext(DataContext);
  const [materialCounts, setMaterialCounts] = useState({ inprogress: 0, fail: 0, delay: 0 });
  const [dmsCounts, setDmsCounts] = useState({ inprogress: 0, fail: 0, delay: 0 });

  // Helper to normalize data keys for mapping (handles Cond/COND, etc.)
  const normalizeData = (arr) => {
    return arr.map(item => {
      const normalized = { ...item };
      if (item.Cond !== undefined) normalized.COND = item.Cond;
      return normalized;
    });
  };

  // Helper to count Inprogress/Fail/Delay for a dataset
  const getStatusCounts = (arr) => ({
    inprogress: arr.filter(item => item.COND === 'G').length,
    fail: arr.filter(item => item.COND === 'R').length,
    delay: arr.filter(item => item.COND === 'Y').length,
  });

  useEffect(() => {
    const materialNorm = normalizeData(materialData);
    const dmsNorm = normalizeData(dmsData);

    setMaterialCounts(getStatusCounts(materialNorm));
    setDmsCounts(getStatusCounts(dmsNorm));
  }, [materialData, dmsData]);

  const createChartData = (counts) => ({
    labels: ['In Progress', 'Fail', 'Delay'],
    datasets: [
      {
        data: [counts.inprogress, counts.fail, counts.delay],
        backgroundColor: theme === 'dark'
          ? ['#1e90ff', '#e63946', '#f4a261']
          : ['#4bc0c0', '#ff9f40', '#ffcd56'],
        hoverBackgroundColor: theme === 'dark'
          ? ['#0074e0', '#b71c1c', '#ffb300']
          : ['#2a9d8f', '#e76f51', '#f4a261'],
        borderWidth: 2,
        borderColor: theme === 'dark' ? '#23272f' : '#ffffff',
      },
    ],
  });

  const renderChartCard = (title, chartData, type = 'doughnut') => (
    <div
      style={{
        background: theme === 'dark' ? '#23272f' : '#fff',
        borderRadius: 16,
        boxShadow: theme === 'dark'
          ? '0 4px 16px rgba(0,0,0,0.7)'
          : '0 4px 16px rgba(54,162,235,0.10)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 260,
        margin: '16px',
      }}
    >
      <h3
        style={{
          color: theme === 'dark' ? '#00e4d3' : '#1976d2',
          marginBottom: 16,
          fontWeight: 700,
        }}
      >
        {title}
      </h3>
      <div style={{ width: 180, height: 180 }}>
        {type === 'pie' ? (
          <Pie
            data={chartData}
            options={{
              plugins: { legend: { display: false } },
              maintainAspectRatio: false,
              responsive: false,
            }}
          />
        ) : (
          <Doughnut
            data={chartData}
            options={{
              plugins: { legend: { display: false } },
              cutout: '70%',
              maintainAspectRatio: false,
              responsive: false,
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        background: theme === 'dark' ? '#181c23' : '#f9f9f9',
        padding: '40px 0',
        gap: '24px',
      }}
    >
      {/* Removed chart cards as requested */}
    </div>
  );
};

export default SpareIRNMonitoring;
