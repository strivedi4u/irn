import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './PieChart.css';

const PieChart = ({ data, theme }) => {
  const chartData = {
    labels: ['In Progress', 'Fail', 'Delay'],
    datasets: [
      {
        data: [data.inProgress, data.fail, data.delay],
        backgroundColor: ['#007bff', '#dc3545', '#ffc107'],
        hoverBackgroundColor: ['#0056b3', '#a71d2a', '#d39e00'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="pie-chart-container">
      <div className="pie-chart">
        <Pie data={chartData} options={options} />
      </div>
      <div className="pie-chart-details">
        <div className="detail in-progress">
          <span className="dot" style={{ backgroundColor: '#007bff' }}></span>
          In Progress: {data.inProgress}
        </div>
        <div className="detail fail">
          <span className="dot" style={{ backgroundColor: '#dc3545' }}></span>
          Fail: {data.fail}
        </div>
        <div className="detail delay">
          <span className="dot" style={{ backgroundColor: '#ffc107' }}></span>
          Delay: {data.delay}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
