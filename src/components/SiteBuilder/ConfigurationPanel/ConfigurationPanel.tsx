import { DEVICE_SPECS } from '../../../types';
import type { DeviceSpec } from '../../../types';
import './ConfigurationPanel.css';

interface ConfigurationPanelProps {
  readonly quantities: Record<string, number>;
  readonly onQuantityChange: (name: string, count: number) => void;
}

export default function ConfigurationPanel({ quantities, onQuantityChange }: ConfigurationPanelProps) {
  return (
    <div className="config-panel">
      <h2 className="config-title">Device Configuration</h2>
      
      <div className="device-list">
        {DEVICE_SPECS.map((device: DeviceSpec) => {
          const isTransformer = device.type === 'transformer';
          const currentQuantity = quantities[device.name] || 0;

          return (
            <div key={device.name} className="device-card">
              <div className="device-info">
                <span className="device-name">{device.name}</span>
                <span className="device-details">
                  {device.width}ft × {device.length}ft • {device.energy} MWh • ${device.cost.toLocaleString()}
                </span>
              </div>
              
              <div className="device-control">
                <label htmlFor={`qty-${device.name}`} className="sr-only">
                  Quantity for {device.name}
                </label>
                <input
                  id={`qty-${device.name}`}
                  type="number"
                  min="0"
                  value={currentQuantity}
                  onChange={(e) => onQuantityChange(device.name, parseInt(e.target.value, 10) || 0)}
                  disabled={isTransformer}
                  className={`quantity-input ${isTransformer ? 'input-disabled' : ''}`}
                />
                {isTransformer && (
                  <span className="auto-badge">Auto</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}