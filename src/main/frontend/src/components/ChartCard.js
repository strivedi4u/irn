import React from 'react';
import ChartSection from './ChartSection';

// ChartCard expects ChartSection to provide the following renderCard and Card logic via props or context.
// Here, we assume ChartSection exports the Card and renderCard logic, or you can copy them here if needed.

const ChartCard = ({ 
  chartsData, // Array of { title, chartData, type, isNull, chartKey }
  cardsData,  // Array of { title, inProgress, fail, delay, theme, icon, loading, onCardClick, onStatusClick, isActive }
  pieChartData, // { title, chartData, type, isNull, chartKey }
  theme,
  renderCard, // function from ChartSection
  Card,       // Card component from ChartSection
}) => {
  // Layout: left (4 doughnut charts, 2x2 grid), right (5 cards in column, below them 1 pie chart)
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: 40,
      width: '100%',
      maxWidth: 1800,
      margin: '0 auto',
      alignItems: 'flex-start',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }}>
      {/* Left: 2x2 grid of 4 doughnut charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 32,
        minWidth: 700,
        flex: '0 0 700px'
      }}>
        {chartsData.slice(0, 4).map((chart, idx) =>
          renderCard(
            chart.title,
            chart.chartData,
            chart.type || 'doughnut',
            chart.isNull,
            chart.chartKey
          )
        )}
      </div>
      {/* Right: 5 cards in column, below them 1 pie chart */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        minWidth: 360,
        flex: '0 0 360px'
      }}>
        {/* 5 cards, same size as chart cards */}
        {cardsData.map((card, idx) => (
          <Card key={idx} {...card} />
        ))}
        {/* Pie chart below cards */}
        <div style={{ marginTop: 24, width: 340 }}>
          {renderCard(
            pieChartData.title,
            pieChartData.chartData,
            pieChartData.type || 'pie',
            pieChartData.isNull,
            pieChartData.chartKey
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
