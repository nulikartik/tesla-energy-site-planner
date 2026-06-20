import { describe, it, expect } from 'vitest';
import { computeRowChunks } from './layoutEngine';

// Mock color token specifications mapping
const MOCK_COLORS = { battery: '#3498db', transformer: '#e67e22' };

describe('Site Layout Engineering Engine - Boundary Verification', () => {
  
  it('should deterministically place items within a single row if beneath the layout threshold', () => {
    const quantities = { 'Megapack': 2 }; // Assumes width = 30ft each
    const deviceGap = 2;
    const rowGap = 4;

    const result = computeRowChunks({
      quantities,
      deviceGap,
      rowGap,
      scale: 4,
      maxWidthFeet: 100,
      typeColorMap: MOCK_COLORS,
    });

    // Space: (30 + 2) + (30 + 2) = 64ft total footprint <= 100ft max width limit
    expect(result.rowChunks).toHaveLength(1);
    expect(result.rowChunks[0]).toHaveLength(2);
    expect(result.calculatedWidth).toBe(62); // 64 - trailing gap (2)
  });

  it('should execute a clean horizontal wrap when a device breaches the maximum width boundary', () => {
    const quantities = { 'Megapack': 4 }; // 4 items * 30ft width = 120ft -> must wrap
    const deviceGap = 2;
    const rowGap = 4;

    const result = computeRowChunks({
      quantities,
      deviceGap,
      rowGap,
      scale: 4,
      maxWidthFeet: 100,
      typeColorMap: MOCK_COLORS,
    });

    // 3 items fit in Row 1: (30+2)*3 = 96ft. The 4th item forces a wrap to Row 2.
    expect(result.rowChunks).toHaveLength(2);
    expect(result.rowChunks[0]).toHaveLength(3);
    expect(result.rowChunks[1]).toHaveLength(1);
  });

  it('should handle an empty site configuration gracefully without throwing evaluation exceptions', () => {
    const result = computeRowChunks({
      quantities: {},
      deviceGap: 2,
      rowGap: 4,
      scale: 4,
      maxWidthFeet: 100,
      typeColorMap: MOCK_COLORS,
    });

    expect(result.rowChunks).toHaveLength(0);
    expect(result.calculatedWidth).toBe(0);
    expect(result.calculatedLength).toBe(0);
  });
});