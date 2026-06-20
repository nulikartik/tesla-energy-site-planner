import React, { useState, useMemo } from 'react';
import { DEVICE_SPECS } from '../../../types';
import { computeRowChunks } from '../../../utils/layoutEngine';
import { LAYOUT_CONSTRAINTS, TYPE_COLOR_MAP } from '../../../config/layoutConfig';
import SiteMetricsPanel from './SiteMetricsPanel/SiteMetricsPanel';
import LayoutControls from './LayoutControls/LayoutControls';
import SiteRow from './SiteRow/SiteRow';
import './SiteLayout.css';

interface SiteLayoutProps {
  readonly quantities: Record<string, number>;
}

function SiteLayout({ quantities }: SiteLayoutProps) {
  const [deviceGap, setDeviceGap] = useState<number>(2);
  const [rowGap, setRowGap] = useState<number>(4);

  // 1. Financial Analytics: Compute financials utilizing primitive tracking to seal reference leaks
  const metrics = useMemo(() => {
    return DEVICE_SPECS.reduce(
      (acc, spec) => {
        const qty = quantities[spec.name] || 0;
        return {
          totalCost: acc.totalCost + spec.cost * qty,
          totalEnergy: acc.totalEnergy + spec.energy * qty,
        };
      },
      { totalCost: 0, totalEnergy: 0 }
    );
    // Track stringified serialization to bypass upstream reference mismatches completely
  }, [JSON.stringify(quantities)]);

  // 2. Spatial Engine: Compute row slices using primitive serialization to prevent object reference leaks
  const { rowChunks, calculatedWidth, calculatedLength } = useMemo(() => {
    return computeRowChunks({
      quantities,
      deviceGap,
      rowGap,
      scale: LAYOUT_CONSTRAINTS.SCALE,
      maxWidthFeet: LAYOUT_CONSTRAINTS.MAX_WIDTH_FEET,
      typeColorMap: TYPE_COLOR_MAP,
    });
  }, [JSON.stringify(quantities), deviceGap, rowGap]);

  return (
    <div className="layout-panel">
      <h2 className="layout-title">Site Analysis & Blueprint</h2>

      {/* Primary Analytics Readout */}
      <SiteMetricsPanel
        totalCost={metrics.totalCost}
        totalEnergy={metrics.totalEnergy}
        width={calculatedWidth}
        length={calculatedLength}
      />

      {/* Footprint Parameter Adjustments */}
      <LayoutControls
        deviceGap={deviceGap}
        rowGap={rowGap}
        onDeviceGapChange={setDeviceGap}
        onRowGapChange={setRowGap}
      />

      {/* Visual Map Render Grid Canvas */}
      <div className="grid-canvas-container">
        <span className="canvas-dimension-label width-label">
          Max Width: {LAYOUT_CONSTRAINTS.MAX_WIDTH_FEET} ft
        </span>
        
        <div 
          className="grid-canvas"
          style={{ 
            width: `${LAYOUT_CONSTRAINTS.MAX_WIDTH_FEET * LAYOUT_CONSTRAINTS.SCALE}px`, 
            height: `${Math.max(LAYOUT_CONSTRAINTS.FALLBACK_HEIGHT_FEET, calculatedLength) * LAYOUT_CONSTRAINTS.SCALE}px` 
          }}
        >
          {rowChunks.map((chunk, index) => (
            <React.Fragment key={`row-group-${index}`}>
              <SiteRow devices={chunk} deviceSpacing={deviceGap * LAYOUT_CONSTRAINTS.SCALE} />
              
              {/* Interleave structural clearance spacer if this is not the final tail row chunk */}
              {index < rowChunks.length - 1 && (
                <div 
                  className="row-spacer" 
                  style={{ height: `${rowGap * LAYOUT_CONSTRAINTS.SCALE}px` }} 
                />
              )}
            </React.Fragment>
          ))}
          
          {rowChunks.length === 0 && (
            <div className="canvas-empty-state">
              Add devices from the configuration panel to map the layout.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrap the module export with React.memo to intercept unnecessary parent cascading updates
export default React.memo(SiteLayout);