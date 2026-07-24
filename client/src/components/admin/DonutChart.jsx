import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import './chartSetup'

// ====== Reusable donut with centered label ======
// segments: [{ label, pct, color }]  centerValue / centerLabel: overlay text
const DonutChart = ({ segments, centerValue, centerLabel, size = 190 }) => {
  const data = {
    labels: segments.map((s) => s.label),
    datasets: [
      {
        data: segments.map((s) => s.pct),
        backgroundColor: segments.map((s) => s.color),
        borderColor: '#141414',
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A1A1A',
        borderColor: '#2A2A2A',
        borderWidth: 1,
        titleColor: '#F5F0EB',
        bodyColor: '#B8B0A5',
        padding: 10,
        cornerRadius: 8,
        callbacks: { label: (item) => `${item.label}: ${item.parsed}%` },
      },
    },
  }

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[1.15rem] font-body font-bold text-cream leading-none">{centerValue}</span>
        {centerLabel && <span className="text-[10px] font-ui tracking-wide text-cream-muted mt-1">{centerLabel}</span>}
      </div>
    </div>
  )
}

export default DonutChart
