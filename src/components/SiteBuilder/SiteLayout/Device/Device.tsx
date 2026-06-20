import './Device.css';

interface DeviceProps {
  readonly name: string;
  readonly color: string;
  readonly width: number;
  readonly height: number;
}

export default function Device({ name, color, width, height }: DeviceProps) {
  const inlineStyles = {
    backgroundColor: color,
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <div className="custom-device-node" style={inlineStyles}>
      <span className="custom-device-label">{name}</span>
    </div>
  );
}