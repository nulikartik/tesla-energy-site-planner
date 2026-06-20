import { DEVICE_SPECS } from '../types';

export interface DeviceRenderData {
  readonly name: string;
  readonly color: string;
  readonly width: number;
  readonly height: number;
}

interface ChunkLayoutOptions {
  quantities: Record<string, number>;
  deviceGap: number;
  rowGap: number;
  scale: number;
  maxWidthFeet: number;
  typeColorMap: Record<string, string>;
}

/**
 * Pure geometric layout engine.
 * Chunks industrial site inventory into sequential linear rows based on 1D boundary constraints.
 */
export function computeRowChunks({
  quantities,
  deviceGap,
  rowGap,
  scale,
  maxWidthFeet,
  typeColorMap,
}: ChunkLayoutOptions) {
  const rowChunks: DeviceRenderData[][] = [];
  
  let runningWidthFeet = 0;
  let currentChunk: DeviceRenderData[] = [];
  
  let totalLengthFeet = 0;
  let currentRowMaxHeightFeet = 0;
  let maxReachedWidthFeet = 0;

  for (const deviceName of Object.keys(quantities)) {
    const targetQuantity = quantities[deviceName] || 0;
    const spec = DEVICE_SPECS.find(s => s.name === deviceName);
    if (!spec) continue;

    const itemColor = typeColorMap[spec.type] || '#bdc3c7';

    for (let i = 0; i < targetQuantity; i++) {
      const spaceNeededFeet = spec.width + deviceGap;

      // Row boundary breach: push active collection chunk to tracking matrix array
      if (runningWidthFeet + spaceNeededFeet > maxWidthFeet) {
        rowChunks.push(currentChunk);
        totalLengthFeet += currentRowMaxHeightFeet + rowGap;

        // Reset tracking buffers for the subsequent structural row
        currentChunk = [];
        runningWidthFeet = 0;
        currentRowMaxHeightFeet = 0;
      }

      currentChunk.push({
        name: spec.name,
        color: itemColor,
        width: spec.width * scale,
        height: spec.length * scale,
      });

      runningWidthFeet += spaceNeededFeet;
      currentRowMaxHeightFeet = Math.max(currentRowMaxHeightFeet, spec.length);
      maxReachedWidthFeet = Math.max(maxReachedWidthFeet, runningWidthFeet - deviceGap);
    }
  }

  // Flush remaining trailing nodes
  if (currentChunk.length > 0) {
    rowChunks.push(currentChunk);
    totalLengthFeet += currentRowMaxHeightFeet;
  }

  return {
    rowChunks,
    calculatedWidth: Math.min(maxReachedWidthFeet, maxWidthFeet),
    calculatedLength: totalLengthFeet,
  };
}