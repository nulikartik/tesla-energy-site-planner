import React from 'react';
import Device from '../Device/Device';
import './SiteRow.css';

interface DeviceItem {
  readonly name: string;
  readonly color: string;
  readonly width: number;
  readonly height: number;
}

interface SiteRowProps {
  readonly devices: readonly DeviceItem[];
  readonly deviceSpacing: number;
}

// 1. Keep the base component clean and focused purely on rendering
function SiteRowComponent({ devices, deviceSpacing }: SiteRowProps) {
  const rowStyles = {
    gap: `${deviceSpacing}px`,
  };

  return (
    <div className="site-layout-row" style={rowStyles}>
      {devices.map((device, index) => (
        <Device
          key={`${device.name}-${index}`}
          name={device.name}
          color={device.color}
          width={device.width}
          height={device.height}
        />
      ))}
    </div>
  );
}

// 2. Add a custom comparison function to prevent JavaScript shallow array reference mismatches
const areRowsEqual = (prevProps: SiteRowProps, nextProps: SiteRowProps) => {
  // If the visual layout spacing options change, re-render immediately
  if (prevProps.deviceSpacing !== nextProps.deviceSpacing) return false;
  
  // If the number of devices in this row changed, re-render immediately
  if (prevProps.devices.length !== nextProps.devices.length) return false;
  
  // Explicitly check the internal properties of each device inside this row
  for (let i = 0; i < prevProps.devices.length; i++) {
    if (
      prevProps.devices[i].name !== nextProps.devices[i].name ||
      prevProps.devices[i].width !== nextProps.devices[i].width ||
      prevProps.devices[i].height !== nextProps.devices[i].height ||
      prevProps.devices[i].color !== nextProps.devices[i].color
    ) {
      return false; // Structural mismatch found, trigger a re-render
    }
  }

  return true; // The row's contents are identical; skip re-rendering safely!
};

// 3. Export the optimized component as the default export
const SiteRow = React.memo(SiteRowComponent, areRowsEqual);
export default SiteRow;