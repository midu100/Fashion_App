import React, { useRef } from 'react'
import { Line } from 'react-chartjs-2'
import './chartSetup'

// ====== Revenue line chart (this period vs last period, gold gradient area) ======
const RevenueChart = ({ labels, thisPeriod, lastPeriod }) => {
  const chartRef = useRef(null)

  // Build the gold gradient fill once the canvas context exists
  const goldFill = (ctx) => {
    const { chart } = ctx
    const { ctx: c, chartArea } = chart
    if (!chartArea) return 'rgba(201,169,110,0.15)'
    const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
    gradient.addColorStop(0, 'rgba(201,169,110,0.35)')
    gradient.addColorStop(1, 'rgba(201,169,110,0)')
    return gradient
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'This Period',
        data: thisPeriod,
        borderColor: '#C9A96E',
        backgroundColor: goldFill,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#C9A96E',
        pointBorderColor: '#0A0A0A',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
      },
      {
        label: 'Last Period',
        data: lastPeriod,
        borderColor: '#8A8278',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        borderDash: [4, 4],
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBackgroundColor: '#8A8278',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A1A1A',
        borderColor: '#2A2A2A',
        borderWidth: 1,
        titleColor: '#F5F0EB',
        bodyColor: '#B8B0A5',
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        callbacks: { label: (item) => `$${item.parsed.y.toLocaleString()}` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#8A8278', font: { size: 11 } },
      },
      y: {
        grid: { color: '#1f1f1f' },
        border: { display: false },
        ticks: {
          color: '#8A8278',
          font: { size: 11 },
          callback: (value) => `$${value / 1000}K`,
        },
      },
    },
  }

  return (
    <div className="h-[280px]">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  )
}

export default RevenueChart
