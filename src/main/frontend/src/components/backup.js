import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaList } from 'react-icons/fa';
import './Dashboard.css';
import { Client } from '@stomp/stompjs';

// Register required Chart.js component
ChartJS.register(ArcElement, Tooltip, Legend);

const Backup = ({ onRefresh }) => {
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [loading, setLoading] = useState(true);
  const [popupData, setPopupData] = useState(null);
  const [spareData, setSpareData] = useState([]);
  const [materialData, setMaterialData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('spare'); // 'spare' or 'material'
  const [wsError, setWsError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let stompClient = null;

    const connectWebSocket = () => {
      stompClient = new Client({
        brokerURL: 'ws://localhost:8080/ws-irn',
        reconnectDelay: 1000,
        onConnect: () => {
          setWsError(null);
          // Subscribe to DMS IRN (spare)
          stompClient.subscribe('/topic/dms-irn', (message) => {
            if (isMounted) {
              let data;
              try {
                data = JSON.parse(message.body);
              } catch {
                data = [];
              }
              setSpareData(data || []);
              if (selectedDataset === 'spare') setFilteredData(data || []);
              setLoading(false);
            }
          });
          // Subscribe to Material IRN
          stompClient.subscribe('/topic/material-irn', (message) => {
            if (isMounted) {
              let data;
              try {
                data = JSON.parse(message.body);
              } catch {
                data = [];
              }
              setMaterialData(data || []);
              if (selectedDataset === 'material') setFilteredData(data || []);
              setLoading(false);
            }
          });
          // Optionally, request initial data broadcast from backend
          fetch('http://localhost:8080/api/broadcast-dms-irn', { method: 'POST' });
          fetch('http://localhost:8080/api/broadcast-material-irn', { method: 'POST' });
        },
        onStompError: (frame) => {
          setWsError('WebSocket connection error (STOMP). Please check backend.');
        },
        onWebSocketError: (event) => {
          setWsError('WebSocket connection failed. Please check backend/server.');
        }
      });
      stompClient.activate();
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      if (stompClient) stompClient.deactivate();
    };
    // eslint-disable-next-line
  }, [selectedDataset]);

  // Update filtered data based on selected dataset and condition
  useEffect(() => {
    let baseData = selectedDataset === 'spare' ? spareData : materialData;
    const getCond = (item) => item.Cond || item.COND;
    if (selectedCondition === 'Inprogress') {
      setFilteredData(baseData.filter((item) => getCond(item) === 'G'));
    } else if (selectedCondition === 'Fail') {
      setFilteredData(baseData.filter((item) => getCond(item) === 'R'));
    } else {
      setFilteredData(baseData);
    }
  }, [selectedCondition, spareData, materialData, selectedDataset]);

  // Helper to count Inprogress/Fail for a dataset (handles both Cond and COND)
  const getStatusCounts = (arr) => ({
    inprogress: arr.filter(item => item.Cond === 'G' || item.COND === 'G').length,
    fail: arr.filter(item => item.Cond === 'R' || item.COND === 'R').length,
  });

  const spareCounts = getStatusCounts(spareData);
  const materialCounts = getStatusCounts(materialData);

  // Pie chart data for Spare IRN
  const sparePieData = {
    labels: [
      `Inprogress (${spareCounts.inprogress})`,
      `Fail (${spareCounts.fail})`
    ],
    datasets: [
      {
        data: [spareCounts.inprogress, spareCounts.fail],
        backgroundColor: ['#36a2eb', '#ff6384'],
        hoverOffset: 10,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Pie chart data for Material IRN
  const materialPieData = {
    labels: [
      `Inprogress (${materialCounts.inprogress})`,
      `Fail (${materialCounts.fail})`
    ],
    datasets: [
      {
        data: [materialCounts.inprogress, materialCounts.fail],
        backgroundColor: ['#4bc0c0', '#ff9f40'],
        hoverOffset: 10,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Pie chart data for "No Data"
  const noDataPieData = {
    labels: ['No Data'],
    datasets: [
      {
        data: [1],
        backgroundColor: ['#cccccc'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const noDataPieOptions = {
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: {
        callbacks: {
          label: () => 'No Data',
        },
      },
    },
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeInOutQuad',
    },
  };

  // Define handleCellClick to handle table cell clicks
  const handleCellClick = (value, row) => {
    // If value is an object, show the whole row, else show the row as details
    setPopupData(row);
  };

  // Define closePopup to close the popup
  const closePopup = () => {
    setPopupData(null);
  };

  // Pie chart click handlers
  const handleSparePieClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      setSelectedDataset('spare');
      if (clickedIndex === 0) setSelectedCondition('Inprogress');
      else if (clickedIndex === 1) setSelectedCondition('Fail');
    }
  };

  const handleMaterialPieClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      setSelectedDataset('material');
      if (clickedIndex === 0) setSelectedCondition('Inprogress');
      else if (clickedIndex === 1) setSelectedCondition('Fail');
    }
  };

  // Add filter buttons for All/Inprogress/Fail
  const renderFilterButtons = () => (
    <div style={{ marginBottom: 10 }}>
      <button
        className={`filter-btn${selectedCondition === 'All' ? ' active' : ''}`}
        onClick={() => setSelectedCondition('All')}
        title="Show All"
      >
        <FaList style={{ marginRight: 4 }} /> All
      </button>
      <button
        className={`filter-btn${selectedCondition === 'Inprogress' ? ' active' : ''}`}
        onClick={() => setSelectedCondition('Inprogress')}
        title="Show Inprogress"
      >
        Inprogress
      </button>
      <button
        className={`filter-btn${selectedCondition === 'Fail' ? ' active' : ''}`}
        onClick={() => setSelectedCondition('Fail')}
        title="Show Fail"
      >
        <FaTimesCircle style={{ color: '#ff6384', marginRight: 4 }} /> Fail
      </button>
    </div>
  );

  return (
    <div className="monitoring-page">
      {/* Show WebSocket error if present */}
      {wsError && (
        <div style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>
          {wsError}
        </div>
      )}
      {/* Only show loading text if loading and no data */}
      {loading && filteredData.length === 0 ? (
        <motion.div
          className="loading-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="loading-text">Loading data...</p>
        </motion.div>
      ) : (
        <>
          {/* Charts Row */}
          <motion.div
            className="charts-row"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
            }}
          >
            {/* Spare IRN Pie Chart */}
            <div className="chart-container chart-same-size small-pie-chart">
              <h3>
                Spare IRN Status
              </h3>
              <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 4 }}>
                Total: {spareCounts.inprogress + spareCounts.fail}
              </div>
              <Pie
                data={
                  spareData && spareData.length > 0 && (spareCounts.inprogress + spareCounts.fail > 0)
                    ? sparePieData
                    : noDataPieData
                }
                options={
                  spareData && spareData.length > 0 && (spareCounts.inprogress + spareCounts.fail > 0)
                    ? {
                        plugins: {
                          legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                              font: { size: 14 },
                            },
                          },
                          tooltip: {
                            callbacks: {
                              label: (tooltipItem) => {
                                const label = sparePieData.labels[tooltipItem.dataIndex];
                                const value = sparePieData.datasets[0].data[tooltipItem.dataIndex];
                                const total = spareCounts.inprogress + spareCounts.fail;
                                const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
                                return `${label}: ${value} (${percentage}%)`;
                              },
                            },
                          },
                        },
                        maintainAspectRatio: false,
                        animation: {
                          duration: 1500,
                          easing: 'easeInOutQuad',
                        },
                        onClick: handleSparePieClick,
                      }
                    : noDataPieOptions
                }
              />
            </div>
            {/* Material IRN Pie Chart */}
            <div className="chart-container chart-same-size small-pie-chart">
              <h3>
                Material IRN Status
              </h3>
              <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 4 }}>
                Total: {materialCounts.inprogress + materialCounts.fail}
              </div>
              <Pie
                data={
                  materialData && materialData.length > 0 && (materialCounts.inprogress + materialCounts.fail > 0)
                    ? materialPieData
                    : noDataPieData
                }
                options={
                  materialData && materialData.length > 0 && (materialCounts.inprogress + materialCounts.fail > 0)
                    ? {
                        plugins: {
                          legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                              font: { size: 14 },
                            },
                          },
                          tooltip: {
                            callbacks: {
                              label: (tooltipItem) => {
                                const label = materialPieData.labels[tooltipItem.dataIndex];
                                const value = materialPieData.datasets[0].data[tooltipItem.dataIndex];
                                const total = materialCounts.inprogress + materialCounts.fail;
                                const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
                                return `${label}: ${value} (${percentage}%)`;
                              },
                            },
                          },
                        },
                        maintainAspectRatio: false,
                        animation: {
                          duration: 1500,
                          easing: 'easeInOutQuad',
                        },
                        onClick: handleMaterialPieClick,
                      }
                    : noDataPieOptions
                }
              />
            </div>
          </motion.div>

          {/* Table with Framer Motion */}
          <motion.div
            className="table-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >            <div className="table-scrollable">
              <h3 className="table-title">
                {selectedDataset === 'spare'
                  ? <>Spare IRN</>
                  : <>Material IRN</>
                }{' '}
                {selectedCondition === 'Inprogress'
                  ? <>Inprogress Data</>
                  : selectedCondition === 'Fail'
                  ? <><FaTimesCircle style={{ color: 'tomato', marginRight: 4 }} />Fail Data</>
                  : <><FaList style={{ marginRight: 4 }} />All Data</>
                }
              </h3>
              {renderFilterButtons()}
              <table className="data-table modern-table">
                <thead>
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    {filteredData.length > 0 &&
                      Object.keys(filteredData[0])
                        .filter((key) => key !== 'Count' && key !== 'Cond' && key !== 'COND')
                        .map((key, index) => (
                          <th key={index} className="table-header">{key}</th>
                        ))}
                  </motion.tr>
                </thead>
                <tbody>
                  {/* Show error mesage in table if WebSocket error and no data */}
                  {wsError && filteredData.length === 0 && (
                    <tr>
                      <td colSpan={10} style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>
                        {wsError}
                      </td>
                    </tr>
                  )}
                  {/* ...existing code for rendering table rows... */}
                  {filteredData.map((row, rowIndex) => (
                    <motion.tr
                      key={rowIndex}
                      className={`table-row ${
                        (row.Cond === 'G' || row.COND === 'G')
                          ? 'success-row'
                          : (row.Cond === 'R' || row.COND === 'R')
                          ? 'fail-row tomato-row'
                          : ''
                      }`}
                      style={
                        (row.Cond === 'R' || row.COND === 'R')
                          ? { backgroundColor: 'tomato', color: '#fff' }
                          : {}
                      }
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
                    >
                      {Object.entries(row)
                        .filter(([key]) => key !== 'Count' && key !== 'Cond' && key !== 'COND')
                        .map(([key, value], colIndex) => (
                          <td
                            key={colIndex}
                            className="table-cell"
                            onClick={() => handleCellClick(value, row)}
                          >
                            {typeof value === 'object' && value !== null
                              ? '[details]'
                              : value && value.length > 20
                              ? `${value.substring(0, 20)}...`
                              : value}
                          </td>
                        ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Popup for Full Data */}
          {popupData && (
            <motion.div
              className="popup-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePopup}
            >
              <motion.div
                className="popup-content"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="popup-close" onClick={closePopup}>×</button>
                <h3 className="popup-title">Detailed Information</h3>
                {typeof popupData === 'object' && popupData !== null ? (
                  <table className="popup-details-table">
                    <tbody>
                      {Object.entries(popupData).map(([key, value]) => (
                        <tr key={key}>
                          <td style={{ fontWeight: 'bold', paddingRight: 8 }}>{key}</td>
                          <td>
                            {typeof value === 'object' && value !== null
                              ? JSON.stringify(value)
                              : String(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="popup-text">{String(popupData)}</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Backup;
