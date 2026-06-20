export type DeviceType = 'battery' | 'transformer' | 'other';

export interface DeviceSpec {
  readonly name: string;        // e.g., 'MegapackXL' [cite: 7]
  readonly width: number;       // in feet [cite: 7, 13]
  readonly length: number;      // in feet [cite: 7, 13]
  readonly energy: number;      // in MWh (negative for transformers) [cite: 7]
  readonly cost: number;        // in USD [cite: 7]
  readonly releaseDate?: number;// Optional because Transformer doesn't have one [cite: 7]
  readonly type: DeviceType;    // Future-proof classification
}

export const DEVICE_SPECS: DeviceSpec[] = [
  { name: 'MegapackXL',  width: 40, length: 10, energy: 4,    cost: 120000, releaseDate: 2022, type: 'battery' },     // [cite: 7]
  { name: 'Megapack2',   width: 30, length: 10, energy: 3,    cost: 80000,  releaseDate: 2021, type: 'battery' },     // [cite: 7]
  { name: 'Megapack',    width: 30, length: 10, energy: 2,    cost: 50000,  releaseDate: 2005, type: 'battery' },     // [cite: 7]
  { name: 'PowerPack',   width: 10, length: 10, energy: 1,    cost: 10000,  releaseDate: 2000, type: 'battery' },     // [cite: 7]
  { name: 'Transformer', width: 10, length: 10, energy: -0.5, cost: 10000,                     type: 'transformer' }, // [cite: 7]
];

export interface PlacedDevice {
  readonly id: string;          // Unique ID (e.g., 'MegapackXL-0') for React keys
  readonly spec: DeviceSpec;    // Reference to the static data
  readonly x: number;           // Layout grid X coordinate (in feet)
  readonly y: number;           // Layout grid Y coordinate (in feet)
}

export interface SiteMetrics {
  readonly totalCost: number;     // Total budget [cite: 8]
  readonly totalEnergy: number;   // Total site energy density 
  readonly landWidth: number;     // Constrained to 100ft max [cite: 15]
  readonly landLength: number;    // Calculated dynamically based on row stacking 
}