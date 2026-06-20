interface LayoutControlsProps {
  readonly deviceGap: number;
  readonly rowGap: number;
  readonly onDeviceGapChange: (value: number) => void;
  readonly onRowGapChange: (value: number) => void;
}

export default function LayoutControls({
  deviceGap,
  rowGap,
  onDeviceGapChange,
  onRowGapChange,
}: LayoutControlsProps) {
  return (
    <div className="spacing-controls">
      <h3>Engineering Clearance Spacing</h3>
      <div className="slider-group">
        <div className="slider-item">
          <label htmlFor="device-gap">Device Spacing (Side-by-Side): {deviceGap} ft</label>
          <input
            id="device-gap"
            type="range"
            min="0"
            max="15"
            value={deviceGap}
            onChange={(e) => onDeviceGapChange(Number(e.target.value))}
          />
        </div>
        <div className="slider-item">
          <label htmlFor="row-gap">Row Spacing (Aisles): {rowGap} ft</label>
          <input
            id="row-gap"
            type="range"
            min="0"
            max="25"
            value={rowGap}
            onChange={(e) => onRowGapChange(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}