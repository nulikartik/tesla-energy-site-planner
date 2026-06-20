interface SiteMetricsPanelProps {
  readonly totalCost: number;
  readonly totalEnergy: number;
  readonly width: number;
  readonly length: number;
}

export default function SiteMetricsPanel({ totalCost, totalEnergy, width, length }: SiteMetricsPanelProps) {
  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <span className="metric-label">Total Cost</span>
        <span className="metric-value">${totalCost.toLocaleString()}</span>
      </div>
      <div className="metric-card">
        <span className="metric-label">Energy Capacity</span>
        <span className="metric-value">{totalEnergy.toFixed(1)} MWh</span>
      </div>
      <div className="metric-card">
        <span className="metric-label">Land Size Required</span>
        <span className="metric-value">
          {width}ft × {length}ft
        </span>
      </div>
    </div>
  );
}